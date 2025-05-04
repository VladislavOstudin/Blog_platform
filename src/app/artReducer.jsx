import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialArticlesState = {
  articles: [],
  totalPage: 0,
  page: 1,
  currentSlug: '',
  tags: [],
  createTags: [],
  currentTags: '',
  loading: false,
  error: null,
}

const artReducer = createSlice({
  name: 'articles',
  initialState: initialArticlesState,
  reducers: {
    setLoading(state) {
      state.loading = true
    },
    getArticles(state, action) {
      const { articles, articlesCount } = action.payload
      state.articles = articles.map((art) => ({ ...art, uid: uuidv4() }))
      state.totalPages = Math.ceil(articlesCount / 5)
      state.loading = false
      state.error = null
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setLoading, getArticles, setError } = artReducer.actions

export default artReducer.reducer
