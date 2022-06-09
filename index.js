if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    module.exports = require('./dist/shellcoochi.js');
  } else {
    module.exports = require('./dist/shellcoochi.min.js');
  }