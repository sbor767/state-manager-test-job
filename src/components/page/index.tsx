import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'

import { Item, StackItem, ListItem } from '../../types'
import { getItem, getChildren } from '../../api'
import MenuItem from '../menu-item'
import './style.css'
// import { RouteComponentProps } from "react-router"


export interface Props {
  id: number,
  // name: string,
  stack?: StackItem,
  menu: Item[],
  // @TODO Find right type.
  // location: RouteComponentProps
  location: object,
  setStack?: (stack: StackItem) => void
}

interface ComponentState {
  item?: Item,
  list: ListItem[],
  error: string
}

// export default function Page({ id, stack, location, setStack }: Props) {
export default class Page extends Component<Props, ComponentState> {

  state: ComponentState = {
    item: undefined,
    list: [],
    error: ''
  }

  componentDidMount(): void {
    console.log('Page__componentDidMount=props', this.props)

    const { id, stack, setStack } = this.props

    if (!id) return

    if (!this.state.item) {
      const fitStack: StackItem|undefined = this.getStackItem(stack)
      if (!!fitStack) {
        this.setState({item: fitStack.item, list: fitStack.list, error: ''})
        // @TODO May cause looping.
        if (!!setStack) setStack(fitStack)
      } else {

        // Get from API.
        Promise.all([
          getItem(id),
          getChildren(id)
        ])

          .then(([item, list]) => {
            console.log('Page__componentDidMount=(before) item, list', item, list)
            console.log('Page__componentDidMount=(before) state', this.state)
            this.setState({item, list, error: ''})
            if (!!setStack) setStack({item, list})
          })

          .catch(error => this.setState(error))
      }
    }
  }

  getStackItem(stack: StackItem|undefined): StackItem|undefined {
    if (!stack) return undefined

    const { id } = this.props
    if (stack.item.id === id) return stack

    if (!!stack.child) return this.getStackItem(stack.child)

    return undefined
  }

  render() {

    const { menu } = this.props

    return <div className="Page">

      <header className="Page__header">
        <a href="http://ya.ru" target="_blank">
          <div className="Page__headerSourceCode">Source Code</div>
        </a>
        <Link to="/">
          <img src={'/assets/logo.svg'} className="Page__logo" alt="logo"/>
        </Link>
        <h1 className="Page__title">{name}</h1>

        <div className="Page__headerMenuWrapper">
          <div className="Page__headerMenu">
            {menu.map(item => <MenuItem
                key={`header-menu-${item.id}`}
                id={item.id}
                name={item.name}
              />
            )}
          </div>
        </div>
      </header>

      <div className="Page__contentWrapper">

        <div className="Page__content">
          {this.state.list.map(item => <MenuItem
              key={`section-menu-${item.id}`}
              id={item.id}
              name={item.name}
          />
          )}
        </div>

      </div>

    </div>

  }
}