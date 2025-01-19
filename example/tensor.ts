import { useAdapter } from '@pnsk-lab/hekapu'
import createCPUAdapter from '@pnsk-lab/hekapu/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([[0, 1]] as const)
