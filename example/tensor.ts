import { useAdapter } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const mt = useAdapter(createCPUAdapter())

const x = mt.tensor([[0, 1]] as const)