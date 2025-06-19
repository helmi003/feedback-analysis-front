import AIServer from './AIServer';

export interface FeedbackAnalysisModel {
    negative: string,
    neutral: string,
    positive: string
}

class FeedbackAnalysisService {
    getAnalysis = (comment: string) => {
        return AIServer.post<FeedbackAnalysisModel>('/sentiment', { text: comment });
    };
}

const feedbackAnalysisService = new FeedbackAnalysisService();
export { feedbackAnalysisService };
