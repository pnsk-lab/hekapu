import { assertEquals } from '@std/assert'
import { CalculatingNode } from '../../types.ts'
import { CPUAdapter, CPUData, CPUTensor } from './mod.ts'

Deno.test('calculateGradient', async (t) => {
  await t.step('f(x, y) = x + y, df/dx = 1, df/dy = 1', async () => {
    const adapter = new CPUAdapter()

    const x = adapter.createTensorFromArray(2)
    const y = adapter.createTensorFromArray(2)
    const f: CalculatingNode<CPUData> = {
      type: 'add',
      left: { type: 'tensor', data: x, requiresGrad: true },
      right: { type: 'tensor', data: y, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(f)
    assertEquals(grads.get(x)?.tensor.data, 1)
    assertEquals(grads.get(y)?.tensor.data, 1)
  })
  await t.step('f(x, y) = x + y + y, df/dx = 1, df/dy = 2', async () => {
    const adapter = new CPUAdapter()
    const x = adapter.createTensorFromArray(2)
    const y = adapter.createTensorFromArray(3)
    const f: CalculatingNode<CPUData> = {
      type: 'add',
      left: { type: 'tensor', data: x, requiresGrad: true },
      right: {
        type: 'add',
        left: { type: 'tensor', data: y, requiresGrad: true },
        right: { type: 'tensor', data: y, requiresGrad: true },
      },
    }
    const grads = adapter.calculateGradient(f)
    assertEquals(grads.get(x)?.tensor.data, 1)
    assertEquals(grads.get(y)?.tensor.data, 2)
  })
  await t.step('Simple dot product', async () => {
    const adapter = new CPUAdapter()
    const x = adapter.createTensorFromArray([1, 2])
    const b = adapter.createTensorFromArray([3, 4])
    const y: CalculatingNode<CPUData> = {
      type: 'dot',
      left: { type: 'tensor', data: x, requiresGrad: true },
      right: { type: 'tensor', data: b, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(y)
    assertEquals(grads.get(x)?.tensor.data, [3, 4])
    assertEquals(grads.get(b)?.tensor.data, [1, 2])
  })
})
