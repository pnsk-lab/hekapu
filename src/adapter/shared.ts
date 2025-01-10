import type { AnyShapeJSArray, TensorShape, CalculatingNode } from '../types.ts'

export type SupportedOperations = Set<CalculatingNode['type']>
export interface MetoriAdapter {
  name: string

  /**
   * Supported operations
   */
  supportedOperations: SupportedOperations

  /**
   * Create tensor from JS array
   * @param input Input JS array
   * @returns Tensor ID
   */
  createTensorFromArray: (input: AnyShapeJSArray) => number

  /**
   * Calculate tensor
   * @param tree Calculating tree
   * @returns Calculated tensor
   */
  calculate: (tree: CalculatingNode) => Promise<number> | number

  /**
   * Convert tensor to array
   * @param id Tensor ID
   * @returns Array
   */
  toArray: (id: number) => Promise<AnyShapeJSArray> | AnyShapeJSArray

  /**
   * Get tensor shape
   * @param id Tensor ID
   * @returns Shape
   */
  getShape: (id: number) => Promise<TensorShape> | TensorShape
}
