import React from 'react'
import * as d3 from 'd3'
import {D3Types} from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

interface LabelsProps {
  vertices: D3Types.Vertex[]
}

interface SingleLabelProps {
  vertex: D3Types.Vertex
}

class Label extends React.Component<SingleLabelProps, {}> {
  // Note the definite assignment operator `!` to relay to Typescript
  // that this variable has definitely been assigned for all
  // intents and purposes
  ref!: SVGTextElement

  componentDidMount() {
    d3.select(this.ref).data([this.props.vertex])
  }

  render() {
    return (
      <text
        className="label"
        ref={(ref: SVGTextElement) => {
          this.ref = ref
        }}
      >
        {this.props.vertex.id}
      </text>
    )
  }
}

function Labels({vertices}: LabelsProps) {
  const labelComponents = vertices.map(
    (vertex: D3Types.Vertex, index: number) => (
      <Label key={generateReactKey('labels', index)} vertex={vertex} />
    )
  )

  return <g className="labels">{labelComponents}</g>
}

export default Labels
