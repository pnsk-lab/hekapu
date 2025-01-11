import type { MetoriAdapter } from '../adapter/shared.ts'
import type { Compatible, GetShape, TensorShape, CalculatingNode, TensorOptions, TensorInternalOptions } from '../types.ts'

abstract class TensorBase<Shape extends TensorShape> {
  abstract tree: CalculatingNode
  #adapter: MetoriAdapter

  readonly calculatingHistory?: CalculatingNode
  constructor(options: TensorInternalOptions) {
    this.#adapter = options.adapter
    if (options.calculatingHistory) {
      this.calculatingHistory = options.calculatingHistory
    }
  }

  /**
   * Add tensor
   * @param tensor Tensor to add
   * @returns CalculatingTensor
   */
  add(tensor: CalculatingTensor<Compatible<Shape>> | ResolvedTensor<Compatible<Shape>>) {
    return new CalculatingTensor({
      type: 'add',
      left: this.tree,
      right: tensor.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'add',
        left: this.calculatingHistory,
        right: tensor.tree,
      } : undefined,
    })
  }

  /**
   * Subtract tensor
   * @param tensor Tensor to subtract
   * @returns CalculatingTensor
   */
  sub(tensor: CalculatingTensor<Shape> | ResolvedTensor<Shape>) {
    return new CalculatingTensor({
      type: 'sub',
      left: this.tree,
      right: tensor.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'sub',
        left: this.calculatingHistory,
        right: tensor.tree,
      } : undefined,
    })
  }

  /**
   * Dot product
   * @param tensor Vector to dot product
   * @returns CalculatingTensor
   */
  dot(tensor: CalculatingTensor<Shape> | ResolvedTensor<Shape>) {
    return new CalculatingTensor({
      type: 'dot',
      left: this.tree,
      right: tensor.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'dot',
        left: this.calculatingHistory,
        right: tensor.tree,
      } : undefined,
    })
  }

  /**
   * Matrix multiplication
   * @param tensor Tensor to multiply
   * @returns CalculatingTensor
   */
  matmul(tensor: CalculatingTensor<Shape> | ResolvedTensor<Shape>) {
    return new CalculatingTensor({
      type: 'matmul',
      left: this.tree,
      right: tensor.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'matmul',
        left: this.calculatingHistory,
        right: tensor.tree,
      } : undefined,
    })
  }

  matVecMul<O extends number>(tensor: CalculatingTensor<[Shape[0], O]> | ResolvedTensor<[Shape[0], O]>): CalculatingTensor<[O]> {
    return new CalculatingTensor({
      type: 'matVecMul',
      left: this.tree,
      right: tensor.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'matVecMul',
        left: this.calculatingHistory,
        right: tensor.tree,
      } : undefined,
    })
  }

  shape(): CalculatingTensor<Shape> {
    return new CalculatingTensor({
      type: 'shape',
      input: this.tree,
    }, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory ? {
        type: 'shape',
        input: this.calculatingHistory,
      } : undefined,
    })
  }
}

export class CalculatingTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  #adapter: MetoriAdapter
  tree: CalculatingNode
  constructor(tree: CalculatingNode, options: TensorInternalOptions) {
    super(options)
    this.tree = tree
    this.#adapter = options.adapter
  }

  async calculate(): Promise<ResolvedTensor<Shape>> {
    const id = await this.#adapter.calculate(this.tree)
    return new ResolvedTensor(id, {
      adapter: this.#adapter,
      calculatingHistory: this.calculatingHistory,
    })
  }

  then<TResult1 = ResolvedTensor<Shape>, TResult2 = never>(
    onfulfilled?:
      | ((value: ResolvedTensor<Shape>) => TResult1 | PromiseLike<TResult1>)
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

export class ResolvedTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  id: number
  #adapter: MetoriAdapter
  tree: CalculatingNode
  constructor(id: number, options: TensorInternalOptions) {
    super(options)

    this.id = id
    this.#adapter = options.adapter
    this.tree = {
      type: 'tensor',
      id,
    }
  }

  async toArray() {
    return await this.#adapter.toArray(this.id)
  }
}

export type Tensor<Shape extends TensorShape> = CalculatingTensor<Shape> | ResolvedTensor<Shape>

export interface CreateTensor {
  // @ts-ignore pls tell me how to fix this
  <T extends AnyShapeJSArrayOrNumber>(input: T, options?: TensorOptions): Tensor<GetShape<T>>
}

export const useTensor = (adapter: MetoriAdapter): CreateTensor => {
  // @ts-ignore be quiet!!
  return (input, options = {}) => {
    const id = adapter.createTensorFromArray(input)
    return new ResolvedTensor(id, {
      adapter,
      calculatingHistory: options.autoGrad ? {
        type: 'tensor',
        id,
      } : undefined,
    })
  }
}
