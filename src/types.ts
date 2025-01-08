export type TensorShape = number[]

export type AnyShapeJSArray = (AnyShapeJSArray | number)[] | number
export type TypedJSArray<Shape extends TensorShape> = AnyShapeJSArray & {
  // Not used
  // Just for type inference
  _shape?: Shape
}
export type GetShape<T> = T extends any[]
  ? T extends { length: infer L }
    ? T[number] extends any[]
      ? [L, ...GetShape<T[number]>]
      : [L]
    : []
  : []
