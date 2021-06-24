const router = require('../../router/router');

router.post('/send', (req, res, next) => {
    res.status(201).send('send');
});

router.get('/status', (req, res, next) => {
    res.status(200).send('status')
})

router.get('/download', (req, res, next) => {
    res.status(200).send('download')
})


module.exports = router;