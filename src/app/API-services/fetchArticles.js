import axios from 'axios'
import { setLoading, getArticles, setError } from '../artReducer'

const API_BASE_URL = 'https://blog-platform.kata.academy/api'

export const fetchArticles =
  (page = 1) =>
  async (dispatch) => {
    const limit = 5
    const offset = (page - 1) * limit

    dispatch(setLoading())

    try {
      const response = await axios.get(`${API_BASE_URL}/articles?limit=${limit}&offset=${offset}`)
      dispatch(getArticles(response.data))
    } catch (err) {
      dispatch(setError('Ошибка при получении статей'))
    }
  }
