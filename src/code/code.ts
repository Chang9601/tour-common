type CodeAttr = {
  code: number;
  message: string;
};

type CodeToMessage = Record<number, string>;
type MessageToCode = Record<string, number>;

class Code {
  public static readonly OK: CodeAttr = {
    code: 200,
    message: '성공했습니다.',
  };

  public static readonly CREATED: CodeAttr = {
    code: 201,
    message: '생성되었습니다.',
  };

  public static readonly NO_CONTENT: CodeAttr = {
    code: 204,
    message: '삭제되었습니다.',
  };

  public static readonly BAD_REQUEST: CodeAttr = {
    code: 400,
    message: '잘못된 요청입니다.',
  };

  public static readonly UNAUTHORIZED: CodeAttr = {
    code: 401,
    message: '권한이 없습니다.',
  };

  public static readonly NOT_FOUND: CodeAttr = {
    code: 404,
    message: '찾을 수 없습니다.',
  };

  public static readonly CONFLICT: CodeAttr = {
    code: 409,
    message: '충돌이 발생했습니다.',
  };

  public static readonly INTERNAL_SERVER_ERROR: CodeAttr = {
    code: 500,
    message: '서버 오류가 발생했습니다.',
  };

  public static readonly MONGO_ID_ERROR: CodeAttr = {
    code: 1000,
    message: '유효하지 않은 MongoDB 아이디입니다.',
  };

  public static readonly MONGO_VALIDATION_ERROR: CodeAttr = {
    code: 1001,
    message: '유효하지 않은 MongoDB 필드입니다.',
  };

  public static readonly MONGO_DUPLICATE_ERROR: CodeAttr = {
    code: 1002,
    message: '중복된 MongoDB 도큐먼트입니다.',
  };

  public static toMessage: CodeToMessage = {
    [Code.BAD_REQUEST.code]: Code.BAD_REQUEST.message,
    [Code.UNAUTHORIZED.code]: Code.UNAUTHORIZED.message,
  };

  public static toCode: MessageToCode = {};
}

export { CodeAttr, Code };
