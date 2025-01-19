# Getting Started

Hekapu is a TypeScript library for building ML projects.

You can install via JSR.

Here is a simple example:

```ts twoslash
import { useAdapter } from 'hekapu'
import createCPUAdapter from 'hekapu/adapter/cpu'

const hk = useAdapter(createCPUAdapter())

const a = hk.tensor([1, 2, 3])
const b = hk.tensor(1)

console.log(await a.add(b).toArray()) // [2, 3, 4]
```

## Installation

```shell
deno add npm:hekapu # With Deno
bun add hekapu # With Bun
pnpm add hekapu # With pnpm
yarn add hekapu # With Yarn
npm i hekapu # With npm
```
