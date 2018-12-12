export interface Item {
  id: number,
  parentId: number,
  name: string
}

export interface ListItem {
  id: number,
  name: string
}

export interface StackItem {
  item: Item,
  list: ListItem[]
  child?: StackItem
}

export interface State {
  menu: Item[],
  current?: ListItem,
  stack?: StackItem,
  error: string
}
