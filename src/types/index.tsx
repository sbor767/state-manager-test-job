export interface MenuItemType {
  id: number
  parentId: number
  hierarchyCode: string
}

export interface PageStatesItemType {
  currentItem: MenuItemType
  list: MenuItemType[]
}