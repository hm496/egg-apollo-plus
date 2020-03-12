'use strict';

const path = require('path');

module.exports = appInfo => {
  const exports = {};

  exports.apollo = {
    cachePath: path.join(appInfo.baseDir, 'apollo_cache'),
    host: 'http://localhost:8070',
    namespaces: ['application'],
  };
  return exports;
};
