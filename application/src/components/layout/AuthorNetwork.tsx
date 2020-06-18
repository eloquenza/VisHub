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

interface AuthorNetworkProps {
  width: number
  height: number
}

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

type GraphTypes = 'force' | 'edgebundling' | '3dforce'

interface AuthorNetworkState {
  currentGraphName: GraphTypes
  searchInput: string
  networkVisualisation: React.ReactNode
  searchCallback: (allVertices: Vertex[], searchTerm: string) => void
}

export default class AuthorNetwork extends React.Component<
  AuthorNetworkProps,
  AuthorNetworkState
> {
  forceGraphComponent: React.ReactNode
  edgeBundlingGraphComponent: React.ReactNode
  threeDimensionalForceGraphComponent: React.ReactNode

  constructor(props: AuthorNetworkProps) {
    super(props)
    this.forceGraphComponent = this.createForceGraphComponent()
    this.edgeBundlingGraphComponent = this.createEdgeBundlingGraph()
    this.threeDimensionalForceGraphComponent= <ForceGraph3D key={generateReactKey('3dforceGraph', 1)} graphData={{ nodes: data.vertices, links: data.edges }}/>
    this.state = {
      currentGraphName: 'force',
      searchInput: '',
      networkVisualisation: this.forceGraphComponent,
      searchCallback: (allVertices: Vertex[], searchTerm: string) => {}
    }
  }

  onRadioButtonSwitchGraph(event: React.ChangeEvent<HTMLInputElement>) {
    const graphType = event.currentTarget.value as GraphTypes
    console.log(graphType)
    this.setState(state => {
      switch (graphType) {
        case 'force':
          return {
            networkVisualisation: this.forceGraphComponent,
            searchInput: '',
            currentGraphName: graphType,
          }
        case 'edgebundling':
          return {
            networkVisualisation: this.edgeBundlingGraphComponent,
            searchInput: '',
            currentGraphName: graphType,
          }
        case '3dforce':
          return {
            networkVisualisation: this.threeDimensionalForceGraphComponent,
            searchInput: '',
            currentGraphName: graphType,
          }
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
      <option value={vertex.id} />
    ))

    return (
      <div className={styles.authorNetworkContainer}>
        <div className={styles.authorNetworkMenuBar}>
          <text>Search by author name</text>
          <input
            type="text"
            value={this.state.searchInput}
            onChange={event => this.searchBarOnUserInput(event)}
            list="test"
          />
          <datalist id="test">{verticesForSelection}</datalist>
          <div className={styles.authorNetworkRadioButtons}>
            Force-directed graph
            <input
              id="force"
              value="force"
              type="radio"
              checked={this.state.currentGraphName === 'force'}
              onChange={event => this.onRadioButtonSwitchGraph(event)}
            />
            3D Force-directed graph
            <input
              id="3dforce"
              value="3dforce"
              type="radio"
              checked={this.state.currentGraphName === '3dforce'}
              onChange={event => this.onRadioButtonSwitchGraph(event)}
            />
            Radial edge-bundling graph
            <input
              id="edgebundling"
              value="edgebundling"
              type="radio"
              checked={this.state.currentGraphName === 'edgebundling'}
              onChange={event => this.onRadioButtonSwitchGraph(event)}
            />
          </div>
        </div>
        {this.state.networkVisualisation}
      </div>
    )
  }
}
