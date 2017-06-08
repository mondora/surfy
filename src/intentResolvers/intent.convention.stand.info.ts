import * as builder from "botbuilder";
import * as cardResponses from "../responses/cardResponses";
import { collection } from "../services/mongodb";
import IProduct from "../typings/IProduct";
import * as productResolver from "../utils/ProductResolver";

export const intent = "intent.convention.stand.info";
export const resolver: builder.IDialogWaterfallStep[] = [
    async (session, args) => {
        const product = await productResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Product"), "*");
        let query = {};
        if (product) {
            const queryProducts = { alias: { $elemMatch: { $eq: product } } };
            const products = await collection("products");
            const matchingProducts: IProduct[] = await products.find(queryProducts).limit(10).toArray();
            const productsArray = matchingProducts.map(p => p.name);
            query = { ...query, products: { $elemMatch: { $in: productsArray } } };
        }

        const eventCard = await cardResponses.getStand(session, query);
        if (eventCard) {
            session.send(`Ecco gli stand${(product ? ` riguardanti ${product}` : "")}`);
            session.send(eventCard.reply);
            if (eventCard.size > 3) {
                session.send("Quanti risultati! Se vuoi puoi chiedermi la lista degli espositori per uno specifico prodotto :)");
            }
        } else {
            session.send(`Non ho trovato stand${(product ? ` riguardanti ${product}` : "")}`);
            builder.Prompts.choice(session, `Vuoi un elenco degli stand ?`, "Si|No");
        }
    },
    async (session, result) => {
        if (result.response.entity === "Si") {
            const query = {};
            const eventCard = await cardResponses.getStand(session, query);
            session.send(`Ecco alcuni degli stand`);
            if (eventCard) {
                session.send(eventCard.reply);
            }
        } else {
            session.send("Ok va bene :)");
        }
    }
];
