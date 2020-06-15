import {ValueFn, BaseType} from 'd3'

export interface ContainerDimensions {
  width: number
  height: number
}

export interface Margin {
  top: number
  bottom: number
  left: number
  right: number
}

type SVGCoordinateNames = 'x' | 'y' | 'dx' | 'dy'

export type SVGAttributeName =
  | 'alignment-baseline'
  | 'baseline-shift'
  | 'clip'
  | 'clip-path'
  | 'clip-rule'
  | 'color'
  | 'color-interpolation'
  | 'color-interpolation-filters'
  | 'color-profile'
  | 'color-rendering'
  | 'cursor'
  | 'direction'
  | 'display'
  | 'dominant-baseline'
  | 'enable-background'
  | 'fill'
  | 'fill-opacity'
  | 'fill-rule'
  | 'filter'
  | 'flood-color'
  | 'flood-opacity'
  | 'font-family'
  | 'font-size'
  | 'font-size-adjust'
  | 'font-stretch'
  | 'font-style'
  | 'font-variant'
  | 'font-weight'
  | 'glyph-orientation-horizontal'
  | 'glyph-orientation-vertical'
  | 'image-rendering'
  | 'kerning'
  | 'letter-spacing'
  | 'lighting-color'
  | 'marker-end'
  | 'marker-mid'
  | 'marker-start'
  | 'mask'
  | 'opacity'
  | 'overflow'
  | 'pointer-events'
  | 'shape-rendering'
  | 'solid-color'
  | 'solid-opacity'
  | 'stop-color'
  | 'stop-opacity'
  | 'stroke'
  | 'stroke-dasharray'
  | 'stroke-dashoffset'
  | 'stroke-linecap'
  | 'stroke-linejoin'
  | 'stroke-miterlimit'
  | 'stroke-opacity'
  | 'stroke-width'
  | 'text-anchor'
  | 'text-decoration'
  | 'text-rendering'
  | 'transform'
  | 'unicode-bidi'
  | 'vector-effect'
  | 'visibility'
  | 'word-spacing'
  | 'writing-mode'
  | SVGCoordinateNames

export type SVGCSSAttribute = {
  name: SVGAttributeName
  value:
    | null
    | string
    | number
    | boolean
    | ValueFn<BaseType, any, string | number | boolean | null>
}

export type FontWeightString =
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | number
  | 'initial'
  | 'inherit'
