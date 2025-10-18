import { useState, useEffect, useCallback } from 'react'
import { PaginationParams, PaginatedResponse, PaginationInfo } from '@/types/api'

export interface PaginationState<T> {
  data: T[]
  pagination: PaginationInfo
  loading: boolean
  error: string | null
  page: number
  limit: number
  search: string
  filters: Record<string, any>
}

export interface PaginationActions {
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  setFilters: (filters: Record<string, any>) => void
  resetFilters: () => void
  refetch: () => void
}

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  initialSearch?: string
  initialFilters?: Record<string, any>
  debounceMs?: number
}

export function usePagination<T>(
  fetchFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  options: UsePaginationOptions = {}
): PaginationState<T> & PaginationActions {
  const {
    initialPage = 1,
    initialLimit = 25,
    initialSearch = '',
    initialFilters = {},
    debounceMs = 300
  } = options

  // Memoize the fetch function to prevent infinite loops
  const memoizedFetchFn = useCallback(fetchFn, [fetchFn])

  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    pagination: {
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    },
    loading: false,
    error: null,
    page: initialPage,
    limit: initialLimit,
    search: initialSearch,
    filters: initialFilters
  })

  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // No debounced search effect - let the fetch effect handle all data fetching

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const params: PaginationParams = {
          page: state.page,
          limit: state.limit,
          ...(state.search && { search: state.search }),
          ...(Object.keys(state.filters).length > 0 && { filters: state.filters })
        }

        const response = await memoizedFetchFn(params)

        if (response.success) {
          setState(prev => ({
            ...prev,
            data: response.data,
            pagination: response.pagination,
            loading: false
          }))
        } else {
          setState(prev => ({
            ...prev,
            error: 'Failed to fetch data',
            loading: false
          }))
        }
      } catch (err: any) {
        setState(prev => ({
          ...prev,
          error: err.message || 'Failed to fetch data',
          loading: false
        }))
      }
    }

    fetchData()
  }, [state.page, state.limit, state.search, state.filters, refetchTrigger, memoizedFetchFn])

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, limit, page: 1 })) // Reset to first page when changing limit
  }, [])

  const setSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search }))
  }, [])

  const setFilters = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ ...prev, filters, page: 1 })) // Reset to first page when changing filters
  }, [])

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      search: initialSearch,
      filters: initialFilters,
      page: 1
    }))
  }, [initialSearch, initialFilters])

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1) // Trigger re-fetch by incrementing trigger
  }, [])

  return {
    ...state,
    setPage,
    setLimit,
    setSearch,
    setFilters,
    resetFilters,
    refetch
  }
}
