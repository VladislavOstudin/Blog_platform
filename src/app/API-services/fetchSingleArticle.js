import axios from 'axios'

const API_BASE_URL = 'https://blog-platform.kata.academy/api'

export const fetchSingleArticle = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles/${slug}`)
    // console.log('Статья:', response.data.article)
    return response.data.article
  } catch (err) {
    throw new Error('Ошибка при получении статьи')
  }
}
