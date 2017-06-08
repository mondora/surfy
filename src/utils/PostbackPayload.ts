import {IMessage} from "botbuilder";
import {startsWith, trimStart} from "lodash";

const MESSAGE_PREFIX = "runAction:";

export interface IPostbackPayload {
    actionName: string;
    actionPayload?: any;
}

export function extractFromMessage (message: IMessage): IPostbackPayload | null {
    try {
        /*
        *   Messages coming both from facebook and skype have the payload in
        *   message.text (facebook messages also carry it in
        *   sourceEvent.postback.payload, but since skype messages don't, we get
        *   it from message.text)
        */
        const payload = message.text;
        return (
            typeof payload === "string" && startsWith(payload, MESSAGE_PREFIX)
            ? parse(payload)
            : null
        );
    } catch (err) {
        return null;
    }
}

export function parse (payload: string): IPostbackPayload {
    return JSON.parse(trimStart(payload, MESSAGE_PREFIX));
}

export function stringify (payload: IPostbackPayload): string {
    return `${MESSAGE_PREFIX}${JSON.stringify(payload)}`;
}
