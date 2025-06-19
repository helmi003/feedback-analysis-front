import type { FeedbackItemType } from '../models/feedback/response';
import type { PaginationResponse } from '../models/ResponseTypes';
import http from './http';
class FeedbackService {
  getFeedbacks = (params = {}) => {
    return http.get<PaginationResponse<FeedbackItemType>>('/feedback', { params });
  };

  getFeedback = (id: string) => http.get<FeedbackItemType>(`/feedback/${id}`);
}

const feedbackService = new FeedbackService();
export { feedbackService };
