export interface IResponse<T> {
  statusCode: number;
  isSucess: boolean;
  message: string;
  data: T;
  path: string;
  timestamp: Date;
}

export interface IPagination<T> {
  page: number;
  totalPage: number;
  limit: number;
  totalReults: number;
  results: T[];
}
