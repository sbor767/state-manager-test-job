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

    // Must reload from API if not in cache or is the root menu item (by specification).
    const isRootItem = pageStateInStack !== null && +stack[pageStateInStack].currentItem.parentId === 0


    // Found and meets - Get data from the stack.
    if (pageStateInStack !== null && !isRootItem) {

      // Truncate stored stack from redundant data.
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


      // Get data from API.
      Promise.all([
        getItemPromise(id),
        getChildrenPromise(id)
      ])

        .then(([currentItem, list]) => {

          // Add new data to stack - to the stack end or instead.
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
      <div className="Page__headerInner">
        <div className="Page_headerTopRowWrapper">
          <Link to="/">
            <img src={'/assets/logo.svg'} className="Page__headerLogo" alt="logo"/>
          </Link>
          <div className="Page__headerTitle">State manager</div>

          <a href="http://ya.ru" target="_blank">
            <div className="Page__headerSourceCode">Source Code</div>
          </a>
        </div>

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
        <h1 className="Page__sectionTitle">{`Section${hierarchyCode}`}</h1>
        <section className="Page__section">

          {this.state.needUpdate ? (
            <div className="Page__loading">Loading...</div>
          ) : (
            <Fragment>
              <h2 className="Page__sectionListTitle">{`List${hierarchyCode}`}</h2>
              <div className="Page__sectionListWrapper">

                {list.length ? (
                  <div className="Page__sectionList">

                    {list}
                  </div>

                ) : (
                  <h2 className="Page_sectionNoData">No data</h2>
                )}

                {!!this.state.receivedFrom && <div
                  className={'Page__sectionReceivedFrom' + (!!this.state.receivedFrom && ` Page__sectionReceivedFrom${this.state.receivedFrom}`)}>
                  Received from: {this.state.receivedFrom}
                </div>}

              </div>
            </Fragment>
          )}
        </section>

      </div>
    </div>

  }
}