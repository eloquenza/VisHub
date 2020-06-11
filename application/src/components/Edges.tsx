import React from 'react'
import * as d3 from 'd3'
import D3Types from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

interface EdgesProps {
  edges: D3Types.Edge[]
}

interface SingleEdgeProps {
  edge: D3Types.Edge
}

class Edge extends React.Component<SingleEdgeProps, {}> {
  readonly ref: React.RefObject<SVGLineElement> = React.createRef()

  componentDidMount() {
    d3.select(this.ref.current)
      .data([this.props.edge])
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
  }

  render() {
    return <line className="edge" ref={this.ref} />
  }
}

function Edges({edges}: EdgesProps) {
  const edgeComponents = edges.map((edge: D3Types.Edge, index: number) => (
    <Edge key={generateReactKey(edges, index)} edge={edge} />
  ))

  return <g className="edges">{edgeComponents}</g>
}

export default Edges
