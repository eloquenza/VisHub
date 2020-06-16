export interface D3VisLifeCycle<PropType, StateType> {
  // for componentDidMount
  create(documentElement: Element, props: PropType, state: StateType): void
  // for componentDidUpdate
  update(documentElement: Element, props: PropType, state: StateType): void
  // for componentWillUnmount
  destroy(documentElement: Element): void
}
