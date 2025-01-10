// Just idea (not working and not implemented)

import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const a = mt.tensor([1, 2, 4] as const)
const b = mt.ones([3] as const)

console.log(await a.add(b).toArray())
