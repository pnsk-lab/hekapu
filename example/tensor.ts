import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([1, 2, 3] as const, { requiresGrad: true })
const b = mt.tensor(1)
const y = x.add(x).add(b)

const grads = await mt.backward(y)

console.log(await grads.refer(x).toArray())
