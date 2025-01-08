import type { AnyShapeJSArray } from '../types.ts'
import type { CalculatingTree } from '../matrix.ts'

export type SupportedOperations = 'add' | 'sub'

export interface MetoriAdapter {
  name: string

  /**
   * Supported operations
   */
  supportedOperations: SupportedOperations[]

  /**
   * Create matrix from JS array
   * @param input Input JS array
   * @returns Matrix ID
   */
  createMatrixFromArray: (input: AnyShapeJSArray) => number

  /**
   * Calculate matrix
   * @param tree Calculating tree
   * @returns Calculated matrix
   */
  calculate: (tree: CalculatingTree) => Promise<number> | number

  /**
   * Convert matrix to array
   * @param id Matrix ID
   * @returns Array
   */
  toArray: (id: number) => Promise<AnyShapeJSArray> | AnyShapeJSArray
}
