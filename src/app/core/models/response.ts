export interface ApiResponse<T> {
  title: string;
  message: string;
  status: string;
  body: T;
}
