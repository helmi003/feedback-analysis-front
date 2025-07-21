import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient } from 'react-query'
import App from './App'

// Mock the Home component
vi.mock('./pages/home', () => ({
  default: () => <div data-testid="home-component">Home Component</div>,
}))

// Mock CSS imports
vi.mock('./App.css', () => ({}))
vi.mock('./index.css', () => ({}))

// Mock the queryClientManager
vi.mock('./services/queryClientManager', () => ({
  queryClientManager: {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
  },
}))

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('home-component')).toBeInTheDocument()
  })

  it('should render the Home component through routing', () => {
    render(<App />)
    
    // The Home component should be rendered at the root path
    expect(screen.getByTestId('home-component')).toBeInTheDocument()
  })

  it('should provide QueryClient and Router context', () => {
    const { container } = render(<App />)
    
    // The app should render without errors, providing both contexts
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByTestId('home-component')).toBeInTheDocument()
  })
})
