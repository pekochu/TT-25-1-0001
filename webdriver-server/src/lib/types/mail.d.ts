export interface Options {
  to: string | string[]
  subject: string
  text: string
  html: string
  replyTo?: string
}

  export interface OptionsAttachment {
  to: string | string[]
  subject: string
  text: string
  html: string
  attachments: any
}