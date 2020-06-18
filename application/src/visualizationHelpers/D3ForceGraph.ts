import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import {Graph, Vertex, Edge} from 'typedecls/D3Types'
import * as d3 from 'd3'

import {ClassElementNames} from 'appConstants'
import {ContainerDimensions} from 'typedecls/CssStyleTypes'
import {D3Graph} from './D3Graph'
import {D3ForceGraphSearchStrategy} from './D3ForceGraphSearchStrategy'
import { createTooltipString } from 'utils/d3UtilityFunctions'

export class D3ForceGraph extends D3Graph<Vertex> {
  constructor() {
    super()

    this.searchStrategy = new D3ForceGraphSearchStrategy(
      this.highlightSelectedVertex,
      this.dehighlightSelectedVertex
    )
  }

  createHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void {
    // In SVG, z-culling/z-index is defined via first element defined is
    // first element painted, therefore, I want to let the vertices
    // be painted last and be on top of everything
    // https://www.w3.org/TR/SVG11/render.html#RenderingOrder
    // https://www.w3.org/TR/SVG2/render.html#RenderingOrder
    selection.append('g').classed('edges', true)
    selection.append('g').classed('labels', true)
    selection.append('g').classed('vertices', true)

    this.updateHook(selection, props, state)
  }

  updateHook(selection: d3.Selection<any, any, any, any>, props: GraphProps, state: GraphState) {
    const {width, height} = props.window
    const graph = state.data as Graph
    const {vertices, edges} = graph

    const simulation = this.createSimulation(graph, width, height)

    this.drawVertices(selection, simulation, vertices)
    this.drawEdges(selection, edges)
    this.drawLabels(selection, vertices)
  }

  viewBoxHook(containerDims: ContainerDimensions) {
    const {width, height} = containerDims
    return `0 0 ${width} ${height}`
  }

  createSimulation(graph: Graph, width: number, height: number) {
    return d3.forceSimulation(graph.vertices)
      .force(
        'link',
        d3
          .forceLink(graph.edges)
          .id((d: any) => (d as Vertex)?.id?.toString() || "0")
          .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(-250))
      // do not use forceCenter because the graph could be disjunct
      // where directly using forceX/Y prevents detached subgraphes from
      // escaping the viewport.
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      //.force('center', d3.forceCenter(width / 2, height / 2))
      .nodes(graph.vertices)
      .on('tick', this.onTick)
  }

  drawVertices<ElementType extends Element>(
    parentSVG: d3.Selection<ElementType, unknown, null, undefined>,
    simulation: d3.Simulation<Vertex, Edge>,
    vertices: Vertex[]
  ) {
    const circles = parentSVG
      .selectAll('g.vertices')
      .selectAll<SVGCircleElement, Vertex>(ClassElementNames.svgCircleElementName)
      .data(vertices)
      .join(ClassElementNames.svgCircleElementName)
      .attr('r', 5)
      .classed(ClassElementNames.forceVerticesClassName, true)

      circles.append('title').text((v) => createTooltipString(v.name || 'undefined'))

      circles
      .on('mouseover', this.highlightSelectedVertex)
      .on('mouseout', this.dehighlightSelectedVertex)
      // if vertex is fixed, remove via double click and reset color
      .on('click', (v: Vertex, index: number, array: ArrayLike<SVGCircleElement>) => {
        if (d3.event.ctrlKey) {
          d3.select(array[index]).attr("fill", null)
          v.fx = null // eslint-disable-line no-param-reassign
          v.fy = null // eslint-disable-line no-param-reassign
        }
      })

      this.addDragEventListener(
        d3.selectAll<SVGCircleElement, Vertex>(
          `.${ClassElementNames.forceVerticesClassName}`),
        simulation
      )
  }

  addDragEventListener(vertices: d3.Selection<SVGCircleElement, Vertex, HTMLElement, undefined>, simulation: d3.Simulation<Vertex, Edge>) {
    vertices.call(
      d3
        .drag<SVGCircleElement, Vertex>()
        .on('start', (v: Vertex, index: number, array: ArrayLike<SVGCircleElement>) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart()
          }
          // set color to indicate that the vertex is fixed
          d3.select(array[index]).attr("fill", '#ff66d6')
          v.fx = v.x // eslint-disable-line no-param-reassign
          v.fy = v.y // eslint-disable-line no-param-reassign
        })
        .on('drag', (v: Vertex) => {
          v.fx = d3.event.x // eslint-disable-line no-param-reassign
          v.fy = d3.event.y // eslint-disable-line no-param-reassign
        })
        .on('end', (v: Vertex) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0)
          }
          // do not set the following attributes to make the vertex
          // sticky after user interaction, i.e. stay where it was put
          // v.fx = null // eslint-disable-line no-param-reassign
          // v.fy = null // eslint-disable-line no-param-reassign
        })
    )
  }

  drawEdges<ElementType extends Element>(
    parentSVG: d3.Selection<ElementType, unknown, null, undefined>,
    edges: Edge[]
  ) {
    parentSVG
      .selectAll('g.edges')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll(ClassElementNames.svgLineElementName)
      .data(edges)
      .join(ClassElementNames.svgLineElementName)
      .classed(ClassElementNames.forceEdgesClassName, true)
      .attr('pointer-events', 'none')
  }

  drawLabels<ElementType extends Element>(
    parentSVG: d3.Selection<ElementType, unknown, null, undefined>,
    vertices: Vertex[]
  ) {
    parentSVG
      .selectAll('g.labels')
      .selectAll(ClassElementNames.svgTextElementName)
      .data(vertices)
      .join(ClassElementNames.svgTextElementName)
      .classed(ClassElementNames.forceLabelsClassName, true)
      .attr('pointer-events', 'none')
      .text(d => d.name || 'undefined')
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

  // normally I should also highlight the vertices here, that are directly
  // connected to the selected vertex - but currently the data is not formatted as a adjacency list.
  highlightSelectedVertex(selectedVertex: Vertex): void {
    // this needs to be here, as otherwise there is no way to make
    // a correct multi-selecting search
    if (d3.event !== null && d3.event.type == 'mouseover') {
      d3.selectAll(`.${ClassElementNames.forceVerticesClassName}`)
      .attr('opacity', 0.1)
    }

    const verticesToHighlight: Vertex[] = []

    highlightIncidentForceEdges(selectedVertex, (edge: Edge, index: number, nodes: ArrayLike<SVGLineElement>) => {
        const source = edge.source as Vertex
        const target = edge.target as Vertex
        if (source.id === selectedVertex.id || target.id === selectedVertex.id) {
          d3.select(nodes[index]).attr('stroke-opacity', 1)
          // if the triggering event is a mouseover, then lower the
          // opacity of each edge not directly incident to the selected
          // vertex in order to make it clear, which vertex is getting /// highlighted
          verticesToHighlight.push(source)
          verticesToHighlight.push(target)
          // this needs to be here, as otherwise there is no way to make
          // a correct multi-selecting search
        } else if (d3.event !== null && d3.event.type == 'mouseover') {
          d3.select(nodes[index]).attr('stroke-opacity', 0.1)
        }
    })

    // highlight all vertices that are incident
    d3.selectAll<SVGCircleElement, Vertex>(`.${ClassElementNames.forceVerticesClassName}`)
    .each((v: Vertex, i: number, arr: ArrayLike<SVGCircleElement>) => {
        if (verticesToHighlight.includes(v)) {
          d3.select(arr[i]).attr('opacity', 0.4)
        }
        if (v.id == selectedVertex.id) {
          d3.select(arr[i]).attr('opacity', 1)
        }
    })
  }

  dehighlightSelectedVertex(selectedVertex: Vertex): void {
    highlightIncidentForceEdges(selectedVertex,
      (edge: Edge, index: number, nodes: ArrayLike<SVGLineElement>) =>
      d3.select(nodes[index]).attr('stroke-opacity', 0.6)
    )
    d3.selectAll(`.${ClassElementNames.forceVerticesClassName}`)
      .attr('opacity', 1)
  }
}

function highlightIncidentForceEdges(
  selectedVertex: Vertex,
  edgeFunctor: (edge: Edge, index: number, nodes: ArrayLike<SVGLineElement>) => void
) {
  d3.selectAll<SVGLineElement, Edge>(
    `.${ClassElementNames.forceEdgesClassName}`
  ).each(
    (edge: Edge, index: number, nodes: ArrayLike<SVGLineElement>) =>
        edgeFunctor(edge, index, nodes)
  )
}
