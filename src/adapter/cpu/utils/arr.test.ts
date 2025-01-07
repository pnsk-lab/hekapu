import { assertEquals } from '@std/assert'
import { getArrItemByIndexes, setArrItemByIndexes } from './arr.ts'

Deno.test('getArrItemByIndexes', () => {
  const arr = [
    [
      [1, 2, 3],
    ],
    2,
  ]
  assertEquals(
    getArrItemByIndexes(arr, [0, 0, 1]),
    2,
  )
  assertEquals(
    getArrItemByIndexes(arr, [1]),
    2,
  )
})

Deno.test('setArrItemByIndexes', () => {
  const arr = [
    0,
    [1],
    [[2]],
  ]
  setArrItemByIndexes(arr, [2, 0, 0], (prev) => prev + 1)
})
