import * as nodemailer from 'nodemailer';
import { Options } from './types/mail';

export async function sendEmail({ to, subject, text, html }: Options): Promise<any> {
  // create reusable transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `\"${process.env.SMTP_FROM_NAME}\" <${process.env.SMTP_FROM_ADDRESS}>`,
    to: Array.isArray(to) ? to : [to], // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  return info;
}

export function generateProfileConfirmationBodyPlain(token: string): string {
  return `
    Hi,
    You have updated your email address.
    Please click the following link to confirm your your new email address:
    ${process.env.APP_URL}/confirm-email/${token}
    Thank you,
  `;
}

export function generateProfileConfirmationBodyHTML(token: string): string {
  return `
    <p>Hi,</p>
    <p>You have updated your email address.</p> 
    <p>Please click the following link to confirm your your new email address:</p>
    <p><a href="${process.env.APP_URL}/confirm-email/${token}">${process.env.APP_URL}/api/confirm-profile?token=${token}</a></p>
    <p>Thank you,</p>
  `;
}

export function generateConfirmRegistrationBodyPlain(token: string): string {
  // generate email body as plain text (no html)
  return `
  or favor, da clic en el siguiente link para confirmar tu correo electrónico y activar tu cuenta:
    ${process.env.APP_FRONT_URL}/confirm-email/${token}
  `;
}

export function generateConfirmRegistrationBodyHTML(token: string): string {
  return `
    <h1>Welcome to ${process.env.APP_NAME}</h1>
    <p>
      Por favor, da clic en el siguiente link para confirmar tu correo electrónico y activar tu cuenta:
      <a href="${process.env.APP_FRONT_URL}/confirm-email/${token}">Confirmar correo electrónico</a>
    </p>
  `;
}
