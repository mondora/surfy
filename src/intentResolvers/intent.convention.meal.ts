import * as builder from "botbuilder";

import * as mealResolver from "../utils/MealResolver";
// TODO si potrebbe migliorare facendogli capire il giorno oggi/domani
export const intent = "intent.convention.meal";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session, args) => {
        const giovedi = new Date().getDate(); // TODO settare come data il 23
        const venerdi = (new Date().getDate()) + 1;
        const meal = mealResolver.resolve(builder.EntityRecognizer.findEntity(args.entities, "Meal"));
        if (!meal) {
            builder.Prompts.choice(session, "Vuoi sapere il menù di oggi a pranzo o di questa sera?", "Pranzo|Cena");
        } else {
            let url = "";
            if (meal === "Cena") {
                if (new Date().getDate() === giovedi) {
                    session.send("Ecco il menù di giovedì 23 a cena con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/cena_23_marzo_allergeni.jpg";
                }
                if (new Date().getDate() === venerdi) {
                    session.send("Venerdì 24 non ci sarà la cena!");
                    return;
                }
            }
            if (meal === "Pranzo") {
                if (new Date().getDate() === giovedi) {
                    session.send("Ecco il menù di giovedì 23 a pranzo con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/pranzo_23_marzo_allergeni.jpg";
                }
                if (new Date().getDate() === venerdi) {
                    session.send("Ecco il menù di venerdì 24 a pranzo con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/pranzo_24_marzo_allergeni.jpg";
                }

            }
            const msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: url,
                    contentType: "image/jpg",
                });
            session.send(msg);
        }
    },
    (session, result) => {
        const giovedi = new Date().getDate();
        const venerdi = (new Date().getDate()) + 1;

        let url;
        switch (result.response.entity) {
            case "Cena":
                if (new Date().getDate() === giovedi) {
                    session.send("Ecco il menu di giovedì 23 a cena con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/cena_23_marzo_allergeni.jpg";
                }
                if (new Date().getDate() === venerdi) {
                    session.send("Venerdì 24 non ci sarà la cena!");
                    return;
                }
            break;
            case "Pranzo":
                if (new Date().getDate() === giovedi) {
                    session.send("Ecco il menu di giovedì 23 a pranzo con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/pranzo_23_marzo_allergeni.jpg";
                }
                if (new Date().getDate() === venerdi) {
                    session.send("Ecco il menu di venerdì 24 a pranzo con i relativi allergeni");
                    url = "https://tsconvention2017assets.blob.core.windows.net/assets/meals/pranzo_24_marzo_allergeni.jpg";
                }
            break;
            default : url = "none";
        }
        const msg = new builder.Message(session)
            .addAttachment({
                contentUrl: url,
                contentType: "image/jpg",
            });
        session.send(msg);
    }
];
