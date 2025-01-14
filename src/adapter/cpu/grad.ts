import type { AnyShapeJSArrayOrNumber, CalculatingNode } from '../../types.ts'
import type { CPUAdapter, CPUTensor } from './mod.ts'
import { add } from './operands.ts'

// Reverse-mode automatic differentiation
export function grad(
  adapter: CPUAdapter,
  tensors: Map<number, CPUTensor>,
  y: CalculatingNode,
): Record<number, CPUTensor> {
  // First, forward it.
  const forwardedTensors = new Map<CalculatingNode | number, CPUTensor>()
  const forward = (node: CalculatingNode): CPUTensor => {
    switch (node.type) {
      case 'tensor': {
        const tensor = tensors.get(node.id)
        if (!tensor) {
          throw new Error(`Tensor ${node.id} not found.`)
        }
        forwardedTensors.set(node.id, tensor)
        return tensor
      }
      case 'add': {
        const left = forward(node.left)
        const right = forward(node.right)
        const tensor = add(left, right)
        forwardedTensors.set(node, tensor)
        return tensor
      }
      default:
        throw new Error(`${node.type} is not supported for forward pass to calculate gradients.`)
    }
  }

  forward(y)

  // if the node is a tensor, a key will be a number.
  // in the other case, a key will be the add node.

  const grads = new Map<CalculatingNode | number, CPUTensor>()
  const getGradByNode = (node: CalculatingNode): CPUTensor => {
    const key = node.type === 'tensor' ? node.id : node
    const forwarded = forwardedTensors.get(key)
    if (!forwarded) {
      throw new Error(`Forwarded tensor for not found.`)
    }
    return grads.get(node.type === 'tensor' ? node.id : node) ?? {
      shape: forwarded.shape,
      data: adapter.toArray(adapter.calculate({ type: 'zeros', shape: forwarded.shape })),
    }
  }
  const setGradByNode = (node: CalculatingNode, grad: CPUTensor) => {
    const key = node.type === 'tensor' ? node.id : node
    grads.set(key, grad)
  }

  const backward = (node: CalculatingNode) => {
    switch (node.type) {
      case 'tensor': {
        break
      }
      case 'add': {
        setGradByNode(node.left, add(getGradByNode(node.left), { shape: [], data: 1 }))
        setGradByNode(node.right, add(getGradByNode(node.right), { shape: [], data: 1 }))
        backward(node.left)
        backward(node.right)
        break
      }
      default:
        throw new Error(`${node.type} is not supported for backward pass to calculate gradients.`)
    }
  }
  backward(y)

  return Object.fromEntries([...grads].filter(([key]) => typeof key === 'number'))
}
