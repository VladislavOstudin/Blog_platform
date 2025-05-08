import { createSlice } from '@reduxjs/toolkit'

const initialUsersState = {
  token: '',
  username: '',
  bio: '',
  email: '',
  image: '',
  authorization: false,
  currentUser: null,
  errorSignUp: false,
  errorSignIn: false,
  errorEdit: false,
}

const usersReducer = createSlice({
  name: 'users',
  initialState: initialUsersState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload
      state.currentUser = user
      state.token = token
      state.username = user.username
      state.bio = user.bio
      state.email = user.email
      state.image = user.image
      state.authorization = true
      state.errorSignIn = false
      state.errorSignUp = false
    },

    logOut(state) {
      state.token = ''
      state.username = ''
      state.bio = ''
      state.email = ''
      state.image = ''
      state.authorization = false
      state.currentUser = null
    },

    setSignInError(state) {
      state.errorSignIn = true
    },

    setSignUpError(state) {
      state.errorSignUp = true
    },

    setEditError(state) {
      state.errorEdit = true
    },

    clearErrors(state) {
      state.errorSignIn = false
      state.errorSignUp = false
    },
  },
})

export const { setUser, logOut, setSignInError, setSignUpError, setEditError, clearErrors } = usersReducer.actions

export default usersReducer.reducer
