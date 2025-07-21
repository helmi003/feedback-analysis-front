import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getColumns, getFilterComponents } from './columns'

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

// Mock date formatter
vi.mock('../../constants/dateformatter', () => ({
  formatDateTimeString: vi.fn((date) => `Formatted: ${date}`),
}))

describe('columns', () => {
  const mockParams = {
    onViewMore: vi.fn(),
    truncate: vi.fn((text: string, length = 50) => 
      text.length > length ? text.substring(0, length) + '...' : text
    ),
    loadingRows: {},
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getColumns', () => {
    it('should return an array of column definitions', () => {
      const columns = getColumns(mockParams)
      
      expect(Array.isArray(columns)).toBe(true)
      expect(columns.length).toBeGreaterThan(0)
    })

    it('should include all required columns', () => {
      const columns = getColumns(mockParams)
      
      const columnKeys = columns.map(col => col.dataIndex || col.key)
      expect(columnKeys).toContain('comment')
      expect(columnKeys).toContain('rating')
      expect(columnKeys).toContain('status')
      expect(columnKeys).toContain('createdAt')
      expect(columnKeys).toContain('actions')
    })

    it('should include column titles', () => {
      const columns = getColumns(mockParams)
      
      const titles = columns.map(col => col.title)
      expect(titles).toContain('Comment')
      expect(titles).toContain('Rating')
      expect(titles).toContain('Status')
      expect(titles).toContain('Created At')
      expect(titles).toContain('Actions')
    })

    it('should have proper column widths for specific columns', () => {
      const columns = getColumns(mockParams)
      
      const ratingColumn = columns.find(col => col.key === 'rating')
      const statusColumn = columns.find(col => col.key === 'status')
      const actionsColumn = columns.find(col => col.key === 'actions')
      
      expect(ratingColumn?.width).toBe(180)
      expect(statusColumn?.width).toBe(140)
      expect(actionsColumn?.width).toBe(220)
    })
  })

  describe('getFilterComponents', () => {
    const mockFilterParams = {
      searchTerm: '',
      setSearchTerm: vi.fn(),
      filterRating: null,
      setFilterRating: vi.fn(),
      filterStatus: null,
      setFilterStatus: vi.fn(),
      filterCompany: null,
      setFilterCompany: vi.fn(),
      filterConference: null,
      setFilterConference: vi.fn(),
      ratingOptions: [1, 2, 3, 4, 5],
      statusColors: {
        excellent: 'green',
        good: 'blue',
        neutral: 'gold',
        bad: 'orange',
        terrible: 'red',
      },
    }

    it('should return filter components JSX element', () => {
      const filterComponents = getFilterComponents(mockFilterParams)
      
      expect(filterComponents).toBeDefined()
      expect(typeof filterComponents).toBe('object')
      expect(filterComponents.type).toBeDefined() // JSX element should have a type property
    })

    it('should accept all required parameters', () => {
      expect(() => getFilterComponents(mockFilterParams)).not.toThrow()
    })

    it('should work with different filter values', () => {
      const paramsWithValues = {
        ...mockFilterParams,
        searchTerm: 'test',
        filterRating: 5,
        filterStatus: 'excellent',
        filterCompany: 'company-1',
        filterConference: 'conf-1',
      }
      
      expect(() => getFilterComponents(paramsWithValues)).not.toThrow()
    })
  })
})
