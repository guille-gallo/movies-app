import React from 'react'
import MovieFilters from './MovieFilters'

describe('<MovieFilters />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MovieFilters />)
  })
})