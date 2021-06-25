require('dotenv').config();
const dsConfig = require('../config/index').config;
const DsJwtAuth = require('./lib/DSJwtAuth');


const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MemoryStore = require('memorystore')(session);
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./router');


const app = express();

app.use(express.json())
    .use(session({
        secret: dsConfig.sessionSecret,
        name: 'ds-test-session',
        cookie: {maxAge: 180 * 60000}, // 180 Minutes
        saveUninitialized: true,
        resave: true,
        store: new MemoryStore({
            checkPeriod: 86400000 // Prune expired entries every 24h
        })
    }))
    .use(morgan('dev'))
    .use((req, res, next) => {
        console.log('req: ', req.user)
        req.locals.user = req.user;
        req.locals.session = req.session;
        req.locals.dsConfig = { ...dsConfig, docOptions: docOptions, docNames: docNames };
        next();
    })
    .use((req, res, next) => {
        req.dsAuth = new DsJwtAuth(req);
        next();
    })
    .use('/api', routes)

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`)
