import React from 'react'
import {BaseVisualizationDataArrayLoader, BaseVisualizationArrayState} from 'typedecls/ReactPropsAndStates'

import { PieChartDatum } from 'typedecls/D3Types'
import D3PieChart from 'visualizationHelpers/D3PieChart'

export default class PieChart extends React.Component<BaseVisualizationDataArrayLoader<PieChartDatum>, BaseVisualizationArrayState<PieChartDatum>> {
  ref!: SVGSVGElement
  chart: D3PieChart

  constructor(props: BaseVisualizationDataArrayLoader<PieChartDatum>) {
    super(props)
    this.state = {
      data: this.props.loadData(),
    }
    this.chart = new D3PieChart(props, this.state)
  }

  componentDidMount() {
    this.chart.create(this.ref, this.props, this.state)
  }

  componentDidUpdate() {
    this.chart.update(this.ref, this.props, this.state)
  }

  componentWillUnmount() {
    this.chart.destroy(this.ref)
  }

  render() {
    return (
      <svg
        className={this.props.className}
        ref={(ref: SVGSVGElement) => {
          this.ref = ref
        }}
      />
    )
  }
}
