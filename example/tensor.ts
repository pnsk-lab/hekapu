// Just idea (not working and not implemented)

import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const a = mt.tensor([1, 2, 3] as const)
const b = mt.tensor([2, 4, 6] as const)

console.log(await a.dot(b).toArray())
