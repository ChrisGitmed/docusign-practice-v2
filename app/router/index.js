const router = require('./router');
const path = require('path');
const fs = require('fs');

router.get('/healthcheck', async (req, res, next) => {
    res.status(200).send('Success')
})

const getDirectories = path => {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(file => file.isDirectory)
        .map(dir => dir.name)
}

const basePath = path.join(__dirname, '../components');

const dirs = getDirectories(basePath);
    
dirs.forEach(componentName => {
    let routesPath = `${basePath}/${componentName}/routes.js`;
    if (fs.existsSync(routesPath)) require(routesPath);
})

module.exports = router