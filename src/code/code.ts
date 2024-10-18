export type CodeAttribute = {
  code: number;
  message: string;
};

type CodeToMessage = Record<number, string>;
type MessageToCode = Record<string, number>;

export class Code {
  public static readonly OK: CodeAttribute = {
    code: 200,
    message: '성공했습니다.',
  };

  public static readonly CREATED: CodeAttribute = {
    code: 201,
    message: '생성되었습니다.',
  };

  public static readonly NO_CONTENT: CodeAttribute = {
    code: 204,
    message: '삭제되었습니다.',
  };

  public static readonly BAD_REQUEST: CodeAttribute = {
    code: 400,
    message: '잘못된 요청입니다.',
  };

  public static readonly UNAUTHORIZED: CodeAttribute = {
    code: 401,
    message: '인증되지 않았습니다.',
  };

  public static readonly FORBIDDEN: CodeAttribute = {
    code: 403,
    message: '권한이 없습니다.',
  };

  public static readonly NOT_FOUND: CodeAttribute = {
    code: 404,
    message: '찾을 수 없습니다.',
  };

  public static readonly CONFLICT: CodeAttribute = {
    code: 409,
    message: '충돌이 발생했습니다.',
  };

  public static readonly INTERNAL_SERVER_ERROR: CodeAttribute = {
    code: 500,
    message: '서버 오류가 발생했습니다.',
  };

  public static readonly MONGO_ID_ERROR: CodeAttribute = {
    code: 400,
    message: '유효하지 않은 MongoDB 아이디입니다.',
  };

  public static readonly MONGO_VALIDATION_ERROR: CodeAttribute = {
    code: 400,
    message: '유효하지 않은 MongoDB 필드입니다.',
  };

  public static readonly MONGO_DUPLICATE_ERROR: CodeAttribute = {
    code: 409,
    message: '중복된 MongoDB 도큐먼트입니다.',
  };

  public static readonly JWT_VALIDATION_ERROR: CodeAttribute = {
    code: 401,
    message: '유효하지 않은 JWT입니다.',
  };

  public static readonly JWT_EXPIRATION_ERROR: CodeAttribute = {
    code: 401,
    message: '만료된 JWT입니다.',
  };

  public static readonly JWT_AFTER_PASSWORD_UPDATE_ERROR: CodeAttribute = {
    code: 401,
    message: 'JWT 발급 후 비밀번호가 변경되었습니다.',
  };

  public static readonly NATS_NOT_CONNECTED_ERROR: CodeAttribute = {
    code: 500,
    message: 'NATS 클라이언트에 연결되지 않았습니다.',
  };

  public static readonly MULTER_UNINTIALIZED_ERROR: CodeAttribute = {
    code: 500,
    message: 'Multer가 초기화되지 않았습니다.',
  };

  public static readonly MULTER_INVALID_MIMETYPE_ERROR: CodeAttribute = {
    code: 400,
    message: '유효한 MIME 타입이 아닙니다.',
  };

  public static toMessage: CodeToMessage = {
    [Code.BAD_REQUEST.code]: Code.BAD_REQUEST.message,
    [Code.UNAUTHORIZED.code]: Code.UNAUTHORIZED.message,
  };

  public static toCode: MessageToCode = {};
}
