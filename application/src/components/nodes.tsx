
import React from "react";
import * as d3 from "d3";
import { d3Types } from "typedecls";

interface NodesProps {
  nodes: d3Types.d3Node[];
  simulation: any;
}

interface SingleNodeProps {
  node: d3Types.d3Node;
  color: string;
}

class Node extends React.Component<SingleNodeProps, {}> {
  readonly ref: React.RefObject<SVGCircleElement> = React.createRef();

  componentDidMount() {
     d3.select(this.ref.current).data([this.props.node])
  }

  render() {
    return (
      <circle className="node" r={5} fill={this.props.color}
        ref={this.ref}>
        <title>{this.props.node.id}</title>
      </circle>
    );
  }
}

export default class Nodes extends React.Component<NodesProps, {}> {
  componentDidMount() {
    const simulation = this.props.simulation;
    // https://stackoverflow.com/questions/44472945/d3-js-and-typescript-compilation-error/44523718#44523718
   d3.selectAll<SVGCircleElement, d3Types.d3Node>(".node")
   .call(d3.drag<SVGCircleElement, d3Types.d3Node>()
        .on("start", onDragStart)
        .on("drag", onDrag)
        .on("end", onDragEnd));

    function onDragStart(d: d3Types.d3Node) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function onDrag(d: d3Types.d3Node) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function onDragEnd(d: d3Types.d3Node) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  render() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const nodes = this.props.nodes.map((node: d3Types.d3Node, index: number) => {
      if (typeof node.group === 'undefined') {
        return <Node key={index} node={node} color={color("undefined")} />;
      } else {
        return <Node key={index} node={node} color={color(node.group.toString())} />;
      }
    });

    return (
      <g className="nodes">
        {nodes}
      </g>
    );
  }
}