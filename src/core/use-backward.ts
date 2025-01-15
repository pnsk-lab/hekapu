import type { MetoriAdapter } from '../adapter/shared.ts'
import type { TensorShape } from '../types.ts'
import type { ResolvedTensor, Tensor } from './mod.ts'

export interface BackwardResult {
  refer<T extends TensorShape>(tensor: ResolvedTensor<T>): Tensor<T>
}
export interface Backward {
  (y: Tensor<TensorShape>): Promise<BackwardResult>
}
export const useBackward = (adapter: MetoriAdapter): Backward => {
  return async (y) => {
    const history = y.calculatingHistory
    if (!history) {
      throw new Error('The y value has no tape to backpropagate.')
    }
    const grads = await adapter.calculateGradient(history)
    return {
      refer(tensor) {
        return grads[tensor.id]
      },
    }
  }
}
