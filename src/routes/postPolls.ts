import {json} from "body-parser";
import {v4} from "uuid";

import ActiveDialogService from "../services/ActiveDialogService";
import {collection} from "../services/mongodb";
import IAuthenticatedRequest from "../typings/IAuthenticatedRequest";
import IPoll from "../typings/IPoll";
import IRoute from "../typings/IRoute";
import validateRequestBody from "../utils/validateRequestBody";

const bodySchema = {
    type: "object",
    properties: {
        question: {
            type: "string"
        },
        suggestedAnswers: {
            type: "array",
            items: {type: "string"},
            uniqueItems: true
        },
        suggestedAnswersReplies: {
            type: "array",
            items: {type: "string"}
        },
        defaultReply: {
            type: "string"
        }
    },
    required: [
        "question",
        "suggestedAnswers",
        "suggestedAnswersReplies",
        "defaultReply"
    ],
    additionalProperties: false
};

export default (activeDialogService: ActiveDialogService): IRoute => ({
    path: "/polls",
    method: "post",
    middleware: [
        json(), validateRequestBody(bodySchema)
    ],
    handler: async (req: IAuthenticatedRequest, res) => {
        const _id = v4();
        const poll: IPoll = {_id, ...req.body};
        const pollsCollection = await collection("polls");
        await pollsCollection.insert({
            ...poll,
            sentTo: [],
            responses: [],
            sentAt: new Date(),
            sentBy: req.userId
        });
        activeDialogService.startBroadcastDialog("/poll", poll);
        res.status(204).send();
    }
});
