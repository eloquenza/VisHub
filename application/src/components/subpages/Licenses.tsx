import React from 'react'
import PieChart from 'components/visualizations/PieChart'

import data from '../../data/licenses.json'
import { Chart } from 'components'
import { PieChartDatum } from 'typedecls/D3Types'

function Licenses() {
  return (
    <div className="columns">
      <div>
        <h1>Amount of licences used in GitHub projects</h1>
        <h2>... as a pie chart</h2>
      </div>
      <div className="column is-full">
        <div className="panel">
          <PieChart
            window={{width: window.innerWidth, height: window.innerHeight}}
            className="licensePieChart"
            loadData={() => data.map(({name, value}) => {
              return {name: name, value: parseInt(value)}
            })}/>
          </div>
      </div>
      <div>
        <h2>... as a line chart without logarithmic scale</h2>
      </div>
      <div className="column is-full">
      <div className="panel">
          <Chart<PieChartDatum>
            window={{width: window.innerWidth, height: window.innerHeight}}
            className="licenseChart"
            loadData={() => data.map(({name, value}) => {
              return {name: name, value: parseInt(value)}
            })}
            useLogScale={false}
            />
          </div>
      </div>
      <div>
        <h2>... as a line chart with logarithmic scale</h2>
      </div>
      <div className="column is-full">
      <div className="panel">
          <Chart<PieChartDatum>
            window={{width: window.innerWidth, height: window.innerHeight}}
            className="licenseChart"
            loadData={() => data.map(({name, value}) => {
              return {name: name, value: parseInt(value)}
            })}
            useLogScale={true}
            />
          </div>
      </div>
    </div>
  )
}

export default Licenses
