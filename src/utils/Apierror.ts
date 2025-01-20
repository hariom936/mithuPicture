import { HttpError } from 'routing-controllers';

export class ApiError extends HttpError {
  errorCode?: string | undefined;
    pacificCode: string | undefined;
  constructor(status: number, message?: string, pacificCode?: string) {
    super(status, message);
    this.errorCode = pacificCode;
  }
}
