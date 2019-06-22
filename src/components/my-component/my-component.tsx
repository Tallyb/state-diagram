import { Component, Prop, h, State, Method, JSX, Watch, ComponentWillLoad } from '@stencil/core';

export interface ITransition {
  name: string;
  to: string;
  description?: string;
}
export interface IState {
  name: string;
  description?: string;
  transitions: Array<ITransition>;
  isFinal?: boolean;
}

export interface IDiagram {
  [key: string]: IState
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent implements ComponentWillLoad{
  /**
   * State Diagram structure
   */
  @Prop() diagram: IDiagram;

  /**
   * The name of the initial state
   */
  @Prop() initial: string;

  @State() currentState: IState;
  
  @Method() 
  async getCurrentState() {
    return this.currentState;
  }

  @Watch('initial')
  initialHandler(newValue: string) {
    this.setState(newValue);
  }

  componentWillLoad() {
    this.setState(this.initial)
  }

  setState(name: string) {
    if (typeof this.diagram === 'object') {
      let newState = this.diagram[name];
      if (!newState) return;
      this.currentState = newState;

    }
  }

  renderTransitions(transitions: Array<ITransition>): JSX.Element {
    return (
    <ul class="transitions">
      {transitions.map(t => <li onClick={ (event: UIEvent) => this.setState(t.to)}>{t.name}</li>)}
    </ul>
  )};

  renderState(state): JSX.Element {
    return (
      <div class="state">
        <p>{state.name}</p>
        {this.renderTransitions(state.transitions)} 
      </div>
    )
  }

  render(): JSX.Element {

    return (
      <div class="container">
        {(!!this.currentState)
          ? this.renderState(this.currentState)
          : <div> State not yet known </div> 
        }
      </div>
    );
  }
}
