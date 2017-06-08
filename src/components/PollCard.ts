import * as builder from "botbuilder";

import IPoll from "../typings/IPoll";

interface IPollCardProps {
    session: builder.Session;
    poll: IPoll;
}

function PollButtons (session: builder.Session, poll: IPoll) {
    return poll.suggestedAnswers.map(answer => (
        builder.CardAction.imBack(session, answer, answer)
    ));
}

export default function PollCard (props: IPollCardProps) {
    const {poll, session} = props;
    return new builder.HeroCard(session)
        .title(poll.question)
        .buttons(PollButtons(session, poll));
}
