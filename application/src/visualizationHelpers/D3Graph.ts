import {D3SearchStrategy} from './D3SearchStategy'
import {D3VisLifeCycle} from './D3VisLifeCycle'
import { GraphProps } from 'typedecls/ReactPropsAndStates'
import * as d3 from 'd3';

export abstract class D3Graph<VertexType>
  implements D3VisLifeCycle<GraphProps, any> {
  searchStrategy!: D3SearchStrategy<VertexType>

  abstract create(selection: Element, props: GraphProps, state: any): void
  abstract update(selection: Element, props: GraphProps, state: any): void

  destroy(documentElement: Element): void {
    d3.select(documentElement).selectAll("*").remove();
  }

  abstract highlightSelectedVertex(selectedVertex: VertexType): void
  abstract dehighlightSelectedVertex(selectedVertex: VertexType): void
}
