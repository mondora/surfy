import {IAddress} from "botbuilder";

export default function userIdFromAddress (address: IAddress) {
    return `${address.channelId}:${address.user.id}`;
}
