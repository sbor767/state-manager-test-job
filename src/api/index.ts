import { MenuItemType } from '../types'

const API_TEST_DELAY: number = 500

interface Item {
  id: number
  parentId: number
}
interface Items {
  [key: string]: Item
}

const items: Items = {
  1: {
    id: 1,
    parentId: 0,
  },
  2: {
    id: 2,
    parentId: 0,
  },
  3: {
    id: 3,
    parentId: 0,
  },
  4: {
    id: 4,
    parentId: 0,
  },
  5: {
    id: 5,
    parentId: 1,
  },
  6: {
    id: 6,
    parentId: 2,
  },
  7: {
    id: 7,
    parentId: 3,
  },
  8: {
    id: 8,
    parentId: 4,
  },
  9: {
    id: 9,
    parentId: 5,
  },
  10: {
    id: 10,
    parentId: 5,
  },
  11: {
    id: 11,
    parentId: 5,
  },
  12: {
    id: 12,
    parentId: 9,
  },
  13: {
    id: 13,
    parentId: 9,
  },
  14: {
    id: 14,
    parentId: 10,
  },
  15: {
    id: 15,
    parentId: 14,
  },
  16: {
    id: 16,
    parentId: 14,
  },
  17: {
    id: 17,
    parentId: 14,
  },
  18: {
    id: 18,
    parentId: 10,
  },
  19: {
    id: 19,
    parentId: 6,
  },
  20: {
    id: 20,
    parentId: 6,
  },
  21: {
    id: 21,
    parentId: 19,
  },
  22: {
    id: 22,
    parentId: 20,
  },
  23: {
    id: 23,
    parentId: 7,
  },
  24: {
    id: 24,
    parentId: 8,
  },
  25: {
    id: 25,
    parentId: 1,
  },
  26: {
    id: 26,
    parentId: 1,
  },
  27: {
    id: 27,
    parentId: 1,
  },
}


function getHierarchyCode(id: number): string {
  const siblings: string[] = Object.keys(items).filter(key => items[key].parentId === items[id].parentId)
  const codeAmongSiblings: string = (siblings.indexOf(id.toString()) + 1).toString()
  const parentHierarchy = items[id].parentId ? getHierarchyCode(items[id].parentId) + '.' : ''

  return parentHierarchy + codeAmongSiblings
}

function getItem(id:number): MenuItemType {
  return {...items[id], hierarchyCode: getHierarchyCode(id)}
}


export function getItemPromise(id: number): Promise<MenuItemType> {

  return new Promise<MenuItemType>((resolve: (value: MenuItemType) => void, reject: (reason?: any) => void) => {

    setTimeout(() => {
      if(!!id && !items[id]) reject(`No items exist with id=${id}`)

      resolve(getItem(id))

    }, API_TEST_DELAY)
  })
}


export function getChildrenPromise(id: number = 0): Promise<MenuItemType[]> {

  return new Promise<MenuItemType[]>((resolve: (value: MenuItemType[]) => void, reject: (reason?: any) => void) => {

    setTimeout(() => {

      if(!!id && !items[id]) reject(`No items exist with id=${id}`)

      const keys: string[] = Object.keys(items).filter(key => items[key].parentId === +id)
      const children: MenuItemType[] = keys.reduce(function(acc: MenuItemType[], key) {
        acc.push(getItem(+key))
        return acc
      }, [])

      resolve(children)

    }, API_TEST_DELAY)
  })
}