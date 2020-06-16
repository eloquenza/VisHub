import {Graph, Vertex} from 'typedecls/D3Types'
import {D3EdgeBundlingGraph} from 'visualizationHelpers/D3EdgeBundlingGraph'
import {D3ForceGraph} from 'visualizationHelpers/D3ForceGraph'
import {EdgeBundlingNode, ChartDatum} from './D3Types'
import {ContainerDimensions} from './CssStyleTypes'
import { D3Graph } from 'visualizationHelpers/D3Graph'

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
}

export interface GraphState {
  data: Graph | EdgeBundlingNode
}
