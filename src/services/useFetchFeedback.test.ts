import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import React from 'react'
import useFetchFeedback from './useFetchFeedback'
import { feedbackService } from './FeedbackService'

// Mock the feedbackService
vi.mock('./FeedbackService', () => ({
  feedbackService: {
    getFeedbacks: vi.fn(),
  },
}))

// Mock react-router-dom hooks
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock use-query-params
vi.mock('./use-query-params', () => ({
  default: vi.fn(() => ({
    limit: '10',
    page: '1',
    search: '',
    status: undefined,
    rating: undefined,
    company: undefined,
    conference: undefined,
  })),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => {
    return React.createElement(
      BrowserRouter,
      {},
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    )
  }
}

describe('useFetchFeedback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with default values', () => {
    const mockFeedbackData = {
      docs: [
        {
          _id: '1',
          comment: 'Test feedback',
          rating: 5,
          status: 'excellent',
          conference: { _id: 'conf1', title: 'Test Conference' },
          companyId: { _id: 'comp1', name: 'Test Company' },
          createdBy: { fullName: 'John Doe' },
          createdAt: '2023-01-01',
        },
      ],
      totalDocs: 1,
      limit: 10,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      nextPage: null,
      hasPrevPage: false,
      prevPage: null,
    } as any

    vi.mocked(feedbackService.getFeedbacks).mockResolvedValue(mockFeedbackData)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    expect(result.current.searchTerm).toBe('')
    expect(result.current.filterRating).toBe(null)
    expect(result.current.filterStatus).toBe(null)
    expect(result.current.filterCompany).toBe(null)
    expect(result.current.filterConference).toBe(null)
    expect(result.current.selectedRowKeys).toEqual([])
  })

  it('should call feedbackService.getFeedbacks with correct parameters', async () => {
    const mockFeedbackData = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
      hasNextPage: false,
      nextPage: null,
      hasPrevPage: false,
      prevPage: null,
    } as any

    vi.mocked(feedbackService.getFeedbacks).mockResolvedValue(mockFeedbackData)

    const wrapper = createWrapper()
    renderHook(() => useFetchFeedback(), { wrapper })

    await waitFor(() => {
      expect(feedbackService.getFeedbacks).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        status: undefined,
        rating: undefined,
        company: undefined,
        conference: undefined,
        search: '',
        filter: {},
        sorter: {},
      })
    })
  })

  it('should handle search functionality', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleSearchChange('test search')

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'search=test+search&page=1' },
      { replace: true }
    )
  })

  it('should handle rating filter changes', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleRatingChange(5)

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'rating=5&page=1' },
      { replace: true }
    )
  })

  it('should handle status filter changes', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleStatusChange('excellent')

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'status=excellent&page=1' },
      { replace: true }
    )
  })

  it('should handle company filter changes', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleCompanyChange('Test Company')

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'company=Test+Company&page=1' },
      { replace: true }
    )
  })

  it('should handle conference filter changes', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleConferenceChange('Test Conference')

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'conference=Test+Conference&page=1' },
      { replace: true }
    )
  })

  it('should handle table pagination changes', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleTableChange(
      { current: 2, pageSize: 20 },
      {},
      { field: 'rating', order: 'descend' }
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: 'limit=20&page=2' },
      { replace: true }
    )
  })

  it('should clear filters when null values are passed', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useFetchFeedback(), { wrapper })

    result.current.handleRatingChange(null)
    result.current.handleStatusChange(null)
    result.current.handleCompanyChange(null)
    result.current.handleConferenceChange(null)

    expect(mockNavigate).toHaveBeenCalledTimes(4)
  })

  it('should build correct filter object for search', async () => {
    const mockUseQueryParams = await import('./use-query-params')
    vi.mocked(mockUseQueryParams.default).mockReturnValue({
      limit: '10',
      page: '1',
      search: 'test search',
      status: undefined,
      rating: undefined,
      company: undefined,
      conference: undefined,
    })

    const mockFeedbackData = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
      hasNextPage: false,
      nextPage: null,
      hasPrevPage: false,
      prevPage: null,
    } as any

    vi.mocked(feedbackService.getFeedbacks).mockResolvedValue(mockFeedbackData)

    const wrapper = createWrapper()
    renderHook(() => useFetchFeedback(), { wrapper })

    await waitFor(() => {
      expect(feedbackService.getFeedbacks).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        status: undefined,
        rating: undefined,
        company: undefined,
        conference: undefined,
        search: 'test search',
        filter: {
          $or: [
            { title: { $regex: 'test search', $options: 'i' } },
            { description: { $regex: 'test search', $options: 'i' } },
          ],
        },
        sorter: {},
      })
    })
  })
})
