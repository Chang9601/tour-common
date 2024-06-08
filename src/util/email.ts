import * as nodemailer from 'nodemailer';

export const sendEmail = (options: string[]) => {
  /* 1. */
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {},
  });

  /* 2. */
  /* 3. */
};
