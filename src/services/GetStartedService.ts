import axios from "axios";
import {UniversalBot} from "botbuilder";

import {FACEBOOK_PAGE_ACCESS_TOKEN} from "../config";
import * as PostbackPayload from "../utils/PostbackPayload";
import logger from "./logger";

export default class GetStartedService {

    private bot: UniversalBot;

    constructor (bot: UniversalBot) {
        this.bot = bot;
    }

    public configure () {
        this.configureMessenger();
    }

    /*
    *   Configures Facebook Messenger Get Started button. Info at
    *   developers.facebook.com/docs/messenger-platform/thread-settings/get-started-button
    */
    private async configureMessenger () {
        try {
            const url = `https://graph.facebook.com/v2.6/me/thread_settings?access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`;
            await axios.delete(url, {
                data: {
                    setting_type: "call_to_actions",
                    thread_state: "new_thread"
                }
            });
            logger.debug("Successfully deleted previous Messenger Get Started button configuration");
            const payload = PostbackPayload.stringify({
                actionName: "getStarted",
                actionPayload: null
            });
            await axios.post(url, {
                setting_type: "call_to_actions",
                thread_state: "new_thread",
                call_to_actions: [{payload}]
            });
            logger.debug("Successfully posted new Messenger Get Started button configuration");
            logger.info("Messenger Get Started button configured successfully");
        } catch (err) {
            logger.error(err, "Error configuring Messenger Get Started button");
        }
    }

}
