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

// If neither router location exists, exit non-zero so deploy/build fails early with a clear message
const router1 = path.join(expressLibDir || '', 'router');
const router2 = path.join(expressLibDir || '', 'lib', 'router');
const ok = (fs.existsSync(router1) || fs.existsSync(router2));
if (!ok) {
    console.error('\nERROR: express router files not found. This indicates an incomplete or corrupted express installation.');
    console.error('Paths checked:');
    console.error(' -', router1, fs.existsSync(router1));
    console.error(' -', router2, fs.existsSync(router2));
    console.error('\nRecommended actions:');
    console.error(' - Ensure the deploy/build step runs `npm ci` inside the `backend` directory.');
    console.error(' - Clear the build cache on the host and redeploy (Render: "Clear cache and deploy").');
    console.error(' - If you have shell access, run: cd backend && rm -rf node_modules package-lock.json && npm ci');
    process.exit(2);
}
