import React from 'react'
import * as d3 from 'd3'
import d3Types from 'typedecls'
import {Links, Nodes, Labels} from 'components'

interface AppProps {
  width: number
  height: number
  graph: d3Types.Graph
}

export default class App extends React.Component<AppProps, {}> {
  simulation: d3.Simulation<d3Types.SimulationNode, d3Types.SimulationLink>

  constructor(props: AppProps) {
    super(props)

    const {width, height, graph} = props
    this.simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        'link',
        d3
          .forceLink(graph.links)
          .id((d: d3Types.SimulationNode) => {
            return typeof d.id === 'undefined' ? 'undefined' : d.id
          })
          .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  componentDidMount() {
    const {nodes} = this.props.graph
    const node = d3.selectAll('.node')
    const link = d3.selectAll('.link')
    const label = d3.selectAll('.label')

    function ticked() {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

      label.attr('x', (d: any) => d.x + 5).attr('y', (d: any) => d.y + 5)
    }

    this.simulation.nodes(nodes).on('tick', ticked)
  }

  render() {
    const {width, height, graph} = this.props
    return (
      <svg className="container" width={width} height={height}>
        <Links links={graph.links} />
        <Nodes nodes={graph.nodes} simulation={this.simulation} />
        <Labels nodes={graph.nodes} />
      </svg>
    )
  }
}
