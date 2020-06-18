import React from 'react'
import { AuthorNetwork } from 'components'

function Users() {
  return (
    <>
      <div className="columns">
        
        {/* AuthorNetwork */}
        <div className="column is-full">
          <div className="panel">
            <AuthorNetwork width={window.innerWidth} height={window.innerHeight} />
          </div>
        </div>

      </div>
    </>
  )
}

export default Users
