declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      MONGO_URI: string;

      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;

      NODEMAILER_FROM: string;
      NODEMAILER_HOST: string;
      NODEMAILER_PORT: number;
      NODEMAILER_USER: string;
      NODEMAILER_PASS: string;

      GOOGLE_OAUTH2_CLIENT_ID: string;
      GOOGLE_OAUTH2_CLIENT_SECRET: string;
      GOOGLE_OAUTH2_REDIRECT_URI: string;

      NAVER_OAUTH2_CLIENT_ID: string;
      NAVER_OAUTH2_CLIENT_SECRET: string;
      NAVER_OAUTH2_REDIRECT_URI: string;

      TEST_USER_ROLE: string;
    }
  }
}

export {};
