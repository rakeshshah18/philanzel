const fs = require('fs');
const path = require('path');

let expressLibDir;
try {
  const expressPath = require.resolve('express');
  console.log('express resolved to:', expressPath);

  expressLibDir = path.dirname(expressPath);
  console.log('express lib dir:', expressLibDir);

  const routerDir = path.join(expressLibDir, 'router');
  console.log('router dir path:', routerDir);

  const exists = fs.existsSync(routerDir);
  console.log('router directory exists:', exists);

  if (exists) {
    const files = fs.readdirSync(routerDir);
    console.log('router directory contents:', files);
  }
} catch (err) {
  console.error('Error while resolving express or reading router dir:');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

// Also check the common `lib/router` location inside the package
try {
  const libRouter = path.join(expressLibDir, 'lib', 'router');
  const libExists = fs.existsSync(libRouter);
  console.log('lib/router path:', libRouter);
  console.log('lib/router exists:', libExists);
  if (libExists) {
    console.log('lib/router contents:', fs.readdirSync(libRouter));
  }
} catch (err) {
  // ignore
}
