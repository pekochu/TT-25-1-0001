export const generateApiUrl = (path: string): string => {
  // If environment variable is not set, throw an error
  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL no esta configurado')
  }
  return `${process.env.API_BASE_URL}${path}`;
}

// Admin
export const API_ADMIN_USERS = `/api/v1/users`;

// Sesión y auth
export const API_LOGIN = `/api/v1/login`;
export const API_AUTH = `/api/v1/login/auth`;
export const API_LOGIN_REFRESH = `/api/v1/login/refresh`;
export const API_CURRENT_USER = `/api/v1/auth/current`;

// WebDriver
export const API_WEB_GOTO_URL = `/api/v1/web/goto`;
export const API_WEB_PERFORM_ACTIONS = `/api/v1/web/actions`;
export const API_WEB_SCREENSHOT_URL = `/api/v1/web/screenshot`;
export const API_WEB_ELEMENT_SCREENSHOT = `/api/v1/web/element/screenshot`;
export const API_WEB_TITLE = `/api/v1/web/title`;
export const API_WEB_MOVE = `/api/v1/web/move`;
export const API_WEB_XPATH = `/api/v1/web/xpath`;
export const API_WEB_INPUT_ELEMENTS = `/api/v1/web/inputElements`;

// Crear cliente y página
export const API_CREATE_USER_URL = `/api/v1/user`;

// Páginas
export const API_V1_PAGES = `/api/v1/pages`;

// Páginas
export const API_V1_RESULTADOS = `/api/v1/results`;

// Contacto
export const API_V1_CONTACTO = `/api/v1/contacto`;