import type { HekapuAdapter } from './adapter/shared.ts'

export type TensorShape = number[]

export type AnyShapeJSArray = (number | AnyShapeJSArray)[]
export type AnyShapeJSArrayOrNumber = number | AnyShapeJSArray
export type TypedJSArray<Shape extends TensorShape> = AnyShapeJSArray & {
  // Not used
  // Just for type inference
  _shape?: Shape
}
export type GetShape<T extends AnyShapeJSArray> = T extends { length: infer L }
  ? T[number] extends Array<any> ? [L, ...GetShape<T[number]>]
  : [L]
  : []

export type Compatible<T extends any[]> =
  | (T extends [...infer Rest, infer Last] ? Compatible<Rest> | T
    : [])
  | []

export type CalculatingNode<T = unknown> = {
  type: 'tensor'

  data?: T
  id: symbol

  requiresGrad?: boolean
} | {
  type: 'add'
  left: CalculatingNode<T>
  right: CalculatingNode<T>
} | {
  type: 'sub'
  left: CalculatingNode<T>
  right: CalculatingNode<T>
} | {
  type: 'zeros'
  shape: TensorShape | CalculatingNode<T>
} | {
  type: 'ones'
  shape: TensorShape | CalculatingNode<T>
} | {
  type: 'dot'
  left: CalculatingNode<T>
  right: CalculatingNode<T>
} | {
  type: 'matmul'
  left: CalculatingNode<T>
  right: CalculatingNode<T>
} | {
  type: 'matVecMul'
  left: CalculatingNode<T>
  right: CalculatingNode<T>
} | {
  type: 'shape'
  input: CalculatingNode<T>
}

export interface TensorInternalOptions {
  adapter: HekapuAdapter<any>
  calculatingHistory?: CalculatingNode
}
