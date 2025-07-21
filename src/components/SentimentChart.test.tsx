import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import SentimentChart from './SentimentChart'
import type { FeedbackAnalysisModel } from '../services/FeedbackAnalysisService'

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data }: { data: any[] }) => (
    <div data-testid="pie" data-entries={data.length}>
      {data.map((entry, index) => (
        <div key={index} data-testid={`pie-entry-${entry.name}`}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="pie-cell" data-fill={fill} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}))

describe('SentimentChart', () => {
  const mockFeedbackAnalysis: FeedbackAnalysisModel = {
    Positive: '65.5',
    Neutral: '25.0',
    Negative: '9.5',
  }

  it('should render sentiment analysis title', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument()
  })

  it('should render ResponsiveContainer with correct dimensions', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    const container = screen.getByTestId('responsive-container')
    expect(container).toBeInTheDocument()
  })

  it('should render PieChart with correct data', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie')).toBeInTheDocument()
  })

  it('should display correct sentiment data', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    expect(screen.getByTestId('pie-entry-Positive')).toHaveTextContent('Positive: 65.5')
    expect(screen.getByTestId('pie-entry-Neutral')).toHaveTextContent('Neutral: 25.0')
    expect(screen.getByTestId('pie-entry-Negative')).toHaveTextContent('Negative: 9.5')
  })

  it('should render correct number of pie entries', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    const pieElement = screen.getByTestId('pie')
    expect(pieElement).toHaveAttribute('data-entries', '3')
  })

  it('should render tooltip and legend', () => {
    render(<SentimentChart feedbackAnalysis={mockFeedbackAnalysis} />)
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })

  it('should handle zero values correctly', () => {
    const zeroAnalysis: FeedbackAnalysisModel = {
      Positive: '0',
      Neutral: '0',
      Negative: '100',
    }

    render(<SentimentChart feedbackAnalysis={zeroAnalysis} />)
    
    expect(screen.getByTestId('pie-entry-Positive')).toHaveTextContent('Positive: 0')
    expect(screen.getByTestId('pie-entry-Neutral')).toHaveTextContent('Neutral: 0')
    expect(screen.getByTestId('pie-entry-Negative')).toHaveTextContent('Negative: 100')
  })

  it('should handle decimal values correctly', () => {
    const decimalAnalysis: FeedbackAnalysisModel = {
      Positive: '33.33',
      Neutral: '33.33',
      Negative: '33.34',
    }

    render(<SentimentChart feedbackAnalysis={decimalAnalysis} />)
    
    expect(screen.getByTestId('pie-entry-Positive')).toHaveTextContent('Positive: 33.33')
    expect(screen.getByTestId('pie-entry-Neutral')).toHaveTextContent('Neutral: 33.33')
    expect(screen.getByTestId('pie-entry-Negative')).toHaveTextContent('Negative: 33.34')
  })
})
