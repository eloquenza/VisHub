import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import * as d3 from 'd3'
import {ClassElementNames} from 'appConstants'
import {D3VisLifeCycle} from './D3VisLifeCycle'
import {D3SearchStrategy} from './D3SearchStategy'

export const graphSVGContainerCSSSelector = `${ClassElementNames.svgElementName}.${ClassElementNames.graphContainerClassName}`

export const zoomContainerCSSSelector = `${graphSVGContainerCSSSelector} ${ClassElementNames.svgGElementName}.${ClassElementNames.zoomGroupClassName}`

export abstract class D3Graph<VertexType>
  extends D3VisLifeCycle<GraphProps, GraphState> {
  searchStrategy!: D3SearchStrategy<VertexType>

  createBaseTypeHook(
    documentElement: Element,
    parentSVG: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ) {
    const zoomContainer = this.createChildSVGGElementForZooming(parentSVG)
    this.registerZoomPanHandler(parentSVG)
    const graphGroupSVG = this.createSVGGElementForGraph(zoomContainer, props)
    this.createExtendedTypeHook(graphGroupSVG, props, state)
  }

  updateBaseTypeHook(
    documentElement: Element,
    parentSVG: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ) {
    const zoomContainer = d3
      .select(documentElement)
      .select(zoomContainerCSSSelector)
    let graphContainer = zoomContainer.select(`g.${props.className}`)
    // happens during the first switch, as it is an update from React's view
    // meaning the other graph representation will not be created, but rather
    // 'updated into creation'
    if (graphContainer.empty()) {
      graphContainer = this.createSVGGElementForGraph(zoomContainer, props)
    }
    // set visibility on all graph representations but the one getting updated
    // using css selectors to correctly filter out only direct descendants
    d3.selectAll(
      `${zoomContainerCSSSelector} > g:not(.${props.className})`
    ).attr('visibility', 'hidden')
    // remove visibility on current graph representation if it is set
    zoomContainer
      .selectAll(`g.${props.className}`)
      .attr('visibility', null)
    this.resetzoomAndPan(documentElement, props, zoomContainer)
    this.updateExtendedTypeHook(graphContainer, props, state)
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
    const min_zoom = 0.1;
    const max_zoom = 7;
    const zoomBehaviour = d3.zoom<SVGElement, any>()
      .filter(() => {
        if (d3.event.type === 'wheel') {
          return d3.event.ctrlKey
        } else if (d3.event.type === 'dblclick') {
          return false;
        }
        return true
      })
      // declare min/max zoom so the user cannot "zoom" the graph away
      .scaleExtent([min_zoom,max_zoom])
    // register the listener to the parent SVG element, but add the transform/scale to the child Group element
    // This way, the graph does not bounce around because the transformation matrix is calculated relative to the mouse location
    parentSVG.call(zoomBehaviour.on('zoom', zoomFunction))
  }

  private createSVGGElementForGraph(
    parentElem: d3.Selection<any, any, any, any>,
    props: GraphProps
  ): d3.Selection<any, any, any, any> {
    return parentElem.append('g').classed(props.className, true)
  }

  protected abstract createExtendedTypeHook(
    selection: d3.Selection<any, any, any, any>,
    props: GraphProps,
    state: GraphState
  ): void

  protected abstract updateExtendedTypeHook(
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
