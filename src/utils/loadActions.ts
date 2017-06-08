import {readdirSync} from "fs";

import Action from "./Action";

export default function loadActions (): Action<any>[] {
    const baseDir = `${__dirname}/../actions`;
    return readdirSync(baseDir)
        .map(fileName => require(`${baseDir}/${fileName}`).default);
}
