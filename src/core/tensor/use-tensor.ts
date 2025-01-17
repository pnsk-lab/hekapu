import type { MetoriAdapter } from '../../adapter/shared.ts'
import type { AnyShapeJSArrayOrNumber } from '../../types.ts'
import type { Tensor } from './types.ts'
import { CreatingTensor } from './tensor.ts'
export interface CreateTensor {
  (source: AnyShapeJSArrayOrNumber): Tensor
}

export const useTensor = (adapter: MetoriAdapter): CreateTensor => {
  return (source) => {
    const id = adapter.createTensorFromArray(source)
    const tensor = new CreatingTensor({
      id,
      adapter,
    })

    const finalizer = async (id: number | Promise<number>) => {
      await adapter.destroyTensor(await id)
    }
    const finalizationRegistry = new FinalizationRegistry(finalizer)
    finalizationRegistry.register(tensor, id)
    return tensor
  }
}
