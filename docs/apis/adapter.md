# Adapter

Hekapu has a target, it works any runtimes. Adapter will make Hekapu able to do
that.

## What's Adapter?

Adapters are wrappers to connect between Hekapu and JS runtimes/devices.

For example, you can run your app on CPU if you use CPU adapter. If you changed
your mind and you want to use GPU on Deno, you can choose or create optimal
adapter.

## Usage

```ts twoslash
import { useAdapter } from 'hekapu'
import createCPUAdapter from 'hekapu/adapter/cpu'

const hk = useAdapter(createCPUAdapter())

const scalar = hk.tensor(0)
```

Import adapter and useAdapter to use Hekapu.

## Built-in Adapters

Currently, only CPU adapter is supported.
