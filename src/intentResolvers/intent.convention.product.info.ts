import * as builder from "botbuilder";

import * as cardResponses from "../responses/cardResponses";
import * as productResolver from "../utils/ProductResolver";

export const intent = "intent.convention.product.info";
export const resolver: builder.IDialogWaterfallStep[] = [
    async (session, args) => {
        session.dialogData.productName = await productResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Product"), "product");
        if (!session.dialogData.productName) {
            const cards = await cardResponses.getProduct(session, {
                type: "product"
            });
            if (cards) {
                session.send("Non ho capito a che prodotto ti riferisci. Eccone alcuni");
                session.send(cards.reply);
                session.send("Prova a chiedermelo in un altro modo o ad essere più preciso sul nome prodotto :)");
            }
        } else {
            const query = { alias: { $elemMatch: { $eq: session.dialogData.productName } }, type: "product" };
            const cards = await cardResponses.getProduct(session, query);
            if (cards) {
                session.send(cards.reply);
                if (cards.size > 3) {
                    session.send("Quanti risultati! prova ad essere più preciso sul nome prodotto :)");
                }
            } else {
                session.send("Mi spiace, non sono riuscito a trovare prodotti con questo nome");
                session.send("Prova a chiedermelo in un altro modo o ad essere più preciso sul nome prodotto :)");
            }
        }
    }
];
