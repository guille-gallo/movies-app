import React from 'react'
import { ApiProvider } from './ApiContext'

describe('<ApiProvider />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ApiProvider />)
  })
})