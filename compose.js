const fs = require('fs');
const path = require('path');

const mkdir = (dir) => {
  try {
    fs.mkdirSync(dir, { recursive: true, mode: '0755' });
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};

const removeDirContent = (dir) => {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const current = fs.lstatSync(path.join(dir, file));
      if (current.isDirectory()) {
        removeDirContent(path.join(dir, file));
      } else {
        fs.unlinkSync(path.join(dir, file));
      }
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
};

const copy = (src, dest) => {
  const oldFile = fs.createReadStream(src);
  const newFile = fs.createWriteStream(dest);
  oldFile.pipe(newFile);
};

const copyDir = (src, dest) => {
  mkdir(dest);
  removeDirContent(dest);
  const files = fs.readdirSync(src);
  for (const file of files) {
    const current = fs.lstatSync(path.join(src, file));
    if (current.isDirectory()) {
      copyDir(path.join(src, file), path.join(dest, file));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, file));
      fs.symlinkSync(symlink, path.join(dest, file));
    } else {
      copy(path.join(src, file), path.join(dest, file));
    }
  }
};

(function () {
  const docsPath = './docs';
  const folders = [
    { input: 'information', output: `${docsPath}/docs/information` },
    { input: 'environments', output: `${docsPath}/docs/environments` },
    { input: 'flows', output: `${docsPath}/docs/flows` },
    { input: 'openapi', output: `${docsPath}/docs/openapi` },
    { input: 'version' },
  ];
  const files = [
    { input: 'logo.png', output: `${docsPath}/.vuepress/public/logo.png` },
    {
      input: 'favicon.ico',
      output: `${docsPath}/.vuepress/public/favicon.ico`,
    },
    {
      input: 'openapi.json',
      output: `${docsPath}/.vuepress/public/specs/openapi.json`,
    },
  ];

  try {
    folders.map(({ input, output }) => {
      const directory = output || input;
      copyDir(input, directory);
    });

    files.map(({ input, output }) => {
      copy(input, output);
    });
    console.log(`Documentation generated`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
})(process.argv);
