import * as builder from "botbuilder";
import moment = require("moment-timezone");
import * as cardResponses from "../responses/cardResponses";
import * as dateResolver from "../utils/DateResolver";
import * as productResolver from "../utils/ProductResolver";
import * as speakerResolver from "../utils/SpeakerResolver";

export const intent = "intent.convention.event.info";
export const resolver: builder.IDialogWaterfallStep[] = [
    async (session, args) => {
            session.dialogData.date = dateResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "customDateTime"));
            session.dialogData.product = await productResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Product"), "*");
            session.dialogData.speaker = await speakerResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Speaker"));
            builder.Prompts.choice(session, `A che tipo di evento sei interessato${(session.dialogData.product ? ` sul prodotto ${session.dialogData.product}` : "")}?`, "Workshop|Demo|Plenaria|Nessuno");
    },
    async (session, result) => {
        const speaker = session.dialogData.speaker;
        const date = session.dialogData.date;
        const product = session.dialogData.product;
        let query = {
            date: {
                $gte: date ? new Date(date.from) : new Date("01-01-1970"),
                $lte: date ? new Date(date.to) : new Date("01-01-2099")
            }
        };
        if (product) {
            query = { ...query, products: { $elemMatch: { $eq: product } } };
        }
        if (speaker) {
            query = { ...query, speakers: { $elemMatch: { $eq: speaker } } };
        }
        let reply;
        let phrase;
        switch (result.response.entity) {
            case "Workshop":
                session.dialogData.eventType = "workshop";
                reply = await cardResponses.getEvent(session, { ...query, type: "workshop" });
                phrase = `Ecco l'elenco dei workshop${(speaker ? ` con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`;
            break;
            case "Demo":
                session.dialogData.eventType = "demo";
                reply = await cardResponses.getEvent(session, { ...query, type: "demo" });
                phrase = `Ecco l'elenco delle demo${(speaker ? ` con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`;
            break;
            case "Plenaria":
                session.dialogData.eventType = "plenary";
                reply = await cardResponses.getEvent(session, { ...query, type: "plenary" });
                phrase = `Ecco l'elenco degli eventi in plenaria${(speaker ? ` con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`;
            break;
            default:
                session.send("Ok bene :), probabilmente ho capito male io");
                return;
        }
        if (reply) {
            session.send(phrase);
            session.send(reply.reply);
            if (reply.size > 6) {
                session.send("Quanti risultati! Se vuoi puoi chiedermi la lista degli eventi di oggi/domani per uno specifico prodotto o argomento :)");
            }
        } else {
            session.send(`Non ho trovato eventi${(speaker ? ` con ${speaker}` : "")}${(product ? ` su ${product}` : "")}${(date ? ` in data ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "")}`);
            builder.Prompts.choice(session, `Vuoi l'elenco di ${result.response.entity} ${date ? `del ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}` : "di oggi"}?`, "Si|No");
        }
    },
    async (session, result) => {
        if (result.response.entity === "Si") {
            let date = session.dialogData.date;
            if (!date) {
                const oggi: builder.IEntity = { entity: "oggi", type: "customDateTime" };
                date = dateResolver.resolve(oggi);
            }
            const query = {
                type: session.dialogData.eventType,
                date: {
                    $gte: date ? date.from : new Date("01-01-1970"),
                    $lte: date ? date.to : new Date("01-01-2099")
                }
            };
            const eventCard = await cardResponses.getEvent(session, query);
            if (eventCard) {
                session.send(`Ecco ${session.dialogData.eventType} del ${moment(date.from).tz("Europe/Rome").format("DD/MM/YYYY")}`);
                session.send(eventCard.reply);
            }
        } else {
            session.send("Ok va bene :)");
        }
    }
];
