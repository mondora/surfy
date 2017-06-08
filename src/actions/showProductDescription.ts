import {IDialogWaterfallStep} from "botbuilder";

import { collection } from "../services/mongodb";
import IProduct from "../typings/IProduct";
import Action from "../utils/Action";

interface IShowProductDescriptionOptions {
    productName: string;
}

const name = "showProductDescription";
const handler: IDialogWaterfallStep[] = [
    async (session, showProductDescriptionOptions: IShowProductDescriptionOptions) => {
        const query = { name: showProductDescriptionOptions.productName, type: "product" };
        const products = await collection("products");
        const matchingProducts: IProduct[] = await products.find(query).limit(1).toArray();
        if (matchingProducts.length > 0) {
            session.send(matchingProducts[0].title);
            session.send(matchingProducts[0].subtitle);
            session.send(matchingProducts[0].text);
        } else {
            session.send("Ops. Qualcosa è andato storto e non sono riuscito a recuperare i dati");
        }
        session.endDialog();
    }
];

export default new Action<IShowProductDescriptionOptions>({name, handler});
