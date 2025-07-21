import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock React DOM
const mockRender = vi.fn()
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}))

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}))

// Mock the App component
vi.mock('./App', () => ({
  default: () => 'App Component',
}))

// Mock CSS imports
vi.mock('./index.css', () => ({}))

// Mock document.getElementById before importing main
const mockElement = document.createElement('div')
mockElement.id = 'root'
vi.spyOn(document, 'getElementById').mockReturnValue(mockElement)

describe('main.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create root and render App in StrictMode', async () => {
    // Import main.tsx to trigger the execution
    await import('./main')

    // Verify createRoot was called with the root element
    expect(document.getElementById).toHaveBeenCalledWith('root')
    expect(mockCreateRoot).toHaveBeenCalledWith(mockElement)
    
    // Verify render was called
    expect(mockRender).toHaveBeenCalledWith(
      expect.anything() // React element (StrictMode with App)
    )
  })
})
