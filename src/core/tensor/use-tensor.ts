import type { MetoriAdapter } from '../../adapter/shared.ts'
import type { AnyShapeJSArrayOrNumber } from '../../types.ts'
import type { Tensor } from './types.ts'
import { CreatingTensor } from './tensor.ts'
export interface CreateTensor {
  (source: AnyShapeJSArrayOrNumber): Tensor
}

export const useTensor = (adapter: MetoriAdapter<any>): CreateTensor => {
  return (source) => {
    const data = adapter.createTensorFromArray(source)
    const tensor = new CreatingTensor({
      adapter,
      data,
    })
    return tensor
  }
}
