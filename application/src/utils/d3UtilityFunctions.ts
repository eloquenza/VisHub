import * as d3 from 'd3'
import {FontWeightString, SVGCSSAttribute} from 'typedecls/CssStyleTypes'
import {Vertex, Edge} from 'typedecls/D3Types'
import {ClassElementNames} from 'appConstants'

function assignValueToAttr<ElemType extends Element>(
  selection: d3.Selection<ElemType, any, any, any>,
  attr: string,
  value: string | number
) {
  return selection.attr(attr, value)
}

export function colorEdges(
  edges: d3.Selection<SVGPathElement, unknown, null, undefined>,
  colorHexString: string
) {
  return assignValueToAttr<SVGPathElement>(edges, 'stroke', colorHexString)
}

export function colorText(
  texts: d3.Selection<SVGTextElement, unknown, null, undefined>,
  colorHexString: string
) {
  return assignValueToAttr<SVGTextElement>(texts, 'fill', colorHexString)
}

export function setFontWeightText(
  texts: d3.Selection<SVGTextElement, unknown, null, undefined>,
  fontWeightString: FontWeightString
) {
  return assignValueToAttr<SVGTextElement>(
    texts,
    'font-weight',
    fontWeightString
  )
}

export function applyAttrsToSelection<ElemType extends Element>(
  selection: d3.Selection<ElemType, any, any, any>,
  attributes: SVGCSSAttribute[]
) {
  attributes.forEach(attribute => {
    // This feels bad to write due to type interference failing to know which function to call as the .attr function is horribly overloaded.
    if (typeof attribute.value === null) {
      selection.attr(attribute.name, attribute.value as null)
    } else {
      selection.attr(
        attribute.name,
        attribute.value as string | number | boolean
      )
    }
  })
  return selection
}

export function highlightIncidentForceEdges(
  selectedVertex: Vertex,
  color: string,
  opacity: number
) {
  d3.selectAll<SVGLineElement, Edge>(
    `.${ClassElementNames.forceEdgesClassName}`
  ).each((edge: Edge, index: number, nodes: ArrayLike<SVGLineElement>) => {
    const source = edge.source as Vertex
    const target = edge.target as Vertex
    if (source.id === selectedVertex.id || target.id === selectedVertex.id) {
      d3.select(nodes[index])
        .attr('stroke', color)
        .attr('stroke-opacity', opacity)
    }
  })
}
