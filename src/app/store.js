import { configureStore } from '@reduxjs/toolkit'
import artReducer from './artReducer'
import usersReducer from './usersReducer'

export const store = configureStore({
  reducer: {
    articles: artReducer,
    users: usersReducer,
  },
  devTools: true,
})
