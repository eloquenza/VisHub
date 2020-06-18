import * as d3 from 'd3'
import {BaseVisualizationDataArrayLoader, BaseVisualizationArrayState} from 'typedecls/ReactPropsAndStates'
import {Margin, ContainerDimensions} from 'typedecls/CssStyleTypes'
import {D3VisLifeCycle} from './D3VisLifeCycle'

export class D3Chart<DataType> extends D3VisLifeCycle<BaseVisualizationDataArrayLoader<DataType>, BaseVisualizationArrayState<DataType>> {

  useLogScale: boolean

  constructor(useLogScale: boolean) {
    super()
    this.useLogScale = useLogScale
  }

  createBaseTypeHook(
    documentElement: Element,
    parentSVG: d3.Selection<any, any, any, any>,
    props: BaseVisualizationDataArrayLoader<DataType>,
    state: BaseVisualizationArrayState<DataType>
  ): void {
    this.updateBaseTypeHook(documentElement, parentSVG, props, state)
  }

  viewBoxHook(containerDims: ContainerDimensions): string {
    return `0 0 ${containerDims.width} ${containerDims.height}`
  }

  createAxes(
    margin: Margin,
    windowDims: ContainerDimensions,
    yScale: d3.ScaleLinear<number, number>,
    xScale: d3.ScaleBand<string>
  ) {
    const {width, height} = windowDims
    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, any>) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text('Amount of repos')
        )

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, any>) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(xScale)
          .ticks(width / 80)
          .tickSizeOuter(0)
      )

    return {x: xAxis, y: yAxis}
  }

  createScales(
    margin: Margin,
    windowDims: ContainerDimensions,
    data: DataType[]
  ) {
    const {width, height} = windowDims

    var y
    if (this.useLogScale) {
      y = d3.scaleLog()
    } else {
      y = d3.scaleLinear()
    }
    // 1 is needed in case of logarithmic scale
    y.domain([1, d3.max(data, (d: any) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top])

    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(data.map((d:any) => d.name))
      .range([margin.left, width - margin.right])

    return {yScale: y, xScale: x}
  }

  createLineGenerator(
    yScale: d3.ScaleLinear<number, number>,
    xScale: d3.ScaleBand<string>
  ) {
    return d3
      .line<DataType>()
      .x((d: any) => xScale(d.name) || 0)
      .y((d: any) => yScale(d.value))
  }

  createPaths(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    lineGenerator: d3.Line<DataType>,
    data: DataType[]
  ) {
    parentSVG
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator)
  }

  updateBaseTypeHook(
    documentElement: Element,
    parentSVG: d3.Selection<any, any, any, any>,
    props: BaseVisualizationDataArrayLoader<DataType>,
    state: BaseVisualizationArrayState<DataType>
  ): void {
    const {data} = state
    const {window} = props
    const margin: Margin = {top: 20, right: 0, bottom: 20, left: 60}

    const scales = this.createScales(margin, window, data)
    const axes = this.createAxes(margin, window, scales.yScale, scales.xScale)
    const lineGenerator = this.createLineGenerator(scales.yScale, scales.xScale)

    parentSVG.append('g').call(axes.y)
    parentSVG.append('g').call(axes.x)

    this.createPaths(parentSVG, lineGenerator, data)
  }

  destroy(documentElement: Element): void {
    d3.select(documentElement).selectAll('*').remove()
  }
}
