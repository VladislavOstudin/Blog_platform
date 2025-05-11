import { createAsyncThunk } from '@reduxjs/toolkit'
import { editArticle } from '../artReducer'
import apiClient from './apiClient'

export const createArticleThunk = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/articles', {
        article: articleData,
      })
      return response.data.article
    } catch (err) {
      const message = err.response?.data?.errors || err.message
      return rejectWithValue(message)
    }
  },
)

export const updateArticleThunk = createAsyncThunk(
  'articles/updateArticle',
  async ({ slug, articleData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/articles/${slug}`, {
        article: articleData,
      })

      dispatch(editArticle(response.data.article))
      return response.data.article
    } catch (err) {
      const message = err.response?.data?.errors || err.message
      return rejectWithValue(message)
    }
  },
)

export const fetchSingleArticleThunk = createAsyncThunk(
  'articles/fetchSingleArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/articles/${slug}`)
      return response.data.article
    } catch (err) {
      const message = err.response?.data?.errors || err.message
      return rejectWithValue(message)
    }
  },
)

export const deleteArticleThunk = createAsyncThunk('articles/deleteArticle', async (slug, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/articles/${slug}`)
    return slug
  } catch (err) {
    const message = err.response?.data?.errors || err.message
    return rejectWithValue(message)
  }
})
