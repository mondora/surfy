import {UniversalBot} from "botbuilder";

import Action from "../utils/Action";
import * as PostbackPayload from "../utils/PostbackPayload";

interface IActionsMap {
    [name: string]: string;
}

export default class ActionService {

    private actions: IActionsMap = {};
    private bot: UniversalBot;

    constructor (bot: UniversalBot) {
        this.bot = bot;
        this.bot
            .dialog("/runAction", (session, postbackPayload: PostbackPayload.IPostbackPayload) => {
                session.reset(
                    this.actions[postbackPayload.actionName],
                    postbackPayload.actionPayload
                );
            })
            .triggerAction({
                onFindAction: (context, callback) => {
                    const postbackPayload = PostbackPayload.extractFromMessage(context.message);
                    if (postbackPayload !== null) {
                        // TODO remove casting when https://github.com/Microsoft/BotBuilder/pull/2370 is resolved
                        callback(null as any, 1, postbackPayload);
                    } else {
                        callback(null as any, 0);
                    }
                }
            });
    }

    public registerAction (action: Action<any>) {
        const actionDialogId = `/runAction/${action.name}`;
        this.bot.dialog(actionDialogId, action.handler);
        this.actions[action.name] = actionDialogId;
    }

}
