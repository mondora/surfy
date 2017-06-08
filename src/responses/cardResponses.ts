import * as builder from "botbuilder";
import moment = require("moment-timezone");

import remind from "../actions/remind";
import showEventDescription from "../actions/showEventDescription";
import showEventList from "../actions/showEventList";
import showEventSpeakers from "../actions/showEventSpeakers";
import showImage from "../actions/showImage";
import showProductDescription from "../actions/showProductDescription";
import showSpeakerDescription from "../actions/showSpeakerDescription";
import showStandList from "../actions/showStandList";
import showStandMap from "../actions/showStandMap";
import { collection } from "../services/mongodb";
import IEvent from "../typings/IEvent";
import IProduct from "../typings/IProduct";
import ISpeaker from "../typings/ISpeaker";
import IStand from "../typings/IStand";
import appendCachebuster from "../utils/appendCachebuster";

export async function getEvent (session: builder.Session, query: {}) {
    const events = await collection("events");
    const matchingEvents: IEvent[] = await events.find(query).limit(10).toArray();
    const cards = matchingEvents.map(event => {
        let actions = [
            remind.getCardAction({
                session: session,
                label: "Ricordamelo",
                payload: {
                    what: `Tra 10 minuti inizia l'evento "${event.title}"`,
                    when: moment(event.date).subtract(10, "minutes").toISOString(),
                    confirmationMessage: `Ok, ti ricorderò di partecipare all'evento "${event.title}" 10 minuti prima che inizi`
                }
            }),
            showEventDescription.getCardAction({
                session: session,
                label: "Info",
                payload: {
                    eventTitle: event.title
                }
            })];
        if (event.type === "plenary") {
            actions = actions.concat(
                showEventSpeakers.getCardAction({
                    session: session,
                    label: "Relatori",
                    payload: {
                        speakerNames: event.speakers
                    }
                }));
        }
        return new builder.HeroCard(session)
                .title(`${event.title} -  ${moment(event.date).tz("Europe/Rome").format("DD/MM/YYYY HH:mm")}`)
                .subtitle(`Durata: ${event.duration}\nSala: ${event.room}\n`)
                .text(event.text)
                .images([
                    builder.CardImage.create(session, appendCachebuster(event.image))
                ])
                .buttons(actions);
    });
    if (cards.length === 0) {
        return;
    }
    const reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    return { reply: reply, size: cards.length};
}

export async function getProduct (session: builder.Session, query: {}) {
    console.log(query);
    const products = await collection("products");
    const matchingProducts: IProduct[] = await products.find(query).limit(10).toArray();
    const cards = matchingProducts.map(product => {
        return new builder.HeroCard(session)
                .title(product.title)
                .subtitle(product.subtitle)
                .text(product.text)
                .images([
                    builder.CardImage.create(session, appendCachebuster(product.image))
                ])
                .buttons([
                    showEventList.getCardAction({
                        session: session,
                        label: "Mostra Eventi",
                        payload: {
                            productName: product.name,
                            speakerName: "",
                            eventType: ""
                        }
                    }),
                    showProductDescription.getCardAction({
                        session: session,
                        label: "Info",
                        payload: {
                            productName: product.name
                        }
                    }),
                    showStandList.getCardAction({
                        session: session,
                        label: "Stand",
                        payload: {
                            productName: product.name
                        }
                    })
                ]);
    });
    if (cards.length === 0) {
        return;
    }
    const reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    return { reply: reply, size: cards.length };
}

export async function getSpeaker (session: builder.Session, query: {}) {
    console.log(query);
    const speakerCollection = await collection("speakers");
    const matchingEvents: ISpeaker[] = await speakerCollection.find(query).limit(10).toArray();
    const cards = matchingEvents.map(speaker => {
        return new builder.HeroCard(session)
            .title(speaker.title)
            .subtitle(speaker.subtitle)
            .text(speaker.text)
            .images([
                builder.CardImage.create(session, appendCachebuster(speaker.image))
            ])
            .buttons([
                showEventList.getCardAction({
                    session: session,
                    label: "Interventi",
                    payload: {
                        productName: "",
                        speakerName: speaker.name,
                        eventType: "plenary"
                    }
                }),
                showSpeakerDescription.getCardAction({
                    session: session,
                    label: "Info",
                    payload: {
                        title: speaker.title,
                        subtitle: speaker.subtitle,
                        text: speaker.text,
                        linkedin: speaker.linkedin
                    }
                })
            ]);
    });
    if (cards.length === 0) {
        return;
    }
    const reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    return { reply: reply, size: cards.length };
}

export async function getStand (session: builder.Session, query: {}) {
    console.log(query);
    const stands = await collection("stands");
    const matchingStands: IStand[] = await stands.find(query).limit(10).toArray();
    const cards = matchingStands.map(stand => {
        return new builder.HeroCard(session)
            .title(`${stand.title} - Stand: ${stand.stand}`)
            .subtitle(`Area: ${stand.area}\n`)
            .text(stand.text)
            .images([
                builder.CardImage.create(session, appendCachebuster(stand.image))
            ]).buttons([
                showStandMap.getCardAction({
                    session: session,
                    label: "Mappa",
                    payload: {
                        standImage: stand.map,
                        standName: stand.stand
                    }
                }),
            ]);
    });
    if (cards.length === 0) {
        return;
    }
    const reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    return { reply: reply, size: cards.length };
}

export function conventionStartCardsReply (session: builder.Session) {
    const cards = [new builder.HeroCard(session)
        .title("TeamSystem - #Surf the change - 23 e 24 Marzo")
        .subtitle("Palacongressi di Rimini - Via della Fiera 23\n47923 Rimini (RN) Italy")
        .images([
            builder.CardImage.create(
                session,
                appendCachebuster("https://tsconvention2017assets.blob.core.windows.net/assets/generic/Agenda_doppia_riassuntiva.jpg")
            )
        ])
        .buttons([
            showImage.getCardAction({
                session: session,
                label: "Info 23 Marzo",
                payload: {
                    preText: "Ecco il programma del 23 Marzo",
                    imageUrl: appendCachebuster("https://tsconvention2017assets.blob.core.windows.net/assets/generic/Agenda_23_marzo.jpg")
                }
            }),
            showImage.getCardAction({
                session: session,
                label: "Info 24 Marzo",
                payload: {
                    preText: "Ecco il programma del 24 Marzo",
                    imageUrl: appendCachebuster("https://tsconvention2017assets.blob.core.windows.net/assets/generic/Agenda_24_marzo.jpg")
                }
            })
        ])];
    const reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    return reply;
}
