import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map(a => a.id !== action.payload.id ? a : action.payload.votedAnecdote)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    sortAnecdotes(state, action) {
      state.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, sortAnecdotes, setAnecdotes } 
  = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
    dispatch(sortAnecdotes())
  }
}

export const createNew = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const vote = (id, newObj) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.vote(id, newObj)
    dispatch(voteAnecdote({
      id,
      votedAnecdote
    }))
    dispatch(sortAnecdotes())
  }
}

export default anecdoteSlice.reducer