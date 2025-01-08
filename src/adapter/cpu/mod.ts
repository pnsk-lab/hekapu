import type { MetoriAdapter, SupportedOperations } from '../shared.ts'
import type { AnyShapeJSArray, MatrixShape } from '../../types.ts'
import type { CalculatingTree } from '../../matrix.ts'
import { add, sub } from './operands.ts'

export interface CPUMatrix {
  shape: MatrixShape
  data: AnyShapeJSArray
}
class CPUAdapter implements MetoriAdapter {
  name = 'metori/cpu'
  supportedOperations: SupportedOperations[] = ['add', 'sub']

  #matrixes = new Map<number, CPUMatrix>()
  #id = 0

  createMatrixFromArray(input: AnyShapeJSArray) {
    const shape: MatrixShape = []
    let crr: AnyShapeJSArray = input
    while (true) {
      shape.push(crr.length)
      const next = crr[0]
      if (!Array.isArray(next)) {
        break
      }
      crr = next
    }
    this.#id++
    this.#matrixes.set(this.#id, { shape, data: input })
    return this.#id
  }

  calculate(tree: CalculatingTree) {
    if (!('type' in tree)) {
      return tree.id
    }
    switch (tree.type) {
      case 'add': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftMatrix = this.#matrixes.get(leftId)
        const rightMatrix = this.#matrixes.get(rightId)
        if (!leftMatrix || !rightMatrix) {
          throw new Error('Matrix not found')
        }
        add(leftMatrix, rightMatrix)
        return this.createMatrixFromArray(leftMatrix.data)
      }
      case 'sub': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftMatrix = this.#matrixes.get(leftId)
        const rightMatrix = this.#matrixes.get(rightId)
        if (!leftMatrix || !rightMatrix) {
          throw new Error('Matrix not found')
        }
        sub(leftMatrix, rightMatrix)
        return this.createMatrixFromArray(leftMatrix.data)
      }
    }
    throw new TypeError('calculate failed.')
  }

  toArray(id: number) {
    const matrix = this.#matrixes.get(id)
    if (!matrix) {
      throw new Error('Matrix not found')
    }
    return matrix.data
  }
}

export default function createCPUAdapter(): MetoriAdapter {
  return new CPUAdapter()
}
