import { CodeAttr } from '../code/code';

export abstract class AbstractError extends Error {
  constructor(
    public readonly codeAttr: CodeAttr,
    public readonly detail: string | string[],
    /*
     * 운영 오류는 언젠가 발생할 것을 예측할 수 있는 문제들로 미리 처리해야 한다.
     * 1. 잘못된 경로 접근.
     * 2. 잘못된 사용자 입력.
     * 3. 서버 연결 실패.
     * 4. 데이터베이스 연결 실패.
     * 5. 요청 시간 초과.
     * 6. ...
     */
    public readonly isOperational: boolean
  ) {
    super();

    this.name = this.constructor.name;

    // TODO: isOperational은 항상 true인데 어떻게?

    /* 새로운 객체가 생성되고 생성자 함수가 호출되면 함수 호출이 스택 트레이스에 나타나지 않는다. */
    Error.captureStackTrace(this, this.constructor);
  }
}
