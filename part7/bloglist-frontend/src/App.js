import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/messageReducer'
import { initializeBlogs, createBlog, like } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/loginReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Alert } from 'react-bootstrap'
import Menu from './components/Menu'
import Blogs from './components/Blogs'
//import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import { BrowserRouter as Router,
  Route,
  Routes } from 'react-router-dom'
import Blog from './components/Blog'

const App = () => {
  const dispatch = useDispatch()
  const message = useSelector(state => state.message)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [])

  const handleLogin = async (newUser) => {
    dispatch(login(newUser))
  }

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blog))
      dispatch(setNotification(`A new blog '${blog.title}' added`, false, 5))
    } catch (exception) {
      dispatch(setNotification('Make sure that all fields are correct', true, 5))
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleLike = (id, blog) => {
    dispatch(like(id, blog))
  }

  return (
    <Router>
      {(message.content &&
        <Alert variant={message.isError ? 'warning' : 'success'}>
          {message.content}
        </Alert>
      )}

      {user === null ? (
        <div className='container'>
          <LoginForm login={handleLogin} />
        </div>

      ) : (
        <div className='container'>
          <Menu user={user} logout={handleLogout} />
          <h2>Blog app</h2>
          <Routes>
            <Route path="/" element={
              <div>
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
                <br />
                <Blogs blogs={blogs} />
              </div>
            } />

            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/blogs/:id" element={<Blog blogs={blogs} like={handleLike} />} />
          </Routes>
          <br />
        </div>
      )}
    </Router>
  )
}

export default App