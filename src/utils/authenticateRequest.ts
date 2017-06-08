import {RequestHandler} from "express";
import jwt = require("express-jwt");

export default function authenticateRequest (jwtSecret: Buffer): RequestHandler {
    const jwtMiddleware = jwt({
        secret: jwtSecret,
        requestProperty: "jwt",
        credentialsRequired: true
    });
    return (req: any, res, next) => {
        jwtMiddleware(req, res, err => {
            if (err) {
                res.status(401).send({
                    message: err.message
                });
                return;
            }
            const userId = req.jwt.sub;
            req.userId = userId;
            req.user = {
                id: userId
            };
            delete req.jwt;
            next();
        });
    };
};
