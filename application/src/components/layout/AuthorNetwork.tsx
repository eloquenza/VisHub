import React from 'react'
import * as d3 from 'd3'

import {Vertex, EdgeBundlingNode} from 'typedecls/D3Types'
import {transformGraphIntoTree, bilinks} from 'utils/dataTransformation'
import {
  D3EdgeBundlingGraph,
  D3ForceGraph,
  D3SearchStrategy,
} from 'visualizationHelpers'
import {ClassElementNames} from 'appConstants'

import styles from 'styles/AuthorNetwork.module.css'

import GraphComponent from 'components/visualizations/GraphComponent'
import data from '../../miserables'

interface AuthorNetworkProps {
  width: number
  height: number
}

function loadTreeRoot() {
  const treeifiedGraph = transformGraphIntoTree(data)
  const hierarchy = d3
    .hierarchy(treeifiedGraph)
    .sort((a, b) => d3.ascending(a.data.id, b.data.id)) as EdgeBundlingNode
  return bilinks(hierarchy)
}

const root = loadTreeRoot()

type GraphTypes = 'force' | 'edgebundling'
type VertexType = Vertex | EdgeBundlingNode

interface AuthorNetworkState {
  currentGraphName: GraphTypes
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
      currentGraphName: 'force',
      searchInput: '',
      networkVisualisation: this.forceGraphComponent,
      searchStrategy: this.forceGraphFactory.searchStrategy,
    }
  }

  onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const graphType = event.currentTarget.value as GraphTypes
    this.setState(state => {
      switch (state.currentGraphName) {
        case 'force':
          return {
            networkVisualisation: this.edgeBundlingGraphComponent,
            searchStrategy: this.edgeBundlingGraphFactory.searchStrategy,
            currentGraphName: graphType,
          }
        case 'edgebundling':
          return {
            networkVisualisation: this.forceGraphComponent,
            searchStrategy: this.forceGraphFactory.searchStrategy,
            currentGraphName: graphType,
          }
      }
    })
  }

  createForceGraphComponent() {
    this.forceGraphFactory = new D3ForceGraph()

    return (
      <GraphComponent
        window={{width: window.innerWidth, height: window.innerHeight}}
        containerClassName={ClassElementNames.forceDirectedClassName}
        data={data}
        graphFactory={this.forceGraphFactory}
      />
    )
  }

  createEdgeBundlingGraph() {
    this.edgeBundlingGraphFactory = new D3EdgeBundlingGraph(root)

    return (
      <GraphComponent
        window={{width: window.innerWidth, height: window.innerHeight}}
        containerClassName={ClassElementNames.edgeBundlingClassName}
        data={root}
        graphFactory={this.edgeBundlingGraphFactory}
      />
    )
  }

  searchForAuthor(searchTerm: string) {
    this.state.searchStrategy.search(data.vertices, searchTerm)
  }

  searchBarOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget.value
    this.setState({
      searchInput: input,
    })
    this.searchForAuthor(input)
  }

  render() {
    const verticesForSelection = data.vertices.map(vertex => (
      <option value={vertex.id} />
    ))

    return (
      <div className={styles.authorNetworkContainer}>
        <div className={styles.authorNetworkMenuBar}>

          { /* Textfeld */ }
          <div className={styles.authorNetworkInline}>
            <text>Search by author name:&nbsp;</text>
            <input
              type="text"
              value={this.state.searchInput}
              onChange={event => this.searchBarOnChange(event)}
              list="test" />
            <datalist id="test">{verticesForSelection}</datalist>
          </div>

          { /* Dropdown */ }
          <div className={styles.authorNetworkInline}>
            <text>Graphentyp:&nbsp;</text>
            <select
              onChange={event => this.onSelectChange(event)}>
              <option value="force">Force-directed graph</option>
              <option value="edgebundling">Radial edge-bundling graph</option>
            </select>
          </div>

        </div>
        {this.state.networkVisualisation}
      </div>
    )
  }
}
