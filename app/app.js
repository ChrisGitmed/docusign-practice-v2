require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const routes = require('./router')


const app = express();

app.use(morgan('dev'))
    .use('/api', routes)

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`)