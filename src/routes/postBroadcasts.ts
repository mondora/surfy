import {json} from "body-parser";
import {v4} from "uuid";

import ActiveDialogService from "../services/ActiveDialogService";
import {collection} from "../services/mongodb";
import IAuthenticatedRequest from "../typings/IAuthenticatedRequest";
import IBroadcast from "../typings/IBroadcast";
import IRoute from "../typings/IRoute";
import validateRequestBody from "../utils/validateRequestBody";

const bodySchema = {
    type: "object",
    properties: {
        message: {
            type: "string"
        }
    },
    required: ["message"]
};

export default (activeDialogService: ActiveDialogService): IRoute => ({
    path: "/broadcasts",
    method: "post",
    middleware: [
        json(), validateRequestBody(bodySchema)
    ],
    handler: async (req: IAuthenticatedRequest, res) => {
        const _id = v4();
        const broadcast: IBroadcast = {_id, ...req.body};
        const broadcastsCollection = await collection("broadcasts");
        await broadcastsCollection.insert({
            ...broadcast,
            sentTo: [],
            sentAt: new Date(),
            sentBy: req.userId
        });
        activeDialogService.startBroadcastDialog("/broadcast", broadcast);
        res.status(204).send();
    }
});
