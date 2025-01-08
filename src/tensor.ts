import type { MetoriAdapter } from './adapter/shared.ts'
import type { AnyShapeJSArray, GetShape, TensorShape, TypedJSArray } from './types.ts'

export type CalculatingTree = Tensor<TensorShape> | {
  type: 'add'
  left: CalculatingTree
  right: CalculatingTree
} | {
  type: 'sub'
  left: CalculatingTree
  right: CalculatingTree
}

abstract class TensorBase<Shape extends TensorShape> {
  abstract tree: CalculatingTree
  shape?: Shape
  #adapter: MetoriAdapter
  constructor(adapter: MetoriAdapter) {
    this.#adapter = adapter
  }

  /**
   * Add tensor
   * @param tensor Tensor to add
   * @returns CalculatingTensor
   */
  add(tensor: CalculatingTensor<Shape> | Tensor<Shape>) {
    return new CalculatingTensor({
      type: 'add',
      left: this.tree,
      right: tensor.tree,
    }, this.#adapter)
  }

  /**
   * Subtract tensor
   * @param tensor Tensor to subtract
   * @returns CalculatingTensor
   */
  sub(tensor: CalculatingTensor<Shape> | Tensor<Shape>) {
    return new CalculatingTensor({
      type: 'sub',
      left: this.tree,
      right: tensor.tree,
    }, this.#adapter)
  }
}

export class CalculatingTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  #adapter: MetoriAdapter
  tree: CalculatingTree
  constructor(tree: CalculatingTree, adapter: MetoriAdapter) {
    super(adapter)
    this.tree = tree
    this.#adapter = adapter
  }

  async calculate(): Promise<Tensor<Shape>> {
    const id = await this.#adapter.calculate(this.tree)
    return new Tensor(id, this.#adapter)
  }

  then<TResult1 = Tensor<Shape>, TResult2 = never>(
    onfulfilled?:
      | ((value: Tensor<Shape>) => TResult1 | PromiseLike<TResult1>)
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

export class Tensor<Shape extends TensorShape> extends TensorBase<Shape> {
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

export interface CreateTensor {
  <T extends TypedJSArray<TensorShape>>(input: T): Tensor<GetShape<T>>
}

export const useTensor = (adapter: MetoriAdapter): CreateTensor => {
  return (input) => {
    const id = adapter.createTensorFromArray(input)
    return new Tensor(id, adapter)
  }
}
