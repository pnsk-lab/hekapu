import * as fs from '@std/fs'
import * as path from '@std/path'
import denoJSON from '../deno.json' with { type: 'json' }
import { build } from 'tsup'

await fs.emptyDir('dist')

await build({
  entry: Object.values(denoJSON.exports),
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm'],
  tsconfig: './scripts/tsconfig-for-build.json',
  outDir: 'dist/dist',
})

const packageJSON = {
  name: 'hekapu',
  version: Deno.args[0] ?? '0.0.0',
  exports: Object.fromEntries(
    Object.entries(denoJSON.exports).map(([k, v]) => {
      const relativePath = path.relative('./src', v).replaceAll('\\', '/')
      return [k, {
        default: './dist/' + relativePath.replace(/\.ts$/, '.mjs'),
        types: './dist/' + relativePath.replace(/\.ts$/, '.d.mts'),
      }]
    }),
  ),
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'https://github.com/pnsk-lab/hekapu.git',
  },
  homepage: 'https://pnsk-lab.github.io/hekapu',
  files: ['dist'],
}

await Deno.writeTextFile(
  'dist/package.json',
  JSON.stringify(packageJSON, null, 2),
)
await Deno.copyFile('README.md', 'dist/README.md')
