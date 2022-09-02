import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import messageReducer from './reducers/messageReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    message: messageReducer,
    filter: filterReducer
  }
})

export default store