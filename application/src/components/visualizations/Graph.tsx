import React from 'react'
import {GraphProps, GraphState} from 'typedecls/ReactPropsAndStates'
import {ClassElementNames} from 'appConstants'

export default class GraphComponent extends React.Component<
  GraphProps,
  GraphState
> {
  ref!: SVGSVGElement

    constructor(props: GraphProps) {
        super(props)
        this.state = {
            data: this.props.loadData()
        }
    }

    componentDidMount() {
        this.props.graphFactory.create(this.ref, this.props, this.state)
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
