# Typings

Hekapu supports high-level TypeScript APIs. You can use tensors safety.

For example, you can get typed tensor by using `as const`.

```ts twoslash
import { useAdapter } from 'hekapu'
import createCPUAdapter from 'hekapu/adapter/cpu'
const hk = useAdapter(createCPUAdapter())
// ---cut---
const tensor = hk.tensor([[1, 2], [3, 4], [5, 6]] as const)
//     ^?
```

In this code, `tensor` is typed as `Tensor<[3, 2]>`. It means a shape of
`[[1, 2], [3, 4], [5, 6]]`.
