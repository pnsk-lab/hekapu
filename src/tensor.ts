import type { MetoriAdapter } from './adapter/shared.ts'
import type { AnyShapeJSArray } from './types.ts'

export type CalculatingTree = Tensor| {
  type: 'add'
  left: CalculatingTree
  right: CalculatingTree
} | {
  type: 'sub'
  left: CalculatingTree
  right: CalculatingTree
}

abstract class TensorBase {
  abstract tree: CalculatingTree
  #adapter: MetoriAdapter
  constructor(adapter: MetoriAdapter) {
    this.#adapter = adapter
  }

  /**
   * Add tensor
   * @param tensor Tensor to add
   * @returns CalculatingTensor
   */
  add(tensor: CalculatingTensor | Tensor) {
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
  sub(tensor: CalculatingTensor | Tensor) {
    return new CalculatingTensor({
      type: 'sub',
      left: this.tree,
      right: tensor.tree,
    }, this.#adapter)
  }
}

export class CalculatingTensor extends TensorBase {
  #adapter: MetoriAdapter
  tree: CalculatingTree
  constructor(tree: CalculatingTree, adapter: MetoriAdapter) {
    super(adapter)
    this.tree = tree
    this.#adapter = adapter
  }

  async calculate(): Promise<Tensor> {
    const id = await this.#adapter.calculate(this.tree)
    return new Tensor(id, this.#adapter)
  }

  then<TResult1 = Tensor, TResult2 = never>(
    onfulfilled?:
      | ((value: Tensor) => TResult1 | PromiseLike<TResult1>)
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

export class Tensor extends TensorBase {
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
  (input: AnyShapeJSArray): Tensor
}

export const useTensor = (adapter: MetoriAdapter): CreateTensor => {
  return (input) => {
    const id = adapter.createTensorFromArray(input)
    return new Tensor(id, adapter)
  }
}
