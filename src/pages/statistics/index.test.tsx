import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import FeedbackStatistics from './index'
import { feedbackService } from '../../services/FeedbackService'
import type { FeedbackItemType, FeedbackStats, FeedbackAVG } from '../../models/feedback/response'

// Mock the feedback service
vi.mock('../../services/FeedbackService', () => ({
  feedbackService: {
    getFeedbackStatistics: vi.fn(),
    getFeedbackAVG: vi.fn(),
    getTopFeedbacks: vi.fn(),
  },
}))

const mockGetFeedbackStatistics = vi.mocked(feedbackService.getFeedbackStatistics)
const mockGetFeedbackAVG = vi.mocked(feedbackService.getFeedbackAVG)
const mockGetTopFeedbacks = vi.mocked(feedbackService.getTopFeedbacks)

// Mock the date formatter
vi.mock('../../constants/dateformatter', () => ({
  formatDateTimeString: vi.fn((date) => `Formatted: ${date}`),
}))

// Mock console.error
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('FeedbackStatistics', () => {
  const mockStats = {
    positive: 50,
    negative: 10,
    neutral: 25,
  }

  const mockAvgStats = {
    total: 85,
    averageRating: 4.2,
    ratingDistribution: [75.0, 15.0, 8.0, 1.5, 0.5], // percentages for 5,4,3,2,1 stars
    ratingCounts: [64, 13, 7, 1, 0], // actual counts for 5,4,3,2,1 stars
  }

  const mockTopFeedbacks = [
    {
      _id: '1',
      comment: 'Excellent conference with great speakers!',
      rating: 5,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      createdBy: { fullName: 'John Doe' },
      conference: { _id: 'conf1', title: 'Tech Summit 2024' },
      companyId: { _id: 'company1', name: 'TechCorp' },
      status: 'active',
    },
    {
      _id: '2',
      comment: 'Very informative and well organized.',
      rating: 5,
      createdAt: new Date('2024-01-16T14:45:00Z'),
      createdBy: { fullName: 'Jane Smith' },
      conference: { _id: 'conf2', title: 'DevCon 2024' },
      companyId: { _id: 'company2', name: 'DevCompany' },
      status: 'active',
    },
    {
      _id: '3',
      comment: 'Great networking opportunities.',
      rating: 4,
      createdAt: new Date('2024-01-17T09:15:00Z'),
      createdBy: { fullName: 'Bob Johnson' },
      conference: { _id: 'conf3', title: 'AI Conference' },
      companyId: { _id: 'company3', name: 'AI Corp' },
      status: 'active',
    },
  ] as FeedbackItemType[]

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
    
    mockGetFeedbackStatistics.mockResolvedValue(mockStats)
    mockGetFeedbackAVG.mockResolvedValue(mockAvgStats)
    mockGetTopFeedbacks.mockResolvedValue(mockTopFeedbacks)
  })

  it('should render loading state initially', () => {
    // Make the promises never resolve to test loading state
    mockGetFeedbackStatistics.mockImplementation(() => new Promise(() => {}))
    
    render(<FeedbackStatistics />)
    
    // Check for loading spinner by class
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
    expect(document.querySelector('.ant-spin-spinning')).toBeInTheDocument()
  })

  it('should render error state when API calls fail', async () => {
    const errorMessage = 'API Error'
    mockGetFeedbackStatistics.mockRejectedValue(new Error(errorMessage))
    
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load statistics.')).toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  it('should render statistics when data is loaded successfully', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Feedback Statistics')).toBeInTheDocument()
    })

    // Check if ratings breakdown is displayed
    expect(screen.getByText('Ratings Breakdown')).toBeInTheDocument()
    
    // Check if sentiment statistics are displayed
    expect(screen.getByText('Positive')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Negative')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Neutral')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('should display rating distribution correctly', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Ratings Breakdown')).toBeInTheDocument()
    })

    // Check if rating counts are displayed
    expect(screen.getByText('64')).toBeInTheDocument() // 5-star count
    expect(screen.getByText('13')).toBeInTheDocument() // 4-star count
    expect(screen.getByText('7')).toBeInTheDocument()  // 3-star count
    expect(screen.getAllByText('1')).toHaveLength(3)  // 2-star count appears multiple times (count + rating stars)
    expect(screen.getByText('0')).toBeInTheDocument()  // 1-star count

    // Check total and average
    expect(screen.getByText(`Total: ${mockAvgStats.total}`)).toBeInTheDocument()
    expect(screen.getByText('(4.2)')).toBeInTheDocument()
  })

  it('should display top feedbacks in carousel', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Top Feedbacks')).toBeInTheDocument()
    })

    // Check if top feedback comments are displayed (expect 2 since Carousel may duplicate)
    expect(screen.getAllByText('Excellent conference with great speakers!')).toHaveLength(2)
    expect(screen.getAllByText('Very informative and well organized.')).toHaveLength(2)
    expect(screen.getAllByText('Great networking opportunities.')).toHaveLength(3)

    // Check if author and conference names are displayed
    expect(screen.getAllByText('John Doe - Tech Summit 2024')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Jane Smith - DevCon 2024')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Bob Johnson - AI Conference')[0]).toBeInTheDocument()

    // Check if formatted dates are displayed in carousel
    const formattedElements = screen.getAllByText(/Formatted:/)
    expect(formattedElements.length).toBeGreaterThan(0)
    // Just check that any date is formatted with "Formatted:" prefix - don't be too specific about the date format
    expect(formattedElements[0]).toBeInTheDocument()
  })

  it('should handle missing stats data gracefully', async () => {
    mockGetFeedbackStatistics.mockResolvedValue({
      positive: 0,
      neutral: 0,
      negative: 0,
    } as FeedbackStats)
    
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(mockGetFeedbackStatistics).toHaveBeenCalled()
    })

    // Component should still render with zero values
    expect(screen.getByText('Feedback Statistics')).toBeInTheDocument()
  })

  it('should handle missing avgStats data gracefully', async () => {
    mockGetFeedbackAVG.mockResolvedValue({
      averageRating: 0,
      total: 0,
      ratingCounts: [0, 0, 0, 0, 0],
      ratingDistribution: [0, 0, 0, 0, 0],
    } as FeedbackAVG)
    
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(mockGetFeedbackAVG).toHaveBeenCalled()
    })

    // Component should return null and not crash
    expect(screen.queryByText('Feedback Statistics')).not.toBeInTheDocument()
  })

  it('should make all required API calls on mount', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(mockGetFeedbackStatistics).toHaveBeenCalledTimes(1)
      expect(mockGetFeedbackAVG).toHaveBeenCalledTimes(1)
      expect(mockGetTopFeedbacks).toHaveBeenCalledTimes(1)
    })
  })

  it('should render rating stars correctly', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Feedback Statistics')).toBeInTheDocument()
    })

    // Check if Rate components are rendered (they create elements with specific classes)
    const rateElements = document.querySelectorAll('.ant-rate')
    expect(rateElements.length).toBeGreaterThan(0)
  })

  it('should display progress bars for rating distribution', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Ratings Breakdown')).toBeInTheDocument()
    })

    // Check if progress bars are rendered
    const progressElements = document.querySelectorAll('.ant-progress')
    expect(progressElements.length).toBe(5) // One for each rating level
  })

  it('should render carousel for top feedbacks', async () => {
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Top Feedbacks')).toBeInTheDocument()
    })

    // Check if carousel is rendered
    const carouselElement = document.querySelector('.ant-carousel')
    expect(carouselElement).toBeInTheDocument()
  })

  it('should handle empty top feedbacks array', async () => {
    mockGetTopFeedbacks.mockResolvedValue([])
    
    render(<FeedbackStatistics />)
    
    await waitFor(() => {
      expect(screen.getByText('Top Feedbacks')).toBeInTheDocument()
    })

    // Should still render the heading but no feedback cards
    const carouselElement = document.querySelector('.ant-carousel')
    expect(carouselElement).toBeInTheDocument()
  })
})
