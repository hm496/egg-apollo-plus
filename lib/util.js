function Deferred () {
  this.resolve = null;
  this.reject = null;
  this.promise = new Promise(function (resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }.bind(this));
  Object.freeze(this);
}

exports.Deferred = Deferred;

function formatConfig (NS = '', config = {}, options = {}) {
  let CONFIG = Object.assign({}, config);
  try {
    if (/\.(json|yml|yaml)$/.test(NS) && typeof config.content === 'string') {
      CONFIG = {
        [NS + '__content']: config.content
      }
      if (options.parseConfig) {
        if (/\.json$/.test(NS)) {
          CONFIG = Object.assign({}, JSON.parse(config.content));
        }
      }
    }
  } catch (e) {
  }
  return CONFIG;
}

exports.formatConfig = formatConfig;
