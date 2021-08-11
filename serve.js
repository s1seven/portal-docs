const { resolve } = require('path');
const express = require('express');
const context = require('./docs/.vuepress/config');

// TODO: pass options via CLI
const options = {};
const notFoundPath = resolve(context.outDir, '404.html');
const port = 8080;
const host = 'localhost';

// express instance
const app = express();

// serve static files
app.use(context.base, express.static(context.outDir, options.staticOptions));

// fallback to base url
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith(context.base)) {
    res.sendFile(notFoundPath);
  } else {
    res.redirect(context.base);
  }
  next();
});

// create server
app.listen(port, host, async () => {
  const url = `http://${host}:${port}${context.base}`;
  console.log(`VuePress server listening at ${url}`);
});
