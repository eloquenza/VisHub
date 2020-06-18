import * as d3 from 'd3'

export class Vertex implements d3.SimulationNodeDatum {
  index?: number
  x?: number
  y?: number
  z?: number
  vx?: number
  vy?: number
  vz?: number
  fx?: number | null
  fy?: number | null
  fz?: number | null

  id: number
  name?: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}

export type vertexWithAllDecendants = Vertex & {
  targets: number[]
}

export class Edge implements d3.SimulationLinkDatum<Vertex> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number

  // must - defining enforced implementation properties
  source: Vertex | number
  target: Vertex | number

  constructor(source: Vertex, target: Vertex, value: number) {
    this.source = source
    this.target = target
  }
}

export interface ChartDatum {
  name: Date
  value: number
}

export interface PieChartDatum {
  name: string
  value: number
}

export type Graph = {
  vertices: Vertex[]
  edges: Edge[]
}

export type NodeElem = {
  id: number
  name: string
  targets: number[]
  children?: vertexWithAllDecendants[]
}

export interface EdgeBundlingEdge {
  source: EdgeBundlingNode
  target: EdgeBundlingNode
  svgPath: SVGPathElement
}

export interface EdgeBundlingNode extends d3.HierarchyPointNode<NodeElem> {
  text: SVGTextElement
  following: EdgeBundlingEdge[]
  followers: EdgeBundlingEdge[]
  x: number
  y: number
}
