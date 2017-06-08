import {random} from "lodash";

type ResponseType = (
    "howareyou"|
    "funny" |
    "compliment" |
    "insult" |
    "greeting" |
    "personal" |
    "preference" |
    "questionGeneral" |
    "end" |
    "none"
);

type Responses = {
    [type in ResponseType]: string[]
};

const responses: Responses = {
    howareyou: [
        "Bene grazie!",
        "Sto bene grazie!",
        "Tutto bene!",
        "Benone"
    ],
    funny: [
        "Ahah",
        "Hihi",
        "Buona questa!",
    ],
    compliment: [
        "Grazie!",
        ":) :)",
        ";) ;)",
        "Hihi, grazie!",
        "Grazie, così mi fai arrosire :)",
    ],
    insult: [
        "Scusa vedrò di migliorare",
        "Non dirmi così",
        "scusa, non volevo",
        "Scusa, mi hanno programmato male :(",
    ],
    greeting: [
        "Heila!",
        "Ciao!",
        "Ciao! come posso aiutarti?",
        "Buongiorno!",
        "Hei!",
        "Hola!"
    ],
    personal: [
        "Preferisco non rispondere a domande personali! :) sorry",
        "Ehm, a questa non rispondo...",
        "Non dirò nulla a riguardo!",
        "Non si chiedono certe cose dai..."
    ],
    preference: [
        "ah, non lo avrei mai detto, a me no XD",
        "ah si?, anche a me!",
        "buono a sapersi!"
    ],
    end: [
        "ok prego!",
        ":)",
        ";)",
        "prego!",
    ],
    questionGeneral: [
        "Non lo so",
        "Non saprei",
        "Non saprei che dire"
    ],
    none: [
        "Non capisco...",
        "Non ho capito",
        "Non lo so fare :)",
        "Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste",
        "Sono dura di comprendonio, puoi spiegarti meglio?",
    ]
};

export function getResponse (type: ResponseType) {
    const randomIndex = random(responses[type].length - 1);
    return responses[type][randomIndex];
}
