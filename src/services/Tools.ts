import type { SorterResult, FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import type { PaginationResponse as PaginationResponse2 } from '../models/ResponseTypes';
import type { LabelValueModel } from '../models/CommonModels';

export type PaginationResponse<T> = PaginationResponse2<T>;

export type PaginationQueryParams = {
  pagination?: {
    limit?: number;
    page?: number;
  };
  filter?: any;
  sorter?: any;
  select?: string;
  search?: string;
  from?: string;
  users?: string;
};

export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
} as const;

export type STATUS = (typeof STATUS)[keyof typeof STATUS];

export type dispatchType<T> = React.Dispatch<React.SetStateAction<T>>;

export type RequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

//
export type SorterType<T> = SorterResult<T> | SorterResult<T>[];
export type FilterType = Record<string, FilterValue | null>;
export type PaginationType = TablePaginationConfig;

export type HandleTableChangeType<T> = (
  pagination: PaginationType,
  filters: FilterType,
  sorter: SorterType<T>,
) => void;

export type UseFilterWithPagination<T> = {
  data: LabelValueModel<T>[];
  search: string;
  totalDocs: number;
  scrollableTarget: string;
  isEmpty: boolean;
  isFetchingNextPage: boolean;
  selectedRowKeys: string[];
  loading: boolean;
  isSuccess: boolean;
  hasNextPage: boolean;
  onChange: (selectedRowKeys: string[]) => void;
  fetchNextPage: () => void;
  onSearchChange: (search: string) => void;
};
