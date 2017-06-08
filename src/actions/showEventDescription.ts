import { IDialogWaterfallStep, Message} from "botbuilder";
import { collection } from "../services/mongodb";
import IEvent from "../typings/IEvent";
import Action from "../utils/Action";

interface IShowProductDescriptionOptions {
    eventTitle: string;
}

const name = "showEventDescription";
const handler: IDialogWaterfallStep[] = [
    async (session, showProductDescriptionOptions: IShowProductDescriptionOptions) => {
        const query = { title: showProductDescriptionOptions.eventTitle };
        const products = await collection("events");
        const matchingEvents: IEvent[] = await products.find(query).limit(1).toArray();
        if (matchingEvents.length > 0) {
            session.send(matchingEvents[0].title);
            session.send(matchingEvents[0].subtitle);
            session.send(matchingEvents[0].text);
            session.send(`Sala: ${matchingEvents[0].room}`);
            const msg = new Message(session)
                .addAttachment({
                    contentUrl: matchingEvents[0].map,
                    contentType: "image/jpg",
                });
            session.send(msg);
        } else {
            session.send("Ops. Qualcosa è andato storto e non sono riuscito a recuperare i dati");
        }
        session.endDialog();
    }
];

export default new Action<IShowProductDescriptionOptions>({name, handler});
