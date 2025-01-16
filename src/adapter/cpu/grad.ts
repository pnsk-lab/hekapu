import { ResolvedTensor } from '../../core/tensor.ts'
import type { Tensor } from '../../mod.ts'
import type { CalculatingNode, TensorShape } from '../../types.ts'
import type { MetoriAdapter } from '../shared.ts'
import type { CPUAdapter, CPUTensor } from './mod.ts'
import { add, dot, matVecMul, sub } from './operands.ts'

// Reverse-mode automatic differentiation
export function grad(
  adapter: CPUAdapter,
  tensors: Map<number, CPUTensor>,
  y: CalculatingNode,
): Record<number, Tensor<TensorShape>> {
  // First, forward it.
  const forwardedTensors = new Map<CalculatingNode | number, CPUTensor>()
  const getForwardedTensor = (node: CalculatingNode): CPUTensor => {
    const tensor = forwardedTensors.get(node.type === 'tensor' ? node.id : node)
    if (!tensor) {
      throw new Error(`Forwarded tensor for ${node} not found.`)
    }
    return tensor
  }
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
      case 'sub': {
        const left = forward(node.left)
        const right = forward(node.right)
        const tensor = sub(left, right)
        forwardedTensors.set(node, tensor)
        return tensor
      }
      case 'matVecMul': {
        const left = forward(node.left)
        const right = forward(node.right)
        const tensor = matVecMul(left, right)
        forwardedTensors.set(node, tensor)
        return tensor
      }
      case 'dot': {
        const left = forward(node.left)
        const right = forward(node.right)
        const scalar = dot(left, right)
        const tensor: CPUTensor = {
          shape: [],
          data: [scalar],
        }
        forwardedTensors.set(node, tensor)
        return tensor
      }
      default:
        throw new Error(
          `${node.type} is not supported for forward pass to calculate gradients.`,
        )
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
      data: adapter.toArray(
        adapter.calculate({ type: 'zeros', shape: forwarded.shape }),
      ),
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
        setGradByNode(
          node.left,
          add(getGradByNode(node.left), { shape: [], data: 1 }),
        )
        setGradByNode(
          node.right,
          add(getGradByNode(node.right), { shape: [], data: 1 }),
        )
        backward(node.left)
        backward(node.right)
        break
      }
      case 'sub': {
        setGradByNode(node.left, add(getGradByNode(node.left), { shape: [], data: 1 }))
        setGradByNode(node.right, add(getGradByNode(node.right), { shape: [], data: -1 }))
        backward(node.left)
        backward(node.right)
        break
      }
      case 'matVecMul': {
        const left = getForwardedTensor(node.left)
        const right = getForwardedTensor(node.right)

        /** Matrix A */
        let matrix = left
        /** Vector x */
        let vector = right
        if (right.shape.length === 2) {
          matrix = right
          vector = left
        }

        const gradA = matVecMul(getGradByNode(node.left), right)
        setGradByNode(node.left, add(getGradByNode(node.left), gradA))

        const gradX = matVecMul(left, getGradByNode(node.right))
        setGradByNode(node.right, add(getGradByNode(node.right), gradX))

        backward(node.left)
        backward(node.right)
        break
      }
      case 'dot': {
        const left = getForwardedTensor(node.left)
        const right = getForwardedTensor(node.right)
        setGradByNode(node.left, add(getGradByNode(node.left), right))
        setGradByNode(node.right, add(getGradByNode(node.right), left))
        backward(node.left)
        backward(node.right)
        break
      }
      default:
        throw new Error(
          `${node.type} is not supported for backward pass to calculate gradients.`,
        )
    }
  }
  backward(y)

  return Object.fromEntries(
    [...grads]
      .filter(([key]) => typeof key === 'number')
      .map((
        [k, v],
      ) => [
        k,
        new ResolvedTensor(adapter.createTensorFromArray(v.data), {
          adapter: adapter as MetoriAdapter,
        }),
      ]),
  )
}
