import {D3SearchStrategy} from './D3SearchStategy'
import {D3VisLifeCycle} from './D3VisLifeCycle'
import { GraphProps, GraphState } from 'typedecls/ReactPropsAndStates'

export abstract class D3Graph<VertexType>
  implements D3VisLifeCycle<GraphProps, GraphState> {
  searchStrategy!: D3SearchStrategy<VertexType>

  abstract create(selection: Element, props: GraphProps, state: GraphState): void
  abstract update(selection: Element, props: GraphProps, state: GraphState): void
  abstract destroy(selection: Element): void

  abstract highlightSelectedVertex(selectedVertex: VertexType): void
  abstract dehighlightSelectedVertex(selectedVertex: VertexType): void
}
