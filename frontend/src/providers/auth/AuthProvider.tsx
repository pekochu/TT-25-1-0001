import { createContext, useContext, useEffect, useState } from 'react';
import { generateApiUrl, API_LOGIN, API_AUTH, API_CURRENT_USER } from '@/lib/constants';
import Cookies from 'universal-cookie';

interface AuthContextData {
  isAuthenticated: boolean
  currentUser: any
  accessToken: string | null
  refreshToken: string | null
  logIn: (_data: any) => Promise<void>
  validateTwoFactorAuth: (_data: any) => Promise<void>
  logOut: () => void
  refreshSession: () => Promise<void>
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  logIn: () => Promise.resolve(),
  validateTwoFactorAuth: () => Promise.resolve(),
  logOut: () => { },
  refreshSession: () => Promise.resolve(),
})

const AuthProvider = ({ children }: AuthProviderProps) => {
  const cookies = new Cookies();
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  // Watch currentUser
  useEffect(() => {
    if (!currentUser) {
      // try to get user from local storage
      const user = localStorage.getItem('currentUser')
      if (user != null && user !== 'undefined') {
        setCurrentUser(JSON.parse(user))
        setIsAuthenticated(true)
      }
    }
  }, [currentUser])

  // Watch access token
  useEffect(() => {
    if (!accessToken) {
      // Read access token from cookies
      const cookiesArray = document.cookie.split(';');
      const tokenCookie = cookiesArray.find(cookie => cookie.includes('token'))
      if (tokenCookie) {
        const token = cookies.get('token');
        setAccessToken(token)
      }
    }
  }, [accessToken])

  // Watch refresh token
  useEffect(() => {
    if (!refreshToken) {
      // try to get refresh token from local storage
      const token = localStorage.getItem('refreshToken')
      console.log('refresh token', token)
      if (token != null && token !== 'undefined') {
        setRefreshToken(token)
      }
    }
  }, [refreshToken])

  const logIn = async (data: any) => {
    return new Promise<void>((resolve, reject) => {
      // Send data to API
      fetch(generateApiUrl(API_LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json() as Promise<any>)
        .then(res => {
          if (res.success && res.data) {
            // save access token in cookies
            cookies.set('token', res.data.token, { secure: true });

            // Save refresh token in session storage for persistence
            localStorage.setItem('refreshToken', res.data.refreshToken)

            // Save access token and refresh token
            setRefreshToken(res.data.refreshToken)

            // save user data inside state
            setCurrentUser(res.data.session)

            // set auth state
            resolve()
          } else {
            reject(new Error(res.data.message))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const validateTwoFactorAuth = async (res: any) => {
    return new Promise<void>((resolve, reject) => {
      // Send data to API
      if (res.success && res.data) {
        // save user data inside state
        setCurrentUser(res.data.session)

        // save current user in local storage
        localStorage.setItem(
          'currentUser',
          JSON.stringify(res.data.session)
        )

        // set isAuthenticated to true
        setIsAuthenticated(true)

        // set auth state
        resolve()
      } else {
        reject(new Error(res.data.message))
      }
    })
  }

  const logOut = () => {
    // Remove access token from cookies
    cookies.remove('token');

    // Clear provider state
    setCurrentUser(null)
    setIsAuthenticated(false)
    setAccessToken('')
    setRefreshToken('')

    // Remove persistence data from local storage
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
  }

  const refreshSession = async () => {
    // Read refresh token from localStorage if not found in provider state
    if (!refreshToken) {
      const token = localStorage.getItem('refreshToken')
      if (token != null && token !== 'undefined') {
        setRefreshToken(token)
      } else {
        return Promise.reject(new Error('Refresh token not found'))
      }
    }

    // Send API request to refresh endpoint
    return new Promise<void>((resolve, reject) => {
      fetch(generateApiUrl('api/v1/login/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then(res => res.json() as Promise<any>)
        .then(res => {
          if (res.success && res.data) {
            // Overwrite current token with new one
            cookies.set('token', res.data.token, { secure: true })

            // Refresh access token
            setAccessToken(res.data.token)

            // Refreshed correctly
            resolve()
          } else {
            reject(new Error(res.message))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        logIn,
        validateTwoFactorAuth,
        logOut,
        refreshSession,
        refreshToken,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  // Custom hook to use auth context
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext, AuthProvider, useAuth }