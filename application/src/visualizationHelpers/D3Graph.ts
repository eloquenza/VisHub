import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import * as d3 from 'd3'
import {ContainerDimensions} from 'typedecls/CssStyleTypes'
import {ClassElementNames} from 'appConstants'
import {D3VisLifeCycle} from './D3VisLifeCycle'
import {D3SearchStrategy} from './D3SearchStategy'

const zoomContainerCSSSelector = `${ClassElementNames.svgElementName}.${ClassElementNames.graphContainerClassName} ${ClassElementNames.svgGElementName}.${ClassElementNames.zoomGroupClassName}`

export abstract class D3Graph<VertexType>
  implements D3VisLifeCycle<GraphProps, GraphState> {
  searchStrategy!: D3SearchStrategy<VertexType>

  create(documentElement: Element, props: GraphProps, state: GraphState) {
    const parentSVG = this.styleParentSVG(documentElement, props)
    const zoomContainer = this.createChildSVGGElementForZooming(parentSVG)
    this.registerZoomPanHandler(parentSVG)
    const graphGroupSVG = this.createSVGGElementForGraph(zoomContainer, props)
    this.createHook(graphGroupSVG, props, state)
  }

  update(documentElement: Element, props: GraphProps, state: GraphState) {
    const zoomContainer = d3
      .select(documentElement)
      .select(zoomContainerCSSSelector)
    let graphContainer = zoomContainer.select(`g.${props.containerClassName}`)
    // happens during the first switch, as it is an update from React's view
    // meaning the other graph representation will not be created, but rather
    // 'updated into creation'
    if (graphContainer.empty()) {
      graphContainer = this.createSVGGElementForGraph(zoomContainer, props)
    }
    // set visibility on all graph representations but the one getting updated
    // using css selectors to correctly filter out only direct descendants
    d3.selectAll(
      `${zoomContainerCSSSelector} > g:not(.${props.containerClassName})`
    ).attr('visibility', 'hidden')
    // remove visibility on current graph representation if it is set
    zoomContainer
      .selectAll(`g.${props.containerClassName}`)
      .attr('visibility', null)
    this.resetzoomAndPan(documentElement, props, zoomContainer)
    this.updateHook(graphContainer, props, state)
  }

  destroy(documentElement: Element): void {
    d3.select(documentElement)
      .select(zoomContainerCSSSelector)
      .selectAll('*')
      .remove()
  }

  resetzoomAndPan(documentElement: Element, props: GraphProps, zoomContainer: d3.Selection<any, any, any, any>) {
    // remove translations from the zoomContainer to let re-appearing
    // graph representation be centered
    zoomContainer.attr('transform', null)
    // reapply correct viewBox properties
    this.styleParentSVG(documentElement, props)
    // reset zoom transform matrix
    d3.select(documentElement).call(d3.zoom().transform, d3.zoomIdentity)
  }

  private styleParentSVG(documentElement: Element, props: GraphProps) {
    return d3
      .select(documentElement)
      .attr('viewBox', this.viewBoxHook(props.window))
      .classed('svg-content-responsive', true)
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  // this allows 'jumpless' panning and zooming due to transformations being applied to the g element instead of the parentSVG
  private createChildSVGGElementForZooming(
    parentSVG: d3.Selection<any, any, any, any>
  ) {
    return parentSVG
      .append('g')
      .classed(ClassElementNames.zoomGroupClassName, true)
  }

  private registerZoomPanHandler(parentSVG: d3.Selection<any, any, any, any>) {
    // disable wheel zooming to not interfere with native scrolling
    // enable zooming only on ctrl + wheeling
    const zoomBehaviour = d3.zoom<SVGElement, any>().filter(() => {
      if (d3.event.type === 'wheel') {
        return d3.event.ctrlKey
      } else if (d3.event.type === 'dblclick') {
        return false;
      }
      return true
    })
    // register the listener to the parent SVG element, but add the transform/scale to the child Group element
    // This way, the graph does not bounce around because the transformation matrix is calculated relative to the mouse location
    parentSVG.call(zoomBehaviour.on('zoom', zoomFunction))
  }

  private createSVGGElementForGraph(
    parentElem: d3.Selection<any, any, any, any>,
    props: GraphProps
  ): d3.Selection<any, any, any, any> {
    return parentElem.append('g').classed(props.containerClassName, true)
  }

  protected abstract viewBoxHook(containerDims: ContainerDimensions): string
  protected abstract createHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void

  protected abstract updateHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void

  abstract highlightSelectedVertex(selectedVertex: VertexType): void
  abstract dehighlightSelectedVertex(selectedVertex: VertexType): void
}

function zoomFunction() {
  d3.select(zoomContainerCSSSelector).attr('transform', d3.event.transform)
}
