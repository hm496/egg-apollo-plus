const startApollo = require('./lib/apollo');

class AppBootHook {
  constructor (app) {
    this.app = app;
  }

  configDidLoad () {
    const { app } = this;
    app.logger.info('[Apollo] [startApollo] namespaces => ' + JSON.stringify(app.config.apollo && app.config.apollo.namespaces));
    if (app.config.apollo && app.config.apollo.namespaces) {
      startApollo(app);
    }
  }
}

module.exports = AppBootHook;
