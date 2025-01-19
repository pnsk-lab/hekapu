# Hekapu

Hekapu is a library for calculating tensorsand creating ML programs, with
TypeScript.

## Example

```ts
import { useAdapter } from '@pnsk-lab/hekapu'
import createCPUAdapter from '@pnsk-lab/hekapu/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const a = mt.tensor([1, 2, 4] as const) // create tensor from array
const b = mt.ones([3] as const) // create tensor of ones ([1, 1, 1])

console.log(await a.add(b).toArray()) // add two tensors and convert to array
```
