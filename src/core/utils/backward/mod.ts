// Top-down

import type { CalculatingNode } from '../../../types.ts'

export function buildGradientTree(
  y: CalculatingNode,
  x: number,
): CalculatingNode {
  switch (y.type) {
    case 'tensor':
      // If the tensor is the input, the gradient is 1, otherwise 0
      // If the tensor is not the input, the gradient is 0
      // If the tensor is the input, the gradient is 1, otherwise 0
      return y.id === x ? {
        type: 'ones',
        shape: []
      } : {
        type: 'zeros',
        shape: []
      }

    case 'add':
      // If the operation is adding, the gradient is the sum of the gradients of the left and right sides
      return {
        type: 'add',
        left: buildGradientTree(y.left, x),
        right: buildGradientTree(y.right, x),
      }

    case 'sub':
      // If the operation is subtracting, the gradient is the difference of the gradients of the left and right sides
      return {
        type: 'sub',
        left: buildGradientTree(y.left, x),
        right: buildGradientTree(y.right, x),
      }

    case 'dot':
      // If the operation is dot product, apply the product of the gradients
      return {
        type: 'add',
        left: {
          type: 'dot',
          left: buildGradientTree(y.left, x),
          right: y.right,
        },
        right: {
          type: 'dot',
          left: y.left,
          right: buildGradientTree(y.right, x),
        },
      }

    default:
      throw new Error(`Unsupported node type: ${(y as CalculatingNode).type}`)
  }
}
