import {UniversalBot} from "botbuilder";

import ActionService from "./services/ActionService";
import GetStartedService from "./services/GetStartedService";
import logger from "./services/logger";
import * as SpellService from "./services/SpellService";
import StatsService from "./services/StatsService";
import loadActions from "./utils/loadActions";
import loadDialogs from "./utils/loadDialogs";

const bot = new UniversalBot();

// Set default bot locale
bot.set("localizerSettings", {
    defaultLocale: "it"
});

// Register dialogs
loadDialogs().forEach(dialog => {
    bot.dialog(dialog.path, dialog.dialog);
});

// Register thumbsup dialog
bot
    .dialog("/thumbsup", (session) => {
        session.send("👍");
        session.endDialog();
    })
    .triggerAction({
        onFindAction: (context, callback) => {
            const hasAttachment = (
                context.message.attachments &&
                context.message.attachments.length > 0
            );
            if (hasAttachment) {
                // TODO remove casting when https://github.com/Microsoft/BotBuilder/pull/2370 is resolved
                callback(null as any, 1);
            } else {
                callback(null as any, 0);
            }
        }
    });

// Register actions
const actionService = new ActionService(bot);
loadActions().forEach(action => {
    actionService.registerAction(action);
});

// Register spell-check middleware
bot.use({
    botbuilder: async (session, next) => {
        try {
            const text = await SpellService.getCorrectedText(session.message.text);
            session.message.text = text;
            next();
        } catch (err) {
            logger.error(err, "SpellService: error spell-checking message");
            next();
        }
    }
});

// Init get started service
const getStartedService = new GetStartedService(bot);
getStartedService.configure();

// Init stats service
const statsService = new StatsService(bot);
statsService.start();

export default bot;
