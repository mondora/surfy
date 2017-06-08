import {collection} from "../services/mongodb";
import IRoute from "../typings/IRoute";

export default (): IRoute => ({
    path: "/broadcasts",
    method: "get",
    middleware: [],
    handler: async (_, res) => {
        const broadcastsCollection = await collection("broadcasts");
        const broadcasts = await broadcastsCollection.find({}).toArray();
        const jsonBroadcasts = broadcasts.map(broadcast => ({
            ...broadcast,
            sentAt: broadcast.sentAt.toISOString()
        }));
        res.status(200).send(jsonBroadcasts);
    }
});
