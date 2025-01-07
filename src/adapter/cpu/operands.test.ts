import { assertEquals } from '@std/assert'
import type { CPUMatrix } from './mod.ts'
import { processLR } from './operands.ts'

Deno.test('processLR', () => {
  const leftMatrix = (): CPUMatrix => ({
    data: [[1, 2], [3, 4]],
    shape: [2, 2]
  })
  const rightMatrix = (): CPUMatrix => ({
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
