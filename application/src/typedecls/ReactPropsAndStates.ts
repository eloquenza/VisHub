import {Graph, Vertex} from 'typedecls/D3Types'
import {D3Graph} from 'visualizationHelpers/D3Graph'
import {EdgeBundlingNode, ChartDatum} from './D3Types'
import {ContainerDimensions} from './CssStyleTypes'

export type ChildrenProps = {
  children?: React.ReactNode
}

export interface BaseVisualizationProps {
  window: ContainerDimensions
  className: string
}

export interface BaseVisualizationDataArrayLoader<DataType> extends BaseVisualizationProps {
  loadData: () => DataType[]
}

export interface BaseVisualizationDataSingleLoader<DataType> extends BaseVisualizationProps {
  loadData: () => DataType
}

export interface ChartProps<DataType> extends BaseVisualizationDataArrayLoader<DataType> {
  useLogScale: boolean
}

export interface BaseVisualizationDefaultState {}

export interface BaseVisualizationArrayState<DataType> extends BaseVisualizationDefaultState {
  data: DataType[]
}

export interface BaseVisualizationSingleState<DataType> extends BaseVisualizationDefaultState {
  data: DataType
}

export interface ChartState extends BaseVisualizationArrayState<ChartDatum[]> { }

type GraphDataType = Graph | EdgeBundlingNode

export interface GraphProps extends BaseVisualizationProps,BaseVisualizationDataSingleLoader<GraphDataType>  {
  graphFactory: D3Graph<Vertex | EdgeBundlingNode>
  setSearchCallbackFunction: (callback: (allVertices: Vertex[], searchTerm: string) => void) => void
}

export interface GraphState extends BaseVisualizationSingleState<GraphDataType> { }

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
