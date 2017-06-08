import * as builder from "botbuilder";

export const intent = new RegExp("(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?");
export const resolver: builder.IDialogWaterfallStep[] = [
    (session) => {
        session.send("Non saprei cosa fare con questo indirizzo :)");
    }
];
