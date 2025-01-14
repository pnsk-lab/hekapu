import { assertEquals } from '@std/assert'
import { CalculatingNode } from '../../types.ts'
import { CPUAdapter } from './mod.ts'

Deno.test('calculateGradient', async (t) => {
  await t.step('f(x, y) = x + y, df/dx = 1, df/dy = 1', () => {
    const adapter = new CPUAdapter()
    
    const x = adapter.createTensorFromArray(2)
    const y = adapter.createTensorFromArray(2)
    const f: CalculatingNode = {
      type: 'add',
      left: { type: 'tensor', id: x, requiresGrad: true },
      right: { type: 'tensor', id: y, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(f)
    assertEquals(grads[x].data, 1)
    assertEquals(grads[y].data, 1)
  })
  await t.step('f(x, y) = x + y + y, df/dx = 1, df/dy = 2', () => {
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
    assertEquals(grads[x].data, 1)
    assertEquals(grads[y].data, 2)
  })
  /*await t.step('Simple dot product', () => {
    const adapter = new CPUAdapter()
    const x = adapter.createTensorFromArray([1, 2 ])
    const b = adapter.createTensorFromArray([3, 4])
    const y: CalculatingNode = {
      type: 'dot',
      left: { type: 'tensor', id: x, requiresGrad: true },
      right: { type: 'tensor', id: b, requiresGrad: true },
    }
    const grads = adapter.calculateGradient(y)
    console.log(grads)
  })*/
})
