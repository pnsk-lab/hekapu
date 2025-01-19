# Adapter

Metori has a target, it works any runtimes.
Adapter will make Metori able to do that.

## What's Adapter?

Adapters are wrappers to connect between Metori and JS runtimes/devices.

For example, you can run your app on CPU if you use CPU adapter.
If you changed your mind and you want to use GPU on Deno, you can choose or create optimal adapter.

## Usage

```ts
import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const scalar = mt.tensor(0)
```

Import adapter and useAdapter to use Metori.

## Built-in Adapters

Currently, only CPU adapter is supported.
