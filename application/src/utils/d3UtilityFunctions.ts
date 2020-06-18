import * as d3 from 'd3'
import {FontWeightString, SVGCSSAttribute} from 'typedecls/CssStyleTypes'

import * as tooltips from '../data/userDataQueryResults.json'

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

export function createTooltipString(accountName: string) {
  if (accountName !== 'undefined') {
    const tooltipString = `Full name: ${(tooltips.data as UserNameAsKey)[accountName]?.name || 'No full name found'}\n`
      + `Company: ${(tooltips.data as UserNameAsKey)[accountName]?.company || 'No companies found'}\n`
      + `Bio: ${(tooltips.data as UserNameAsKey)[accountName]?.bio || 'No bio found'}\n`
      + `Location: ${(tooltips.data as UserNameAsKey)[accountName]?.location  || 'No location found' }\n`
      + `Account created at: ${(tooltips.data as UserNameAsKey)[accountName]?.createdAt}\n`
      + `Last seen on GitHub: ${(tooltips.data as UserNameAsKey)[accountName]?.updatedAt}\n`

    return tooltipString
  }
  return "Sorry, no data available - user currently not on GitHub"
}

// types needed to read out the json holding all the account-specific user data, i.e. for tooltips
type RepositoryNode = {
  name: string
  primaryLanguage: null | {
    name: string
  }
}

type TooltipType = {
  login: string
  name: string | null
  company: string | null
  bio: string | null
  location: string | null
  avatarUrl: string
  createdAt: string
  updatedAt: string
  repositories: {
    nodes: RepositoryNode[]
  }
}

type UserNameAsKey = {
  [key: string]: TooltipType | null
}
