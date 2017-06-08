import {RequestHandler} from "express";
const {validate} = require("express-jsonschema") as {
    validate: (schema: object) => RequestHandler;
};

export default function validateRequestBody (schema: object): RequestHandler {
    const middleware = validate({body: schema});
    return (req, res, next) => {
        middleware(req, res, err => {
            if (!err) {
                next();
                return;
            }
            res.status(400).send({
                message: "Invalid request body",
                errors: err.validations
            });
        });
    };
}
