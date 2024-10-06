import { Code } from '../code/code';

type Metadata = {
  code: number;
  message: string;
  timestamp: number;
  detail?: string | string[];
};

export class ApiResponse<TData> {
  public readonly metadata: Metadata;
  public readonly data: TData;

  private constructor(
    code: number,
    message: string,
    data: TData,
    detail: string | string[]
  ) {
    this.metadata = {
      code,
      message,
      timestamp: Date.now(),
      detail,
    };

    this.data = data;
  }

  public static handleSuccess<TData>(
    code: number,
    message: string,
    data: TData,
    detail: string | string[]
  ): ApiResponse<TData> {
    const successCode = code || Code.OK.code;
    const successMessage = message || Code.OK.message;

    return new ApiResponse(successCode, successMessage, data, detail);
  }

  public static handleFailure<TData>(
    code: number,
    message: string,
    detail: string | string[],
    data: TData
  ): ApiResponse<TData> {
    const failureCode = code || Code.INTERNAL_SERVER_ERROR.code;
    const failureMessage = message || Code.INTERNAL_SERVER_ERROR.message;

    return new ApiResponse(failureCode, failureMessage, data, detail);
  }
}
