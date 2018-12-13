import * as React from 'react'
import { Component } from 'react'
import { Route, Switch } from 'react-router'

import Page from '../components/page'


class App extends Component {

  render() {

    return (
      <Switch>
        <Route
          exact path="/"
          render={() => <Page id={0} />}
        />

        <Route
          path="/items/:id"
          render={({ match }) => <Page id={match.params.id} />}
        />

      </Switch>
    )
  }
}

export default App