import { grad } from './grad.ts'
import { CPUTensor } from './mod.ts'

Deno.test('grad', async (t) => {
  await t.step('Simple add', () => {
    const tensors = new Map<number, CPUTensor>()
    tensors.set(0, { shape: [], data: 0 })
    tensors.set(1, { shape: [], data: 1 })
    const difference = grad(tensors, {
      type: 'add',
      left: {
        type: 'tensor',
        id: 0,
        requiresGrad: true
      },
      right: {
        type: 'tensor',
        id: 1
      }
    })
    console.log(difference)
  })
})