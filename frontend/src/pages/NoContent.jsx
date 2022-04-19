import React from 'react'
import {Link} from 'react-router-dom'

const NoContent = () => {
  return (
      <>
        <Link to='/' className='btn btn-light my-3'>Go Back</Link>
        <h2>Nothing to see Here</h2>
      </>
  )
}

export default NoContent