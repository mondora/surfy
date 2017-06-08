import {Dialog, IDialogWaterfallStep} from "botbuilder";
import {readdirSync} from "fs";

export interface IDialog {
    path: string;
    dialog: Dialog | IDialogWaterfallStep | IDialogWaterfallStep[];
}

export default function loadDialogs (): IDialog[] {
    const baseDir = `${__dirname}/../dialogs`;
    return readdirSync(baseDir)
        .map(fileName => require(`${baseDir}/${fileName}`));
}
