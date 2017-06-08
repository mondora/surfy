import * as builder from "botbuilder";

import {getResponse} from "../responses/generalResponses";

export const intent = "intent.statement.compliment";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send(getResponse("compliment"));
    }
];
