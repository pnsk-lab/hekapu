import type { AnyShapeJSArray, AnyShapeJSArrayOrNumber } from '../../../types.ts'

export function getArrItemByIndexes(
  arr: AnyShapeJSArrayOrNumber,
  indexes: number[],
): number {
  if (typeof arr === 'number') {
    if (indexes.length === 0) {
      return arr
    } else {
      throw new Error('Index out of bounds')
    }
  }

  let item = arr
  for (const index of indexes) {
    const got = item[index]
    if (Array.isArray(got)) {
      item = got
    } else {
      return got
    }
  }
  throw new Error('Index out of bounds')
}

export function setArrItemByIndexes(
  arr: AnyShapeJSArray,
  indexes: number[],
  setValue: (prev: number) => number,
) {
  let item = arr
  for (const index of indexes) {
    const got = item[index]
    if (Array.isArray(got)) {
      item = got
    } else {
      item[index] = setValue(got)
    }
  }
}
