import { useState, useEffect } from 'react'
import axios from 'axios'
import { authHeader, API_URL } from '../../../auth/helpers'
import { useUser } from '../../../auth/UserProvider'


const getContactInfo = async (user) => {
  const { data } = await axios.get(`${API_URL}/contact-info`,
    { headers: authHeader(user) })
  return data
}

const formatPhone = (phone) => {
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
}

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState(undefined)
  const { user } = useUser()

  useEffect(() => {
    getContactInfo(user)
      .then(info => setContactInfo({...info, readablePhone: formatPhone(info.phone) }))
      .catch((err) => console.error(err))
  }, [user])

  return contactInfo
}

export const contactInfoService = {
  getContactInfo,
}
