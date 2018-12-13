export interface MenuItemType {
  id: number
  parentId: number
  name: string
}

export interface PageStatesItemType {
  currentItem: MenuItemType
  list: MenuItemType[]
}