const pkg = require('../../package.json');

module.exports = {
  title: 'S1Seven Developers guide',
  base: `/${pkg.name}${process.env.notifyBCDocVersion_PATH || '/'}`,
  description: pkg.description,
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    repo: pkg.repository.url,
    repoLabel: 'Git',
    docsDir: 'docs',
    editLinks: false,
    editLinkText: '',
    lastUpdated: false,
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [
      ['/informations/', 'General API information'],
      ['/flows/', 'API Flows'],
      ['/openapi/', 'Swagger UI'],
    ],
    serviceWorker: {
      updatePopup: true,
      updatePopup: {
        message: 'New content is available.',
        buttonText: 'Refresh',
      },
    },
  },
};
