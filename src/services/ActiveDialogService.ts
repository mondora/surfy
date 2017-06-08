import {delay, mapSeries} from "bluebird";
import {IAddress, IEvent, UniversalBot} from "botbuilder";

import userIdFromAddress from "../utils/userIdFromAddress";
import logger from "./logger";
import {collection} from "./mongodb";

interface IUser {
    _id: string;
    address: string;
    registeredAt: string;
}

export default class ActiveDialogService {

    private bot: UniversalBot;

    constructor (bot: UniversalBot) {
        this.bot = bot;
        // Register users when receiving messages
        this.bot.on("receive", (event: IEvent) => {
            this.registerUser(event.address);
        });
    }

    public async startDialogForUser (userId: string, dialogId: string, dialogArgs?: any) {
        const usersCollection = await collection("users");
        const user: IUser | null = await usersCollection.findOne({_id: userId});
        if (user === null) {
            throw new Error(`No user found with id ${userId}`);
        }
        const address: IAddress = JSON.parse(user.address);
        this.bot.beginDialog(address, dialogId, dialogArgs);
    }

    public async startBroadcastDialog (dialogId: string, dialogArgs?: any) {
        const usersCollection = await collection("users");
        const users: IUser[] = await usersCollection.find().toArray();
        await mapSeries(users, async user => {
            try {
                const address: IAddress = JSON.parse(user.address);
                this.bot.beginDialog(address, dialogId, dialogArgs);
                // Add a 1s delay between starting users' dialogs
                await delay(1000);
            } catch (err) {
                logger.error(err, `Error starting dialog ${dialogId} for user ${user._id}`);
            }
        });
    }

    private async registerUser (address: IAddress) {
        try {
            const usersCollection = await collection("users");
            const userId = userIdFromAddress(address);
            await usersCollection.updateOne({_id: userId}, {
                $set: {
                    address: JSON.stringify(address),
                },
                $setOnInsert: {
                    platform: address.channelId,
                    registeredAt: new Date().toISOString(),
                    sentNotifications: []
                }
            }, {upsert: true});
        } catch (err) {
            logger.error(err, "ActiveDialogService: error registering user", {address});
        }
    }

}
