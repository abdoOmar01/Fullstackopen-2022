import { Link } from 'react-router-dom'

const Menu = ({ user, logout }) => {
  const style = {
    backgroundColor: 'lightgrey',
    padding: 10
  }
  const padding = {
    padding: 5
  }

  const displayUser = () => (
    user
      ? <span style={padding}>
        {user.name} logged in <button onClick={logout}>logout</button>
      </span>
      : null
  )

  return (
    <div style={style}>
      <Link to="/" style={padding}>blogs</Link>
      <Link to="/users" style={padding}>users</Link>
      {displayUser()}
    </div>
  )
}

export default Menu