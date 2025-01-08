import type { MetoriAdapter } from './adapter/shared.ts'
import type { AnyShapeJSArray } from './types.ts'

export type CalculatingTree = Matrix | {
  type: 'add'
  left: CalculatingTree
  right: CalculatingTree
} | {
  type: 'sub'
  left: CalculatingTree
  right: CalculatingTree
}

abstract class MatrixBase {
  abstract tree: CalculatingTree
  #adapter: MetoriAdapter
  constructor(adapter: MetoriAdapter) {
    this.#adapter = adapter
  }

  /**
   * Add matrix
   * @param matrix Matrix to add
   * @returns CalculatingMatrix
   */
  add(matrix: CalculatingMatrix | Matrix) {
    return new CalculatingMatrix({
      type: 'add',
      left: this.tree,
      right: matrix.tree,
    }, this.#adapter)
  }

  /**
   * Subtract matrix
   * @param matrix Matrix to subtract
   * @returns CalculatingMatrix
   */
  sub(matrix: CalculatingMatrix | Matrix) {
    return new CalculatingMatrix({
      type: 'sub',
      left: this.tree,
      right: matrix.tree,
    }, this.#adapter)
  }
}

export class CalculatingMatrix extends MatrixBase {
  #adapter: MetoriAdapter
  tree: CalculatingTree
  constructor(tree: CalculatingTree, adapter: MetoriAdapter) {
    super(adapter)
    this.tree = tree
    this.#adapter = adapter
  }

  async calculate(): Promise<Matrix> {
    const id = await this.#adapter.calculate(this.tree)
    return new Matrix(id, this.#adapter)
  }

  then<TResult1 = Matrix, TResult2 = never>(
    onfulfilled?:
      | ((value: Matrix) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.calculate().then(onfulfilled, onrejected)
  }
  async toArray() {
    return await this.calculate().then((m) => m.toArray())
  }
}

export class Matrix extends MatrixBase {
  id: number
  tree = this
  #adapter: MetoriAdapter
  constructor(id: number, adapter: MetoriAdapter) {
    super(adapter)

    this.id = id
    this.#adapter = adapter
  }

  async toArray() {
    return await this.#adapter.toArray(this.id)
  }
}

export interface CreateMatrix {
  (input: AnyShapeJSArray): Matrix
}

export const useMatrix = (adapter: MetoriAdapter): CreateMatrix => {
  return (input) => {
    const id = adapter.createMatrixFromArray(input)
    return new Matrix(id, adapter)
  }
}
