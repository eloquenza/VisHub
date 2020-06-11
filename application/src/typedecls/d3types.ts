import * as d3 from 'd3'

export class SimulationNode implements d3.SimulationNodeDatum {
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

export class SimulationLink
  implements d3.SimulationLinkDatum<SimulationNode> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number

  // must - defining enforced implementation properties
  source: SimulationNode | string | number
  target: SimulationNode | string | number

  value: number

  constructor(
    source: string | number | SimulationNode,
    target: string | number | SimulationNode,
    value: number
  ) {
    this.source = source
    this.target = target
    this.value = value
  }
}

export type Graph = {
  nodes: SimulationNode[]
  links: SimulationLink[]
}
