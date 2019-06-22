import { newSpecPage } from '@stencil/core/testing';

import {MyComponent, IDiagram } from './my-component';



describe('my-component', () => {
  const diagram: IDiagram = {
    a: {name: 'a', description: 'aaa', transitions: [
      {name: 'toB', to: 'b'},
      {name: 'toC', to: 'c'}
    ]},
    b: {name: 'b', description: 'bbb', transitions: [
      {name: 'toA', to: 'a'},
      {name: 'toC', to: 'c'}
    ]},
    c: {name: 'c', description: 'ccc', transitions: [
      {name: 'toA', to: 'a'},
      {name: 'toB', to: 'b'}
    ]}
  }

  it('should render initial state', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component></my-component>`
    });
    page.rootInstance.diagram = diagram; 
    page.rootInstance.initial = 'a';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('should render empty state if initial does not exist', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component></my-component>`
    });
    page.rootInstance.diagram = diagram; 
    page.rootInstance.initial = 'x';
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });


  fit('should move to a new State', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component></my-component>`
    });
    page.rootInstance.diagram = diagram; 
    page.rootInstance.initial = 'a';
    await page.waitForChanges();
    let transitions = await page.root.shadowRoot.querySelectorAll('li');
    transitions[0].click();
    await page.waitForChanges();
    
    expect(await page.root.shadowRoot.querySelector('p').textContent).toEqual('b');

  });


});
