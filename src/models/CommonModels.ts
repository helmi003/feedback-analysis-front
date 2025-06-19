import type { ColumnGroupType, ColumnType } from 'antd/lib/table';
import type { EnsuredQueryKey, QueryFunctionContext, QueryKey } from 'react-query';

export type QueryKeyType<T extends QueryKey> = QueryFunctionContext<EnsuredQueryKey<T>>;

export type LabelValueModel<T = string> = {
  label: string;
  value: string;
  item?: T;
};

/** */
export type TableColumnType<TModel, KEY extends keyof TModel = keyof TModel> = (
  | ColumnType<TModel>
  | ColumnGroupType<TModel>
) & {
  dataIndex: KEY;
};

export type UnselectedStoreType = {
  _id: string;
  category: string;
};
export type UnselectedStoresType = Array<UnselectedStoreType>;
