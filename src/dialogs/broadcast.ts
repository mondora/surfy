import {IDialogWaterfallStep} from "botbuilder";

import logger from "../services/logger";
import {collection} from "../services/mongodb";
import IBroadcast from "../typings/IBroadcast";
import userIdFromAddress from "../utils/userIdFromAddress";

async function saveBroadcastSentTo (broadcastId: string, userId: string) {
    try {
        const broadcastsCollection = await collection("broadcasts");
        await broadcastsCollection.update(
            {_id: broadcastId},
            {
                $addToSet: {
                    sentTo: userId
                }
            }
        );
    } catch (err) {
        logger.error(err, `Failed to save user ${userId} sentTo to broadcast ${broadcastId}`);
    }
}

export const path = "/broadcast";
export const dialog: IDialogWaterfallStep[] = [
    (session, broadcast: IBroadcast) => {
        session.send(broadcast.message);
        saveBroadcastSentTo(broadcast._id, userIdFromAddress(session.message.address));
        session.endDialog();
    }
];
