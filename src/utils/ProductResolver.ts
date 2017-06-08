import * as builder from "botbuilder";
import * as levenshtein from "fast-levenshtein";
import {first, sortBy} from "lodash";

import {collection} from "../services/mongodb";
import IProduct from "../typings/IProduct";

export async function resolve (name: builder.IEntity, type: string) {
    if (!name) {
        return;
    }
    const stringToCompare = name.entity;
    const allProductsCollection = await collection("products");
    let filter = {};
    if (type !== "*") {
        filter = { type: type };
    }
    const allProducts: IProduct[] = await allProductsCollection.find(filter).toArray();
    const allAlias: string[] = [].concat.apply([], allProducts.map(product => product.alias));
    const levenshteinResult = allAlias.map(alias => (
        {
        name: alias,
        score: levenshtein.get(alias, stringToCompare)
    }));
    const bestMatch = first(
        sortBy(levenshteinResult, "score")
    );
    if (bestMatch !== undefined && bestMatch.score <= 4) {
        return bestMatch.name;
    }
    return name.entity;
}
