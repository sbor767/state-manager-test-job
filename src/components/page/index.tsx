import * as React from 'react'
import { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { MenuItemType, PageStatesItemType } from '../../types'
import { getItemPromise, getChildrenPromise } from '../../api'
import MenuItem from '../menu-item'
import './style.css'


export interface Props {
  id: number
}

const enum ReceivedFrom {
  Stack = 'Stack',
  Api = 'API'
}

interface PageState {
  needUpdate: boolean
  menu: MenuItemType[]

  currentItem?: MenuItemType
  list: MenuItemType[]
  receivedFrom?: ReceivedFrom

  pageStatesStack: PageStatesItemType[]
  error: string
}

export default class Page extends Component<Props, PageState> {

  state: PageState = {
    needUpdate: true,
    menu: [],

    currentItem: undefined,
    list: [],
    receivedFrom: undefined,

    pageStatesStack: [],
    error: ''
  }


  static getDerivedStateFromProps(nextProps: Props, prevState: PageState) {
    if (!!prevState.currentItem && +nextProps.id !== prevState.currentItem.id) {
      return {needUpdate: true}
    }
    return null
  }


  componentDidMount(): void {
    // Init menu.
    if(!this.state.menu.length) {
      getChildrenPromise(0)
        .then(value => {
          this.setState({menu: value})
        })
        .catch(error => this.setState(error))
    }

    const { id } = this.props

    // For the root page we do not need data
    if (!id) return

    if (!this.state.currentItem) {
      this.loadData()
    }
  }


  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<PageState>, snapshot?: any): void {
    if (this.state.needUpdate) this.loadData()
  }


  loadData = () => {
    const { id } = this.props
    const stack = this.state.pageStatesStack

    // Root page - no data need.
    if (+id === 0) {
      const nullItem: MenuItemType = {id: 0, parentId: 0, hierarchyCode: ''}
      this.setState({
        needUpdate: false,
        currentItem: nullItem,
        list: [],
        receivedFrom: undefined,
        pageStatesStack: [],
        error: ''
      })
      return
    }

    // @pageStateInStack - index of the page with required id in the stack (null if not found).
    const pageStateInStack: number|null = this.getPageIndexFromStack(id)
    console.log('Page__loadData=pageStateInStack', pageStateInStack)
    console.log('Page__loadData=state', this.state)


    // Must reload from API if not in cache or is the root menu item (by specification).
    const isRootItem = pageStateInStack !== null && +stack[pageStateInStack].currentItem.parentId === 0

    // Get from stack.
    if (pageStateInStack !== null && !isRootItem) {

      // Truncate stack if it bigger than need.
      let truncatedStack = [...stack]
      truncatedStack.length = pageStateInStack + 1

      this.setState({
        needUpdate: false,
        currentItem: stack[pageStateInStack].currentItem,
        list: stack[pageStateInStack].list,
        receivedFrom: ReceivedFrom.Stack,
        pageStatesStack: truncatedStack,
        error: ''
      })

    } else {

      // Get from API.
      Promise.all([
        getItemPromise(id),
        getChildrenPromise(id)
      ])

        .then(([currentItem, list]) => {

          // Add to stack
          // Root menu item must reset the stack.
          const isNextAfterLastInStack = stack.length && currentItem.parentId === stack[stack.length - 1].currentItem.id
          let newStack = isNextAfterLastInStack && !isRootItem ? [...stack] : []
          newStack.push({currentItem, list})

          this.setState({
            needUpdate: false,
            currentItem,
            list,
            receivedFrom: ReceivedFrom.Api,
            pageStatesStack: newStack,
            error: ''
          })
        })

        .catch(error => this.setState(error))
    }
  }

  getPageIndexFromStack = (id: number): number|null => {
    let index = null
    this.state.pageStatesStack.forEach((item, i) => {
      if (item.currentItem.id === +id) index = i
    })
    return index
  }


  render() {

    const Header = () => <header className="Page__header">
      <a href="http://ya.ru" target="_blank">
        <div className="Page__headerSourceCode">Source Code</div>
      </a>
      <Link to="/">
        <img src={'/assets/logo.svg'} className="Page__logo" alt="logo"/>
      </Link>
      <h1 className="Page__title">{name}</h1>

      <div className="Page__headerMenuWrapper">
        <div className="Page__headerMenu">
          {this.state.menu.map(item => <MenuItem
              key={`header-menu-${item.id}`}
              id={item.id}
              name={`MenuItem${item.hierarchyCode}`}
              isTopMenu
            />
          )}
        </div>
      </div>
    </header>

    const list = this.state.list.map(item => <MenuItem
        key={`section-menu-${item.id}`}
        id={item.id}
        name={`Item${item.hierarchyCode}`}
      />
    )

    const hierarchyCode: string = (
      this.props.id ?
        !!this.state.currentItem ? this.state.currentItem.hierarchyCode : ''
      :
        ' Home'
    )


    return <div className="Page">

      <Header/>

      <div className="Page__sectionWrapper">

        <section className="Page__section">

          {this.state.needUpdate ? (

            <div className="Page__loading">Loading...</div>

          ) : (

            <Fragment>

              <h1 className="Page_sectionTitle">{`Section${hierarchyCode}`}</h1>

              {list.length ? (

                <div className="Page__sectionList">
                  <h2 className="Page__sectionListTitle">{`List${hierarchyCode}`}</h2>
                  {list}
                </div>

              ): (

                <h2 className="Page_sectionNoData">No data</h2>

              )}

              {!!this.state.receivedFrom && <div className={'Page__sectionReceivedFrom' + (!!this.state.receivedFrom && ` Page__sectionReceivedFrom${this.state.receivedFrom}`)}>
                Received from: {this.state.receivedFrom}
              </div>}

            </Fragment>
          )}

        </section>

      </div>

    </div>

  }
}