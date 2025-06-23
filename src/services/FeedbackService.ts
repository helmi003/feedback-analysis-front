import type { FeedbackAVG, FeedbackItemType, FeedbackStats } from '../models/feedback/response';
import type { PaginationResponse } from '../models/ResponseTypes';
import http from './http';
class FeedbackService {
  getFeedbacks = (params = {}) => {
    return http.get<PaginationResponse<FeedbackItemType>>('/feedback', { params });
  };

  getTopFeedbacks = () => {
    return http.get<FeedbackItemType[]>('/feedback/top');
  };

  getFeedbackStatistics = () => {
    return http.get<FeedbackStats>('/feedback/stats');
  };

  getFeedbackAVG = () => {
    return http.get<FeedbackAVG>('/feedback/average-rating');
  };

  getFeedback = (id: string) => http.get<FeedbackItemType>(`/feedback/${id}`);
}

const feedbackService = new FeedbackService();
export { feedbackService };
