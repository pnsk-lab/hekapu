import type { MetoriAdapter } from '../adapter/shared.ts'
import type { AnyShapeJSArray, GetShape, TensorShape, CalculatingNode } from '../types.ts'

abstract class TensorBase<Shape extends TensorShape> {
  abstract tree: CalculatingNode
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
  tree: CalculatingNode
  constructor(tree: CalculatingNode, adapter: MetoriAdapter) {
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

  async getShape(): Promise<Shape> {
    return await this.calculate().then((m) => m.getShape())
  }
  async toArray() {
    return await this.calculate().then((m) => m.toArray())
  }
}

export class Tensor<Shape extends TensorShape> extends TensorBase<Shape> {
  id: number
  #adapter: MetoriAdapter
  tree: CalculatingNode
  constructor(id: number, adapter: MetoriAdapter) {
    super(adapter)

    this.id = id
    this.#adapter = adapter
    this.tree = {
      type: 'tensor',
      id,
    }
  }

  async getShape(): Promise<Shape> {
    return await this.#adapter.getShape(this.id) as Shape
  }

  async toArray() {
    return await this.#adapter.toArray(this.id)
  }
}

export interface CreateTensor {
  // @ts-ignore pls tell me how to fix this
  <T extends AnyShapeJSArray>(input: T): Tensor<GetShape<T>>
}

export const useTensor = (adapter: MetoriAdapter): CreateTensor => {
  // @ts-ignore be quiet!!
  return (input) => {
    const id = adapter.createTensorFromArray(input)
    return new Tensor(id, adapter)
  }
}
