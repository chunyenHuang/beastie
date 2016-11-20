const backup = require('./backup');
backup(() => {
    return process.exit();
});
