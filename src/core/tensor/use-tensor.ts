import type { MetoriAdapter } from '../../adapter/shared.ts'
import type { AnyShapeJSArrayOrNumber } from '../../types.ts'
import type { Tensor, TensorInitOptions } from './types.ts'
import { CreatingTensor } from './tensor.ts'

export interface CreateTensor {
  (source: AnyShapeJSArrayOrNumber, opts?: TensorInitOptions): Tensor
}

export const useTensor = (adapter: MetoriAdapter<any>): CreateTensor => {
  return (source, opts = {}) => {
    const data = adapter.createTensorFromArray(source)
    const tensor = new CreatingTensor({
      adapter,
      data,
      requiresGrad: !!opts.requiresGrad
    })
    return tensor
  }
}
