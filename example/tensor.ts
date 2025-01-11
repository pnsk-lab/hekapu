import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([1, 2, 3] as const, { autoGrad: true })
const b = mt.tensor(1)
const y = x.add(b)

console.log(await y)
