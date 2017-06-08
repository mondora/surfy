import * as assert from "assert";

export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
export const HOSTNAME = process.env.HOSTNAME || "localhost";
export const PORT = process.env.PORT || "3978";

export const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
export const WEATHER_API_URL = process.env.WEATHER_API_URL;
export const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
export const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
export const MICROSOFT_APP_ID = process.env.MICROSOFT_APP_ID;
export const MICROSOFT_APP_PASSWORD = process.env.MICROSOFT_APP_PASSWORD;
export const LUIS_RECOGNIZER_URLS = (() => {
    try {
        const urls = JSON.parse(process.env.LUIS_RECOGNIZER_URLS) as string[];
        // Ensure urls is a string array
        assert.ok(Array.isArray(urls));
        urls.forEach(url => assert.ok(typeof url === "string"));
        return urls;
    } catch (e) {
        throw new Error("You must provide a valid LUIS_RECOGNIZER_URLS environment variable");
    }
})();
export const SPELL_CHECK_API_URL = (() => {
    if (!process.env.SPELL_CHECK_API_URL) {
        throw new Error("You must provide a SPELL_CHECK_API_URL");
    }
    return process.env.SPELL_CHECK_API_URL;
})();
export const SPELL_CHECK_API_KEY = (() => {
    if (!process.env.SPELL_CHECK_API_KEY) {
        throw new Error("You must provide a SPELL_CHECK_API_KEY");
    }
    return process.env.SPELL_CHECK_API_KEY;
})();
export const MONGODB_URL = (
    process.env.MONGODB_URL ||
    (NODE_ENV === "test" ? "mongodb://localhost:27017/test" : "mongodb://localhost:27017/dev")
);
export const HEALTH_ROUTE_ACCESS_TOKEN = process.env.HEALTH_ROUTE_ACCESS_TOKEN;
export const JWT_SECRET = new Buffer(
    process.env.JWT_SECRET || new Buffer("secret").toString("base64"),
    "base64"
);
