import type { CalculatingNode } from '../../types.ts'
import type { CPUAdapter, CPUTensor } from './mod.ts'

export function grad(
  tensors: Map<number, CPUTensor>,
  y: CalculatingNode,
  adapter: CPUAdapter
): Map<number, number> {
  const result = new Map<number, number>()

  function difference(y: CalculatingNode, crrDx: number) {
    switch (y.type) {
      case 'tensor': {
        if (y.requiresGrad) {
          result.set(y.id, crrDx)
        }
        break
      }
      case 'add': {
        return 
      }
    }
  }

  difference(y, 0)

  return result
}
