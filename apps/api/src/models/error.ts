export interface ApiErrorResponse {
  error: string
  details?: { field: string; message: string }[]
}
