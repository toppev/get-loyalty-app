import React from 'react';
import App from '../App';
import { render } from 'react-dom';

describe('(Component) App', () => {

  it('renders without exploding', () => {
    const div = document.createElement('div')
    render(<App/>, div)
  })

})
