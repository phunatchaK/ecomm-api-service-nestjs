export class ApiResponse<T = any> {
  success: boolean;
  message?: string;
  result: T | null;

  constructor(success: boolean, message: string, result: T) {
    this.success = success;
    this.message = message;
    this.result = result;
  }

  static success<T>(data: T, message: string): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error<T>(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null);
  }
}

export class PaginationReponse<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
  totalPages?: number;
  nextPage?: number | null;
  prevPage?: number | null;

  constructor(data: T[], total: number, limit: number, page: number) {
    this.data = data;
    this.total = total;

    if (page !== undefined && limit !== undefined) {
      this.page = page;
      this.limit = limit;
      this.totalPages = Math.ceil(total / limit);
      this.nextPage = page < this.totalPages ? page + 1 : null;
      this.prevPage = page > this.totalPages ? page - 1 : null;
    }
  }
}
