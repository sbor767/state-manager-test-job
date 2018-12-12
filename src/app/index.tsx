import * as React from 'react'
import { Component } from 'react'
import { Route, Switch } from 'react-router'

import { StackItem, State } from '../types'
import { getChildren } from '../api'
import Page from '../components/page'


class App extends Component {

  state: State = {
    menu: [],
    current: undefined,
    stack: undefined,
    error: ''
  }

  componentDidMount(): void {
    console.log('App__componentDidMount=props', this.props)

    if(!this.state.menu.length) {
      getChildren(0)
        .then(value => {
          console.log('Page__componentDidMount_then=value', value)
          this.setState({menu: value})
        })
        .catch(error => this.setState(error))
    }
  }

  setStackHandler = (stack: StackItem) => this.setState(stack)

  render() {
    return (
      <Switch>
        <Route
          exact path="/"
          render={({ location }) => {
            return <Page id={0} stack={this.state.stack} location={location} menu={this.state.menu} />
            }
          }
        />

        <Route
          path="/items/:id"
          render={({ match, location }) => {
            const id: number = match.params.id

            return <Page id={id} stack={this.state.stack} location={location} setStack={this.setStackHandler} menu={this.state.menu} />
            }
          }
        />

      </Switch>
    )
  }
}

export default App