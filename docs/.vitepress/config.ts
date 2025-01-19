import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'Hekapu',
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        base: '/guide/',
        items: [
          {
            text: 'Getting Started',
            link: '/getting-started',
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
