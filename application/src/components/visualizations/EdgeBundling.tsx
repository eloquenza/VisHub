import React from 'react'
import {EdgeBundlingProps} from 'typedecls/ReactPropsAndStates'
import {ClassElementNames} from 'appConstants'

export default class EdgeBundling extends React.Component<
  EdgeBundlingProps,
  {}
> {
  ref!: SVGSVGElement

  componentDidMount() {
    this.props.graphFactory.create(this.ref, this.props, {})
  }

  render() {
    return (
      <svg
        className={ClassElementNames.edgeBundlingClassName}
        ref={(ref: SVGSVGElement) => {
          this.ref = ref
        }}
      />
    )
  }
}
