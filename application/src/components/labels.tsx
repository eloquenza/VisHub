import React from 'react'
import * as d3 from 'd3'
import d3Types from 'typedecls'

interface LabelsProps {
  vertices: d3Types.Vertex[]
}

interface SingleLabelProps {
  vertex: d3Types.Vertex
}

class Label extends React.Component<SingleLabelProps, {}> {
  readonly ref: React.RefObject<SVGTextElement> = React.createRef()

  componentDidMount() {
    d3.select(this.ref.current).data([this.props.vertex])
  }

  render() {
    return (
      <text className="label" ref={this.ref}>
        {this.props.vertex.id}
      </text>
    )
  }
}

function Labels({vertices}: LabelsProps) {
  const labelComponents = vertices.map(
    (vertex: d3Types.Vertex, index: number) => (
      <Label key={index} vertex={vertex} />
    )
  )

  return <g className="labels">{labelComponents}</g>
}

export default Labels
