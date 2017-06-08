import * as builder from "botbuilder";

// import { getResponse } from "../responses/generalResponses";

export const intent = "intent.question.whoareyou";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Io sono SURFY !");
        session.send("Sono stata creata dai migliori nerd per farti da personal assistant durante la Convention TeamSystem 2017");
    }
];
