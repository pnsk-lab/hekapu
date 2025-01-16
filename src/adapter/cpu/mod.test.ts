import { assertEquals } from '@std/assert'
import { CalculatingNode } from '../../types.ts'
import { CPUAdapter } from './mod.ts'

Deno.test('calculateGradient', async (t) => {
  await t.step('f(x, y) = x + y, df/dx = 1, df/dy = 1', async () => {
    const adapter = new CPUAdapter()

    const x = adapter.createTensorFromArray(2)
    const y = adapter.createTensorFromArray(2)
    const f: CalculatingNode = {
      type: 'add',
      left: { type: 'tensor', id: x, requiresGrad: true },
      right: { type: 'tensor', id: y, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(f)
    assertEquals(await grads[x].toArray(), 1)
    assertEquals(await grads[y].toArray(), 1)
  })
  await t.step('f(x, y) = x + y + y, df/dx = 1, df/dy = 2', async () => {
    const adapter = new CPUAdapter()
    const x = adapter.createTensorFromArray(2)
    const y = adapter.createTensorFromArray(2)
    const f: CalculatingNode = {
      type: 'add',
      left: { type: 'tensor', id: x, requiresGrad: true },
      right: {
        type: 'add',
        left: { type: 'tensor', id: y, requiresGrad: true },
        right: { type: 'tensor', id: y, requiresGrad: true },
      },
    }
    const grads = adapter.calculateGradient(f)
    assertEquals(await grads[x].toArray(), 1)
    assertEquals(await grads[y].toArray(), 2)
  })
  await t.step('Simple dot product', async () => {
    const adapter = new CPUAdapter()
    const x = adapter.createTensorFromArray([1, 2])
    const b = adapter.createTensorFromArray([3, 4])
    const y: CalculatingNode = {
      type: 'dot',
      left: { type: 'tensor', id: x, requiresGrad: true },
      right: { type: 'tensor', id: b, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(y)
    assertEquals(await grads[x].toArray(), [3, 4])
    assertEquals(await grads[b].toArray(), [1, 2])
  })
})
