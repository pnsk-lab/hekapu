import type { HekapuAdapter } from '../adapter/shared.ts'
import type { TensorShape } from '../types.ts'
import { ResolvedTensor } from './tensor/tensor.ts'
import type { Tensor } from './tensor/types.ts'

export interface BackwardResult {
  refer<T extends TensorShape>(tensor: Tensor<T>): Tensor<T>
}
export interface Backward {
  (y: Tensor<TensorShape>): Promise<BackwardResult>
}
export const useBackward = (adapter: HekapuAdapter<any>): Backward => {
  return async (y) => {
    const history = y.node
    const grads = await adapter.calculateGradient(history)
    return {
      refer(tensor) {
        const data = grads.get(tensor.id)
        if (!data) {
          throw new Error('No grads')
        }
        return new ResolvedTensor({
          data,
          adapter,
        })
      },
    }
  }
}
