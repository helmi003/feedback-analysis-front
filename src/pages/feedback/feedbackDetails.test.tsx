import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import FeedbackModal from './feedbackDetails'
import type { FeedbackItemType } from '../../models/feedback/response'
import type { FeedbackAnalysisModel } from '../../services/FeedbackAnalysisService'

// Mock the SentimentChart component
vi.mock('../../components/SentimentChart', () => ({
  default: ({ feedbackAnalysis }: { feedbackAnalysis: FeedbackAnalysisModel }) => (
    <div data-testid="sentiment-chart">
      Sentiment Analysis: P:{feedbackAnalysis.Positive} N:{feedbackAnalysis.Neutral} Neg:{feedbackAnalysis.Negative}
    </div>
  ),
}))

describe('FeedbackModal', () => {
  const mockFeedback: FeedbackItemType = {
    _id: 'feedback123',
    comment: 'This was an excellent conference with great speakers and networking opportunities.',
    rating: 5,
    status: 'excellent',
    conference: { _id: 'conf1', title: 'Tech Conference 2023' },
    companyId: { _id: 'comp1', name: 'Tech Corp' },
    createdBy: { fullName: 'John Doe' },
    createdAt: '2023-12-25T10:30:00.000Z',
  } as any

  const mockFeedbackAnalysis: FeedbackAnalysisModel = {
    Positive: '85.5',
    Neutral: '10.2',
    Negative: '4.3',
  }

  const defaultProps = {
    visible: true,
    feedback: mockFeedback,
    onClose: vi.fn(),
    feedbackAnalysis: null,
  }

  it('should render modal when visible and feedback is provided', () => {
    render(<FeedbackModal {...defaultProps} />)
    
    expect(screen.getByText('Feedback Details')).toBeInTheDocument()
    expect(screen.getByText(mockFeedback.comment)).toBeInTheDocument()
  })

  it('should not render modal when feedback is null', () => {
    render(<FeedbackModal {...defaultProps} feedback={null} />)
    
    expect(screen.queryByText('Feedback Details')).not.toBeInTheDocument()
  })

  it('should display all feedback information correctly', () => {
    render(<FeedbackModal {...defaultProps} />)
    
    // Check comment
    expect(screen.getByText(mockFeedback.comment)).toBeInTheDocument()
    
    // Check conference
    expect(screen.getByText('Tech Conference 2023')).toBeInTheDocument()
    
    // Check company
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    
    // Check created by
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    // Check status
    expect(screen.getByText('excellent')).toBeInTheDocument()
  })

  it('should display rating correctly', () => {
    render(<FeedbackModal {...defaultProps} />)
    
    // The Rating component should be rendered
    const ratingElements = screen.getAllByRole('img') // Ant Design Rate uses img elements for stars
    expect(ratingElements.length).toBeGreaterThan(0)
  })

  it('should render sentiment chart when feedbackAnalysis is provided', async () => {
    render(<FeedbackModal {...defaultProps} feedbackAnalysis={mockFeedbackAnalysis} />)
    
    await waitFor(() => {
      expect(screen.getByTestId('sentiment-chart')).toBeInTheDocument()
      expect(screen.getByText(/Sentiment Analysis: P:85.5 N:10.2 Neg:4.3/)).toBeInTheDocument()
    })
  })

  it('should not render sentiment chart when feedbackAnalysis is null', () => {
    render(<FeedbackModal {...defaultProps} feedbackAnalysis={null} />)
    
    expect(screen.queryByTestId('sentiment-chart')).not.toBeInTheDocument()
  })

  it('should call onClose when modal is closed', () => {
    const mockOnClose = vi.fn()
    render(<FeedbackModal {...defaultProps} onClose={mockOnClose} />)
    
    // Find and click the close button (X button in modal header)
    const closeButton = screen.getByRole('button', { name: /close/i })
    closeButton.click()
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle feedback without optional fields', () => {
    const minimalFeedback: FeedbackItemType = {
      _id: 'feedback456',
      comment: 'Basic feedback',
      rating: 3,
      conference: { _id: 'conf2', title: 'Basic Conference' },
      companyId: { _id: 'comp2', name: 'Basic Company' },
      createdBy: { fullName: 'Jane Doe' },
      createdAt: '2023-12-01T00:00:00.000Z',
    } as any

    render(<FeedbackModal {...defaultProps} feedback={minimalFeedback} />)
    
    expect(screen.getByText('Basic feedback')).toBeInTheDocument()
    expect(screen.getByText('Basic Conference')).toBeInTheDocument()
    expect(screen.getByText('Basic Company')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('should handle lazy loading of sentiment chart', async () => {
    render(<FeedbackModal {...defaultProps} feedbackAnalysis={mockFeedbackAnalysis} />)
    
    // Should eventually show the chart (lazy loading happens fast in tests)
    await waitFor(() => {
      expect(screen.getByTestId('sentiment-chart')).toBeInTheDocument()
    })
  })
})
