import {ChatConnector} from "botbuilder";
import cors = require("cors");
import express = require("express");
import {healthRoute} from "express-healthchecker";
const bunyanMiddleware: (options: Object) => express.RequestHandler = require("bunyan-middleware");

import bot from "./bot";
import * as config from "./config";
import getGetBroadcastsRoute from "./routes/getBroadcasts";
import getGetPollsRoute from "./routes/getPolls";
import getGetRootRoute from "./routes/getRoot";
import getGetStatsRoute from "./routes/getStats";
import getPostBroadcastsRoute from "./routes/postBroadcasts";
import getPostPollsRoute from "./routes/postPolls";
import ActiveDialogService from "./services/ActiveDialogService";
import logger from "./services/logger";
import ReminderService from "./services/ReminderService";
import authenticateRequest from "./utils/authenticateRequest";

const connector = new ChatConnector({
    appId: config.MICROSOFT_APP_ID,
    appPassword: config.MICROSOFT_APP_PASSWORD
});
bot.connector("*", connector);

const activeDialogService = new ActiveDialogService(bot);
const reminderService = new ReminderService(activeDialogService);
reminderService.start();

logger.debug("Server config", {config});

const getRootRoute = getGetRootRoute();
const postBroadcastsRoute = getPostBroadcastsRoute(activeDialogService);
const getBroadcastsRoute = getGetBroadcastsRoute();
const postPollsRoute = getPostPollsRoute(activeDialogService);
const getPollsRoute = getGetPollsRoute();
const getStatsRoute = getGetStatsRoute();

express()
    .post("/api/messages", connector.listen())
    .use(cors({
        origin: true,
        credentials: true
    }))
    .get("/health", healthRoute({
        healthChecks: [],
        accessToken: config.HEALTH_ROUTE_ACCESS_TOKEN
    }))
    .get(getRootRoute.path, getRootRoute.handler)
    .use(bunyanMiddleware({
        logger: logger,
        obscureHeaders: ["Authorization"]
    }))
    .use(authenticateRequest(config.JWT_SECRET))
    .post(postBroadcastsRoute.path, postBroadcastsRoute.middleware, postBroadcastsRoute.handler)
    .get(getBroadcastsRoute.path, getBroadcastsRoute.handler)
    .post(postPollsRoute.path, postPollsRoute.middleware, postPollsRoute.handler)
    .get(getPollsRoute.path, getPollsRoute.handler)
    .get(getStatsRoute.path, getStatsRoute.handler)
    .listen(config.PORT, () => {
        logger.info(`Server listening on ${config.HOSTNAME}:${config.PORT}`);
    });
