import type { MetoriAdapter } from '../../adapter/shared.ts'
import type { CalculatingNode, Compatible } from '../../types.ts'
import type { TensorShape } from '../../types.ts'
import type { Tensor } from './types.ts'

const createCreatePromises = (tensors: (Tensor | TensorBase<TensorShape>)[]) => {
  const createPromises: Promise<unknown>[] = []
  for (const tensor of tensors) {
    if (tensor.isCalculating || tensor.isCreating) {
      const promise = (tensor as (CalculatingTensor<TensorShape> | CreatingTensor<TensorShape>)).create()
      if (promise) {
        createPromises.push(promise)
      }
    }
  }
  return createPromises
}
abstract class TensorBase<Shape extends TensorShape> {
  abstract isResolved: boolean
  abstract isCreating: boolean
  abstract isCalculating: boolean

  abstract node: CalculatingNode

  readonly adapter: MetoriAdapter

  constructor(adapter: MetoriAdapter) {
    this.adapter = adapter
  }

  add(other: Tensor<Compatible<Shape>>): CalculatingTensor<Shape> {
    const node: CalculatingNode = {
      type: 'add',
      left: this.node,
      right: other.node,
    }
    return new CalculatingTensor({
      adapter: this.adapter,
      node,
      createPromises: createCreatePromises([this, other]),
    })
  }
}

export interface ResolvedTensorInit {
  id: number
  adapter: MetoriAdapter
}
export class ResolvedTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  isResolved: true = true
  isCreating: false = false
  isCalculating: false = false

  node: CalculatingNode

  constructor(init: ResolvedTensorInit) {
    super(init.adapter)
    this.node = {
      type: 'tensor',
      id: init.id,
    }
  }
}

export interface CreatingTensorInit {
  adapter: MetoriAdapter
  id: number | Promise<number>
}

/**
 * Tensor in a state where it has not been checked whether the tensor has been created or not.
 */
export class CreatingTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  isResolved: false = false
  isCreating: true = true
  isCalculating: false = false

  #resolved?: ResolvedTensor<Shape>
  #init: CreatingTensorInit
  /** The node that shows this tensor. */
  readonly node: CalculatingNode & { type: 'tensor' }

  constructor(init: CreatingTensorInit) {
    super(init.adapter)
    this.#init = init
    if (typeof init.id === 'number') {
      this.#resolved = new ResolvedTensor({
        id: init.id,
        adapter: init.adapter,
      })
      this.node = {
        type: 'tensor',
        id: init.id,
      }
    } else {
      this.node = {
        type: 'tensor',
        id: Number.NaN, // The id will be set when the tensor was resolved.
      }
    }
  }

  create() {
    if (this.#resolved) {
      return false
    }
    return this.resolve()
  }

  async resolve() {
    if (this.#resolved) {
      return this.#resolved
    }

    const id = await this.#init.id
    this.#resolved = new ResolvedTensor({
      id,
      adapter: this.#init.adapter,
    })

    this.node.id = id

    return this.#resolved
  }

  then(onfulfilled: (value: ResolvedTensor<Shape>) => void, onrejected?: (reason?: unknown) => void) {
    return this.resolve().then(onfulfilled, onrejected)
  }
}


export interface CalculatingTensorInit {
  node: CalculatingNode
  adapter: MetoriAdapter
  createPromises: Promise<unknown>[]
}

/**
 * Tensor with results not yet computed.
 */
export class CalculatingTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  isResolved: false = false
  isCreating: false = false
  isCalculating: true = true

  #init: CalculatingTensorInit
  #resolved?: ResolvedTensor<Shape>

  node: CalculatingNode

  constructor(init: CalculatingTensorInit) {
    super(init.adapter)
    this.#init = init
    this.node = init.node
  }

  #createdChildren: boolean = false
  /**
   * Creates all tensors included in the calculate node in this tensor.
   */
  create() {
    if (this.#createdChildren) {
      return false
    }
    const promises = this.#init.createPromises
    return Promise.all(promises)
  }

  /**
   * Calculates the tensor.
   */
  async resolve() {
    if (this.#resolved) {
      return this.#resolved
    }

    const id = await this.#init.adapter.calculate(this.#init.node)

    this.#resolved = new ResolvedTensor({
      id,
      adapter: this.#init.adapter,
    })

    return this.#resolved
  }

  then(onfulfilled: (value: ResolvedTensor<Shape>) => void, onrejected?: (reason?: unknown) => void) {
    return this.resolve().then(onfulfilled, onrejected)
  }
}
