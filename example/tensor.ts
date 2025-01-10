// Just idea (not working and not implemented)

import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const a = mt.tensor([[1,1], [2,2], [3,3]])
const b = mt.tensor([[1, 2], [3, 4]])

console.log(await a.matmul(b).toArray())
