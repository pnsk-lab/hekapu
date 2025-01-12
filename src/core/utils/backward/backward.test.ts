import { assertEquals } from '@std/assert'
import type { CalculatingNode } from '../../../types.ts'
import { buildGradientTree } from './mod.ts'
import createCPUAdapter from '../../../adapter/cpu/mod.ts'

Deno.test('buildGradientTree', async (t) => {
  const cpu = createCPUAdapter() // for testing
  await t.step('Simple Addition', async () => {
    // y = x0 + x1
    // ∂y/∂x0 = 1
    const calculatingHistory: CalculatingNode = {
      type: 'add',
      left: {
        type: 'tensor',
        id: 0,
      },
      right: {
        type: 'tensor',
        id: 1,
      },
    }
    // ∂y/∂x0
    const gradientTree = buildGradientTree(calculatingHistory, 0)
    const result = await cpu.toArray(await cpu.calculate(gradientTree))
    assertEquals(result, 1)
  })
})
