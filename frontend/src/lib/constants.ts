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
export const API_V1_PAGES = `/api/v1/pages`;
export const API_LOGIN = `/api/v1/login`;
export const API_AUTH = `/api/v1/login/auth`;
export const API_LOGIN_REFRESH = `/api/v1/login/refresh`;
export const API_CURRENT_USER = `/api/v1/auth/current`;