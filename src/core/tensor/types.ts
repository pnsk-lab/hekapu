import type { TensorShape } from '../../types.ts'
import type {
  CalculatingTensor,
  CreatingTensor,
  ResolvedTensor,
} from './tensor.ts'

export type Tensor<Shape extends TensorShape = TensorShape> =
  | CreatingTensor<Shape>
  | ResolvedTensor<Shape>
  | CalculatingTensor<Shape>

export interface TensorInitOptions {
  /**
   * @default false
   */
  requiresGrad?: boolean
}
