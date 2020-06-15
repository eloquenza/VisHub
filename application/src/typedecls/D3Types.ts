import * as d3 from 'd3'

export class Vertex implements d3.SimulationNodeDatum {
  index?: number
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null

  id?: string
  group?: number

  constructor(id: string, group: number) {
    this.id = id
    this.group = group
  }
}

export type vertexWithAllDecendants = Vertex & {
  targets: string[]
}

export class Edge implements d3.SimulationLinkDatum<Vertex> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number

  // must - defining enforced implementation properties
  source: Vertex | string
  target: Vertex | string

  value: number

  constructor(source: Vertex, target: Vertex, value: number) {
    this.source = source
    this.target = target
    this.value = value
  }
}

export interface ChartDatum {
  date: Date
  close: number
}

export type Graph = {
  vertices: Vertex[]
  edges: Edge[]
}

export type NodeElem = {
  id: string | number
  group?: number
  targets: string[]
  children?: vertexWithAllDecendants[]
}

export interface EdgeBundlingEdge {
  source: EdgeBundlingNode
  target: EdgeBundlingNode
  svgPath: SVGPathElement
}

export interface EdgeBundlingNode extends d3.HierarchyPointNode<NodeElem> {
  text: SVGTextElement
  incoming: EdgeBundlingEdge[]
  outgoing: EdgeBundlingEdge[]
  x: number
  y: number
}
