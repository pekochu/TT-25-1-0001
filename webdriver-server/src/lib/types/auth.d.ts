type User = {
    id: number
    nombre: string
    email: string
    rol: number
    refreshToken: string
  }
  
  export type UserSession = Omit<User, 'refreshToken'>