import React from 'react'
import * as d3 from 'd3'
import D3Types from 'typedecls'
import generateReactKey from 'utils/reactKeyGeneration'

interface VerticesProps {
  vertices: D3Types.Vertex[]
  simulation: any
}

interface SingleVertexProps {
  vertex: D3Types.Vertex
  color: string
}

class Vertex extends React.Component<SingleVertexProps, {}> {
  readonly ref: React.RefObject<SVGCircleElement> = React.createRef()

  componentDidMount() {
    d3.select(this.ref.current).data([this.props.vertex])
  }

  render() {
    return (
      <circle className="vertex" r={5} fill={this.props.color} ref={this.ref}>
        <title>{this.props.vertex.id}</title>
      </circle>
    )
  }
}

export default class Vertices extends React.Component<VerticesProps, {}> {
  componentDidMount() {
    const {simulation} = this.props
    // https://stackoverflow.com/questions/44472945/d3-js-and-typescript-compilation-error/44523718#44523718
    d3.selectAll<SVGCircleElement, D3Types.Vertex>('.vertex').call(
      d3
        .drag<SVGCircleElement, D3Types.Vertex>()
        .on('start', (d: D3Types.Vertex) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart()
          }
          d.fx = d.x // eslint-disable-line no-param-reassign
          d.fy = d.y // eslint-disable-line no-param-reassign
        })
        .on('drag', (d: D3Types.Vertex) => {
          d.fx = d3.event.x // eslint-disable-line no-param-reassign
          d.fy = d3.event.y // eslint-disable-line no-param-reassign
        })
        .on('end', (d: D3Types.Vertex) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0)
          }
          d.fx = null // eslint-disable-line no-param-reassign
          d.fy = null // eslint-disable-line no-param-reassign
        })
    )
  }

  render() {
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    const vertices = this.props.vertices.map(
      (vertex: D3Types.Vertex, index: number) => {
        if (typeof vertex.group === 'undefined') {
          return (
            <Vertex
              key={generateReactKey(this.props.vertices, index)}
              vertex={vertex}
              color={color('undefined')}
            />
          )
        }
        return (
          <Vertex
            key={generateReactKey(this.props.vertices, index)}
            vertex={vertex}
            color={color(vertex.group.toString())}
          />
        )
      }
    )

    return <g className="vertices">{vertices}</g>
  }
}
