import type { MetoriAdapter } from '../adapter/shared.ts'
import { type CreateTensor, useTensor } from './tensor.ts'
import { type Backward, useBackward } from './use-backward.ts'
import {
  type CreateOnes,
  type CreateZeros,
  useOnes,
  useZeros,
} from './use-helpers.ts'

/**
 * UsedAdapter is a wrapper of MetoriAdapter
 */
export interface UsedAdapter {
  tensor: CreateTensor
  backward: Backward
  zeros: CreateZeros
  ones: CreateOnes
}

/**
 * useAdapter is a function to use MetoriAdapter
 * @param adapter - MetoriAdapter
 * @returns UsedAdapter
 *
 * @example
 * ```ts
 * import { useAdapter } from '@pnsk-lab/metori'
 * import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'
 *
 * const adapter = createCPUAdapter()
 * const mt = useAdapter(adapter)
 *
 * mt.tensor([1, 2, 3]) // Create Tensor
 * mt.zeros([2, 2]) // Create Tensor with zeros, shape: [2, 2]
 * ```
 */
export const useAdapter = (adapter: MetoriAdapter): UsedAdapter => {
  return {
    tensor: useTensor(adapter),
    backward: useBackward(adapter),
    zeros: useZeros(adapter),
    ones: useOnes(adapter),
  }
}
