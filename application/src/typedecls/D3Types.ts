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

export class Edge implements d3.SimulationLinkDatum<Vertex> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number

  // must - defining enforced implementation properties
  source: Vertex | string | number
  target: Vertex | string | number

  value: number

  constructor(
    source: string | number | Vertex,
    target: string | number | Vertex,
    value: number
  ) {
    this.source = source
    this.target = target
    this.value = value
  }
}

export type Graph = {
  vertices: Vertex[]
  edges: Edge[]
}
