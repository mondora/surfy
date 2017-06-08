import {IDialogWaterfallStep} from "botbuilder";

import Action from "../utils/Action";

// Note: Messenger's message formatting is indentation-sensitive. The two help
// pages below are indented in a specific way so that Messenger formats them as
// we desire
const helpPageOne = `
Puoi chiedermi qualsiasi informazione riguardante la convention:

    - info sull'inizio della convention
        - Es. Quando inizia la convention?

    - info sulle demo, workshop, plenaria
        - Es. Quali demo ci sono oggi su Agyo?

    - info sui prodotti
        -  Es. Info su Lynfa Movimenti Bancari
`;
const helpPageTwo = `
    - info sui relatori
        - Es. Chi è Mario Rossi?

    - info sulla cena/pranzo
        - Es. Cosa si mangia questa sera?

    - info sugli stand
        - Es. Quali stand ci sono su Agyo ?
`;

const name = "getStarted";
const handler: IDialogWaterfallStep[] = [
    (session) => {
        session.send("Ciao! Sono Surfy, il bot della convention TeamSystem :)");
        session.send(helpPageOne);
        session.send(helpPageTwo);
        session.endDialog();
    }
];

export default new Action<null>({name, handler});
