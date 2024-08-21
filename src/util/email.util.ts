import * as nodemailer from 'nodemailer';

import { EmailMessage } from '../type/email-message.type';

export class EmailUtil {
  private readonly from;

  private constructor(
    private readonly to: string,
    private readonly url: string
  ) {
    this.from = process.env.NODEMAILER_FROM;
  }

  public static create(to: string, url: string) {
    return new EmailUtil(to, url);
  }

  private createTransport(): nodemailer.Transporter {
    // TODO: 운영 환경 시 환경변수 변경.
    return nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }

  public send = async (subject: string, text: string): Promise<void> => {
    const emailMessage: Partial<EmailMessage> = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.createTransport().sendMail(emailMessage);
  };

  public sendWelcome = async (): Promise<void> => {
    await this.send(
      'Whooa 블로그에 오신 걸 환영합니다!',
      '가입해 주셔서 감사합니다.'
    );
  };

  public sendPasswordReset = async (): Promise<void> => {
    await this.send(
      '비밀번호 재설정 토큰이 발급되었습니다. 토큰은 10분간 유효합니다.',
      `새 비밀번호와 비밀번호 확인을 ${this.url}에 제출해 주세요. 비밀번호를 잊지 않으셨다면 이 이메일을 무시해 주세요.`
    );
  };
}
