export type TensorShape = number[]

export type AnyShapeJSArray = (number | AnyShapeJSArray)[]
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
