import * as builder from "botbuilder";
import moment = require("moment-timezone");
import * as cardResponses from "../responses/cardResponses";
import { collection } from "../services/mongodb";
import IProduct from "../typings/IProduct";
import * as dateResolver from "../utils/DateResolver";
import * as productResolver from "../utils/ProductResolver";
import * as speakerResolver from "../utils/SpeakerResolver";

export const intent = "intent.convention.event.info.workshop";
export const resolver: builder.IDialogWaterfallStep[] = [
    async (session, args) => {
        const date = dateResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "customDateTime"));
        session.dialogData.date = date;
        const product = await productResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Product"), "*");
        const speaker = await speakerResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Speaker"));
        let query = {
            type: "workshop",
            date: {
                $gte: date ? new Date(date.from) : new Date("01-01-1970"),
                $lte: date ? new Date(date.to) : new Date("01-01-2099")
            }
        };
        if (product) {
            const queryProducts = { alias: { $elemMatch: { $eq: product } } };
            const products = await collection("products");
            const matchingProducts: IProduct[] = await products.find(queryProducts).limit(10).toArray();
            const productsArray = matchingProducts.map(p => p.name);
            query = { ...query, products: { $elemMatch: { $in: productsArray } } };
        }
        if (speaker) {
            query = { ...query, speakers: { $elemMatch: { $eq: speaker } } };
        }
        const eventCard = await cardResponses.getEvent(session, query);
        if (eventCard) {
            session.send(`Ecco i workshops ${(speaker ? `con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`);
            session.send(eventCard.reply);
            if (eventCard.size > 3) {
                session.send("Quanti risultati! Se vuoi puoi chiedermi la lista dei workshop di oggi o domani per uno specifico prodotto :)");
            }
        } else {
            session.send(`Non ho trovato workshops${(speaker ? ` con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`);
            builder.Prompts.choice(session, `Vuoi un elenco delle demo${date ? ` del ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "di oggi"}?`, "Si|No");
        }
    },
    async (session, result) => {
        if (result.response.entity === "Si") {
            const endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            let date = session.dialogData.date;
            if (!date) {
                const oggi: builder.IEntity = { entity: "oggi", type: "customDateTime" };
                date = dateResolver.resolve(oggi);
            }
            const query = {
                type: "workshop",
                date: {
                    $gte: date ? new Date(date.from) : new Date("01-01-1970"),
                    $lte: date ? new Date(date.to) : new Date("01-01-2099")
                }
            };
            const eventCard = await cardResponses.getEvent(session, query);
            session.send(`Ecco i workshop del ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}`);
            if (eventCard) {
                session.send(eventCard.reply);
            }
        } else {
            session.send("Ok va bene :)");
        }
    }
];
