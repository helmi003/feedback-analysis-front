import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import useQueryParams from './use-query-params';
import { feedbackService } from './FeedbackService';
import type { FeedbackItemType } from '../models/feedback/response';
import type { HandleTableChangeType, PaginationQueryParams } from './Tools';

interface IPaginationParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  rating?: string;
  company?: string;
  conference?: string;
}

export default function useFetchFeedback() {
  const navigate = useNavigate();
  const {
    limit = '10',
    page = '1',
    search = '',
    status,
    rating,
    company,
    conference,
  } = useQueryParams<IPaginationParams>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{ order: 'ascend' | 'descend'; field: string }>({
    order: 'ascend',
    field: '',
  });

  const updateUrlParams = (params: Record<string, string | number | null | undefined>) => {
    const currentParams = new URLSearchParams(window.location.search);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, value.toString());
      }
    });

    navigate({ search: currentParams.toString() }, { replace: true });
  };

  const response = useQuery(
    [
      'feedbacks',
      parseInt(page) ?? 1,
      parseInt(limit),
      sorter.field,
      sorter.order,
      search,
      status,
      rating,
      company,
      conference,
    ] as const,
    ({ queryKey }) => {
      const [, page, pageSize, field, order, search, status, rating, company, conference] = queryKey;

      const filter: Record<string, any> = {};
      if (search?.trim()) {
        filter['$or'] = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const sort: PaginationQueryParams['sorter'] = {};
      if (typeof field === 'string' && field.length > 0) {
        sort[field] = order === 'ascend' ? 1 : -1;
      }

      return feedbackService.getFeedbacks({
        limit: pageSize,
        page,
        status,
        rating: rating ? parseInt(rating) : undefined,
        company,
        conference,
        search: search?.trim(),
        filter,
        sorter: sort,
      });
    },
    {
      keepPreviousData: true,
    },
  );

  const handleTableChange: HandleTableChangeType<FeedbackItemType> = (pagination, _, sorter) => {
    const params = {
      limit: pagination.pageSize?.toString(),
      page: pagination.current?.toString(),
    };
    updateUrlParams(params);

    if (sorter && 'field' in sorter) {
      setSorter({
        field: sorter.field as string,
        order: sorter.order as 'ascend' | 'descend',
      });
    }
  };

  const handleSearchChange = (searchTerm: string) => {
    updateUrlParams({ search: searchTerm, page: '1' });
  };

  const handleRatingChange = (rating: number | null) => {
    updateUrlParams({ rating: rating?.toString(), page: '1' });
  };

  const handleStatusChange = (status: string | null) => {
    updateUrlParams({ status: status ?? undefined, page: '1' });
  };

  const handleCompanyChange = (company: string | null) => {
    updateUrlParams({ company: company ?? undefined, page: '1' });
  };

  const handleConferenceChange = (conference: string | null) => {
    updateUrlParams({ conference: conference ?? undefined, page: '1' });
  };

  return {
    response,
    handleTableChange,
    selectedRowKeys,
    setSelectedRowKeys,
    handleSearchChange,
    handleRatingChange,
    handleStatusChange,
    handleCompanyChange,
    handleConferenceChange,
    searchTerm: search,
    filterRating: rating ? parseInt(rating) : null,
    filterStatus: status ?? null,
    filterCompany: company ?? null,
    filterConference: conference ?? null,
  };
}