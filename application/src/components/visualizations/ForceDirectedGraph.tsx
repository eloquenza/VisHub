import React from 'react'
import {ForceDirectedGraphProps} from 'typedecls/ReactPropsAndStates'
import {ClassElementNames} from 'appConstants'

export default class ForceDirectedGraph extends React.Component<
  ForceDirectedGraphProps,
  {}
> {
  ref!: SVGSVGElement

  componentDidMount() {
    this.props.graphFactory.create(this.ref, this.props, {})
  }

  render() {
    return (
      <svg
        className={ClassElementNames.forceDirectedClassName}
        ref={(ref: SVGSVGElement) => {
          this.ref = ref
        }}
      >
        {/* <Edges edges={graph.edges} />
        <Vertices vertices={graph.vertices} simulation={this.simulation} />
        <Labels vertices={graph.vertices} /> */}
      </svg>
    )
  }
}
