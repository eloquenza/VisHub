import React from 'react'
import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import {ClassElementNames} from 'appConstants'
import { Vertex } from 'typedecls/D3Types'

export default class GraphComponent extends React.Component<GraphProps, GraphState> {
  ref!: SVGSVGElement

  constructor(props: GraphProps) {
    super(props)
    this.state = {
      data: this.props.loadData()
    }
  }

  componentDidMount() {
    this.props.graphFactory.create(this.ref, this.props, this.state)
    this.props.setSearchCallbackFunction(this.searchCallback.bind(this))
  }

  componentDidUpdate() {
    this.props.graphFactory.update(this.ref, this.props, this.state)
  }

  componentWillUnmount() {
    this.props.graphFactory.destroy(this.ref)
  }

  searchCallback(allVertices: Vertex[], searchTerm: string) {
    this.props.graphFactory.searchStrategy.search(allVertices, searchTerm)
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
