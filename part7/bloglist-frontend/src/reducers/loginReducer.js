import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './messageReducer'

const loginSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    // eslint-disable-next-line
    removeUser(state, action) {
      return null
    }
  }
})

export const { setUser, removeUser } = loginSlice.actions

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const login = (user) => {
  return async dispatch => {
    try {
      const loggedUser = await loginService.login(user)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      dispatch(setUser(loggedUser))
      dispatch(setNotification(`logged in as ${loggedUser.name}`, false, 5))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', true, 5))
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(removeUser())
  }
}

export default loginSlice.reducer