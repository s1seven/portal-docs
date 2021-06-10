const fs = require('fs');
const path = require('path');

const mkdir = (dir) => {
  try {
    fs.mkdirSync(dir, 0755);
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
      fs.unlinkSync(path.join(dir, file));
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
  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

(async function(argv) {
  const folders = ['informations', 'flows'];
  const docsPath = './docs';
  const files = [
    { input: 'README.md', output: `${docsPath}/README.md` },
    { input: 'logo.png', output: `${docsPath}/.vuepress/public/logo.png` },
    {
      input: 'favicon.ico',
      output: `${docsPath}/.vuepress/public/favicon.ico`,
    },
  ];

  try {
    folders.map((folder) => {
      const directory = `${docsPath}/${folder}`;
      copyDir(folder, directory);
    });

    files.map(({ input, output }) => {
      copy(input, output);
    });
    console.log(`Documentation generated`);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
