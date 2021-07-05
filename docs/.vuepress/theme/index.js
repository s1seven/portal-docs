const glob = require('glob');

// remove the path and extract just the file name
const files = glob.sync('./docs/.vuepress/public/specs/*.json').map((file) => file.split('/').pop());

module.exports = (themeConfig) => {
  themeConfig.commonSchemas = files;
  return {
    extend: '@vuepress/theme-default',
  };
};
