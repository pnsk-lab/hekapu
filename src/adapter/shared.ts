import type { Tensor } from '../mod.ts'
import type {
  AnyShapeJSArrayOrNumber,
  CalculatingNode,
  TensorShape,
} from '../types.ts'

export type SupportedOperations = Set<CalculatingNode['type']>

export type GradResult<T> = Map<symbol, T>

export interface MetoriAdapter<T> {
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
  createTensorFromArray: (input: AnyShapeJSArrayOrNumber) => T | Promise<T>

  /**
   * Calculate tensor
   * @param tree Calculating tree
   * @returns Calculated tensor
   */
  calculate: (tree: CalculatingNode<T>) => Promise<T> | T

  /**
   * Calculate gradient
   * @param tree Calculating tree
   * @returns Gradient
   */
  calculateGradient: (tree: CalculatingNode<T>) => Promise<GradResult<T>> | GradResult<T>

  /**
   * Convert tensor to array
   * @param id Tensor ID
   * @returns Array
   */
  toArray: (data: T) => Promise<AnyShapeJSArrayOrNumber> | AnyShapeJSArrayOrNumber
}
