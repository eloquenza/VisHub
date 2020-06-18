import {Graph, Vertex} from 'typedecls/D3Types'
import {D3EdgeBundlingGraph} from 'visualizationHelpers/D3EdgeBundlingGraph'
import {D3ForceGraph} from 'visualizationHelpers/D3ForceGraph'
import {D3Graph} from 'visualizationHelpers/D3Graph'
import {EdgeBundlingNode, ChartDatum} from './D3Types'
import {ContainerDimensions} from './CssStyleTypes'

export type ChildrenProps = {
  children?: React.ReactNode
}

export interface ForceDirectedGraphProps {
  width: number
  height: number
  graph: Graph
  graphFactory: D3ForceGraph
}

export interface EdgeBundlingProps {
  width: number
  height: number
  root: EdgeBundlingNode
  graphFactory: D3EdgeBundlingGraph
}

export interface ChartProps {
  window: ContainerDimensions
  className: string
}

export interface ChartState {
  data: ChartDatum[]
}

export interface GraphProps {
  window: ContainerDimensions
  containerClassName: string
  loadData: () => Graph | EdgeBundlingNode
  graphFactory: D3Graph<Vertex | EdgeBundlingNode>
  setSearchCallbackFunction: (callback: (allVertices: Vertex[], searchTerm: string) => void) => void
}

export interface GraphState {
  data: Graph | EdgeBundlingNode
}

export interface AuthorNetworkProps {
  width: number
  height: number
}

// lock down possible graph representation types
export type GraphTypes = 'force' | 'edgebundling' | '3dforce'

export interface AuthorNetworkState {
  currentGraphName: GraphTypes
  searchInput: string
  networkVisualisation: React.ReactNode
  searchCallback: (allVertices: Vertex[], searchTerm: string) => void
}
