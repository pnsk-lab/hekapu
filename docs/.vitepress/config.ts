import { defineConfig, type MarkdownOptions } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import denoConfig from '../../deno.json' with { type: 'json' }

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'Hekapu',
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: 'docs/.vitepress/cache/twoslash',
        }),
        twoslashOptions: {
          compilerOptions: {
            paths: Object.fromEntries(
              Object.entries(denoConfig.exports).map((
                [k, path],
              ): [string, string[]] => [`hekapu${k.slice(1)}`, [path]]),
            ),
          },
        },
      }) as NonNullable<MarkdownOptions['codeTransformers']>[number],
    ],
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/pnsk-lab/hekapu',
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        base: '/guide/',
        items: [
          {
            text: 'Getting Started',
            link: '/getting-started',
          },
          {
            text: 'Typings',
            link: '/typings',
          },
        ],
      },
      {
        text: 'APIs',
        base: '/apis/',
        items: [
          {
            text: 'Tensor',
            link: '/tensor',
          },
          {
            text: 'Adapter',
            link: '/adapter',
          },
        ],
      },
    ],
  },
})
