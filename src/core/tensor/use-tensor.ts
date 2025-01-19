import type { HekapuAdapter } from '../../adapter/shared.ts'
import type { AnyShapeJSArrayOrNumber, GetShape } from '../../types.ts'
import type { Tensor, TensorInitOptions } from './types.ts'
import { CreatingTensor } from './tensor.ts'

export interface CreateTensor {
  // @ts-ignore pls how to fix
  <Arr extends AnyShapeJSArrayOrNumber>(source: Arr, opts?: TensorInitOptions): Tensor<GetShape<Arr>>
}

export const useTensor = (adapter: HekapuAdapter<any>): CreateTensor => {
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
