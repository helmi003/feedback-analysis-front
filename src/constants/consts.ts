export const FEEDBACK_STATUS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  NEUTRAL: 'neutral',
  BAD: 'bad',
  TERRIBLE: 'terrible',
} as const;

export type FeedbackStatusType = typeof FEEDBACK_STATUS[keyof typeof FEEDBACK_STATUS];
