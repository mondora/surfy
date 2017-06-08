import * as builder from "botbuilder";
import * as levenshtein from "fast-levenshtein";
import {first, sortBy} from "lodash";

import {collection} from "../services/mongodb";
import ISpeaker from "../typings/ISpeaker";

export async function resolve (name: builder.IEntity, aliasAllowed?: boolean) {
    if (!name) {
        return;
    }
    const stringToCompare = name.entity;
    const allSpeakersCollection = await collection("speakers");
    const allSpeakers: ISpeaker[] = await allSpeakersCollection.find({}).toArray();
    const allAlias: string[] = [].concat.apply([], allSpeakers.map(speaker => speaker.alias));
    const levenshteinResult = allAlias.map(alias => ({
        name: alias,
        score: levenshtein.get(alias, stringToCompare)
    }));
    const bestMatch = first(
        sortBy(levenshteinResult, "score")
    );
    if (bestMatch !== undefined && bestMatch.score <= 10) {
        if (aliasAllowed) {
            return bestMatch.name;
        }
        const realProductNames: ISpeaker[] = await allSpeakersCollection.find({ alias: { $elemMatch: { $eq: bestMatch.name } } }).limit(1).toArray();
        return realProductNames[0].name;
    }
    return name.entity;
}
