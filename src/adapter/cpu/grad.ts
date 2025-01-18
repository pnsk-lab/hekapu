import type { Tensor } from '../../core/tensor/types.ts'
import type { CalculatingNode, TensorShape } from '../../types.ts'
import type { GradResult, MetoriAdapter } from '../shared.ts'
import type { CPUAdapter, CPUTensor, CPUData } from './mod.ts'
import { add, dot, matVecMul, sub } from './operands.ts'
import { ResolvedTensor } from '../../core/tensor/tensor.ts'

// Reverse-mode automatic differentiation
export function grad(
  adapter: CPUAdapter,
  y: CalculatingNode<CPUData>,
): GradResult<CPUData> {
  // First, forward it.
  const forwardedTensors = new Map<CalculatingNode<CPUData>, CPUTensor>()
  const getForwardedTensor = (node: CalculatingNode<CPUData>): CPUTensor => {
    const tensor = forwardedTensors.get(node)
    if (!tensor) {
      throw new Error(`Forwarded tensor for ${node} not found.`)
    }
    return tensor
  }
  const forward = (node: CalculatingNode<CPUData>): CPUTensor => {
    switch (node.type) {
      case 'tensor': {
        const tensor = node.data
        if (!tensor) {
          throw new Error(`Tensor data was not set.`)
        }
        forwardedTensors.set(node, tensor.tensor)
        return tensor.tensor
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

  const grads = new Map<CalculatingNode<CPUData>, CPUTensor>()
  const getGradByNode = (node: CalculatingNode<CPUData>): CPUTensor => {
    const forwarded = forwardedTensors.get(node)
    if (!forwarded) {
      throw new Error(`Forwarded tensor for not found.`)
    }
    return grads.get(node) ?? {
      shape: forwarded.shape,
      data: adapter.toArray(
        adapter.calculate({ type: 'zeros', shape: forwarded.shape }),
      ),
    }
  }
  const setGradByNode = (node: CalculatingNode<CPUData>, grad: CPUTensor) => {
    grads.set(node, grad)
  }

  const backward = (node: CalculatingNode<CPUData>) => {
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
        let matrixNode = node.left
        /** Vector x */
        let vector = right
        let vectorNode = node.right
        if (right.shape.length === 2) {
          matrix = right
          vector = left
          matrixNode = node.right
          vectorNode = node.left
        }

        const gradA: CPUTensor = {
          data: [],
          shape: matrix.shape
        }
        for (let i = 0; i < matrix.shape[0]; i++) {
          (gradA.data as number[][]).push([...vector.data as number[]])
        }
        setGradByNode(matrixNode, add(getGradByNode(matrixNode), gradA))

        const gradX: CPUTensor = {
          data: [],
          shape: matrix.shape
        }
        for (let n = 0; n < matrix.shape[1]; n++) {
          let sum = 0
          for (let m = 0; m < matrix.shape[0]; m++) {
            sum += (matrix.data as number[][])[m][n]
          }
          ;(gradX.data as number[]).push(sum)
        }
        setGradByNode(vectorNode, add(getGradByNode(vectorNode), gradX))

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

  return new Map(
    [...grads]
      .filter(([key]) => key.type === 'tensor')
      .map((
        [k, v],
      ): [CPUData, CPUData] => [
        (k as (CalculatingNode<CPUData> & { type: 'tensor' })).data!,
        {
          tensor: v,
        }
      ]),
  )
}
