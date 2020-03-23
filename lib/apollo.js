const apollo = require('ctrip-apollo');
const path = require('path');
const { Deferred, formatConfig } = require("./util");

const Symbol_Config = Symbol.for('Apollo#Config');

module.exports = async (app) => {
  let eggReady = false;
  const eggReadyDeffered = new Deferred();

  await initApollo();
  sendConfig();

  app.messenger.once('egg-ready', () => {
    eggReady = true;
    eggReadyDeffered.resolve();
  });

  app.messenger.on('apollo:ConfigUpdated', () => {
    sendConfig();
  });

  async function sendConfig () {
    if (!eggReady) {
      await eggReadyDeffered.promise;
    }
    app.messenger.sendToApp('apollo:ConfigUpdated', getConfigAll());
  }

  function getConfigAll () {
    let configAll = null;

    const arr = app.apollo[Symbol_Config] || [];
    const res = arr.reduceRight((prev, next) => Object.assign(prev, next), {});
    if (Object.keys(res).length > 0) {
      configAll = res;
    }
    return configAll;
  }

  function getConfigByNS (app, NS = 'application', index = 0) {
    return new Promise(resolve => {
      if (app.apollo.namespaces[NS]) {
        return resolve();
      }
      const apolloApp = app.apollo.app;
      if (apolloApp) {
        const namespace = apolloApp.namespace(NS);
        app.apollo.namespaces[NS] = namespace;

        namespace.ready().then(() => {
          app.logger.info('[Apollo] [namespace.ready] success => ' + NS);
          app.apollo[Symbol_Config][index] = formatConfig(NS, namespace.config(), app.config.apollo);
          resolve();
        }).catch((err) => {
          app.logger.error('[Apollo] [namespace.ready] err => ' + err);
          app.logger.error('[Apollo] [namespace.ready] fail => ' + NS);
          resolve();
        });

        namespace.on('updated', () => {
          app.apollo[Symbol_Config][index] = formatConfig(NS, namespace.config(), app.config.apollo);
          app.logger.info('[Apollo] [namespace.updated] => ' + NS);
          sendConfig();
        });
      } else {
        resolve();
      }
    });
  }

  async function initApollo () {
    app.apollo = app.apollo || {};

    app.apollo.namespaces = app.apollo.namespaces || {};
    app.apollo[Symbol_Config] = app.apollo[Symbol_Config] || [];
    app.apollo.app = apollo(Object.assign({}, app.config.apollo));

    const promiseArr = [].concat(app.config.apollo.namespaces).map((NS, index) => {
      return getConfigByNS(app, NS, index);
    });
    try {
      await Promise.all(promiseArr);
    } catch (e) {
      app.logger.error(e);
    }
  }
}
