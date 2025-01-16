import type { AnyShapeJSArray, TensorShape } from '../../types.ts'
import type { CPUTensor } from './mod.ts'
import { getArrItemByIndexes, setArrItemByIndexes } from './utils/arr.ts'

export const processLR = (
  leftMatrix: CPUTensor,
  rightMatrix: CPUTensor,
  calculate: (left: number, right: number) => number,
) => {
  if (leftMatrix.shape.length === 0 && rightMatrix.shape.length === 0) {
    return {
      shape: [],
      data: calculate(leftMatrix.data as number, rightMatrix.data as number),
    }
  }
  const index: number[] = []
  for (let i = 0; i < leftMatrix.shape.length; i++) {
    index.push(0)
  }
  while (true) {
    let rightIndex = index
    if (leftMatrix.shape.length > rightMatrix.shape.length) {
      // like [1, 2, 3] + 1 or [[1, 2], [3, 4]] + [1, 2]
      rightIndex = rightIndex.slice(0, rightMatrix.shape.length)
    }

    setArrItemByIndexes(
      leftMatrix.data as AnyShapeJSArray,
      index,
      (prev) =>
        calculate(
          prev,
          getArrItemByIndexes(rightMatrix.data as AnyShapeJSArray, rightIndex),
        ),
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
  if (shape.length === 0) {
    return 0
  }
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
  if (shape.length === 0) {
    return 1
  }
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
    throw new Error(
      'Dot product is only supported for vectors of the same length',
    )
  }

  let result = 0
  for (let i = 0; i < lenA; i++) {
    const leftItem = getArrItemByIndexes(leftMatrix.data as AnyShapeJSArray, [
      i,
    ])
    const rightItem = getArrItemByIndexes(rightMatrix.data as AnyShapeJSArray, [
      i,
    ])
    result += leftItem * rightItem
  }
  return result
}

export const matmul = (
  leftMatrix: CPUTensor,
  rightMatrix: CPUTensor,
): CPUTensor => {
  const leftShape = leftMatrix.shape
  const rightShape = rightMatrix.shape
  if (leftShape.length !== 2 || rightShape.length !== 2) {
    throw new Error('Matrix multiplication is only supported for 2D matrices')
  }

  const left = leftMatrix.data as AnyShapeJSArray
  const right = rightMatrix.data as AnyShapeJSArray

  const result: number[][] = []

  for (let i = 0; i < leftShape[0]; i++) {
    const row: number[] = []
    for (let j = 0; j < rightShape[1]; j++) {
      let sum = 0
      for (let k = 0; k < leftShape[1]; k++) {
        sum += ((left[i] as number[])[k] as number) *
          ((right[k] as number[])[j] as number)
      }
      row.push(sum)
    }
    result.push(row)
  }

  return { shape: [leftShape[0], rightShape[1]], data: result }
}

export const matVecMul = (
  leftTensor: CPUTensor,
  rightTensor: CPUTensor,
): CPUTensor => {
  let matrix: CPUTensor
  let vector: CPUTensor
  if (leftTensor.shape.length === 1) {
    if (rightTensor.shape.length !== 2) {
      throw new Error('Vector must be a 1D tensor')
    }
    matrix = rightTensor
    vector = leftTensor
  } else if (rightTensor.shape.length === 1) {
    if (leftTensor.shape.length !== 2) {
      throw new Error('Vector must be a 1D tensor')
    }
    matrix = leftTensor
    vector = rightTensor
  } else {
    throw new Error('matVecMul is only supported for 2D matrix and 1D vector')
  }

  const outputShape = [matrix.shape[1]]

  const result: number[] = []
  for (let i = 0; i < outputShape[0]; i++) {
    let sum = 0
    for (let j = 0; j < matrix.shape[0]; j++) {
      sum += (matrix.data as number[][])[j][i] * (vector.data as number[])[j]
    }
    result.push(sum)
  }

  return { shape: outputShape, data: result }
}
