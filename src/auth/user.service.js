import { useState, useEffect } from 'react'
import axios from 'axios'
import { loadAuth2 } from 'gapi-script'
import { authHeader, API_URL } from './helpers'


const CLIENT_ID = '103958983781-lqfqaf0agi3ei1b25t7l97igivci9lh0.apps.googleusercontent.com'

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

function userService() {
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    _initGapi()
  }, [])

  const _initGapi = async () => {
    const auth2 = await loadAuth2(CLIENT_ID)
    if (auth2.isSignedIn.get()) {
      await verifyGoogleUser(auth2)
    }
  }

  const verifyGoogleUser = async (auth2) => {
    const googleUser = auth2.currentUser.get()
    const id_token = googleUser.getAuthResponse().id_token

    const { data } = await axios.post('/api/google/authenticate', { id_token })
    if (data.error || !data.id) {
      await auth2.signOut()
      logout()
      throw data.error
    }

    await auth2.signOut()
    localStorage.setItem('user', JSON.stringify(data))
    await setUser(data)
    return data
  }

  const signInGoogleUser = async () => {
    const auth2 = window.gapi.auth2.getAuthInstance()
    await auth2.signIn()
    return await verifyGoogleUser(auth2)
  }

  const saveUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const login = async (ticket) => {
    const response = await axios.post(`${API_URL}/login`, { ticket })
    if (response.data.token) {
      saveUser(response.data)
    }
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(undefined)
  }

  const verifyUser = async () => {
    if (!user || !user.id || !user.token) return Promise.resolve(false)

    try {
      const result = await axios.get(`${API_URL}/users/${user.id}`, { headers: authHeader(user) })
      if (result.data && !result.error && result.data.token) {
        logout()
        return false
      }
      return user
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    verifyUser,
    login,
    logout,
    signInGoogleUser,
  }
}

export default userService
