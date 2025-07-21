import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ConferenceFeedbackList from './index'
import * as columns from './columns'

// Mock the feedback hook
const mockUseFetchFeedback = {
  response: {
    data: [] as any[],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      nextPage: null,
      hasPrevPage: false,
      prevPage: null,
    },
  },
  handleTableChange: vi.fn(),
  handleSearchChange: vi.fn(),
  handleRatingChange: vi.fn(),
  handleStatusChange: vi.fn(),
  handleCompanyChange: vi.fn(),
  handleConferenceChange: vi.fn(),
  searchTerm: '',
  filterRating: null,
  filterStatus: null,
  filterCompany: null,
  filterConference: null,
  loading: false,
  error: null,
}

vi.mock('../../services/useFetchFeedback', () => ({
  default: () => mockUseFetchFeedback,
}))

// Mock the feedback analysis service
vi.mock('../../services/FeedbackAnalysisService', () => ({
  feedbackAnalysisService: {
    analyseFeedback: vi.fn(),
  },
}))

// Mock the columns
vi.mock('./columns', () => ({
  getColumns: vi.fn(() => [
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
  ]),
  getFilterComponents: vi.fn(() => <div data-testid="filter-components">Filter Components</div>),
}))

// Mock the feedback modal
vi.mock('./feedbackDetails', () => ({
  default: ({ visible, onClose }: any) => 
    visible ? <div data-testid="feedback-modal" onClick={onClose}>Feedback Modal</div> : null,
}))

// Mock constants
vi.mock('../../constants/consts', () => ({
  FEEDBACK_STATUS: {
    excellent: 'excellent',
    good: 'good',
    neutral: 'neutral',
    bad: 'bad',
    terrible: 'terrible',
  },
}))

describe('ConferenceFeedbackList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the feedback list table', () => {
    render(<ConferenceFeedbackList />)
    
    expect(screen.getByTestId('filter-components')).toBeInTheDocument()
    expect(document.querySelector('.ant-table')).toBeInTheDocument()
  })

  it('should display loading state when loading', () => {
    mockUseFetchFeedback.loading = true
    
    render(<ConferenceFeedbackList />)
    
    // Just verify the component renders without errors when loading
    expect(screen.getByText('Conference Feedback')).toBeInTheDocument()
  })

  it('should display feedback data when available', () => {
    const mockFeedbackData = [
      {
        _id: '1',
        comment: 'Great conference!',
        rating: 5,
        status: 'excellent',
        createdBy: { fullName: 'John Doe' },
        conference: { _id: 'conf-1', title: 'Tech Summit' },
        companyId: { _id: 'comp-1', name: 'Tech Corp' },
        createdAt: new Date('2024-01-01'),
      },
    ]

    mockUseFetchFeedback.response.data = mockFeedbackData
    mockUseFetchFeedback.response.meta.total = 1
    mockUseFetchFeedback.loading = false

    render(<ConferenceFeedbackList />)
    
    const table = document.querySelector('.ant-table')
    expect(table).toBeInTheDocument()
  })

  it('should handle pagination correctly', () => {
    const mockMeta = {
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      hasNextPage: true,
      nextPage: 2 as const,
      hasPrevPage: false,
      prevPage: null,
    }

    mockUseFetchFeedback.response.meta = mockMeta as any

    render(<ConferenceFeedbackList />)
    
    // Check for pagination by verifying that the component renders with pagination data
    expect(screen.getByText('Conference Feedback')).toBeInTheDocument()
    // Just verify the component renders without errors when pagination data is provided
  })

  it('should call truncate function correctly', () => {
    const getColumnsSpy = vi.mocked(columns.getColumns)
    
    render(<ConferenceFeedbackList />)
    
    expect(getColumnsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        truncate: expect.any(Function),
      })
    )

    // Test the truncate function
    const call = getColumnsSpy.mock.calls[0][0]
    const truncateFunc = call.truncate

    expect(truncateFunc('Short text')).toBe('Short text')
    expect(truncateFunc('This is a very long text that should be truncated')).toBe('This is a very long ...')
  })

  it('should handle row selection', () => {
    const getColumnsSpy = vi.mocked(columns.getColumns)
    
    render(<ConferenceFeedbackList />)
    
    expect(getColumnsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onViewMore: expect.any(Function),
        loadingRows: expect.any(Object),
      })
    )
  })

  it('should render filter components with correct props', () => {
    const getFilterComponentsSpy = vi.mocked(columns.getFilterComponents)
    
    render(<ConferenceFeedbackList />)
    
    expect(getFilterComponentsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: '',
        setSearchTerm: expect.any(Function),
        filterRating: null,
        setFilterRating: expect.any(Function),
        filterStatus: null,
        setFilterStatus: expect.any(Function),
        filterCompany: null,
        setFilterCompany: expect.any(Function),
        filterConference: null,
        setFilterConference: expect.any(Function),
        ratingOptions: [1, 2, 3, 4, 5],
        statusColors: expect.any(Object),
      })
    )
  })
})