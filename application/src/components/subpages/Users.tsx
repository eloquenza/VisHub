import React from 'react'
import {AuthorNetwork} from 'components'
import data from '../../miserables'

function Users() {
  return (
    <AuthorNetwork
        width={window.innerWidth}
        height={window.innerHeight}
        graph={data}
      />
  )
}

export default Users
