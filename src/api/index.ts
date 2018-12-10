const API_TEST_DELAY: number = 500

interface Item {
  id: number,
  parentId?: number,
  name: string
}

interface Items {
  // [key: number]: Item
  [key: string]: Item
}

const items: Items = {
  1: {
    id: 1,
    parentId: undefined,
    name: 'MenuItem1',
  },
  2: {
    id: 2,
    parentId: undefined,
    name: 'MenuItem2',
  },
  3: {
    id: 3,
    parentId: undefined,
    name: 'MenuItem3',
  },
  4: {
    id: 4,
    parentId: undefined,
    name: 'MenuItem4',
  },
  5: {
    id: 5,
    parentId: 1,
    name: 'Section1',
  },
  6: {
    id: 6,
    parentId: 2,
    name: 'Section2',
  },
  7: {
    id: 7,
    parentId: 3,
    name: 'Section3',
  },
  8: {
    id: 8,
    parentId: 4,
    name: 'Section4',
  },
  9: {
    id: 9,
    parentId: 5,
    name: 'Section1.1',
  },
  10: {
    id: 10,
    parentId: 5,
    name: 'Section1.2',
  },
  11: {
    id: 11,
    parentId: 5,
    name: 'Section1.3',
  },
  12: {
    id: 12,
    parentId: 9,
    name: 'Section1.1.1',
  },
  13: {
    id: 13,
    parentId: 9,
    name: 'Section1.1.2',
  },
  14: {
    id: 14,
    parentId: 10,
    name: 'Section1.2.1',
  },
  15: {
    id: 15,
    parentId: 14,
    name: 'Section1.2.1.1',
  },
  16: {
    id: 16,
    parentId: 14,
    name: 'Section1.2.1.2',
  },
  17: {
    id: 17,
    parentId: 14,
    name: 'Section1.2.1.3',
  },
  18: {
    id: 18,
    parentId: 10,
    name: 'Section1.3.1',
  },
  19: {
    id: 19,
    parentId: 6,
    name: 'Section2.1',
  },
  20: {
    id: 20,
    parentId: 6,
    name: 'Section2.2',
  },
  21: {
    id: 21,
    parentId: 19,
    name: 'Section2.1.1',
  },
  22: {
    id: 22,
    parentId: 20,
    name: 'Section2.2.1',
  },
  23: {
    id: 23,
    parentId: 7,
    name: 'Section3.1',
  },
  24: {
    id: 24,
    parentId: 8,
    name: 'Section4.2',
  },
}


export function getChildren(id: number): Promise<void> {

  return new Promise<void>((resolve: (value: any) => void, reject: (reason?: any) => void) => {

    setTimeout(() => {
      if(!!id && !items[id]) reject(`No items exist with id=${id}`)

      const keys: string[] = Object.keys(items).filter(key => items[key].parentId === id)
      const children: Item[] = keys.reduce(function(acc: Item[], key) {
        acc.push(items[key])
        return acc
      }, [])

      resolve(children)

    }, API_TEST_DELAY)
  })
}