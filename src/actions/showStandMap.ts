import { IDialogWaterfallStep, Message} from "botbuilder";

import Action from "../utils/Action";

interface IShowMapOptions {
    standImage: string;
    standName: string;
}

const name = "showStandMap";
const handler: IDialogWaterfallStep[] = [
    async (session, showMapOptions: IShowMapOptions) => {
        session.send("Ecco una mappa per trovare lo stand");
        session.send(`Lo stand è il "${showMapOptions.standName}"`);
        const msg = new Message(session)
            .addAttachment({
                contentUrl: showMapOptions.standImage,
                contentType: "image/jpg",
            });
        session.send(msg);
        session.endDialog();
    }
];

export default new Action<IShowMapOptions>({name, handler});
