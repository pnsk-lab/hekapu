import type { CPUMatrix } from './mod.ts'
import { getArrItemByIndexes, setArrItemByIndexes } from './utils/arr.ts'

export const processLR = (leftMatrix: CPUMatrix, rightMatrix: CPUMatrix, calculate: (left: number, right: number) => number) => {
  const index: number[] = []
  for (let i = 0; i < leftMatrix.shape.length; i++) {
    index.push(0)
  }

  while (true) {
    setArrItemByIndexes(
      leftMatrix.data,
      index,
      (prev) => {
        return calculate(prev, getArrItemByIndexes(rightMatrix.data, index))
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

export const add = (leftMatrix: CPUMatrix, rightMatrix: CPUMatrix) => {
  return processLR(leftMatrix, rightMatrix, (left, right) => left + right)
}
export const sub = (leftMatrix: CPUMatrix, rightMatrix: CPUMatrix) => {
  return processLR(leftMatrix, rightMatrix, (left, right) => {
    return left - right
  })
}
