import React from 'react'

const DashboardBodyPage = async () => {

  await new Promise((resolve) => setTimeout(resolve, 2000))
  return (
    <div>DashboardBodyPage</div>
  )
}

export default DashboardBodyPage