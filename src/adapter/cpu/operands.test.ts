import { assertEquals } from '@std/assert'
import type { CPUTensor } from './mod.ts'
import { matmul, ones, processLR, zeros } from './operands.ts'

Deno.test('processLR', () => {
  const leftMatrix = (): CPUTensor => ({
    data: [[1, 2], [3, 4]],
    shape: [2, 2],
  })
  const rightMatrix = (): CPUTensor => ({
    data: [[5, 6], [7, 8]],
    shape: [2, 2],
  })

  assertEquals(
    processLR(leftMatrix(), rightMatrix(), (left, right) => left + right).data,
    [[6, 8], [10, 12]],
  )
  assertEquals(
    processLR(leftMatrix(), rightMatrix(), (left, right) => left - right).data,
    [[-4, -4], [-4, -4]],
  )
})

Deno.test('zeros', () => {
  assertEquals(zeros([2, 2]), [[0, 0], [0, 0]])
})

Deno.test('ones', () => {
  assertEquals(ones([2, 2]), [[1, 1], [1, 1]])
})

Deno.test('matmul', () => {
  const left = { shape: [3, 2], data: [[1, 1], [2, 2], [3, 3]] }
  const right = { shape: [2, 2], data: [[1, 2], [3, 4]] }

  assertEquals(matmul(left, right), { shape: [3, 2], data: [[4, 6], [8, 12], [12, 18]] })
})
