import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const tensor = mt.tensor([1, 2]).add(mt.tensor([3, 4]))

console.log(await tensor.toArray())
