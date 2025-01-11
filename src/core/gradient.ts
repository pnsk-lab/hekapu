import type { MetoriAdapter } from '../adapter/shared.ts'
import type { Tensor } from './tensor.ts'

export interface GradientFn {
  (x: Tensor<any>, y: Tensor<any>): void
}
export const useGradient = (adapter: MetoriAdapter): GradientFn => {
  return (x, y) => {
    // TODO: Implement gradient
  }
}
