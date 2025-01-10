import type { AnyShapeJSArray, TensorShape } from '../../types.ts'
import type { CPUTensor } from './mod.ts'
import { getArrItemByIndexes, setArrItemByIndexes } from './utils/arr.ts'

export const processLR = (leftMatrix: CPUTensor, rightMatrix: CPUTensor, calculate: (left: number, right: number) => number) => {
  const index: number[] = []
  for (let i = 0; i < leftMatrix.shape.length; i++) {
    index.push(0)
  }

  while (true) {
    setArrItemByIndexes(
      leftMatrix.data as AnyShapeJSArray,
      index,
      (prev) => {
        return calculate(prev, getArrItemByIndexes(rightMatrix.data as AnyShapeJSArray, index))
      },
    )

    // Process index
    index[index.length - 1]++
    for (let i = index.length - 1; i >= 0; i--) {
      if (index[i] >= (leftMatrix.shape[i] as number)) {
        if (i - 1 in index) {
          index[i - 1]++
          index[i] = 0
        }
      }
    }
    if (index[0] >= (leftMatrix.shape[0] as number)) {
      break
    }
  }
  return leftMatrix
}

export const add = (leftMatrix: CPUTensor, rightMatrix: CPUTensor) => {
  return processLR(leftMatrix, rightMatrix, (left, right) => left + right)
}
export const sub = (leftMatrix: CPUTensor, rightMatrix: CPUTensor) => {
  return processLR(leftMatrix, rightMatrix, (left, right) => {
    return left - right
  })
}
export const zeros = (shape: TensorShape, target: AnyShapeJSArray = []) => {
  for (let i = 0; i < shape[0]; i++) {
    if (shape.length > 1) {
      const thisTarget: AnyShapeJSArray = []
      target.push(thisTarget)
      zeros(shape.slice(1), thisTarget)
    } else {
      target.push(0)
    }
  }
  return target
}
export const ones = (shape: TensorShape, target: AnyShapeJSArray = []) => {
  for (let i = 0; i < shape[0]; i++) {
    if (shape.length > 1) {
      const thisTarget: AnyShapeJSArray = []
      target.push(thisTarget)
      ones(shape.slice(1), thisTarget)
    } else {
      target.push(1)
    }
  }
  return target
}

/**
 * Dot product of two matrices
 * @param leftMatrix Left matrix
 * @param rightMatrix Right matrix
 */
export const dot = (leftMatrix: CPUTensor, rightMatrix: CPUTensor) => {
  if (leftMatrix.shape.length !== 1 || rightMatrix.shape.length !== 1) {
    throw new Error('Dot product is only supported for vectors')
  }

  const lenA = leftMatrix.shape[0]
  const lenB = leftMatrix.shape[0]
  if (lenA !== lenB) {
    throw new Error('Dot product is only supported for vectors of the same length')
  }

  let result = 0
  for (let i = 0; i < lenA; i++) {
    const leftItem = getArrItemByIndexes(leftMatrix.data as AnyShapeJSArray, [i])
    const rightItem = getArrItemByIndexes(rightMatrix.data as AnyShapeJSArray, [i])
    result += leftItem * rightItem
  }
  return result
}
