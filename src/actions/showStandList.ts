import {IDialogWaterfallStep} from "botbuilder";
import * as cardResponses from "../responses/cardResponses";
import Action from "../utils/Action";

interface IShowStandListOptions {
    productName: string;
}

const name = "showStandList";
const handler: IDialogWaterfallStep[] = [
    async (session, showStandListOptions: IShowStandListOptions) => {
        let query = {};
        if (showStandListOptions.productName !== "") {
            query = { ...query, products: { $elemMatch: { $eq: showStandListOptions.productName } } };
        }
        const eventCard = await cardResponses.getStand(session, query);
        if (eventCard) {
            session.send(`Ecco gli stand${(showStandListOptions.productName ? ` riguardanti ${showStandListOptions.productName}` : "")}`);
            session.send(eventCard.reply);
        } else {
            session.send(`Non ho trovato stand${(showStandListOptions.productName ? ` riguardanti ${showStandListOptions.productName}` : "")}`);
        }
        session.endDialog();
    }
];

export default new Action<IShowStandListOptions>({name, handler});
