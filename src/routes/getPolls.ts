import {collection} from "../services/mongodb";
import IRoute from "../typings/IRoute";

export default (): IRoute => ({
    path: "/polls",
    method: "get",
    middleware: [],
    handler: async (_, res) => {
        const pollsCollection = await collection("polls");
        const polls = await pollsCollection.find({}).toArray();
        const jsonPolls = polls.map(poll => ({
            ...poll,
            sentAt: poll.sentAt.toISOString(),
            responses: poll.responses.map((response: any) => ({
                ...response,
                answeredAt: response.answeredAt.toISOString()
            }))
        }));
        res.status(200).send(jsonPolls);
    }
});
