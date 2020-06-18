import { D3VisLifeCycle } from "./D3VisLifeCycle";
import * as d3 from "d3";

import data from '../data/licenses.json'
import { PieChartDatum } from "typedecls/D3Types";
import { ContainerDimensions } from "typedecls/CssStyleTypes";
import { PieArcDatum } from "d3";
import { BaseVisualizationDataArrayLoader, BaseVisualizationArrayState } from "typedecls/ReactPropsAndStates";

export default class D3PieChart extends D3VisLifeCycle<BaseVisualizationDataArrayLoader<PieChartDatum>, BaseVisualizationArrayState<PieChartDatum>> {
    colorGenerator: d3.ScaleOrdinal<string, any>
    arcGenerator: d3.Arc<any, PieArcDatum<PieChartDatum>>
    arcLabelGenerator: d3.Arc<any, PieArcDatum<PieChartDatum>>
    pie!: d3.Pie<any, PieChartDatum>;

    constructor(props: BaseVisualizationDataArrayLoader<PieChartDatum>, state: BaseVisualizationArrayState<PieChartDatum>) {
        super()

        const {width, height} = props.window
        const radius = Math.min(width, height) / 2 * 0.8;

        this.arcGenerator = d3.arc<PieArcDatum<PieChartDatum>>()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1)

        this.arcLabelGenerator = d3.arc<PieArcDatum<PieChartDatum>>()
            .innerRadius(radius)
            .outerRadius(radius)

        this.colorGenerator = d3.scaleOrdinal<string, any>()
            .domain(data.map(d => d.name))
            .range(d3.quantize(
                t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse()
            )
    }

    createBaseTypeHook(
        documentElement: Element,
        styledParentSVG: d3.Selection<any, any, any, any>,
        props: BaseVisualizationDataArrayLoader<PieChartDatum>,
        state: BaseVisualizationArrayState<PieChartDatum>
      ): void {
        const parentSVG = d3.select(documentElement)
            .attr('viewBox', this.viewBoxHook(props.window))
            .classed('svg-content-responsive', true)
            .attr('preserveAspectRatio', 'xMidYMid meet')


        this.pie = d3.pie<PieChartDatum>().sort(null).value((d: PieChartDatum) => d.value)
        const arcs = this.pie(state.data)

        parentSVG.append("g")
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => this.colorGenerator(d.data.name))
            .attr("d", this.arcGenerator)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

        parentSVG.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${this.arcLabelGenerator.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value.toLocaleString()));
    }

    viewBoxHook(containerDims: ContainerDimensions) {
        const {width, height} = containerDims
        return `${-width/2} ${-height/2} ${width} ${height}`
    }

    updateBaseTypeHook(
        documentElement: Element,
        styledParentSVG: d3.Selection<any, any, any, any>,
        props: BaseVisualizationDataArrayLoader<PieChartDatum>,
        state: BaseVisualizationArrayState<PieChartDatum>
      ): void {
        throw new Error("Method not implemented.");
    }
}
