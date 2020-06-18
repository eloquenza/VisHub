import React from 'react'
import {BaseVisualizationArrayState, ChartProps} from 'typedecls/ReactPropsAndStates'
import {D3Chart} from 'visualizationHelpers'

export default class Chart<DataType> extends React.Component<ChartProps<DataType>, BaseVisualizationArrayState<DataType>> {
  ref!: SVGSVGElement
  chart: D3Chart<DataType>

  constructor(props: ChartProps<DataType>) {
    super(props)
    this.state = {
      data: this.props.loadData()
    }
    this.chart = new D3Chart(this.props.useLogScale)
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
