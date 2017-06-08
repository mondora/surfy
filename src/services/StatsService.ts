import {IEvent, UniversalBot} from "botbuilder";
import moment = require("moment");
import {Collection} from "mongodb";

import logger from "./logger";
import {collection} from "./mongodb";

export default class StatsService {

    private bot: UniversalBot;

    constructor (bot: UniversalBot) {
        this.bot = bot;
    }

    public start () {
        this.bot.on("receive", (event: IEvent) => {
            this.updateStats(event);
        });
    }

    private async updateStats (event: IEvent) {
        const statsCollection = await collection("stats");
        this.increaseHourlyMessagesCount(statsCollection);
        this.increaseTotalMessagesCount(statsCollection);
        this.increasePlatformMessagesCount(statsCollection, event.address.channelId);
    }

    private async increaseHourlyMessagesCount (statsCollection: Collection) {
        try {
            await statsCollection.updateOne(
                {
                    type: "hourlyMessagesCount",
                    date: moment().startOf("hour").toDate()
                },
                {
                    $inc: {
                        messagesCount: 1
                    }
                },
                {
                    upsert: true
                }
            );
        } catch (err) {
            logger.error(err, "StatsService: error increasing hourly messages count");
        }
    }

    private async increaseTotalMessagesCount (statsCollection: Collection) {
        try {
            await statsCollection.updateOne(
                {
                    type: "totalMessagesCount"
                },
                {
                    $inc: {
                        messagesCount: 1
                    }
                },
                {
                    upsert: true
                }
            );
        } catch (err) {
            logger.error(err, "StatsService: error increasing total messages count");
        }
    }

    private async increasePlatformMessagesCount (statsCollection: Collection, platform: string) {
        try {
            await statsCollection.updateOne(
                {
                    type: "platformMessagesCount",
                    platform: platform
                },
                {
                    $inc: {
                        messagesCount: 1
                    }
                },
                {
                    upsert: true
                }
            );
        } catch (err) {
            logger.error(err, "StatsService: error increasing platform messages count", {platform});
        }
    }

}
