import AIServer from './AIServer';

export interface FeedbackAnalysisModel {
    Negative: string,
    Neutral: string,
    Positive: string
}

class FeedbackAnalysisService {
    getAnalysis = (comment: string) => {
        return AIServer.post<FeedbackAnalysisModel>('/sentiment', { text: comment });
    };
}

const feedbackAnalysisService = new FeedbackAnalysisService();
export { feedbackAnalysisService };
