// Example initial state for a product management feature
// This file demonstrates the expected structure for react-state-cli

export default {
  // Array of products
  products: [],
  
  // Loading states
  loading: false,
  error: null,
  
  // Selection and filters
  selectedProductId: 0,
  searchQuery: '',
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  
  // Filters
  filters: {
    category: '',
    priceRange: [0, 1000],
    inStock: true,
    sortBy: 'name',
    sortOrder: 'asc'
  },
  
  // UI state
  isFiltersOpen: false,
  selectedView: 'grid', // 'grid' or 'list'
  
  // Form state
  editingProduct: null,
  isDirty: false,
  
  // Nested objects and arrays
  categories: ['electronics', 'clothing', 'books'],
  recentlyViewed: [],
  
  // Different data types
  lastUpdated: null,
  isInitialized: false,
  debugMode: false
} 