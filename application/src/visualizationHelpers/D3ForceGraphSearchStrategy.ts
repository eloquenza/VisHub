import {Vertex} from 'typedecls/D3Types'
import {D3SearchStrategy} from './D3SearchStategy'

export class D3ForceGraphSearchStrategy extends D3SearchStrategy<Vertex> {
  constructor(highlightCallback: any, dehighlightCallback: any) {
    super([] as Vertex[], highlightCallback, dehighlightCallback)
  }

  findElement(allVerticesList: Vertex[], searchTerm: string): Vertex[] {
    return allVerticesList.filter(vertex =>
      vertex.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
}
