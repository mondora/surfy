import {map} from "bluebird";
import {range, values} from "lodash";
import moment = require("moment");
import {Collection} from "mongodb";

import {collection} from "../services/mongodb";
import IRoute from "../typings/IRoute";

/*
*   Get totals stats
*/

interface ITotalStat {
    type: "totalMessagesCount";
    messagesCount: number;
}

interface ITotals {
    usersCount: number;
    messagesCount: number;
}

async function getTotals (statsCollection: Collection, usersCollection: Collection): Promise<ITotals> {
    const totalStat: ITotalStat = await statsCollection.findOne({
        type: "totalMessagesCount"
    });
    const usersCount = await usersCollection.count({});
    return {
        messagesCount: totalStat.messagesCount,
        usersCount: usersCount
    };
}

/*
*   Get platforms stats
*/

interface IMessagesCountStat {
    type: "platformMessagesCount";
    platform: string;
    messagesCount: number;
}

interface IPlatform {
    name: string;
    usersCount: number;
    messagesCount: number;
}

async function getPlatforms (statsCollection: Collection, usersCollection: Collection): Promise<IPlatform[]> {
    const messagesCounts: IMessagesCountStat[] = await statsCollection.find({
        type: "platformMessagesCount"
    }).toArray();
    return map(messagesCounts, async messagesCount => {
        const usersCount = await usersCollection.count({
            platform: messagesCount.platform
        });
        return {
            name: messagesCount.platform,
            usersCount: usersCount,
            messagesCount: messagesCount.messagesCount
        };
    });
}

/*
*   Get hourly messages count stats
*/

interface IHourlyMessagesCountStat {
    date: Date;
    messagesCount: number;
}

interface IHourlyMessagesCount {
    date: string;
    messagesCount: number;
}

interface IHourlyMessagesCountsMap {
    [key: string]: IHourlyMessagesCount;
}

async function getPreviousWeekHourlyMessagesCounts (statsCollection: Collection): Promise<IHourlyMessagesCount[]> {
    const sevenDaysAgo = moment().subtract(6, "days").startOf("day");
    // Initialize an (empty) date -> hourlyMessagesCount map
    const hourlyMessagesCountsMap = range(7 * 24).reduce<IHourlyMessagesCountsMap>((acc, delta) => {
        const date = moment().subtract(delta, "hours").toISOString();
        acc[date] = {
            date: date,
            messagesCount: 0
        };
        return acc;
    }, {});
    const hourlyMessagesCountStats: IHourlyMessagesCountStat[] = await statsCollection.find({
        type: "hourlyMessagesCount",
        date: {
            $gte: sevenDaysAgo.toDate()
        }
    }).toArray();
    hourlyMessagesCountStats.forEach(hourlyMessagesCountStat => {
        const date = hourlyMessagesCountStat.date.toISOString();
        hourlyMessagesCountsMap[date] = {
            date: date,
            messagesCount: hourlyMessagesCountStat.messagesCount
        };
    });
    return values(hourlyMessagesCountsMap);
}

/*
*   Define route
*/

export default (): IRoute => ({
    path: "/stats",
    method: "get",
    middleware: [],
    handler: async (_, res) => {
        const [
            statsCollection,
            usersCollection
        ] = await Promise.all([
            collection("stats"),
            collection("users")
        ]);
        const [
            totals,
            platforms,
            previousWeekHourlyMessagesCounts
        ] = await Promise.all([
            getTotals(statsCollection, usersCollection),
            getPlatforms(statsCollection, usersCollection),
            getPreviousWeekHourlyMessagesCounts(statsCollection)
        ]);
        res.status(200).send({
            totals,
            platforms,
            previousWeekHourlyMessagesCounts
        });
    }
});
