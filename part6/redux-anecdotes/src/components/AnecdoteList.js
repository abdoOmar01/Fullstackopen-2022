import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/messageReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const anecdotesToShow =
    anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))

  const voteHandler = (id) => {
    const anecdote = anecdotes.find(a => a.id === id)
    const obj = {
      content: anecdote.content,
      id,
      votes: anecdote.votes + 1
    }

    dispatch(vote(id, obj))
    dispatch(setNotification(`you voted ${anecdote.content}`, 5))
  }

  return (
    <div>
      {anecdotesToShow.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => voteHandler(anecdote.id)}
          />
        )}
    </div>
  )
}

export default AnecdoteList