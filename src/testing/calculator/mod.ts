import type { MetoriAdapter } from '../../adapter/shared.ts'
import type { AnyShapeJSArrayOrNumber, CalculatingNode } from '../../types.ts'

export interface Calculator {
  addTensor(i: AnyShapeJSArrayOrNumber): number
  calculate(tree: CalculatingNode): Promise<AnyShapeJSArrayOrNumber>
}
export const useCalculator = (adapter: MetoriAdapter): Calculator => {
  return {
    addTensor(i: AnyShapeJSArrayOrNumber) {
      return adapter.createTensorFromArray(i)
    },
    async calculate(tree: CalculatingNode) {
      const id = await adapter.calculate(tree)
      return adapter.toArray(id)
    },
  }
}
