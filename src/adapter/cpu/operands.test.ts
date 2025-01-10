import { assertEquals } from '@std/assert'
import type { CPUTensor } from './mod.ts'
import { ones, processLR, zeros } from './operands.ts'

Deno.test('processLR', () => {
  const leftMatrix = (): CPUTensor => ({
    data: [[1, 2], [3, 4]],
    shape: [2, 2]
  })
  const rightMatrix = (): CPUTensor => ({
    data: [[5, 6], [7, 8]],
    shape: [2, 2]
  })

  assertEquals(
    processLR(leftMatrix(), rightMatrix(), (left, right) => left + right).data,
    [[6, 8], [10, 12]]
  )
  assertEquals(
    processLR(leftMatrix(), rightMatrix(), (left, right) => left - right).data,
    [[-4, -4], [-4, -4]]
  )
})

Deno.test('zeros', () => {
  assertEquals(zeros([2, 2]), [[0, 0], [0, 0]])
})

Deno.test('ones', () => {
  assertEquals(ones([2, 2]), [[1, 1], [1, 1]])
})
