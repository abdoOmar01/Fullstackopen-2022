import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: '',
  isError: false
}

const messageSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessage(state, action) {
      return {
        content: action.payload.content,
        isError: action.payload.isError
      }
    },
    // eslint-disable-next-line
    removeMessage(state, action) {
      return initialState
    }
  }
})

export const { setMessage, removeMessage } = messageSlice.actions

let timer = null
export const setNotification = (content, isError, time) => {
  return dispatch => {
    if (timer) {
      clearTimeout(timer)
    }

    dispatch(setMessage({
      content,
      isError
    }))
    timer = setTimeout(() => {
      dispatch(removeMessage())
    }, time * 1000)
  }
}

export default messageSlice.reducer