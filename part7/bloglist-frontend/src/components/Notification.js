const Notification = ({ message, isError }) => {
  const defaultStyle = {
    backgroundColor: 'lightgrey',
    color: 'green',
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: 'green',
  }

  const errorStyle = {
    ...defaultStyle,
    color: 'red',
    borderColor: 'red',
  }

  if (message === '') {
    return null
  }

  return (
    <div className="message" style={isError ? errorStyle : defaultStyle}>
      {message}
    </div>
  )
}

// eslint-disable-next-line
export default Notification;
