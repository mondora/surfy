import {IDialogWaterfallStep} from "botbuilder";

export const path = "/remind";
export const dialog: IDialogWaterfallStep[] = [
    (session, args) => {
        session.send(args.what);
        session.endDialog();
    }
];
