export const generateApiUrl = (path: string): string => {
  // If environment variable is not set, throw an error
  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL no esta configurado')
  }
  return `${process.env.API_BASE_URL}${path}`;
}
export const API_SCREENSHOT_URL = `/api/v1/screenshot`;
export const API_GOTO_URL = `/api/v1/goto`;
export const API_CREATE_USER_URL = `/api/v1/newuser`;