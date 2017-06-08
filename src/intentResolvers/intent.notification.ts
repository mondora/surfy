import * as builder from "botbuilder";

export const intent = "intent.notification";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Ok te lo ricordo");
    }
];
