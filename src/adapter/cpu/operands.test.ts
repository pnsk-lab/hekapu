import { assertEquals } from '@std/assert'
import type { CPUTensor } from './mod.ts'
import { add, matmul, matVecMul, ones, processLR, sub, zeros } from './operands.ts'

Deno.test('processLR', async (t) => {
  await t.step('basic', () => {
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
  await t.step('with other shape', () => {
    const leftTensor = (): CPUTensor => ({
      data: [[1, 2], [3, 4]],
      shape: [2, 2],
    })
    const rightTensor = (): CPUTensor => ({
      data: 1,
      shape: [],
    })

    assertEquals(
      processLR(leftTensor(), rightTensor(), (left, right) =>  left + right).data,
      [[2, 3], [4, 5]]
    )
  })
})
Deno.test('add', () => {
  assertEquals(add({
    shape: [2, 2],
    data: [[1, 2], [3, 4]],
  }, {
    shape: [2, 2],
    data: [[5, 6], [7, 8]],
  }), {
    shape: [2, 2],
    data: [[6, 8], [10, 12]],
  })
  assertEquals(add({
    shape: [2, 2],
    data: [[1, 2], [3, 4]],
  }, {
    shape: [],
    data: 1,
  }), {
    shape: [2, 2],
    data: [[2, 3], [4, 5]],
  })
})

Deno.test('sub', () => {
  assertEquals(sub({
    shape: [2, 2],
    data: [[1, 2], [3, 4]],
  }, {
    shape: [2, 2],
    data: [[5, 6], [7, 8]],
  }), {
    shape: [2, 2],
    data: [[-4, -4], [-4, -4]],
  })
})

Deno.test('zeros', () => {
  assertEquals(zeros([2, 2]), [[0, 0], [0, 0]])
  assertEquals(zeros([]), 0)
})

Deno.test('ones', () => {
  assertEquals(ones([2, 2]), [[1, 1], [1, 1]])
  assertEquals(ones([]), 1)
})

Deno.test('matmul', () => {
  const left = { shape: [3, 2], data: [[1, 1], [2, 2], [3, 3]] }
  const right = { shape: [2, 2], data: [[1, 2], [3, 4]] }

  assertEquals(matmul(left, right), { shape: [3, 2], data: [[4, 6], [8, 12], [12, 18]] })
})

Deno.test('matVecMul', () => {
  const left = { shape: [2], data: [1, 2] }
  const right = { shape: [2, 3], data: [[1, 2, 3], [4, 5, 6]] }

  assertEquals(matVecMul(left, right), { shape: [3], data: [9, 12, 15] })
})

