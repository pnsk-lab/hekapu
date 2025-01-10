import type { TensorShape } from '../types.ts'
import { CalculatingTensor } from './mod.ts'
import type { MetoriAdapter } from '../adapter/shared.ts'

export interface CreateZeros {
  <S extends TensorShape>(shape: S): CalculatingTensor<S>
}
export const useZeros = (adapter: MetoriAdapter): CreateZeros => {
  return (shape) => {
    return new CalculatingTensor({
      type: 'zeros',
      shape
    }, adapter)
  }
}

export interface CreateOnes {
  <S extends TensorShape>(shape: S): CalculatingTensor<S>
}
export const useOnes = (adapter: MetoriAdapter): CreateOnes => {
  return (shape) => {
    return new CalculatingTensor({
      type: 'ones',
      shape
    }, adapter)
  }
}

