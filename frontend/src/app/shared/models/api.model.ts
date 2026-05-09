/** Generic wrapper that mirrors Spring Boot Page<T> */
export interface Page<T> {
  readonly content: T[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly size: number;
  readonly number: number;
}

/** Generic API error shape returned by the Spring Boot ExceptionHandler */
export interface ApiError {
  readonly timestamp: string;
  readonly status: number;
  readonly error: string;
  readonly message: string;
  readonly path: string;
}
