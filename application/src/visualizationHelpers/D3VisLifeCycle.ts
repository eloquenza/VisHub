export interface D3VisLifeCycle<PropType, StateType> {
  // for componentDidMount
  create(selection: Element, props: PropType, state: StateType): void
  // for componentDidUpdate
  update(): void
  // for componentWillUnmount
  destroy(): void
}
