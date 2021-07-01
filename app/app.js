require('dotenv').config();
const dsConfig = require('../config/index').config;
const DsJwtAuth = require('./lib/DSJwtAuth');
const docOptions = require('../config/documentOptions.json')
const docNames = require('../config/documentNames.json');


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const passport = require('passport');
const MemoryStore = require('memorystore')(session);
const path = require('path')
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./router');


const app = express()
    .use(helmet())
    .use(morgan('dev'))
    .use(express.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(session({
        secret: dsConfig.sessionSecret,
        name: 'ds-launcher-session',
        cookie: {maxAge: 180 * 60000}, // 180 Minutes
        saveUninitialized: true,
        resave: true,
        store: new MemoryStore({
            checkPeriod: 86400000 // Prune expired entries every 24h
        })
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        console.log('req.user: ', req.user)
        // req.user is still undefined
        res.locals.user = req.user;

        res.locals.session = req.session;
        res.locals.dsConfig = { ...dsConfig, docOptions: docOptions, docNames: docNames };
        next();
    })
    .use((req, res, next) => {
        req.dsAuth = new DsJwtAuth(req);
        next();
    })
    .use('/api', routes)

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`)
