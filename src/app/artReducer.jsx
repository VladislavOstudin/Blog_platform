import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { createArticleThunk, updateArticleThunk, deleteArticleThunk } from './API-services/fetchCreateArticle'

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
    createArticle(state, action) {
      state.articles.push({ ...action.payload, uid: uuidv4() })
      state.loading = false
      state.error = null
    },
    editArticle(state, action) {
      const updatedArticle = action.payload
      const index = state.articles.findIndex((art) => art.slug === updatedArticle.slug)
      if (index !== -1) {
        state.articles[index] = {
          ...updatedArticle,
          uid: state.articles[index].uid || uuidv4(),
        }
      }
      state.loading = false
      state.error = null
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArticleThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createArticleThunk.fulfilled, (state, action) => {
        state.articles.push({ ...action.payload, uid: uuidv4() })
        state.loading = false
        state.error = null
      })
      .addCase(createArticleThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при создании статьи'
      })
      .addCase(updateArticleThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateArticleThunk.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        const index = state.articles.findIndex((art) => art.slug === updatedArticle.slug)
        if (index !== -1) {
          state.articles[index] = {
            ...updatedArticle,
            uid: state.articles[index].uid || uuidv4(),
          }
        }
        state.loading = false
        state.error = null
      })
      .addCase(updateArticleThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при обновлении статьи'
      })
      .addCase(deleteArticleThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteArticleThunk.fulfilled, (state, action) => {
        const slug = action.payload
        state.articles = state.articles.filter((art) => art.slug !== slug)
        state.loading = false
        state.error = null
      })
      .addCase(deleteArticleThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при удалении статьи'
      })
  },
})

export const { setLoading, getArticles, createArticle, editArticle, setError } = artReducer.actions

export default artReducer.reducer
