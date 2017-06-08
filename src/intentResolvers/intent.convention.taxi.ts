import * as builder from "botbuilder";

export const intent = "intent.convention.taxi";
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Ecco alcune indicazioni per trovare un taxi");
        session.send("Taxi Rimini: ");
        session.send("RADIO TAXI RIMINI");
        session.send("054150020");
        session.send("www.radiotaxirimini.it");
        session.send("COOPERATIVA RADIO TAXI RIMINI");
        session.send("05411788011");
        session.send("www.riminiradiotaxi.it");
    }
];
