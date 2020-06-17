import React from 'react'
import {GraphProps} from 'typedecls/ReactPropsAndStates'
import {ClassElementNames} from 'appConstants'

export default class GraphComponent extends React.Component<GraphProps, {}> {
  ref!: SVGSVGElement

  constructor(props: GraphProps) {
    super(props)
  }

  componentDidMount() {
    console.log(`mount ${this.props.containerClassName}`)
    this.props.graphFactory.create(this.ref, this.props, {})
  }

  componentDidUpdate() {
    console.log(`update ${this.props.containerClassName}`)
    this.props.graphFactory.update(this.ref, this.props, {})
  }

  componentWillUnmount() {
    console.log(`unmount ${this.props.containerClassName}`)
    this.props.graphFactory.destroy(this.ref)
  }

  render() {
    return (
      <svg
        className={ClassElementNames.graphContainerClassName}
        ref={(ref: SVGSVGElement) => {
          this.ref = ref
        }}
      />
    )
  }
}
