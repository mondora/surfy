import {randomBytes} from "crypto";
import {format, parse} from "url";

export default function appendCachebuster (url: string): string {
    const parsedUrl = parse(url);
    parsedUrl.query = parsedUrl.query || {};
    parsedUrl.query.cachebuster = randomBytes(4).toString("hex");
    return format(parsedUrl);
}
