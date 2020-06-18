import {EdgeBundlingNode, Vertex} from 'typedecls/D3Types'
import {D3SearchStrategy} from './D3SearchStategy'

export class D3EdgeBundlingSearchStrategy extends D3SearchStrategy<
  EdgeBundlingNode
> {
  root: EdgeBundlingNode

  constructor(
    root: EdgeBundlingNode,
    highlightCallback: any,
    dehighlightCallback: any
  ) {
    super([] as EdgeBundlingNode[], highlightCallback, dehighlightCallback)

    this.root = root
  }

  findElement(
    allVerticesList: Vertex[],
    searchTerm: string
  ): EdgeBundlingNode[] {
    const foundElements = allVerticesList.filter(vertex =>
      vertex.id === parseInt(searchTerm)
    )
    return this.root
      .leaves()
      .filter(d => foundElements.includes(d.data as Vertex))
  }
}
