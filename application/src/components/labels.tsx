import * as React from 'react'
import * as d3 from 'd3'
import {d3Types} from 'typedecls'

interface LabelsProps {
  nodes: d3Types.SimulationNode[]
}

interface SingleLabelProps {
  node: d3Types.SimulationNode
}

class Label extends React.Component<SingleLabelProps, {}> {
  readonly ref: React.RefObject<SVGTextElement> = React.createRef()

  componentDidMount() {
    d3.select(this.ref.current).data([this.props.node])
  }

  render() {
    return (
      <text className="label" ref={this.ref}>
        {this.props.node.id}
      </text>
    )
  }
}

export default class Labels extends React.Component<LabelsProps, {}> {
  render() {
    const labels = this.props.nodes.map(
      (node: d3Types.SimulationNode, index: number) => {
        return <Label key={index} node={node} />
      }
    )

    return <g className="labels">{labels}</g>
  }
}
