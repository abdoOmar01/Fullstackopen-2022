import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    removeMessage(state, action) {
      return state = ''
    }
  }
})

export const { setMessage, removeMessage } = messageSlice.actions

let timer = null

export const setNotification = (text, time) => {
  return async dispatch => {
    if (timer) {
      clearTimeout(timer)
    }
    dispatch(setMessage(text))
    timer = setTimeout(() => {
      dispatch(removeMessage())
    }, time * 1000)
  }
}

export default messageSlice.reducer