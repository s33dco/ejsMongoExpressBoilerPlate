const config          = require('config');
const path            = require('path')
const express         = require('express')
const methodOverride  = require('method-override')
const layout          = require('express-layout')
const morgan          = require('morgan');
const bodyParser      = require('body-parser')
const validator       = require('express-validator')
const cookieParser    = require('cookie-parser')
const session         = require('express-session')
const flash           = require('express-flash')
const csrf            = require('csurf')
const moment          = require('moment');
const error           = require('../middleware/error');
const contact         = require('../routes/contact');
const home            = require('../routes/home');
const otherwise       = require('../routes/otherwise');
const logger          = require('./logger');

module.exports = (app) => {

  app.locals.moment = require('moment');
  app.set('views', path.join(__dirname, '../../views'))
  app.set('view engine', 'ejs')

  const middlewares = [
    methodOverride('_method'),
    layout(),
    morgan('dev', { stream: logger.stream }),
    express.static(path.join(__dirname, '../../public')),
    bodyParser.urlencoded({ extended: true }),
    validator(),
    cookieParser(),
    session({
      secret: config.get('SUPER_SECRET_KEY'),
      key: config.get('SUPER_SECRET_COOKIE'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }
    }),
    flash(),
    csrf({ cookie: true })
  ];

  app.use(middlewares)
  app.use('/contact', contact);
  app.use('/', home);
  app.use('*', otherwise);
  app.use(error);
}
