import {CardAction, IDialogWaterfallStep, Session} from "botbuilder";

import * as PostbackPayload from "./PostbackPayload";

export interface IActionOptions {
    name: string;
    handler: IDialogWaterfallStep | IDialogWaterfallStep[];
}

export interface ICardActionOptions<T> {
    session: Session;
    payload: T;
    label: string;
}

export default class Action<T> {

    public readonly name: string;
    public readonly handler: IDialogWaterfallStep | IDialogWaterfallStep[];

    constructor (options: IActionOptions) {
        this.name = options.name;
        this.handler = options.handler;
    }

    public getCardAction (options: ICardActionOptions<T>) {
        const message = PostbackPayload.stringify({
            actionName: this.name,
            actionPayload: options.payload
        });
        return CardAction.postBack(options.session, message, options.label);
    }

}
