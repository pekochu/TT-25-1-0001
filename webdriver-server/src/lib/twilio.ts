import * as TwilioClient from 'twilio';


const randomString = () => Math.random().toString(36).substring(2, 12);

export async function sendTest(): Promise<any> {
  // create reusable transporter
  const client = TwilioClient.default(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  
  const message = await client.messages.create({
    body: 'Hello from Node',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5215536502067',
    mediaUrl: ['https://af6f-187-188-225-47.ngrok-free.app/api/v1/whatsapp/119/getDifferenceImage']
  });
  console.log(message);
}

export async function sendResultNotification({ telefono, subject, resultId }: any): Promise<any> {
  // create reusable transporter
  const client = TwilioClient.default(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  
  
  const message = await client.messages.create({
    body: subject,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+521${telefono}`,
    mediaUrl: [`https://af6f-187-188-225-47.ngrok-free.app/api/v1/whatsapp/${resultId}/getDifferenceImage`]
  });
  console.log(message);
}

export async function sendTextResultNotification({ telefono, subject }: any): Promise<any> {
  // create reusable transporter
  const client = TwilioClient.default(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  
  
  const message = await client.messages.create({
    body: subject,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+521${telefono}`
  });
  console.log(message);
}