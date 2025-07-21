import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Home from './index'

// Mock the lazy-loaded components
vi.mock('../statistics', () => ({
  default: () => <div data-testid="feedback-statistics">Statistics Component</div>,
}))

vi.mock('../feedback', () => ({
  default: () => <div data-testid="conference-feedback-list">Feedback List Component</div>,
}))

describe('Home', () => {
  it('should render tabs component', () => {
    render(<Home />)
    
    // Check if the tabs are rendered
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('should render Statistics tab', () => {
    render(<Home />)
    
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('should render Conference Feedback tab', () => {
    render(<Home />)
    
    expect(screen.getByText('Conference Feedback')).toBeInTheDocument()
  })

  it('should have Statistics tab as default active', () => {
    render(<Home />)
    
    // The Statistics tab should be active by default
    const statisticsTab = screen.getByText('Statistics')
    expect(statisticsTab.closest('.ant-tabs-tab')).toHaveClass('ant-tabs-tab-active')
  })

  it('should handle lazy component loading', async () => {
    render(<Home />)
    
    // Should eventually load the Statistics component (lazy loading happens fast in tests)
    await waitFor(() => {
      expect(screen.getByTestId('feedback-statistics')).toBeInTheDocument()
    })
  })

  it('should load Statistics component when Statistics tab is active', async () => {
    render(<Home />)
    
    // Wait for the lazy component to load
    await screen.findByTestId('feedback-statistics')
    expect(screen.getByTestId('feedback-statistics')).toBeInTheDocument()
    expect(screen.getByText('Statistics Component')).toBeInTheDocument()
  })
})
