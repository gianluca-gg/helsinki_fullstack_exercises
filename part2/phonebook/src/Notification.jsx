const Notification = ({ messageError, messageSuccess }) => {
    const className = messageError ? 'error' : 'success'

 if (!messageError && !messageSuccess) return null
  return <div className={className}>{messageError ?? messageSuccess}</div>
}

export default Notification