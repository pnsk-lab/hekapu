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
    return new CreatingTensor({
      id,
      adapter,
    })
  }
}
