import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    // eslint-disable-next-line
    sortBlogs(state, action) {
      state.sort((a, b) => b.likes - a.likes)
    },
    likeBlog(state, action) {
      state.map(b => b.id !== action.payload.id ? b : action.payload.likedBlog)
    },
    removeBlog(state, action) {
      state.filter(b => b.id === action.payload)
    }
  }
})

export const { appendBlog, setBlogs, sortBlogs, likeBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
    dispatch(sortBlogs())
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const savedBlog = await blogService.create(blog)
    dispatch(appendBlog(savedBlog))
  }
}

export const like = (id, obj) => {
  return async dispatch => {
    const likedBlog = await blogService.update(id, obj)
    dispatch(likeBlog({ id, likedBlog }))
    dispatch(initializeBlogs())
  }
}

export const remove = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer