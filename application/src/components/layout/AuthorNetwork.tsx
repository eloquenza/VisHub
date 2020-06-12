import React from 'react'
import {ForceDirectedGraph} from 'components'
import {D3Types} from 'typedecls'
import data from '../../miserables'

interface AuthorNetworkProps {
  width: number
  height: number
  graph: D3Types.Graph
}

export default class AuthorNetwork extends React.Component<
  AuthorNetworkProps, {}> {
  render() {
    return (
      <ForceDirectedGraph
        width={window.innerWidth}
        height={window.innerHeight}
        graph={data}
      />
    )
  }
}
