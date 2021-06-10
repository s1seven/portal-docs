const pkg = require('../../package.json');

module.exports = {
  title: 'S1Seven Developers guide',
  base: `/${pkg.name}/`,
  themeConfig: {
    logo: '/logo.png',
    repo: pkg.repository.url,
    repoLabel: 'Git',
    docsDir: 'docs',
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [
      ['/informations/', 'General API information'],
      ['/flows/', 'API Flows'],
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
