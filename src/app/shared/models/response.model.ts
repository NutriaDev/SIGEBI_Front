export interface ApiResponse<T> {
  status: string;
  title: string;
  message: string;
  body: T;
}
