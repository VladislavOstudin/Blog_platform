import apiClient from './apiClient'

export const fetchPutLike = async (slug) => {
  try {
    const response = await apiClient.post(`/articles/${slug}/favorite`)
    return response.data.article.favoritesCount
  } catch (err) {
    const message = err.response?.data?.errors || err.message
    throw new Error(`Ошибка при лайке: ${message}`)
  }
}

export const fetchRemoveLike = async (slug) => {
  try {
    const response = await apiClient.delete(`/articles/${slug}/favorite`)
    return response.data.article.favoritesCount
  } catch (err) {
    const message = err.response?.data?.errors || err.message
    throw new Error(`Ошибка при снятии лайка: ${message}`)
  }
}
