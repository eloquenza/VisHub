import {Vertex} from 'typedecls/D3Types'

export abstract class D3SearchStrategy<VertexType> {
  previousSearch: VertexType[]
  highlightCallback: any
  dehighlightCallback: any

  constructor(
    previousSearch: VertexType[],
    highlightCallback: any,
    dehighlightCallback: any
  ) {
    this.previousSearch = previousSearch
    this.highlightCallback = highlightCallback
    this.dehighlightCallback = dehighlightCallback
  }

  search(verticesList: Vertex[], searchTerm: string): void {
    if (typeof this.previousSearch !== 'undefined') {
      this.dehighlightOldSearchResults()
    }
    // skip if empty to avoid highlighting all nodes
    if (searchTerm === '') {
      return
    }
    this.previousSearch = this.findElement(verticesList, searchTerm)
    this.highlightNewSearchResults()
  }

  dehighlightOldSearchResults(): void {
    this.previousSearch.forEach(d => this.dehighlightCallback(d))
  }

  highlightNewSearchResults(): void {
    this.previousSearch.forEach(d => this.highlightCallback(d))
  }

  abstract findElement(
    allVerticesList: Vertex[],
    searchTerm: string
  ): VertexType[]
}
