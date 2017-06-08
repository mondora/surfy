import {IDialogWaterfallStep} from "botbuilder";
import {readdirSync} from "fs";

export interface IIntentResolver {
    intent: string | RegExp;
    resolver: IDialogWaterfallStep | IDialogWaterfallStep[];
}

export default function loadIntentResolvers (): IIntentResolver[] {
    const baseDir = `${__dirname}/../intentResolvers`;
    return readdirSync(baseDir)
        .map(fileName => require(`${baseDir}/${fileName}`));
}
