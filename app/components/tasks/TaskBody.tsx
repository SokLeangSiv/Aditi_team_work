import React from 'react'

const TaskBodyPage = async() => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  return (
    <div>TaskBody</div>
  )
}

export default TaskBodyPage