'use strict';
const { Deferred } = require('./lib/util');

module.exports = app => {
  let cachedConfig = {};
  let isApolloReady = false;
  const apolloDeffered = new Deferred();

  app.messenger.on('apollo:ConfigUpdated', config => {
    cachedConfig = config;

    if (!isApolloReady) {
      isApolloReady = true;
      apolloDeffered.resolve();
    }
  });

  app.messenger.once('egg-ready', () => {
    setTimeout(() => {
      !isApolloReady && app.messenger.sendToAgent('apollo:ConfigUpdated');
    }, 2000);
  });

  app.apollo = {
    async getConfigAll () {
      if (!isApolloReady) {
        await apolloDeffered.promise;
      }
      return cachedConfig;
    },
    async getConfig (key) {
      if (!key) {
        throw new Error('Unable to query config with no key');
      }
      if (!isApolloReady) {
        await apolloDeffered.promise;
      }
      return cachedConfig[key] || null;
    }
  };
};
