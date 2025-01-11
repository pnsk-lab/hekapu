import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

// Simple a layer of neural network, not including activation function and bias

const x = mt.tensor([1, 2, 3] as const) // 3 features

const W = mt.tensor([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]] as const) // 3 features, 2 neurons

const y = x.matVecMul(W)

console.log(await y.toArray())
