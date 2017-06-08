import * as builder from "botbuilder";
import * as request from "request";

import { WEATHER_API_KEY, WEATHER_API_URL } from "../config";
export const intent = "intent.weather";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session, args) => {
        const date = builder.EntityRecognizer.findEntity(args.entities, "customDateTime");
        // TODO implementare gestione del giorno
        const url = `${WEATHER_API_URL}&APPID=${WEATHER_API_KEY}`;
        request({
            url: url,
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let weather = [];
                if (date && date.entity === "domani") {
                    session.send("Ecco il meteo di domani a Rimini");
                    weather = body.list.map((day: any) => {
                        if ((new Date().getDate() + 1) === new Date(day.dt * 1000).getDate()) {
                            return { temp: day.main.temp, date: day.dt_txt, description: day.weather[0].description, icon: `https://tsconvention2017assets.blob.core.windows.net/assets/weather/${day.weather[0].icon}.png` };
                        }
                        return;
                    }).filter((day: any) => {
                        return typeof day !== "undefined";
                    });
                } else {
                    session.send("Ecco il meteo di oggi a Rimini");
                    weather = body.list.map((day: any) => {
                        if ((new Date().getDate()) === new Date(day.dt * 1000).getDate()) {
                            return { temp: day.main.temp, date: day.dt_txt, description: day.weather[0].description, icon: `https://tsconvention2017assets.blob.core.windows.net/assets/weather/${day.weather[0].icon}.png` };
                        }
                        return;
                    }).filter((day: any) => {
                        return typeof day !== "undefined";
                    });
                }

                const cards = weather.map((day: any) => {
                    return new builder.HeroCard(session)
                        .title(`Rimini - ${day.date}`)
                        .subtitle("")
                        .text(`Tempo: ${day.description}\n Temperatura: ${Math.round(day.temp)} gradi`)
                        .images([
                            builder.CardImage.create(session, day.icon)
                        ]);
                });
                const reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                session.send(reply);
            }
        });
    }
];
