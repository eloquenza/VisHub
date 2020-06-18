import React from 'react'
import { AuthorNetwork } from 'components'
import { Chart } from 'components/visualizations'

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

        {/* Charts */}
        <div className="column is-4">
          <div className="panel">
            <h3>Chart1</h3>
            <Chart
              window={{ width: window.innerWidth / 3.5, height: window.innerHeight }}
              className="chart1"
            />
          </div>
        </div>
        <div className="column is-4">
          <div className="panel">
            <h3>Chart2</h3>
            <Chart
              window={{ width: window.innerWidth / 3.5, height: window.innerHeight }}
              className="chart2"
            />
          </div>
        </div>
        <div className="column is-4">
          <div className="panel">
            <h3>Chart3</h3>
            <Chart
              window={{ width: window.innerWidth / 3.5, height: window.innerHeight }}
              className="chart3"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Users
