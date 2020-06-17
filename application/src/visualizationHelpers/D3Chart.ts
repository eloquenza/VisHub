import * as d3 from 'd3'
import {ChartProps, ChartState} from 'typedecls/ReactPropsAndStates'
import {Margin, ContainerDimensions} from 'typedecls/CssStyleTypes'
import {ChartDatum} from 'typedecls/D3Types'
import {D3VisLifeCycle} from './D3VisLifeCycle'

export class D3Chart implements D3VisLifeCycle<ChartProps, ChartState> {
  create(documentElement: Element, props: ChartProps, state: ChartState): void {
    const {window} = props
    this.styleSVG(documentElement, window)

    this.update(documentElement, props, state)
  }

  styleSVG(documentElement: Element, windowDims: ContainerDimensions) {
    return d3
      .select(documentElement)
      .attr('viewBox', `0 0 ${windowDims.width} ${windowDims.height}`)
  }

  createAxes(
    margin: Margin,
    windowDims: ContainerDimensions,
    yScale: d3.ScaleLinear<number, number>,
    xScale: d3.ScaleTime<number, number>
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
            .text('$ Close')
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
    data: ChartDatum[]
  ) {
    const {width, height} = windowDims
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.close)])
      .nice()
      .range([height - margin.bottom, margin.top])

    const x = d3
      .scaleUtc<number, number>()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right])

    return {yScale: y, xScale: x}
  }

  createLineGenerator(
    yScale: d3.ScaleLinear<number, number>,
    xScale: d3.ScaleTime<number, number>
  ) {
    return d3
      .line<ChartDatum>()
      .defined(d => !isNaN(d.close))
      .x(d => xScale(d.date))
      .y(d => yScale(d.close))
  }

  createPaths(
    parentSVG: d3.Selection<Element, unknown, null, undefined>,
    lineGenerator: d3.Line<ChartDatum>,
    data: ChartDatum[]
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

  update(documentElement: Element, props: ChartProps, state: ChartState): void {
    const {data} = state
    const {window} = props
    const margin: Margin = {top: 20, right: 30, bottom: 30, left: 40}

    const svg = d3.select(documentElement)
    const scales = this.createScales(margin, window, data)
    const axes = this.createAxes(margin, window, scales.yScale, scales.xScale)
    const lineGenerator = this.createLineGenerator(scales.yScale, scales.xScale)

    svg.append('g').call(axes.y)
    svg.append('g').call(axes.x)

    this.createPaths(svg, lineGenerator, data)
  }

  destroy(documentElement: Element): void {
    d3.select(documentElement).selectAll('*').remove()
  }
}
