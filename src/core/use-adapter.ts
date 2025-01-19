import type { HekapuAdapter } from '../adapter/shared.ts'
import { type CreateTensor, useTensor } from './tensor/use-tensor.ts'
import { type Backward, useBackward } from './use-backward.ts'
import {
  type CreateOnes,
  type CreateZeros,
  useOnes,
  useZeros,
} from './use-helpers.ts'

/**
 * UsedAdapter is a wrapper of HekapuAdapter
 */
export interface UsedAdapter {
  tensor: CreateTensor
  backward: Backward
  zeros: CreateZeros
  ones: CreateOnes
}

/**
 * useAdapter is a function to use HekapuAdapter
 * @param adapter - HekapuAdapter
 * @returns UsedAdapter
 *
 * @example
 * ```ts
 * import { useAdapter } from '@pnsk-lab/hekapu'
 * import createCPUAdapter from '@pnsk-lab/hekapu/adapter/cpu'
 *
 * const adapter = createCPUAdapter()
 * const mt = useAdapter(adapter)
 *
 * mt.tensor([1, 2, 3]) // Create Tensor
 * mt.zeros([2, 2]) // Create Tensor with zeros, shape: [2, 2]
 * ```
 */
export const useAdapter = (adapter: HekapuAdapter): UsedAdapter => {
  return {
    tensor: useTensor(adapter),
    backward: useBackward(adapter),
    zeros: useZeros(adapter),
    ones: useOnes(adapter),
  }
}
