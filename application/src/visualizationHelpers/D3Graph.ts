import {D3SearchStrategy} from './D3SearchStategy'
import {D3VisLifeCycle} from './D3VisLifeCycle'

export abstract class D3Graph<VertexType, PropType, StateType>
  implements D3VisLifeCycle<PropType, StateType> {
  searchStrategy!: D3SearchStrategy<VertexType>

  abstract create(selection: Element, props: any, state: any): void
  abstract update(): void
  abstract destroy(): void

  abstract highlightSelectedVertex(selectedVertex: VertexType): void
  abstract dehighlightSelectedVertex(selectedVertex: VertexType): void
}
