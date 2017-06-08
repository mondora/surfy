import bunyan = require("bunyan");

import {LOG_LEVEL, NODE_ENV} from "../config";

export default bunyan.createLogger({
    name: "surfy",
    streams: NODE_ENV === "test" ? [] : [{
        level: LOG_LEVEL,
        stream: process.stdout
    }]
});
