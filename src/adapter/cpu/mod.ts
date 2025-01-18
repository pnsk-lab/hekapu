import type { MetoriAdapter, SupportedOperations } from '../shared.ts'
import type {
  AnyShapeJSArrayOrNumber,
  CalculatingNode,
  TensorShape,
} from '../../types.ts'
import { add, dot, matmul, matVecMul, ones, sub, zeros } from './operands.ts'
import { grad } from './grad.ts'

export type CPUTensor = {
  shape: TensorShape
  data: AnyShapeJSArrayOrNumber
} | {
  shape: TensorShape & { length: 0 }
  data: number
}

export interface CPUData {
  tensor: CPUTensor
}
export class CPUAdapter implements MetoriAdapter<CPUData> {
  name = 'metori/cpu'
  supportedOperations: SupportedOperations = new Set([
    'add',
    'sub',
    'zeros',
    'ones',
    'dot',
    'matmul',
    'shape',
  ])

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
    return {
      tensor: {
        shape,
        data: input,
      },
    }
  }

  calculate(tree: CalculatingNode<CPUData>): CPUData {
    switch (tree.type) {
      case 'tensor': {
        if (!tree.data) {
          throw new Error('Tensor data is not set')
        }
        return tree.data
      }
      case 'add': {
        const leftTensor = this.calculate(tree.left).tensor
        const rightTensor = this.calculate(tree.right).tensor
        add(leftTensor, rightTensor)
        return {
          tensor: leftTensor
        }
      }
      case 'sub': {
        const leftTensor = this.calculate(tree.left).tensor
        const rightTensor = this.calculate(tree.right).tensor
        sub(leftTensor, rightTensor)
        return {
          tensor: leftTensor,
        }
      }
      case 'zeros': {
        const shape = Array.isArray(tree.shape)
          ? tree.shape
          : (this.toArray(this.calculate(tree.shape)) as TensorShape)
        const data = zeros(shape)
        return {
          tensor: {
            shape,
            data,
          },
        }
      }
      case 'ones': {
        const shape = Array.isArray(tree.shape)
          ? tree.shape
          : (this.toArray(this.calculate(tree.shape)) as TensorShape)
        const data = ones(shape)
        return {
          tensor: {
            shape,
            data,
          },
        }
      }
      case 'dot': {
        const leftTensor = this.calculate(tree.left).tensor
        const rightTensor = this.calculate(tree.right).tensor
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return {
          tensor: {
            shape: [1],
            data: dot(leftTensor, rightTensor),
          },
        }
      }
      case 'matmul': {
        const leftTensor = this.calculate(tree.left).tensor
        const rightTensor = this.calculate(tree.right).tensor
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return {
          tensor: matmul(leftTensor, rightTensor),
        }
      }
      case 'matVecMul': {
        const leftTensor = this.calculate(tree.left).tensor
        const rightTensor = this.calculate(tree.right).tensor
        if (!leftTensor || !rightTensor) {
          throw new Error('Tensor not found')
        }
        return {
          tensor: matVecMul(leftTensor, rightTensor),
        }
      }
      case 'shape': {
        const input = this.calculate(tree.input).tensor
        return {
          tensor: {
            shape: [input.shape.length],
            data: input.shape
          },
        }
      }
    }
    throw new TypeError(
      `The operation ${(tree as { type: string }).type} is not supported.`,
    )
  }

  calculateGradient(calculatingNode: CalculatingNode<CPUData>) {
    return grad(this, calculatingNode)
  }

  toArray(data: CPUData) {
    const tensor = data.tensor
    if (!tensor) {
      throw new Error('Tensor not found')
    }
    return tensor.data
  }
}

export default function createCPUAdapter(): MetoriAdapter<CPUData> {
  return new CPUAdapter()
}
