import React from 'react'
import * as d3 from 'd3'
import {D3Types} from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

interface EdgesProps {
  edges: D3Types.Edge[]
}

interface SingleEdgeProps {
  edge: D3Types.Edge
}

class Edge extends React.Component<SingleEdgeProps, {}> {
  // Note the definite assignment operator `!` to relay to Typescript
  // that this variable has definitely been assigned for all
  // intents and purposes
  ref!: SVGLineElement

  componentDidMount() {
    d3.select(this.ref)
      .data([this.props.edge])
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
  }

  render() {
    return (
      <line
        className="edge"
        ref={(ref: SVGLineElement) => {
          this.ref = ref
        }}
      />
    )
  }
}

function Edges({edges}: EdgesProps) {
  const edgeComponents = edges.map((edge: D3Types.Edge, index: number) => (
    <Edge key={generateReactKey(edges, index)} edge={edge} />
  ))

  return <g className="edges">{edgeComponents}</g>
}

export default Edges
