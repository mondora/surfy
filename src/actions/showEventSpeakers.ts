import {IDialogWaterfallStep} from "botbuilder";
import * as cardResponses from "../responses/cardResponses";
import Action from "../utils/Action";

interface IShowEventSpeakersOptions {
    speakerNames: string[];
}

const name = "showEventSpeakers";
const handler: IDialogWaterfallStep[] = [
    async (session, showEventSpeakersOptions: IShowEventSpeakersOptions) => {
        const query = { name: { $in: showEventSpeakersOptions.speakerNames } };
        const eventCard = await cardResponses.getSpeaker(session, query);
        if (eventCard && eventCard.size > 0) {
            session.send(eventCard.reply);
        } else {
            session.send("Non è ancora possibile sapere quali sono i relatori per questo evento");
        }
        session.endDialog();
    }
];

export default new Action<IShowEventSpeakersOptions>({name, handler});
