import type { AnyShapeJSArray } from '../types.ts'
import type { CalculatingTree } from '../tensor.ts'

export type SupportedOperations = 'add' | 'sub'

export interface MetoriAdapter {
  name: string

  /**
   * Supported operations
   */
  supportedOperations: SupportedOperations[]

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
  calculate: (tree: CalculatingTree) => Promise<number> | number

  /**
   * Convert tensor to array
   * @param id Tensor ID
   * @returns Array
   */
  toArray: (id: number) => Promise<AnyShapeJSArray> | AnyShapeJSArray
}
