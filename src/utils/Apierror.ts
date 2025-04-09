import { HttpError } from 'routing-controllers';

export class ApiError extends HttpError {
  errorCode?: string;
  pacificCode?: string;

  constructor(status: number, message?: string, pacificCode?: string) {
    super(status, message);
    this.errorCode = pacificCode;
    this.pacificCode = pacificCode;
  }
}
