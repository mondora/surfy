import * as builder from "botbuilder";

import * as cardResponses from "../responses/cardResponses";
import * as speakerResolver from "../utils/SpeakerResolver";

export const intent = "intent.convention.speaker.info";
export const resolver: builder.IDialogWaterfallStep[] = [
    async (session, args) => {
        const speaker = await speakerResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Speaker"), true);
        if (!speaker) {
            const cards = await cardResponses.getSpeaker(session, {});
            if (cards) {
                session.send("Non ho capito a che relatore ti riferisci. Eccone Alcuni");
                session.send(cards.reply);
                session.send("Prova a chiedermelo in un altro modo o ad essere più preciso sul nome e cognome :)");
            }
        } else {
            const query = { alias: { $elemMatch: { $eq: speaker } } };
            const cards = await cardResponses.getSpeaker(session, query);
            if (cards) {
                if (cards.size > 1) {
                    session.send(`A quale "${speaker}" ti riferisci? ho trovato più corrispondenze"`);
                    session.send(cards.reply);
                } else {
                    session.send(cards.reply);
                }
            } else {
                session.send("Non sono riuscito a trovatre dati relativi a questo relatore");
                session.send("Prova a chiedermelo in un altro modo o ad essere più preciso sul nome e cognome :)");
            }
        }
    }
];
