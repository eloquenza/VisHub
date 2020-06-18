import React from 'react'
import * as d3 from 'd3'
import ForceGraph3D from 'react-force-graph-3d'

import {Vertex, EdgeBundlingNode} from 'typedecls/D3Types'
import {transformGraphIntoTree, bilinks} from 'utils/dataTransformation'
import {
  D3EdgeBundlingGraph,
  D3ForceGraph,
} from 'visualizationHelpers'
import {ClassElementNames} from 'appConstants'

import styles from 'styles/AuthorNetwork.module.css'

import GraphComponent from 'components/visualizations/GraphComponent'
import data from '../../data/musae_git_data-reduced'
import generateReactKey from 'utils/reactKeyGeneration'
import { AuthorNetworkProps, AuthorNetworkState, GraphTypes } from 'typedecls/ReactPropsAndStates'

// Not possible to create the data for the d3-hierarchy at compile time
// Extracting the data is also not possible because JSON.stringify fails
// due to circular dependencies
function loadTreeRoot() {
  const treeifiedGraph = transformGraphIntoTree(data)
  const hierarchy = d3
    .hierarchy(treeifiedGraph)
    .sort((a, b) => d3.ascending(a.data.id, b.data.id)) as EdgeBundlingNode
  return bilinks(hierarchy)
}

const root = loadTreeRoot()

export default class AuthorNetwork extends React.Component<
  AuthorNetworkProps,
  AuthorNetworkState
> {
  forceGraphComponent: React.ReactNode
  edgeBundlingGraphComponent: React.ReactNode
  threeDimensionalForceGraphComponent: React.ReactNode

  constructor(props: AuthorNetworkProps) {
    super(props)
    // create react components as class members to easily switch between them
    this.forceGraphComponent = this.createForceGraphComponent()
    this.edgeBundlingGraphComponent = this.createEdgeBundlingGraph()
    // this is enabled by the dependency react-force-graph-3d
    // Normally I would have not resorted to using a 'does it all package'
    // due to the project's context in a university module about
    // exactly this topics but I had severe problems to get a 3D graph
    // working as in my original version the canvas element simply
    // did not want to be visible on the web page
    this.threeDimensionalForceGraphComponent = <ForceGraph3D
      key={generateReactKey('3dforceGraph', 1)}
      graphData={{ nodes: data.vertices, links: data.edges }}
    />

    this.state = {
      currentGraphName: 'force',
      searchInput: '',
      networkVisualisation: this.forceGraphComponent,
      searchCallback: (allVertices: Vertex[], searchTerm: string) => {}
    }
  }

  onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const graphType = event.currentTarget.value as GraphTypes
    var newRepresentation;
    this.setState(state => {
      switch (graphType) {
        case 'force':
          newRepresentation = this.forceGraphComponent
          break;
        case 'edgebundling':
          newRepresentation = this.edgeBundlingGraphComponent
          break;
        case '3dforce':
          newRepresentation = this.threeDimensionalForceGraphComponent
      }
      return {
        networkVisualisation: newRepresentation,
        searchInput: '',
        currentGraphName: graphType,
      }
    })
  }

  createForceGraphComponent() {
    const forceGraphFactory = new D3ForceGraph()

    return (
      <GraphComponent
        key={generateReactKey('forceGraph', 1)}
        window={{width: window.innerWidth, height: window.innerHeight}}
        containerClassName={ClassElementNames.forceDirectedClassName}
        loadData={() => data}
        graphFactory={forceGraphFactory}
        setSearchCallbackFunction={this.setSearchCallback.bind(this)}
      />
    )
  }

  createEdgeBundlingGraph() {
    const edgeBundlingGraphFactory = new D3EdgeBundlingGraph(root)

    return (
      <GraphComponent
        key={generateReactKey('edgeBundlingGraph', 1)}
        window={{width: window.innerWidth, height: window.innerHeight}}
        containerClassName={ClassElementNames.edgeBundlingClassName}
        loadData={() => root}
        graphFactory={edgeBundlingGraphFactory}
        setSearchCallbackFunction={this.setSearchCallback.bind(this)}
      />
    )
  }

  setSearchCallback(callback: (allVertices: Vertex[], searchTerm: string) => void) {
      this.setState({
          searchCallback: callback
      })
  }

  searchForAuthor(searchTerm: string) {
    this.state.searchCallback(data.vertices, searchTerm)
  }

  searchBarOnUserInput(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget.value
    this.setState({
      searchInput: input,
    })
    this.searchForAuthor(input)
  }

  render() {
    const verticesForSelection = data.vertices.map(vertex => (
      <option value={vertex.name} />
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
              onChange={event => this.searchBarOnUserInput(event)}
              list="test" />
            <datalist id="test">{verticesForSelection}</datalist>
          </div>

          { /* Dropdown */ }
          <div className={styles.authorNetworkInline}>
            <text>Graph representation:&nbsp;</text>
            <select
              onChange={event => this.onSelectChange(event)}>
              <option value="force">Force-directed graph</option>
              <option value="3dforce">3D Force-directed graph</option>
              <option value="edgebundling">Radial edge-bundling graph</option>
            </select>
          </div>

          <div className={styles.authorNetworkInline}>
            <text># of vertices: {data.vertices.length}&nbsp;</text>
          </div>

          <div className={styles.authorNetworkInline}>
            <text># of edges: {data.edges.length}&nbsp;</text>
          </div>

        </div>
        {this.state.networkVisualisation}
      </div>
    )
  }
}
