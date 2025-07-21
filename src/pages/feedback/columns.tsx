import { Input, Select, Button, Rate, Tag, Row, Col, Spin } from 'antd';
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import type { FeedbackItemType } from '../../models/feedback/response';
import { FEEDBACK_STATUS, type FeedbackStatusType } from '../../constants/consts';
import { formatDateTimeString } from '../../constants/dateformatter';
import './spin.css';

const { Option } = Select;

const statusOptions: FeedbackStatusType[] = Object.values(FEEDBACK_STATUS);

const statusColors: Record<FeedbackStatusType, string> = {
  excellent: 'green',
  good: 'blue',
  neutral: 'gold',
  bad: 'orange',
  terrible: 'red',
};

export function getColumns(params: {
  onViewMore: (feedback: FeedbackItemType) => void | Promise<void>;
  truncate: (text: string, length?: number) => string;
  loadingRows: Record<string, boolean>;
}) {
  const {
    onViewMore,
    truncate,
    loadingRows,
  } = params;

  return [
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'fullName'],
      key: 'createdBy',
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        (a.createdBy?.fullName ?? '').localeCompare(b.createdBy?.fullName ?? ''),
    },
    {
      title: 'Conference',
      dataIndex: ['conference', 'title'],
      key: 'conference',
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        (a.conference?.title ?? '').localeCompare(b.conference?.title ?? ''),
    },
    {
      title: 'Company',
      dataIndex: ['companyId', 'name'],
      key: 'companyId',
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        (a.companyId?.name ?? '').localeCompare(b.companyId?.name ?? ''),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => truncate(text),
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        (a.comment ?? '').localeCompare(b.comment ?? ''),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ color: '#faad14' }} />,
      sorter: (a: FeedbackItemType, b: FeedbackItemType) => a.rating - b.rating,
      width: 180,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColors[status as FeedbackStatusType] ?? 'default'}>{status}</Tag>,
      sorter: (a: FeedbackItemType, b: FeedbackItemType) =>
        (a.status ?? '').localeCompare(b.status ?? ''),
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
      render: (_: any, record: FeedbackItemType) => {
        const isLoading = loadingRows[record._id] ?? false;

        return (
          <Button
            icon={isLoading ? <Spin className="white-spinner" size="small" /> : <FileTextOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(record);
            }}
            type="primary"
            size="small"
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? "Loading..." : "View More"}
          </Button>
        );
      },
      width: 220,
    }
  ];
}

export function getFilterComponents(params: {
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
  } = params;

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={4}>
        <Input
          placeholder="Conference"
          value={filterConference ?? ''}
          onChange={(e) => setFilterConference(e.target.value ?? null)}
          allowClear
        />
      </Col>
      <Col span={4}>
        <Input
          placeholder="Company"
          value={filterCompany ?? ''}
          onChange={(e) => setFilterCompany(e.target.value ?? null)}
          allowClear
        />
      </Col>
      <Col span={6}>
        <Input
          placeholder="Search comments"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Col>
      <Col span={4}>
        <Select
          placeholder="Filter by rating"
          allowClear
          onChange={(value) => setFilterRating(value)}
          style={{ width: '100%' }}
          value={filterRating ?? undefined}
        >
          {ratingOptions.map((r) => (
            <Option key={r} value={r}>
              {r} <Rate disabled defaultValue={1} count={1} style={{ color: '#faad14' }} />
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={(value) => setFilterStatus(value)}
          style={{ width: '100%' }}
          value={filterStatus ?? undefined}
        >
          {statusOptions.map((status) => (
            <Option key={status} value={status}>
              <Tag color={statusColors[status] ?? 'default'}>{status}</Tag>
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
}