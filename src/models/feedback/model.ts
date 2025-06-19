export type FeedbackModelType = {
  _id: string;
  companyId: string;
  conference: string;
  comment: string;
  rating: number;
  status?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};
