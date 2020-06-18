import * as d3 from 'd3'

import {SVGCSSAttribute, ContainerDimensions} from 'typedecls/CssStyleTypes'
import {EdgeBundlingNode, NodeElem, EdgeBundlingEdge} from 'typedecls/D3Types'
import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'

import {Colors, ClassElementNames} from 'appConstants'
import {colorEdges, applyAttrsToSelection, createTooltipString} from 'utils/d3UtilityFunctions'
import {D3EdgeBundlingSearchStrategy} from './D3EdgeBundlingSearchStrategy'
import {D3Graph} from './D3Graph'

const edgesClassSelector = `${ClassElementNames.svgGElementName}.${ClassElementNames.edgeBundlingEdgesClassName}`

export class D3EdgeBundlingGraph extends D3Graph<EdgeBundlingNode> {

  lineGenerator: d3.LineRadial<EdgeBundlingNode>
  cluster: d3.ClusterLayout<NodeElem>
  rootNode: EdgeBundlingNode

  constructor(root: EdgeBundlingNode, containerDims: ContainerDimensions) {
    super()

    this.lineGenerator = d3
      .lineRadial<EdgeBundlingNode>()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d.y)
      .angle(d => d.x)

    this.cluster = d3
      .cluster<NodeElem>()
      .size([2 * Math.PI, containerDims.width / 3])
    this.rootNode = this.cluster(root) as EdgeBundlingNode

    this.searchStrategy = new D3EdgeBundlingSearchStrategy(
      root,
      this.highlightSelectedVertex,
      this.dehighlightSelectedVertex
    )
  }

  createHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void {
    this.prepareGroupElements(selection)
    this.updateHook(selection, props, state)
  }

  prepareGroupElements(selection: d3.Selection<any, any, any, any>) {
    if (selection.select('g.labels').empty()) {
      applyAttrsToSelection(selection.append('g').classed('labels', true), [
        {name: 'font-family', value: 'sans-serif'},
        {name: 'font-size', value: 18},
      ])
      selection.append('g').classed('edges', true)
    }
  }

  viewBoxHook(containerDims: ContainerDimensions) {
    const {width} = containerDims
    return `${-width / 2}, ${-width / 2}, ${width}, ${width}`
  }

  createVertices(
    parentSVG: d3.Selection<any, unknown, null, undefined>,
    rootNode: EdgeBundlingNode
  ) {
    const textSelections = parentSVG
      .selectAll('g.labels')
      .selectAll('g')
      .classed('vertices', true)
      .data<EdgeBundlingNode>(rootNode.leaves())
      .join<SVGGElement>('g')
      .attr(
        'transform',
        d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      )
      .append(ClassElementNames.svgTextElementName)
      .text(d => d.data.name)
      .each(function (d) {
        d.text = this
      })
      .on('mouseover', this.highlightSelectedVertex)
      .on('mouseout', this.dehighlightSelectedVertex)
      .call(text =>
        text.append('title').text(
          d => `${d.data.name}
        ... has ${d.followers.length} followers
        ... is following ${d.following.length} users`
        + `\n\n${createTooltipString(d.data.name)}`
        )
      )

    applyAttrsToSelection(textSelections, [
      {name: 'dy', value: '0.31em'},
      {name: 'x', value: d => (d.x < Math.PI ? 6 : -6)},
      {name: 'text-anchor', value: d => (d.x < Math.PI ? 'start' : 'end')},
      {name: 'transform', value: d => (d.x >= Math.PI ? 'rotate(180)' : null)},
    ])
  }

  createEdges(
    parentSVG: d3.Selection<any, unknown, null, undefined>,
    lineGenerator: d3.LineRadial<EdgeBundlingNode>,
    edges: EdgeBundlingEdge[]
  ) {
    parentSVG
      .selectAll('g.edges')
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
      d3.selectAll(selectedVertex.following.map(edge => edge.svgPath)),
      Colors.colorIn
    )
    colorEdges(
      d3.selectAll(selectedVertex.followers.map(edge => edge.svgPath)),
      Colors.colorOut
    )
    const boldFont: SVGCSSAttribute = {name: 'font-weight', value: 'bold'}
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.following.map(({source}) => source.text)),
      [{name: 'fill', value: Colors.colorIn}, boldFont]
    )
    applyAttrsToSelection(
      d3.selectAll(selectedVertex.followers.map(({target}) => target.text)),
      [{name: 'fill', value: Colors.colorOut}, boldFont]
    )
    d3.select(selectedVertex.text).attr('font-weight', 'bold')
  }

  dehighlightSelectedVertex(selectedVertex: EdgeBundlingNode) {
    d3.selectAll(edgesClassSelector).style('mix-blend-mode', 'multiply')
    const pathElems = d3.selectAll(selectedVertex.following.map(edge => edge.svgPath).concat(selectedVertex.followers.map(edge => edge.svgPath)))
    colorEdges(
      pathElems,
      Colors.colorNone
    )
    const attrs: SVGCSSAttribute[] = [
      {name: 'fill', value: null},
      {name: 'font-weight', value: null},
    ]
    const textElems = d3.selectAll(selectedVertex.followers.map(({target}) => target.text).concat(selectedVertex.following.map(({source}) => source.text)))
    applyAttrsToSelection(
      textElems,
      attrs
    )
    d3.select(selectedVertex.text).attr('font-weight', null)
  }

  updateHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void {
    this.prepareGroupElements(selection)
    this.createVertices(selection, (this.rootNode as unknown) as EdgeBundlingNode)
    // creating the edges once via either incoming or outgoing is enough.
    this.createEdges(
      selection,
      this.lineGenerator,
      this.rootNode.leaves().flatMap(node => node.followers)
    )
  }
}
