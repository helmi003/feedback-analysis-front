import type { FeedbackModelType } from "./model";

export type FeedbackItemType = Pick<
    FeedbackModelType,
    | '_id'
    | 'comment'
    | 'rating'
    | 'status'
    | 'createdBy'
    | 'conference'
    | 'companyId'
    | 'createdAt'
> & {
    createdBy: BasicUserInformationsType;
    conference: Pick<ConferenceModelType, '_id' | 'title'>;
    companyId: Pick<CompanyModelType, '_id' | 'name'>;
};

export type BasicUserInformationsType = Pick<UserModelType, 'fullName'>;

export type UserModelType = {
    fullName: string;
};

export type ConferenceModelType = {
    _id: string;
    title: string;
};

export type CompanyModelType = {
    _id: string;
    name: string;
};

export type FeedbackStats = {
  positive: number;
  neutral: number;
  negative: number;
};

export type FeedbackAVG = {
  averageRating: number;
  total: number;
  ratingCounts: number[];
  ratingDistribution: number[];
};