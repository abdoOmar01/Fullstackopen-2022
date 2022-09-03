import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import blogService from '../services/blogs'

const Blog = ({ like }) => {
  const id = useParams().id
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const [comment, setComment] = useState('')

  if (!blog) {
    return null
  }

  const handleLike = async () => {
    const newLikes = blog.likes + 1

    const newBlog = {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    like(blog.id, newBlog)
  }

  const handleChange = (event) => {
    setComment(event.target.value)
  }

  const addComment = async (event) => {
    event.preventDefault()
    await blogService.comment(blog.id, comment)
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <br />
      <a href={`${blog.url}`}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
      <p>added by {blog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input type="text" onChange={handleChange} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map(c =>
          <li key={c}>{c}</li>
        )}
      </ul>
    </div>
  )
}

export default Blog