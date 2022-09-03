import { Link } from 'react-router-dom'

const Blogs = ({ blogs }) => {
  const style = {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    margin: 5,
  }

  return (
    <div>
      {blogs.map(b =>
        <div key={b.id} style={style}>
          <Link to={`/blogs/${b.id}`}>{b.title}</Link>
        </div>
      )}
    </div>
  )
}

export default Blogs