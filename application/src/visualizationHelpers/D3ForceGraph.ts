import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import {Graph, Vertex, Edge} from 'typedecls/D3Types'
import * as d3 from 'd3'

import {ClassElementNames} from 'appConstants'
import {highlightIncidentForceEdges} from 'utils/d3UtilityFunctions'
import {D3Graph} from './D3Graph'
import {D3ForceGraphSearchStrategy} from './D3ForceGraphSearchStrategy'

export class D3ForceGraph extends D3Graph<Vertex> {

  constructor() {
    super()

    this.searchStrategy = new D3ForceGraphSearchStrategy(
      this.highlightSelectedVertex,
      this.dehighlightSelectedVertex
    )
  }

  create(documentElement: Element, props: GraphProps, state: GraphState): void {
    const {width, height} = props.window
    const graph = state.data as Graph
    const {vertices, edges} = graph

    const simulation = this.createSimulation(graph, width, height)
    const parentSVG = this.styleSVG(documentElement, props)
    this.createVertices(parentSVG, simulation, vertices)
    this.createEdges(parentSVG, edges)
    this.createLabels(parentSVG, vertices)

    simulation.nodes(vertices).on('tick', this.onTick)
  }


  styleSVG(documentElement: Element, props: GraphProps) {
    const {width, height} = props.window

    return d3
      .select(documentElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('svg-content-responsive', true)
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  createSimulation(graph: Graph, width: number, height: number) {
    return d3
      .forceSimulation<Vertex, Edge>(graph.vertices)
      .force(
        'link',
        d3
          .forceLink(graph.edges)
          .id(d => (d as Vertex).id || 'undefined')
          .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  createVertices(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    simulation: d3.Simulation<Vertex, Edge>,
    vertices: Vertex[]
  ) {
    console.log(typeof parentSVG)
    console.log(parentSVG)
    console.log("Logging vertices")
    console.log(vertices)
    const circles = parentSVG
      .append('g')
      .selectAll(ClassElementNames.svgCircleElementName)
      .data(vertices)
      .join(ClassElementNames.svgCircleElementName)
    console.log(circles)
    circles
      .attr('r', 5)
      .classed(ClassElementNames.forceVerticesClassName, true)
      .on('mouseover', this.highlightSelectedVertex)
      .on('mouseout', this.dehighlightSelectedVertex)

    d3.selectAll<SVGCircleElement, Vertex>(
      `.${ClassElementNames.forceVerticesClassName}`
    ).call(
      d3
        .drag<SVGCircleElement, Vertex>()
        .on('start', (d: Vertex) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart()
          }
          d.fx = d.x // eslint-disable-line no-param-reassign
          d.fy = d.y // eslint-disable-line no-param-reassign
        })
        .on('drag', (d: Vertex) => {
          d.fx = d3.event.x // eslint-disable-line no-param-reassign
          d.fy = d3.event.y // eslint-disable-line no-param-reassign
        })
        .on('end', (d: Vertex) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0)
          }
          d.fx = null // eslint-disable-line no-param-reassign
          d.fy = null // eslint-disable-line no-param-reassign
        })
    )
  }

  createEdges(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    edges: Edge[]
  ) {
    parentSVG
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll(ClassElementNames.svgLineElementName)
      .data(edges)
      .join(ClassElementNames.svgLineElementName)
      .classed(ClassElementNames.forceEdgesClassName, true)
      .attr('stroke-width', d => Math.sqrt(d.value))
  }

  createLabels(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    vertices: Vertex[]
  ) {
    parentSVG
      .append('g')
      .selectAll(ClassElementNames.svgTextElementName)
      .data(vertices)
      .join(ClassElementNames.svgTextElementName)
      .classed(ClassElementNames.forceLabelsClassName, true)
      .text(d => d.id || 'undefined')
  }

  onTick() {
    d3.selectAll(`.${ClassElementNames.forceEdgesClassName}`)
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    d3.selectAll(`.${ClassElementNames.forceVerticesClassName}`)
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)

    d3.selectAll(`.${ClassElementNames.forceLabelsClassName}`)
      .attr('x', (d: any) => d.x + 5)
      .attr('y', (d: any) => d.y + 5)
  }

  update(documentElement: Element, props: GraphProps, state: GraphState): void {
    console.log(documentElement, props, state)
    throw new Error('Method not implemented.')
  }

  destroy(documentElement: Element): void {
    console.log(documentElement)
    throw new Error('Method not implemented.')
  }

  highlightSelectedVertex(selectedVertex: Vertex): void {
    highlightIncidentForceEdges(selectedVertex, '#00f', 1)
  }

  dehighlightSelectedVertex(selectedVertex: Vertex): void {
    highlightIncidentForceEdges(selectedVertex, '#999', 0.6)
  }
}
