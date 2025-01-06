import * as nodemailer from 'nodemailer';
import { Options, OptionsAttachment } from './types/mail';

const randomString = () => Math.random().toString(36).substring(2, 12);

export async function sendEmail({ to, subject, text, html, replyTo }: Options): Promise<any> {
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
    replyTo
  });

  return info;
}

export async function sendEmailWithAttachments({ to, subject, text, html, attachments }: OptionsAttachment): Promise<any> {
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
    attachments
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
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
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
  <span style="opacity: 0">${randomStr}</span>
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
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
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
  <span style="opacity: 0">${randomStr}</span>
</body>
`;
}

export function generateConfirmContactPlain(): string {
  // generate email body as plain text (no html)
  return `Muchas gracias por mostrar intéres en este proyecto. Ángel Bravo se pondrá en contacto lo más pronto posible.`;
}

export function generateConfirmContactHTML(params: { theme: { brandColor?: string; buttonText?: string; } }): string{
  const { theme } = params;
  const brandColor = theme.brandColor || '#346df1';
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Has contactado al desarrollador de <strong>ESCOMONITOR</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Muchas gracias por mostrar intéres en este proyecto. Ángel Bravo se pondrá en contacto lo más pronto posible. 
      </td>
    </tr>
  </table>
  <span style="opacity: 0">${randomStr}</span>
</body>
`;
}

export function generateSomeoneContactingPlain(asunto: string): string {
  // generate email body as plain text (no html)
  return `Alguien tiene interes en el trabajo terminal: >> ${asunto} <<`;
}

export function generateSomeoneContactingHTML(params: { nombre: string, email: string, telefono: string, asunto: string, mensaje: string, theme: { brandColor?: string; buttonText?: string; } }): string{
  const { nombre, email, telefono, asunto, mensaje, theme } = params;
  const brandColor = theme.brandColor || '#346df1';
  const randomStr = randomString();
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
        Es <b>${nombre}</b>, con asunto: ${asunto}
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <h3>Medios de contacto</h3>
      </td>
    </tr>
    <tr>
      <td 
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Correo electrónico: ${email}
      </td>
    </tr>
    <tr>
      <td 
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Teléfono: ${telefono}
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <h3>Mensaje</h3>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        ${mensaje}
      </td>
    </tr>
  </table>
  <span style="opacity: 0">${randomStr}</span>
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
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
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
  <span style="opacity: 0">${randomStr}</span>
</body>
`;
}

export function generateDifferenceDetectedBodyText(pagina: string): string {
  // generate email body as plain text (no html)
  return `¡Se han detectado cambios en la página: ${pagina}`;
}

export function generateDifferenceDetectedBodyHTML(params: { url: string; pagina: string; diferencia:string; theme: { brandColor?: string; buttonText?: string; } }): string{
  const { url, theme, pagina, diferencia } = params;
  const brandColor = theme.brandColor || '#346df1';
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se han detectado cambios visuales en la página <strong>${url}</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Revisa los archivos adjuntos para checar la imagen base, la imagen actual y la imagen con las diferencias resaltadas.
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Descripción de la página: ${pagina ? pagina : ''}
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Diferencia: ${diferencia}%
      </td>
    </tr>
  </table>
  <span style="opacity: 0">${randomStr}</span>
</body>
`;
}

export function generateTextDifferenceDetectedBodyHTML(params: { url: string; pagina: string; diferencia:string; theme: { brandColor?: string; buttonText?: string; } }): string{
  const { url, theme, pagina, diferencia } = params;
  const brandColor = theme.brandColor || '#346df1';
  const randomStr = randomString();
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
  <span style="opacity: 0">${randomStr}</span>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se han detectado cambios de texto en la página <strong>${url}</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Descripción de la página: ${pagina ? pagina : ''}
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Diferencia: ${diferencia}%
      </td>
    </tr>
  </table>
  <span style="opacity: 0">${randomStr}</span>
</body>
`;
}