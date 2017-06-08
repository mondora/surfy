import {IDialogWaterfallStep, Message, Prompts} from "botbuilder";

import PollCard from "../components/PollCard";
import logger from "../services/logger";
import {collection} from "../services/mongodb";
import IPoll from "../typings/IPoll";
import userIdFromAddress from "../utils/userIdFromAddress";

interface IPollResponse {
    userId: string;
    answer: string;
    answeredAt: Date;
}

async function savePollSentTo (pollId: string, userId: string) {
    try {
        const pollsCollection = await collection("polls");
        await pollsCollection.update(
            {_id: pollId},
            {
                $addToSet: {
                    sentTo: userId
                }
            }
        );
    } catch (err) {
        logger.error(err, `Failed to save user ${userId} sentTo to poll ${pollId}`);
    }
}

async function savePollResponse (pollId: string, pollResponse: IPollResponse) {
    try {
        const pollsCollection = await collection("polls");
        await pollsCollection.update(
            {_id: pollId},
            {
                $addToSet: {
                    responses: pollResponse
                }
            }
        );
    } catch (err) {
        logger.error(err, `Failed to save user ${pollResponse.userId} answer to poll ${pollId}`);
    }
}

export const path = "/poll";
export const dialog: IDialogWaterfallStep[] = [
    (session, poll: IPoll) => {
        session.dialogData.poll = poll;
        session.send("Ho una domanda per te");
        session.sendTyping();
        const msg = new Message().addAttachment(PollCard({session, poll}));
        Prompts.text(session, msg);
        savePollSentTo(poll._id, userIdFromAddress(session.message.address));
    },
   (session, result) => {
        session.sendTyping();
        const {poll} = session.dialogData as {
            poll: IPoll;
        };
        const userAnswer = result.response;
        const suggestedAnswerIndex = poll.suggestedAnswers
            .findIndex(suggestedAnswer => suggestedAnswer === userAnswer);
        session.send(
            poll.suggestedAnswersReplies[suggestedAnswerIndex] ||
            poll.defaultReply
        );
        savePollResponse(poll._id, {
            userId: userIdFromAddress(session.message.address),
            answer: userAnswer,
            answeredAt: new Date()
        });
        session.endDialog();
    }
];
