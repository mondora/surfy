import * as builder from "botbuilder";

import * as cardResponses from "../responses/cardResponses";
import * as dateResolver from "../utils/DateResolver";

export const intent = "intent.convention.event.info.start";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session, args) => {
        const date = dateResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "customDateTime"));
        if (date) {
            if (date.from.getDate() === 23) {
                session.send("Ecco il progamma di Giovedì 23");
                const msg = new builder.Message(session)
                    .addAttachment({
                        contentUrl: "https://tsconvention2017assets.blob.core.windows.net/assets/generic/Agenda_23_marzo.jpg",
                        contentType: "image/jpg",
                    });
                session.send(msg);
            }
            if (date.from.getDate() === 24) {
                session.send("Ecco il progamma di Venerdì 24");
                const msg = new builder.Message(session)
                    .addAttachment({
                        contentUrl: "https://tsconvention2017assets.blob.core.windows.net/assets/generic/Agenda_24_marzo.jpg",
                        contentType: "image/jpg",
                    });
                session.send(msg);
            }
        } else {
            session.send("23 marzo: ora di inizio 8:30");
            session.send("24 marzo: ora di inizio 9:00");
            session.send(cardResponses.conventionStartCardsReply(session));
            session.send("Se desideri altre informazioni ti segnalo alcuni contatti :");
            session.send("Mail info@riminipalacongressi.it");
            session.send("Tel  0541 711500");
            session.send("Fax  0541 711505");
        }
    }
];
