import React from 'react'
import * as d3 from 'd3'
import {D3Types} from 'typedecls'
import {Edges, Vertices, Labels} from 'components'

interface ForceDirectedGraphProps {
  width: number
  height: number
  graph: D3Types.Graph
}

export default class ForceDirectedGraph extends React.Component<
  ForceDirectedGraphProps,
  {}
> {
  simulation: d3.Simulation<D3Types.Vertex, D3Types.Edge>

  constructor(props: ForceDirectedGraphProps) {
    super(props)

    const {width, height, graph} = props
    this.simulation = d3
      .forceSimulation(graph.vertices)
      .force(
        'link',
        d3
          .forceLink(graph.edges)
          .id((d: D3Types.Vertex) => {
            return d.id || 'undefined'
            // return typeof d.id === 'undefined' ? 'undefined' : d.id
          })
          .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  componentDidMount() {
    const {vertices} = this.props.graph
    const vertex = d3.selectAll('.vertex')
    const edge = d3.selectAll('.edge')
    const label = d3.selectAll('.label')

    function ticked() {
      edge
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      vertex.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

      label.attr('x', (d: any) => d.x + 5).attr('y', (d: any) => d.y + 5)
    }

    this.simulation.nodes(vertices).on('tick', ticked)
  }

  render() {
    const {width, height, graph} = this.props
    return (
      <svg className="container" width={width} height={height}>
        <Edges edges={graph.edges} />
        <Vertices vertices={graph.vertices} simulation={this.simulation} />
        <Labels vertices={graph.vertices} />
      </svg>
    )
  }
}
