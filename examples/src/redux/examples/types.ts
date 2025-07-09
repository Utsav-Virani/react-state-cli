export interface ExamplesState {
  /** Array with 0 initial items */
  products: any[]
  /** boolean value */
  loading: boolean
  /** Nullable value */
  error: null
  /** number value */
  selectedProductId: number
  /** string value */
  searchQuery: string
  /** number value */
  currentPage: number
  /** number value */
  itemsPerPage: number
  /** number value */
  totalItems: number
  /** Object with 5 properties */
  filters: Record<string, any>
  /** boolean value */
  isFiltersOpen: boolean
  /** string value */
  selectedView: string
  /** Nullable value */
  editingProduct: null
  /** boolean value */
  isDirty: boolean
  /** Array with 3 initial items */
  categories: string[]
  /** Array with 0 initial items */
  recentlyViewed: any[]
  /** Nullable value */
  lastUpdated: null
  /** boolean value */
  isInitialized: boolean
  /** boolean value */
  debugMode: boolean
}