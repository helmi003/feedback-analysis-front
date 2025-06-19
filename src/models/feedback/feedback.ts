import type { FeedbackModelType } from "./model";

export type FeedbackCreatorType = Omit<
  FeedbackModelType,
  '_id' | 'createdAt' | 'updatedAt' | 'isDeleted'
>;
