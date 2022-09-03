import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog tests', () => {
  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      user: 'id',
      title: 'New blog',
      author: 'abdo',
      url: 'url',
      likes: 12,
    }

    container = render(<Blog blog={blog} like={mockHandler} />).container
  })

  test('blog displays title and author by default', () => {
    const element = screen.getByText('New blog by abdo')
    const detailsDiv = container.querySelector('.details')

    expect(element).toBeDefined()
    expect(detailsDiv).toHaveStyle('display: none')
  })

  test('url and likes are shown after button click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('Url: url', { exact: false })
    const likesElement = screen.getByText('Likes: 12', { exact: false })
    const detailsDiv = container.querySelector('.details')

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
    expect(detailsDiv).not.toHaveStyle('display: none')
  })

  test('successfully clicks the like button twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
