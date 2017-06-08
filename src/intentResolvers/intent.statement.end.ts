import * as builder from "botbuilder";

import {getResponse} from "../responses/generalResponses";

export const intent = "intent.statement.end";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send(getResponse("end"));
    }
];
