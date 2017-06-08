import * as builder from "botbuilder";

export const intent = "intent.convention.trains";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Prova a consultare il sito");
        session.send("http://www.trenitalia.com");
    }
];
