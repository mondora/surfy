import * as builder from "botbuilder";

export const intent = "intent.bathroom";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Cerchi un bagno? mmmh, fammi pensare...");
        builder.Prompts.choice(session, `A che piano ti trovi?`, "Primo|Terra");
    },
    async (session, result) => {
        if (result.response.entity === "Primo") {
            const msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: "https://tsconvention2017assets.blob.core.windows.net/assets/generic/mappa-bagni-primo-piano.jpg",
                    contentType: "image/jpg",
                });
            session.send("In giallo trovi evidenziato dove trovare i servizi");
            session.send(msg);
        }
        if (result.response.entity === "Terra") {
            const msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: "https://tsconvention2017assets.blob.core.windows.net/assets/generic/mappa-bagni-piano-terra.jpg",
                    contentType: "image/jpg",
                });
            session.send(msg);
        }
    }
];
