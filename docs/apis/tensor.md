# Tensor

Tensor expresses the data. Scalar, Vector, Matrix, and more multidimensional
array are supported.

## Basic usage

To create a tensor from a JS number or array, use `mt.tensor()` API.

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const scalar = hk.tensor(0)
const vector = hk.tensor([1, 2, 3])
const matrix = hk.tensor([
  [1, 2, 3],
  [4, 5, 6],
])
```

To get a JS value, use `tensor.toArray()` method. It's async process.

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const vector = hk.tensor([1, 2, 3])

const arr = await vector.toArray() // [1, 2, 3]
```

## Calculation

Of course, you can calculate these tensors. Some operators are supported.

### Addition

Use `tensor.add(other)` method.

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const a = hk.tensor(1)
const b = hk.tensor(2)

const added = a.add(b) // 3
```

## Tensor states

There is three kinds of tensor states: Creating, Calculating, and Resolved.

### CreatingTensor

CreatingTensor means tensors that may or may not have been created.

For example, `tensor` is that code is `CreatingTensor`.

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const tensor = hk.tensor(1)
```

Internally, there is a possibility that tensor created, there is also a
possibility that tensor hasn't created yet.

### CalculatingTensor

CalculatingTensor means tensors which don't have the result. It means it hasn't
calculated yet. It is created when you use calculate methods such as `add()`,
`sub()`, and others.

```ts twoslash
import { useAdapter } from 'hekapu'
import createCPUAdapter from 'hekapu/adapter/cpu'
const hk = useAdapter(createCPUAdapter())
// ---cut---
const creating = hk.tensor(1)
const calculating = creating.add(hk.tensor(2))
```

In that code, `calculating` means `3` but the result hasn't computed.

### ResolvedTensor

ResolvedTensor is the tensor the result was confirmed. You can change state to
ResolvedTensor by using `await`.

An example resolving CreatingTensor:

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const creating = hk.tensor(1)
const resolved = await creating // Resolved!
```

Or, you can resolve CalculatingTensor:

```ts twoslash
import { useAdapter } from 'hekapu';import createCPUAdapter from 'hekapu/adapter/cpu';const hk = useAdapter(createCPUAdapter())
// ---cut---
const calculating = hk.tensor(1).add(hk.tensor(1))
const resolved = await calculating // Resolved!
```
