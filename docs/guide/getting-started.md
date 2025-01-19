# Welcome to Hekapu guide

Hekapu is a TypeScript library for building ML projects.

You can install via JSR.

Here is a simple example:

```ts
import { useAdapter } from '@pnsk-lab/hekapu'
import createCPUAdapter from '@pnsk-lab/hekapu/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const a = mt.tensor([1, 2, 3])
const b = mt.tensor(1)

console.log(await a.add(b).toArray()) // [2, 3, 4]
```
