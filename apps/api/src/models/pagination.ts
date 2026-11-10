export interface PaginationQuery {
  page: number
  pageSize: number
}

export interface PaginationData {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationData
}
