import React from 'react'
import {AuthorNetwork} from 'components'
import {Chart} from 'components/visualizations'
import {Box} from 'rebass'

function Users() {
  return (
    <>
      <AuthorNetwork
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <Box
        sx={{
          display: 'grid',
          gridGap: 3,
          // repeat creates a sequence of 3 times 1fr
          // fr is a new unit denoting a fraction of the grid
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto auto auto',
        }}
      >
        <h1>Chart1</h1>
        <h1>Chart2</h1>
        <h1>Chart3</h1>
        <Chart
          window={{width: window.innerWidth / 3.5, height: window.innerHeight}}
          className="chart1"
        />

        <Chart
          window={{width: window.innerWidth / 3.5, height: window.innerHeight}}
          className="chart2"
        />

        <Chart
          window={{width: window.innerWidth / 3.5, height: window.innerHeight}}
          className="chart3"
        />
      </Box>
    </>
  )
}

export default Users
