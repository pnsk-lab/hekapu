import { MetoriAdapter } from './adapter/shared.ts'
import type { ResolvedTensor } from './core/tensor.ts'

export type TensorShape = number[]

export type AnyShapeJSArray = (number | AnyShapeJSArray)[]
export type AnyShapeJSArrayOrNumber = number | AnyShapeJSArray
export type TypedJSArray<Shape extends TensorShape> = AnyShapeJSArray & {
  // Not used
  // Just for type inference
  _shape?: Shape
}
export type GetShape<T extends AnyShapeJSArray> = T extends { length: infer L }
  ? T[number] extends Array<any>
    ? [L, ...GetShape<T[number]>]
    : [L]
  : []

export type Compatible<T extends any[]> = 
  (T extends [...infer Rest, infer Last]
    ? Compatible<Rest> | T
    : []) | [];
export type CalculatingNode = {
  type: 'tensor'
  id: number
} | {
  type: 'add'
  left: CalculatingNode
  right: CalculatingNode
} | {
  type: 'sub'
  left: CalculatingNode
  right: CalculatingNode
} | {
  type: 'zeros'
  shape: TensorShape | CalculatingNode
} | {
  type: 'ones'
  shape: TensorShape | CalculatingNode
} | {
  type: 'dot'
  left: CalculatingNode
  right: CalculatingNode
} | {
  type: 'matmul'
  left: CalculatingNode
  right: CalculatingNode
} | {
  type: 'matVecMul'
  left: CalculatingNode
  right: CalculatingNode
} | {
  type: 'shape'
  input: CalculatingNode
}

export interface TensorOptions {
  /**
   * Whether to automatically calculate gradients
   * @default false
   */
  autoGrad?: boolean
}

export interface TensorInternalOptions {
  adapter: MetoriAdapter
  calculatingHistory?: CalculatingNode
}
