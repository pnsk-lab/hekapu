import type { TensorShape } from '../../types.ts'
import type { CreatingTensor, ResolvedTensor, CalculatingTensor } from './tensor.ts'

export type Tensor<Shape extends TensorShape = TensorShape> = CreatingTensor<Shape> | ResolvedTensor<Shape> | CalculatingTensor<Shape>
