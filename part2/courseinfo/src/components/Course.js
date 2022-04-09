const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <h3>total of {sum} exercises</h3>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part part={part} key={part.id}/>)}
    </div>
  )
}

const Course = ({course}) => {

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={course.parts.reduce((total, part) => total + part.exercises, 0)} />
    </div>
  )
}

export default Course