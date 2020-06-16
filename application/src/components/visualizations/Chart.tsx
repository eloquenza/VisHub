import React from 'react'
import {ChartProps, ChartState} from 'typedecls/ReactPropsAndStates'
import {D3Chart} from 'visualizationHelpers'
import data from '../../aapl'

export default class Chart extends React.Component<ChartProps, ChartState> {
  ref!: SVGSVGElement
  chart: D3Chart

  constructor(props: ChartProps) {
    super(props)
    this.state = {
      data: data.data.map(({date, close}) => ({date: new Date(date), close})),
    }
    this.chart = new D3Chart()
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
    const {window} = this.props
    return (
      <svg
        width={window.width}
        height={window.height}
        ref={(ref: SVGSVGElement) => {
          this.ref = ref
        }}
      />
    )
  }
}
