import React from 'react'
import * as d3 from 'd3'

import {ForceDirectedGraph, EdgeBundling} from 'components'
import {Vertex, EdgeBundlingNode, Graph} from 'typedecls/D3Types'
import {transformGraphIntoTree, bilinks} from 'utils/dataTransformation'
import {
  D3EdgeBundlingGraph,
  D3ForceGraph,
  D3SearchStrategy,
} from 'visualizationHelpers'

import styles from 'styles/AuthorNetwork.module.css'

interface AuthorNetworkProps {
  width: number
  height: number
  graph: Graph
}

type GraphTypes = 'force' | 'edgebundling'
type VertexType = Vertex | EdgeBundlingNode

interface AuthorNetworkState {
  graphName: GraphTypes
  searchInput: string
  networkVisualisation: React.ReactNode
  searchStrategy: D3SearchStrategy<VertexType>
}

export default class AuthorNetwork extends React.Component<
  AuthorNetworkProps,
  AuthorNetworkState
> {
  forceGraphComponent: React.ReactNode
  edgeBundlingGraphComponent: React.ReactNode
  edgeBundlingGraphFactory!: D3EdgeBundlingGraph
  forceGraphFactory!: D3ForceGraph

  constructor(props: AuthorNetworkProps) {
    super(props)
    this.forceGraphComponent = this.createForceGraphComponent()
    this.edgeBundlingGraphComponent = this.createEdgeBundlingGraph()
    this.state = {
      graphName: 'edgebundling',
      searchInput: '',
      networkVisualisation: this.edgeBundlingGraphComponent,
      searchStrategy: this.edgeBundlingGraphFactory.searchStrategy,
    }
  }

  onRadioButtonSwitchGraph(event: React.ChangeEvent<HTMLInputElement>) {
    const graphType = event.currentTarget.value as GraphTypes
    this.setState(state => {
      switch (state.graphName) {
        case 'force':
          return {
            networkVisualisation: this.edgeBundlingGraphComponent,
            searchStrategy: this.edgeBundlingGraphFactory.searchStrategy,
            graphName: graphType,
          }
        case 'edgebundling':
          return {
            networkVisualisation: this.forceGraphComponent,
            searchStrategy: this.forceGraphFactory.searchStrategy,
            graphName: graphType,
          }
      }
    })
  }

  createForceGraphComponent() {
    this.forceGraphFactory = new D3ForceGraph()

    return (
      <ForceDirectedGraph
        width={window.innerWidth}
        height={window.innerHeight}
        graph={this.props.graph}
        graphFactory={this.forceGraphFactory}
      />
    )
  }

  createEdgeBundlingGraph() {
    const treeifiedGraph = transformGraphIntoTree(this.props.graph)
    const hierarchy = d3
      .hierarchy(treeifiedGraph)
      .sort((a, b) => d3.ascending(a.data.id, b.data.id)) as EdgeBundlingNode

    const root = bilinks(hierarchy)

    this.edgeBundlingGraphFactory = new D3EdgeBundlingGraph(root)

    return (
      <EdgeBundling
        width={window.innerWidth}
        height={window.innerHeight}
        root={root}
        graphFactory={this.edgeBundlingGraphFactory}
      />
    )
  }

  searchForAuthor(searchTerm: string) {
    this.state.searchStrategy.search(this.props.graph.vertices, searchTerm)
  }

  searchBarOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget.value
    this.setState({
      searchInput: input,
    })
    this.searchForAuthor(input)
  }

  render() {
    const verticesForSelection = this.props.graph.vertices.map(vertex => (
      <option value={vertex.id} />
    ))

    return (
      <div className={styles.authorNetworkContainer}>
        <div className={styles.authorNetworkMenuBar}>
          <text>Search by author name</text>
          <input
            type="text"
            value={this.state.searchInput}
            onChange={event => this.searchBarOnChange(event)}
            list="test"
          />
          <datalist id="test">{verticesForSelection}</datalist>
          <div className={styles.authorNetworkRadioButtons}>
            Force-directed graph
            <input
              id="force"
              value="force"
              type="radio"
              checked={this.state.graphName === 'force'}
              onChange={event => this.onRadioButtonSwitchGraph(event)}
            />
            Radial edge-bundling graph
            <input
              id="edgebundling"
              value="edgebundling"
              type="radio"
              checked={this.state.graphName === 'edgebundling'}
              onChange={event => this.onRadioButtonSwitchGraph(event)}
            />
          </div>
        </div>
        {this.state.networkVisualisation}
      </div>
    )
  }
}
