import { configureStore } from '@reduxjs/toolkit'
import artReducer from './artReducer'

export const store = configureStore({
  reducer: {
    articles: artReducer,
  },
  devTools: true,
})
