import { IDialogWaterfallStep, Message} from "botbuilder";
import Action from "../utils/Action";

interface IShowImageOptions {
    preText: string;
    imageUrl: string;
}

const name = "showImage";
const handler: IDialogWaterfallStep[] = [
    async (session, showImageOptions: IShowImageOptions) => {
        session.send(showImageOptions.preText);
        const msg = new Message(session)
            .addAttachment({
                contentUrl: showImageOptions.imageUrl,
                contentType: "image/jpg",
            });
        session.send(msg);
        session.endDialog();
    }
];

export default new Action<IShowImageOptions>({name, handler});
