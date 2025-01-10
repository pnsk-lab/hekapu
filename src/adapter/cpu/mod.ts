import type { MetoriAdapter, SupportedOperations } from '../shared.ts'
import type { AnyShapeJSArray, TensorShape, CalculatingNode } from '../../types.ts'
import { add, ones, sub, zeros } from './operands.ts'

export interface CPUTensor {
  shape: TensorShape
  data: AnyShapeJSArray
}
class CPUAdapter implements MetoriAdapter {
  name = 'metori/cpu'
  supportedOperations: SupportedOperations = new Set(['add', 'sub', 'zeros', 'ones'])

  #tensors = new Map<number, CPUTensor>()
  #id = 0

  createTensorFromArray(input: AnyShapeJSArray) {
    const shape: TensorShape = []
    if (Array.isArray(input)) {
      let crr = input
      while (true) {
        shape.push(crr.length)
        const next = crr[0]
        if (!Array.isArray(next)) {
          break
        }
        crr = next
      }
    }
    this.#id++
    this.#tensors.set(this.#id, { shape, data: input })
    return this.#id
  }

  calculate(tree: CalculatingNode) {
    if ('id' in tree) {
      return tree.id
    }
    switch (tree.type) {
      case 'add': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftTensor = this.#tensors.get(leftId)
        const rightTensor = this.#tensors.get(rightId)
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        add(leftTensor, rightTensor)
        return this.createTensorFromArray(leftTensor.data)
      }
      case 'sub': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftTensor = this.#tensors.get(leftId)
        const rightTensor = this.#tensors.get(rightId)
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        sub(leftTensor, rightTensor)
        return this.createTensorFromArray(leftTensor.data)
      }
      case 'zeros': {
        const shape = tree.shape
        const data = zeros(shape)
        return this.createTensorFromArray(data)
      }
      case 'ones': {
        const shape = tree.shape
        const data = ones(shape)
        return this.createTensorFromArray(data)
      }
    }
    throw new TypeError('calculate failed.')
  }

  getShape(id: number) {
    const tensor = this.#tensors.get(id)
    if (!tensor) {
      throw new Error('Tensor not found')
    }
    return tensor.shape
  }

  toArray(id: number) {
    const tensor = this.#tensors.get(id)
    if (!tensor) {
      throw new Error('Tensor not found')
    }
    return tensor.data
  }
}

export default function createCPUAdapter(): MetoriAdapter {
  return new CPUAdapter()
}
