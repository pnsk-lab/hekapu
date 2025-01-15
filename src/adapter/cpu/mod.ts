import type { MetoriAdapter, SupportedOperations } from '../shared.ts'
import type { AnyShapeJSArray, TensorShape, CalculatingNode, AnyShapeJSArrayOrNumber } from '../../types.ts'
import { add, dot, matmul, matVecMul, ones, sub, zeros } from './operands.ts'
import { grad } from './grad.ts'

export type CPUTensor = {
  shape: TensorShape
  data: AnyShapeJSArrayOrNumber
} | {
  shape: TensorShape & { length: 0 }
  data: number
}
export class CPUAdapter implements MetoriAdapter {
  name = 'metori/cpu'
  supportedOperations: SupportedOperations = new Set(['add', 'sub', 'zeros', 'ones', 'dot', 'matmul', 'shape'])

  #tensors = new Map<number, CPUTensor>()
  #id = 0

  #createTensorFromCPUTensor(input: CPUTensor) {
    this.#id++
    this.#tensors.set(this.#id, input)
    return this.#id
  }

  createTensorFromArray(input: AnyShapeJSArrayOrNumber) {
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
    return this.#createTensorFromCPUTensor({ shape, data: input })
  }

  calculate(tree: CalculatingNode) {
    switch (tree.type) {
      case 'tensor': {
        return tree.id
      }
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
        const data = zeros(Array.isArray(shape) ? shape : (this.toArray(this.calculate(shape)) as TensorShape))
        return this.createTensorFromArray(data)
      }
      case 'ones': {
        const shape = tree.shape
        const data = ones(Array.isArray(shape) ? shape : (this.toArray(this.calculate(shape)) as TensorShape))
        return this.createTensorFromArray(data)
      }
      case 'dot': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftTensor = this.#tensors.get(leftId)
        const rightTensor = this.#tensors.get(rightId)
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return this.createTensorFromArray(dot(leftTensor, rightTensor))
      }
      case 'matmul': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftTensor = this.#tensors.get(leftId)
        const rightTensor = this.#tensors.get(rightId)
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return this.#createTensorFromCPUTensor(matmul(leftTensor, rightTensor))
      }
      case 'matVecMul': {
        const leftId = this.calculate(tree.left)
        const rightId = this.calculate(tree.right)
        const leftTensor = this.#tensors.get(leftId)
        const rightTensor = this.#tensors.get(rightId)
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return this.#createTensorFromCPUTensor(matVecMul(leftTensor, rightTensor))
      }
      case 'shape': {
        const input = this.calculate(tree.input)
        const inputTensor = this.#tensors.get(input)
        if (!inputTensor) {
          throw new Error('Tensor not found')
        }
        return this.createTensorFromArray(inputTensor.shape)
      }
    }
    throw new TypeError(`The operation ${(tree as { type: string }).type} is not supported.`)
  }

  calculateGradient(calculatingNode: CalculatingNode) {
    return grad(this, this.#tensors, calculatingNode)
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
