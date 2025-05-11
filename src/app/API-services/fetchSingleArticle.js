import apiClient from './apiClient'

export const fetchSingleArticle = async (slug) => {
  try {
    const response = await apiClient.get(`/articles/${slug}`)
    return response.data.article
  } catch (err) {
    throw new Error('Ошибка при получении статьи')
  }
}
