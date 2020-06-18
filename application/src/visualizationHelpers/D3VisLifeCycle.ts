import * as d3 from "d3";
import { ContainerDimensions } from "typedecls/CssStyleTypes";
import { BaseVisualizationProps, BaseVisualizationDefaultState } from "typedecls/ReactPropsAndStates";

export abstract class D3VisLifeCycle<PropType extends BaseVisualizationProps, StateType extends BaseVisualizationDefaultState> {

  // for componentDidMount
  create(documentElement: Element, props: PropType, state: StateType) {
    // style the SVG element for all classes that are inherited
    const parentSVG = this.styleParentSVG(documentElement, props)
    this.createBaseTypeHook(documentElement, parentSVG, props, state)
  }

  styleParentSVG(documentElement: Element, props: PropType) {
    return d3
      .select(documentElement)
      .attr('viewBox', this.viewBoxHook(props.window))
      .classed('svg-content-responsive', true)
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  // for componentDidUpdate
  update(documentElement: Element, props: PropType, state: StateType){
    const parentSVG = this.styleParentSVG(documentElement, props)
    this.updateBaseTypeHook(documentElement, parentSVG, props, state)
  }

  // for componentWillUnmount
  destroy(documentElement: Element): void {
    d3.select(documentElement)
      .selectAll('*')
      .remove()
  }

  protected abstract viewBoxHook(containerDims: ContainerDimensions): string

  protected abstract createBaseTypeHook(
    documentElement: Element,
    styledParentSVG: d3.Selection<any, any, any, any>,
    props: PropType,
    state: StateType
  ): void

  protected abstract updateBaseTypeHook(
    documentElement: Element,
    styledParentSVG: d3.Selection<any, any, any, any>,
    props: PropType,
    state: StateType
  ): void

}
