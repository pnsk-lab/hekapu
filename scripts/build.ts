import * as ts from 'typescript'
import * as fs from '@std/fs'
import * as esbuild from 'esbuild'
import * as path from '@std/path'
import denoJSON from '../deno.json' with { type: 'json' }

await fs.emptyDir('dist')

const entrys = [...fs.expandGlobSync('./src/**/*.ts', {
  exclude: ['**/*.test.ts']
})].flatMap(e => e.isFile ? e.path : [])

const packageJSON = {
  name: 'hekapu',
  version: Deno.args[0] ?? '0.0.0',
  exports: Object.fromEntries(Object.entries(denoJSON.exports).map(([k, v]) => {
    const normalized = v.replaceAll('\\', '/')
    const relativePath = path.relative('./src', normalized)
    return [k, {
      default: './' + path.join('dist', relativePath.replace(/\.ts$/, '.js')),
      types: './' + path.join('types', relativePath.replace(/\.ts$/, '.d.ts')),
    }]
  })),
  files: [
    'LICENSE',
    'README.md',
    'dist',
    'types'
  ],
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'https://github.com/pnsk-lab/hekapu.git'
  },
  homepage: 'https://pnsk-lab.github.io/hekapu'
}

await Deno.writeTextFile('dist/package.json', JSON.stringify(packageJSON, null, 2))
await Deno.copyFile('README.md', 'dist/README.md')

await esbuild.build({
  entryPoints: entrys,
  outdir: 'dist/dist',
  plugins: [
    {
      name: 'esbuild-plugin-to-js',
      setup(build) {
        build.onResolve({ filter: /.*/ }, args => {
          if (args.importer) {
            return { path: args.path.replace(/\.ts$/, '.js'), external: true }
          }
        })
      },
    }
  ],
  bundle: true,
  format: 'esm'
})

const program = ts.createProgram({
  options: {
    emitDeclarationOnly: true,
    declaration: true,
    outDir: 'dist/types'
  },
  rootNames: entrys,
})
program.emit()
