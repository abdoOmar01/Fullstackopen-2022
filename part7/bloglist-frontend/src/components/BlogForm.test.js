import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form handler is successfully called', async () => {
  const mockHandler = jest.fn()

  render(<BlogForm createBlog={mockHandler} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  const user = userEvent.setup()

  await user.type(titleInput, 'a new blog')
  await user.type(authorInput, 'abdo')
  await user.type(urlInput, 'url')
  await user.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
