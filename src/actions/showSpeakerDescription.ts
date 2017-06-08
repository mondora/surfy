import {IDialogWaterfallStep} from "botbuilder";
import Action from "../utils/Action";

interface IShowSpeakerDescriptionOptions {
    title: string;
    subtitle: string;
    text: string;
    linkedin: string;
}

const name = "showSpeakerDescription";
const handler: IDialogWaterfallStep[] = [
    async (session, showSpeakerDescriptionOptions: IShowSpeakerDescriptionOptions) => {
        session.send(showSpeakerDescriptionOptions.title);
        session.send(showSpeakerDescriptionOptions.subtitle);
        session.send(showSpeakerDescriptionOptions.text);
        session.send(`LinkedIn: ${showSpeakerDescriptionOptions.linkedin}`);
        session.endDialog();
    }
];

export default new Action<IShowSpeakerDescriptionOptions>({name, handler});
