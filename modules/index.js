const modules = (serverApp) => {
    const path = require('path');
    const fs = require('fs');
    const moduleRootPath = path.join(__dirname);

    console.log('=== Modules ===');
    fs
        .readdirSync(moduleRootPath)
        .filter((file) => {
            return file.charAt(0) !== '.';
        })
        .forEach((file) => {
            if (file == 'index.js') {
                return;
            }
            const modulePath = path.join(moduleRootPath, file);
            require(modulePath)(serverApp);
            console.log('module: ' + file);
        });
};

module.exports = modules;
