import apiClient from './apiClient'

export const registerUser = async ({ username, email, password }) => {
  const response = await apiClient.post('/users', {
    user: { username, email, password },
  })
  return response.data.user
}

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post('/users/login', {
    user: { email, password },
  })
  return response.data.user
}

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/user')
  return response.data.user
}

export const updateUser = async (userData) => {
  const response = await apiClient.put('/user', {
    user: userData,
  })
  return response.data.user
}
