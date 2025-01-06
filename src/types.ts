export type MatrixShape = number[]

export type AnyShapeJSArray = (number | AnyShapeJSArray)[]
export type TypedJSArray<Shape extends MatrixShape> = AnyShapeJSArray & {
  // Not used
  // Just for type inference
  _shape?: Shape
}
