import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([1, 2])

const w = mt.tensor([[1], [2]], { requiresGrad: true })

const y = w.matVecMul(x)

const grads = await mt.backward(y)
console.log(await grads.refer(w).toArray())
