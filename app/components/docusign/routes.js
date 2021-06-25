const router = require('../../router/router');
const dsConfig = require('../../../config/index').config
const { errorHandler } = require('../../lib/error')

const docusign = require('docusign-esign');
const validator = require('validator');
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater');

const path = require('path');
const fs = require('fs');

router.post('/send', async (req, res, next) => {

    /**** Pre-processing the file ****/
    /* Load the docx as binary content */
    const content = fs.readFileSync(path.resolve(__dirname, '../../documents/test.docx'), 'binary')
    /* Use PizZip to ????? */
    const zip = new PizZip(content);
    let doc;
    try { doc = new Docxtemplater(zip) } catch (e) { errorHandler(e) }

    /* Set the template variables (signature locations) */
    let extraSignersString;
    if (req.body.signatories) {
        for (let i = 0; i < req.body.signatories.length; i++) {
            extraSignersString += `/sn${i + 2}/`
        }
    } else extraSignersString = ''


    doc.setData({ template_string: extraSignersString });
    try { doc.render() } catch (e) { errorHandler(e) };
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(path.resolve(__dirname, '../../documents/test2.docx'), buf);





    const docsPath = path.resolve(__dirname, '../../documents');
    const doc1File = 'test2.docx'

    /**
     * Create the envelope
     */
    /**** Creating the controller ****/
    const controller = async (req, res) => {
        // Step 1. Check the token -- TODO

        // Step 2. Call the worker method
        const { body } = req;
        console.log('Body: ', body)
        const signerEmail = validator.escape(body.signerEmail);
        const signerName = validator.escape(body.signerName);
        const ccEmail = validator.escape(body.ccEmail);
        const ccName = validator.escape(body.ccName);

        const envelopeArgs = {
            signerEmail: signerEmail,
            signerName: signerName,
            ccEmail: ccEmail,
            ccName: ccName,
            status: 'sent'
        };
        const args = {
            accessToken: req.user.accessToken,
            basePath: req.session.basePath,
            accountId: req.session.accountId,
            envelopeArgs: envelopeArgs
        }

        let results;
        try {
            results = await worker(args)
        }
        catch (e) {
            errorHandler(e)
        }

    }

    const worker = (args) => {
        console.log('args: ', args)
    }

    let result;
    try {
        console.log('fired: ', req.body)
        result = await controller(req, res);
        res.status(200).json(result);
    } catch (e) {
        errorHandler(e)
    }

});

router.get('/status', (req, res, next) => {
    res.status(200).send('status')
})

router.get('/download', (req, res, next) => {
    res.status(200).send('download')
})


module.exports = router;
