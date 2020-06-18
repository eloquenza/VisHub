import {Vertex, Edge} from 'typedecls/D3Types'
import {D3SearchStrategy} from './D3SearchStategy'
import * as d3 from 'd3'
import { ClassElementNames } from 'appConstants'

export class D3ForceGraphSearchStrategy extends D3SearchStrategy<Vertex> {
  constructor(highlightCallback: any, dehighlightCallback: any) {
    super([] as Vertex[], highlightCallback, dehighlightCallback)
  }

  findElement(allVerticesList: Vertex[], searchTerm: string): Vertex[] {
    return allVerticesList.filter(vertex =>
      vertex.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  highlightNewSearchResults(): void {
     // to allow multiple highlighting during a search, first stroke-opacity from each lower
     d3.selectAll<SVGLineElement, Edge>(
      `.${ClassElementNames.forceEdgesClassName}`
    ).attr('stroke-opacity', 0.1)
    // then call the highlight callback for each vertex found during the search
    this.previousSearch.forEach(d => this.highlightCallback(d))
  }
}
