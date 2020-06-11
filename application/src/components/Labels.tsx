import React from 'react'
import * as d3 from 'd3'
import D3Types from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

interface LabelsProps {
  vertices: D3Types.Vertex[]
}

interface SingleLabelProps {
  vertex: D3Types.Vertex
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
    (vertex: D3Types.Vertex, index: number) => (
      <Label key={generateReactKey(vertices, index)} vertex={vertex} />
    )
  )

  return <g className="labels">{labelComponents}</g>
}

export default Labels
