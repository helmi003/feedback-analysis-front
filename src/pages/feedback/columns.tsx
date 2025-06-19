import { Input, Select, Button, Rate, Space, Tag } from 'antd';
import { SmileOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import type { FeedbackItemType } from '../../models/feedback/response';
import { FEEDBACK_STATUS, type FeedbackStatusType } from '../../constants/consts';
import { createIntl, createIntlCache, type FormatDateOptions } from 'react-intl';

const { Option } = Select;

const statusOptions: FeedbackStatusType[] = Object.values(FEEDBACK_STATUS);

export function getColumns(params: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterRating: number | null;
  setFilterRating: (val: number | null) => void;
  filterStatus: string | null;
  setFilterStatus: (val: string | null) => void;
  filterCompany: string | null;
  setFilterCompany: (val: string | null) => void;
  filterConference: string | null;
  setFilterConference: (val: string | null) => void;
  ratingOptions: number[];
  statusColors: Record<FeedbackStatusType, string>;
  onAnalyzeSentiment: (comment: string) => void;
  onViewMore: (feedback: FeedbackItemType) => void;
  truncate: (text: string, length?: number) => string;
}) {
  const {
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    filterStatus,
    setFilterStatus,
    filterCompany,
    setFilterCompany,
    filterConference,
    setFilterConference,
    ratingOptions,
    statusColors,
    onAnalyzeSentiment,
    onViewMore,
    truncate,
  } = params;

  return [
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'fullName'],
      key: 'createdBy',
    },
    {
      title: (
        <Input
          placeholder="Conference"
          value={filterConference || ''}
          onChange={(e) => setFilterConference(e.target.value || null)}
          allowClear
          style={{ width: 200 }}
          onPressEnter={() => setFilterConference(filterConference)}
          onBlur={() => setFilterConference(filterConference)}
          onClear={() => setFilterConference(null)}
        />
      ),
      dataIndex: ['conference', 'title'],
      key: 'conference',
    },
    {
      title: (
        <Input
          placeholder="Company"
          value={filterCompany || ''}
          onChange={(e) => setFilterCompany(e.target.value || null)}
          allowClear
          style={{ width: 200 }}
          onPressEnter={() => setFilterCompany(filterCompany)}
          onBlur={() => setFilterCompany(filterCompany)}
          onClear={() => setFilterCompany(null)}
        />
      ),
      dataIndex: ['company', 'name'],
      key: 'company',
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <Input
            placeholder="Comment"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear={{
              clearIcon: (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                >
                  ×
                </span>
              )
            }}
            style={{ width: 250 }}
            onPressEnter={() => setSearchTerm(searchTerm)}
            onBlur={() => setSearchTerm(searchTerm)}
          />
        </div>
      ),
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => truncate(text),
    },
    {
      title: (
        <Select
          placeholder="Rating"
          allowClear
          onChange={(value) => setFilterRating(value)}
          style={{ width: 120 }}
          value={filterRating || undefined}
        >
          {ratingOptions.map((r) => (
            <Option key={r} value={r}>
              {r} <Rate disabled defaultValue={1} count={1} style={{ color: '#faad14' }} />
            </Option>
          ))}
        </Select>
      ),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ color: '#faad14' }} />,
      width: 180,
    },
    {
      title: (
        <Select
          placeholder="Status"
          allowClear
          onChange={(value) => setFilterStatus(value)}
          style={{ width: 150 }}
          value={filterStatus || undefined}
        >
          {statusOptions.map((status) => (
            <Option key={status} value={status}>
              <Tag color={statusColors[status] || 'default'}>{status}</Tag>
            </Option>
          ))}
        </Select>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColors[status as FeedbackStatusType] || 'default'}>{status}</Tag>,
      width: 140,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDateTimeString(date),
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FeedbackItemType) => (
        <Space size="middle">
          <Button
            icon={<SmileOutlined />}
            onClick={() => onAnalyzeSentiment(record.comment)}
            type="primary"
            size="small"
          >
            Analyze Sentiment
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => onViewMore(record)}
            size="small"
          >
            View More
          </Button>
        </Space>
      ),
      width: 220,
    },
  ];
}

const cache = createIntlCache();

export const intl = createIntl(
  {
    locale: 'en',
    messages: {},
  },
  cache,
);

export function formatDateTimeString(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
) {
  return intl.formatDate(new Date(value), options);
}
