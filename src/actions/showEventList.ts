import {IDialogWaterfallStep} from "botbuilder";
import * as cardResponses from "../responses/cardResponses";
import Action from "../utils/Action";

interface IShowEventListOptions {
    productName: string;
    speakerName: string;
    eventType: string;
}

const name = "showEventList";
const handler: IDialogWaterfallStep[] = [
    async (session, showEventListOptions: IShowEventListOptions) => {
        let query = {};
        if (showEventListOptions.productName !== "") {
            query = { ...query, products: { $elemMatch: { $eq: showEventListOptions.productName } } };
        }
        if (showEventListOptions.speakerName !== "") {
            query = { ...query, speakers: { $elemMatch: { $eq: showEventListOptions.speakerName } } };
        }
        if (showEventListOptions.eventType !== "") {
            query = { ...query, type: showEventListOptions.eventType };
        }
        const eventCard = await cardResponses.getEvent(session, query);
        if (eventCard) {
            session.send(`Ecco gli eventi${(showEventListOptions.speakerName ? ` con ${showEventListOptions.speakerName}` : "")}${(showEventListOptions.productName ? ` su ${showEventListOptions.productName}` : "")}`);
            session.send(eventCard.reply);
        } else {
            session.send(`Non ho trovato eventi${(showEventListOptions.speakerName ? ` con ${showEventListOptions.speakerName}` : "")}${(showEventListOptions.productName ? ` su ${showEventListOptions.productName}` : "")}`);
        }
        session.endDialog();
    }
];

export default new Action<IShowEventListOptions>({name, handler});
