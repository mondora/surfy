import {IDialogWaterfallStep} from "botbuilder";
import moment = require("moment");

import ReminderService from "../services/ReminderService";
import Action from "../utils/Action";
import userIdFromAddress from "../utils/userIdFromAddress";

interface IRemindOptions {
    what: string;
    // ISO8601 string
    when: string;
    confirmationMessage: string;
}

const name = "remind";
const handler: IDialogWaterfallStep[] = [
    (session, remindOptions: IRemindOptions) => {
        ReminderService.setReminder({
            userId: userIdFromAddress(session.message.address),
            dialogId: "/remind",
            dialogArgs: {
                what: remindOptions.what
            },
            triggerDate: moment(remindOptions.when).toDate()
        });
        session.send(remindOptions.confirmationMessage);
        session.endDialog();
    }
];

export default new Action<IRemindOptions>({name, handler});
