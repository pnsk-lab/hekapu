import type { TensorShape } from '../types.ts'
import { CalculatingTensor } from '../core/tensor/tensor.ts'
import type { MetoriAdapter } from '../adapter/shared.ts'

export interface CreateZeros {
  <S extends TensorShape>(shape: S): CalculatingTensor<S>
}
export const useZeros = (adapter: MetoriAdapter): CreateZeros => {
  return (shape) => {
    return new CalculatingTensor({
      node: {
        type: 'zeros',
        shape,
      },
      adapter,
      createPromises: [],
    })
  }
}

export interface CreateOnes {
  <S extends TensorShape>(shape: S): CalculatingTensor<S>
}
export const useOnes = (adapter: MetoriAdapter): CreateOnes => {
  return (shape) => {
    return new CalculatingTensor({
      node: {
        type: 'ones',
        shape,
      },
      adapter,
      createPromises: [],
    })
  }
}
