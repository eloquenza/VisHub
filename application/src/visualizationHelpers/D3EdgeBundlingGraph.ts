import * as d3 from 'd3'

import {SVGCSSAttribute} from 'typedecls/CssStyleTypes'
import {EdgeBundlingNode, NodeElem, EdgeBundlingEdge} from 'typedecls/D3Types'
import {EdgeBundlingProps} from 'typedecls/ReactPropsAndStates'

import {Colors, ClassElementNames} from 'appConstants'
import {colorEdges, applyAttrsToSelection} from 'utils/d3UtilityFunctions'
import {D3EdgeBundlingSearchStrategy} from './D3EdgeBundlingSearchStrategy'
import {D3Graph} from './D3Graph'

const edgesClassSelector = `${ClassElementNames.svgElementName}.${ClassElementNames.edgeBundlingClassName} ${ClassElementNames.svgGElementName}.${ClassElementNames.edgeBundlingEdgesClassName}`

export class D3EdgeBundlingGraph extends D3Graph<
  EdgeBundlingNode,
  EdgeBundlingProps,
  any
> {
  constructor(root: EdgeBundlingNode) {
    super()

    this.searchStrategy = new D3EdgeBundlingSearchStrategy(
      root,
      this.highlightSelectedVertex,
      this.dehighlightSelectedVertex
    )
  }

  create(selection: Element, props: EdgeBundlingProps, state: any): void {
    const {width, root} = props
    const cluster: d3.ClusterLayout<NodeElem> = d3
      .cluster<NodeElem>()
      .size([2 * Math.PI, width / 3])
    const rootNode = cluster(root) as EdgeBundlingNode
    const lineGenerator = d3
      .lineRadial<EdgeBundlingNode>()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d.y)
      .angle(d => d.x)

    console.log(state)

    const svg = this.styleSVG(selection, props)
    this.createVertices(svg, (rootNode as unknown) as EdgeBundlingNode)
    // creating the edges once via either incoming or outgoing is enough.
    this.createEdges(
      svg,
      lineGenerator,
      rootNode.leaves().flatMap(node => node.outgoing)
    )
  }

  styleSVG(selection: Element, props: EdgeBundlingProps) {
    const {width} = props

    return d3
      .select(selection)
      .attr('viewBox', `${-width / 2}, ${-width / 2}, ${width}, ${width}`)
      .classed('svg-content-responsive', true)
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  createVertices(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    rootNode: EdgeBundlingNode
  ) {
    const gSelection = parentSVG.append('g')
    const textSelections = gSelection
      .selectAll('g')
      .data<EdgeBundlingNode>(rootNode.leaves())
      .join<SVGGElement>('g')
      .attr(
        'transform',
        d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      )
      .append(ClassElementNames.svgTextElementName)
      .text(d => d.data.id)
      .each(function (d) {
        d.text = this
      })
      .on('mouseover', this.highlightSelectedVertex)
      .on('mouseout', this.dehighlightSelectedVertex)
      .call(text =>
        text.append('title').text(
          d => `${d.data.id}
        ${d.outgoing.length} outgoing
        ${d.incoming.length} incoming`
        )
      )

    applyAttrsToSelection(gSelection, [
      {name: 'font-family', value: 'sans-serif'},
      {name: 'font-size', value: 18},
    ])
    applyAttrsToSelection(textSelections, [
      {name: 'dy', value: '0.31em'},
      {name: 'x', value: d => (d.x < Math.PI ? 6 : -6)},
      {name: 'text-anchor', value: d => (d.x < Math.PI ? 'start' : 'end')},
      {name: 'transform', value: d => (d.x >= Math.PI ? 'rotate(180)' : null)},
    ])
  }

  createEdges(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    lineGenerator: d3.LineRadial<EdgeBundlingNode>,
    edges: EdgeBundlingEdge[]
  ) {
    parentSVG
      .append('g')
      .attr('stroke', Colors.colorNone)
      .attr('fill', 'none')
      .selectAll(ClassElementNames.svgPathElementName)
      .data(edges)
      .join(ClassElementNames.svgPathElementName)
      .style('mix-blend-mode', 'multiply')
      .classed(ClassElementNames.edgeBundlingEdgesClassName, true)
      .attr('d', edge => {
        return lineGenerator(edge.source.path(edge.target))
      })
      .each(function (d) {
        d.svgPath = this as SVGPathElement
      })
  }

  highlightSelectedVertex(selectedVertex: EdgeBundlingNode) {
    d3.selectAll(edgesClassSelector).style('mix-blend-mode', null)
    colorEdges(
      d3.selectAll(selectedVertex.incoming.map(edge => edge.svgPath)),
      Colors.colorIn
    )
    colorEdges(
      d3.selectAll(selectedVertex.outgoing.map(edge => edge.svgPath)),
      Colors.colorOut
    )
    const boldFont: SVGCSSAttribute = {name: 'font-weight', value: 'bold'}
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.incoming.map(({source}) => source.text)),
      [{name: 'fill', value: Colors.colorIn}, boldFont]
    )
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.outgoing.map(({target}) => target.text)),
      [{name: 'fill', value: Colors.colorOut}, boldFont]
    )
  }

  dehighlightSelectedVertex(selectedVertex: EdgeBundlingNode) {
    d3.selectAll(edgesClassSelector).style('mix-blend-mode', 'multiply')
    colorEdges(
      d3.selectAll(selectedVertex.incoming.map(edge => edge.svgPath)),
      Colors.colorNone
    )
    colorEdges(
      d3.selectAll(selectedVertex.outgoing.map(edge => edge.svgPath)),
      Colors.colorNone
    )
    const attrs: SVGCSSAttribute[] = [
      {name: 'fill', value: null},
      {name: 'font-weight', value: null},
    ]
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.outgoing.map(({target}) => target.text)),
      attrs
    )
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.incoming.map(({source}) => source.text)),
      attrs
    )
  }

  update(): void {
    throw new Error('Method not implemented.')
  }

  destroy(): void {
    throw new Error('Method not implemented.')
  }
}
