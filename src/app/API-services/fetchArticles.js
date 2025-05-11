import apiClient from './apiClient'
import { setLoading, getArticles, setError } from '../artReducer'

export const fetchArticles =
  (page = 1) =>
  async (dispatch) => {
    const limit = 5
    const offset = (page - 1) * limit

    dispatch(setLoading())

    try {
      const response = await apiClient.get(`/articles?limit=${limit}&offset=${offset}`)
      dispatch(getArticles(response.data))
    } catch (err) {
      dispatch(setError('Ошибка при получении статей'))
    }
  }
