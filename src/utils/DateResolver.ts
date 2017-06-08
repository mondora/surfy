import * as builder from "botbuilder";
import * as moment from "moment";

export function resolve (date: builder.IEntity) {
    if (!date) {
        return;
    }
    // TODO da migliorare con regex o altro
    switch (date.entity.toLowerCase().trim()) {
        case "il 23":
            return giovedi();
        case "del 23":
            return giovedi();
        case "giovedi":
            return giovedi();
        case "giovedì":
            return giovedi();
        case "il 24":
            return venerdi();
        case "del 24":
            return venerdi();
        case "venerdi":
            return venerdi();
        case "vene":
            return venerdi();
        case "giove":
            return giovedi();
        case "venerdì":
            return venerdi();
        case "oggi":
            return oggi();
        case "doma":
            return domani();
        case "giornata":
            return oggi();
        case "giornata di oggi":
            return oggi();
        case "domani":
            return domani();
        case "giornata di domani":
            return domani();
        default: return;
    }
}

function oggi () {
    return giovedi(); // Mock
    // const start = new Date(); start.setHours(0, 0, 0, 0);
    // const end = new Date(); end.setHours(23, 59, 59, 0);
    // return {from: start, to: end};
}

function domani () {
    return venerdi(); // Mock
    // const start = moment(moment().add("days", 1)).toDate(); start.setHours(0, 0, 0, 0);
    // const end = moment(moment().add("days", 1)).toDate(); end.setHours(23, 59, 59, 0);
    // return {from: start, to: end};
}

function giovedi () {
    const start = moment("23-03-2017", "DD-MM-YYYY").toDate(); start.setHours(0, 0, 0, 0);
    const end = moment("23-03-2017", "DD-MM-YYYY").toDate(); end.setHours(23, 59, 59, 0);
    return {from: start, to: end};
}

function venerdi () {
    const start = moment("24-03-2017", "DD-MM-YYYY").toDate(); start.setHours(0, 0, 0, 0);
    const end = moment("24-03-2017", "DD-MM-YYYY").toDate(); end.setHours(23, 59, 59, 0);
    return {from: start, to: end};
}
