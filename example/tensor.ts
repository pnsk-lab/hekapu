import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([0, 1, 2], { requiresGrad: true })
const y = mt.tensor([1, 2, 3])

const f = x.add(y)

const backwarded = await mt.backward(f)

console.log(await backwarded.refer(x).toArray())
