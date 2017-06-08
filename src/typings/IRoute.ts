import {RequestHandler} from "express";

type HttpMethod = "get" | "post";

interface IRoute {
    path: string;
    method: HttpMethod;
    middleware: RequestHandler[];
    handler: RequestHandler;
}

export default IRoute;
