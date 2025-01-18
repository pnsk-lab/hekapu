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

  readonly adapter: MetoriAdapter<any>

  id = Symbol('Unique ID')

  constructor(adapter: MetoriAdapter<any>) {
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
  data: any
  adapter: MetoriAdapter<any>
}
export class ResolvedTensor<Shape extends TensorShape> extends TensorBase<Shape> {
  isResolved: true = true
  isCreating: false = false
  isCalculating: false = false

  node: CalculatingNode<unknown> & { type: 'tensor' }

  constructor(init: ResolvedTensorInit) {
    super(init.adapter)
    this.node = {
      type: 'tensor',
      data: init.data,
      id: this.id
    }
  }

  toArray() {
    return this.adapter.toArray(this.node.data)
  }
}

export interface CreatingTensorInit {
  adapter: MetoriAdapter<any>
  data: any | Promise<any>
  requiresGrad: boolean
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
    if (init.data instanceof Promise) {
      this.node = {
        type: 'tensor',
        data: undefined,
        requiresGrad: init.requiresGrad,
        id: this.id
      }
    } else {
      this.#resolved = new ResolvedTensor({
        data: init.data,
        adapter: init.adapter,
      })
      this.node = {
        type: 'tensor',
        data: init.data,
        requiresGrad: init.requiresGrad,
        id: this.id
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

    const data = await this.#init.data
    this.#resolved = new ResolvedTensor({
      data,
      adapter: this.#init.adapter,
    })

    this.node.data = data

    return this.#resolved
  }

  then(onfulfilled: (value: ResolvedTensor<Shape>) => void, onrejected?: (reason?: unknown) => void) {
    return this.resolve().then(onfulfilled, onrejected)
  }

  toArray() {
    return this.resolve().then(tensor => tensor.toArray())
  }
}


export interface CalculatingTensorInit {
  node: CalculatingNode
  adapter: MetoriAdapter<any>
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

  node: CalculatingNode<unknown>

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

    const data = await this.#init.adapter.calculate(this.#init.node as CalculatingNode<unknown>)

    this.#resolved = new ResolvedTensor({
      data,
      adapter: this.#init.adapter,
    })

    return this.#resolved
  }

  then(onfulfilled: (value: ResolvedTensor<Shape>) => void, onrejected?: (reason?: unknown) => void) {
    return this.resolve().then(onfulfilled, onrejected)
  }

  toArray() {
    return this.resolve().then(tensor => tensor.toArray())
  }
}
