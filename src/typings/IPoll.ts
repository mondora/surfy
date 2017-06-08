interface IPoll {
    _id: string;
    question: string;
    suggestedAnswers: string[];
    suggestedAnswersReplies: string[];
    defaultReply: string;
}
export default IPoll;
