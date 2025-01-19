# Tensor

Tensor expresses the data. Scalar, Vector, Matrix, and more multidimensional array are supported.

## Basic usage

To create a tensor from a JS number or array, use `mt.tensor()` API.

```ts
const scalar = mt.tensor(0)
const vector = mt.tensor([1, 2, 3])
const matrix = mt.tensor([
  [1, 2, 3],
  [4, 5, 6]
])
```

To get a JS value, use `tensor.toArray()` method. It's async process.

```ts
const vector = mt.tensor([1, 2, 3])

const arr = await vector.toArray() // [1, 2, 3]
```

## Calculation

Of course, you can calculate these tensors. Some operators are supported.

### Addition

Use `tensor.add(other)` method.

```ts
const a = mt.tensor(1)
const b = mt.tensor(2)

const added = a.add(b) // 3
```

## Tensor states

There is three kinds of tensor states: Creating, Calculating, and Resolved.

### CreatingTensor

CreatingTensor means tensors that may or may not have been created.

For example, `tensor` is that code is `CreatingTensor`.
```ts
const tensor = mt.tensor(1)
```

Internally, there is a possibility that tensor created, there is also a possibility that tensor hasn't created yet.

### CalculatingTensor

CalculatingTensor means tensors which don't have the result. It means it hasn't calculated yet. It is created when you use calculate methods such as `add()`, `sub()`, and others.
```ts
const creating = mt.tensor(1)
const calculating = creating.add(mt.tensor(2))
```
In that code, `calculating` means `3` but the result hasn't computed.

### ResolvedTensor

ResolvedTensor is the tensor the result was confirmed. You can change state to ResolvedTensor by using `await`.

An example resolving CreatingTensor:
```ts
const creating = mt.tensor(1)
const resolved = await creating // Resolved!
```
Or, you can resolve CalculatingTensor:
```ts
const calculating = mt.tensor(1).add(mt.tensor(1))
const resolved = await creating // Resolved!
```
