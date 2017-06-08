import {delay} from "bluebird";
import moment = require("moment");
import {v4} from "uuid";

import ActiveDialogService from "./ActiveDialogService";
import logger from "./logger";
import {collection} from "./mongodb";

interface IReminder {
    userId: string;
    dialogId: string;
    dialogArgs: any;
    triggerDate: Date;
}

export default class ReminderService {

    public static async setReminder (reminder: IReminder) {
        const remindersCollection = await collection("reminders");
        await remindersCollection.insertOne({
            ...reminder,
            triggered: false
        });
    }

    private activeDialogService: ActiveDialogService;

    constructor (activeDialogService: ActiveDialogService) {
        this.activeDialogService = activeDialogService;
    }

    public start () {
        const ONE_MINUTE = moment.duration(1, "minute").asMilliseconds();
        return setInterval(() => this.sendReminders(), ONE_MINUTE);
    }

    /*
    *   sendReminders needs to atomically:
    *
    *   - find all the reminders that haven't been triggered and that now need
    *     to be triggered
    *   - trigger those reminders
    *   - update the reminders (marking them as triggered)
    *
    *   Context:
    *
    *   - there are multiple bot instances reading/writing from the database
    *   - mongodb doesn't provide many facilities to perform atomic transactions
    *   - we're actually working with an Azure DocumentDb exposing part of the
    *     mongodb API, so we don't know which features of mongodb are
    *     implemented
    *
    *   This basically means that we can't have atomicity guarantees from the
    *   database. So, to mitigate the risk of race-conditions which could lead
    *   to the user being "reminded" multiple times, instead of simply:
    *
    *   - reading the list of reminders to trigger
    *   - trigger them
    *   - mark the reminders as triggered
    *
    *   we instead:
    *
    *   - update the reminders, assigning them a random id identifying the "send
    *     reminders" operation we're performing
    *   - wait for some seconds
    *   - find the reminders with our operation id and trigger them
    *
    *   By doing this if some processes are cuncurrently updating the reminders,
    *   after some seconds all updates will have terminated (hopefully, this is
    *   our assumption, and the point where the procedure can fail). Each
    *   process can then trigger the reminders left matching its operation id.
    *   Due to concurrent updates to the database, those reminders might not be
    *   all the ones that the process previously updated, but we obtain that all
    *   reminders will be triggered and no reminder will be triggered twice.
    */
    private async sendReminders () {
        try {
            const remindersCollection = await collection("reminders");
            const updateOperationId = v4();
            const furthestTriggerDate = moment().add(1, "minute").toDate();
            logger.info("Sending reminders", {furthestTriggerDate, updateOperationId});
            const updateResult = await remindersCollection.updateMany(
                {
                    triggerDate: {
                        // We trigger reminders set for the minute to come
                        $lte: furthestTriggerDate
                    },
                    triggered: false
                },
                {
                    $set: {
                        triggered: true,
                        updateOperationId: updateOperationId
                    }
                }
            );
            logger.info(`Marked ${updateResult.modifiedCount} reminders as triggered`, {updateOperationId});
            await delay(
                moment.duration(5, "seconds").asMilliseconds()
            );
            const remindersToTrigger = await remindersCollection.find({updateOperationId}).toArray();
            logger.info(`Triggering ${remindersToTrigger.length} reminders`, {updateOperationId});
            remindersToTrigger.forEach(async (reminder: IReminder) => {
                this.activeDialogService.startDialogForUser(reminder.userId, reminder.dialogId, reminder.dialogArgs);
            });
        } catch (err) {
            logger.error(err, "ReminderService: error sending reminders");
        }
    }

}
