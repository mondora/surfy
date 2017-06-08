import {MongoClient, MongoError} from "mongodb";

import {MONGODB_URL} from "../config";
import logger from "./logger";

const dbPromise = new MongoClient().connect(MONGODB_URL);

// Handle connection errors
dbPromise.catch((err: MongoError) => {
    logger.fatal(err, "Could not connect to mongodb");
    process.exit(1);
});

// Handle db errors
dbPromise.then(db => {
    db.on("error", (err: MongoError) => {
        logger.error(err, "Database error");
    });
});

export async function collection (name: string) {
    const db = await dbPromise;
    return db.collection(name);
}
