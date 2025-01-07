// Just idea (not working and not implemented)

import { useMatrix } from '@pnsk-lab/metori'
import createCPUAdapter from '@pnsk-lab/metori/adapter/cpu'

const adapter = createCPUAdapter()
const createMatrix = useMatrix(adapter)

const a = createMatrix([1, 2, 3])
const b = createMatrix([1, 1, 1])

// Added is just AST
// Not calculated
// CalculateAST { ast: { type: 'add', left: vector, right: vector } }
const added = a.sub(b)

// Use `await` to calculate (Internals use `then`)
const result = await added

// Output Vector
// To convert to array, we need to use `await`
console.log(await result.toArray())
