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

export function generateConfirmRegistrationBodyPlain(url: string): string {
  // generate email body as plain text (no html)
  return `
  Confirma la creación de tu cuenta:
    ${url}
  `;
}

export function generateConfirmRegistrationBodyHTML(params: { url: string; theme: { brandColor?: string; buttonText?: string; } }): string {
  const { url, theme } = params;
  const brandColor = theme.brandColor || '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Confirma la creación de tu cuenta en <strong>ESCOMONITOR</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Confirmar cuenta</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Si no solicitaste este correo, es completamente seguro ignorarlo.
      </td>
    </tr>
  </table>
</body>
`;
}

export function generateConfirmLoginBodyPlain(): string {
  // generate email body as plain text (no html)
  return `Confirma que quieres iniciar sesión en tu cuenta`;
}

export function generateConfirmLoginBodyHTML(params: { url: string; theme: { brandColor?: string; buttonText?: string; } }): string{
  const { url, theme } = params;
  const brandColor = theme.brandColor || '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Iniciar sesión en <strong>ESCOMONITOR</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Iniciar sesión</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Si no solicitaste este correo, es completamente seguro ignorarlo.
      </td>
    </tr>
  </table>
</body>
`;
}

export function generateSomeoneLoggedInBodyPlain(): string {
  // generate email body as plain text (no html)
  return `Alguien ha iniciado sesión en tu cuenta`;
}

export function generateSomeoneLoggedInBodyHTML(params: { url: string; theme: { brandColor?: string; buttonText?: string; } }): string{
  const { url, theme } = params;
  const brandColor = theme.brandColor || '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Iniciaste sesión en <strong>ESCOMONITOR</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Si no fuiste tú, favor de reportarlo.
      </td>
    </tr>
  </table>
</body>
`;
}