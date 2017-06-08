const poll = {
    type: "object",
    properties: {
        userId: {
            type: "string"
        },
        poll: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                question: {
                    type: "string"
                },
                suggestedAnswers: {
                    type: "array",
                    items: {type: "string"},
                    uniqueItems: true
                },
                suggestedAnswersReplies: {
                    type: "array",
                    items: {type: "string"}
                },
                defaultReply: {
                    type: "string"
                }
            },
            required: [
                "id",
                "question",
                "suggestedAnswers",
                "suggestedAnswersReplies",
                "defaultReply"
            ],
            additionalProperties: false
        }
    },
    required: ["userId", "poll"],
    additionalProperties: false
};

export const dialogs = {poll};

export interface IBroadcastsBody {
    dialogId: string;
    dialogArgs: any;
}
export const broadcasts = {
    type: "object",
    properties: {
        dialogId: {
            type: "string"
        }
    },
    required: ["dialogId"]
};
