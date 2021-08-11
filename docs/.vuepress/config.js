const pkg = require('../../package.json');

module.exports = {
  title: 'S1Seven Developers guide',
  // when deploying under github domains
  // base: `/${pkg.name}${process.env.S1SevenDocVersion_PATH || '/'}`,
  // when deploying under s1seven domains
  base: process.env.S1SevenDocVersion_PATH ? `${process.env.S1SevenDocVersion_PATH}` : '',
  outDir: 'docs/.vuepress/dist',
  description: pkg.description,
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    // repo: pkg.repository.url,
    repo: `${pkg.author}/${pkg.name}`,
    githubToken: process.env.GITHUB_TOKEN || '',
    repoLabel: 'Git',
    editLinks: false,
    editLinkText: '',
    lastUpdated: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/information/' },
    ],
    docsDir: '',
    sidebar: {
      '/docs/': [
        {
          // title: 'General API information',
          collapsable: false,
          children: ['information/'],
        },
        {
          collapsable: false,
          children: ['environments/'],
        },
        {
          collapsable: false,
          children: ['flows/'],
        },
        {
          collapsable: false,
          children: ['openapi/'],
        },
      ],
    },
  },
};
