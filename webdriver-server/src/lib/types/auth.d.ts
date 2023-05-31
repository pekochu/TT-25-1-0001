type User = {
    id: number
    nombre: string
    email: string
    refreshToken: string
  }
  
  export type UserSession = Omit<User, 'refreshToken'>