export type TensorShape = number[]

export type AnyShapeJSArray = (number | AnyShapeJSArray)[]
export type TypedJSArray<Shape extends TensorShape> = AnyShapeJSArray & {
  // Not used
  // Just for type inference
  _shape?: Shape
}
