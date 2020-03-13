# egg-apollo-plus
[ctrip-apollo](https://github.com/kaelzhang/ctrip-apollo) plugin for egg.      
## Install

```sh
$ npm i egg-apollo-plus
```

## Configuration

`egg-apollo-plus` support all configurations in [ctrip-apollo](https://github.com/kaelzhang/ctrip-apollo). and with default configurations below:

- cachePath: `path.join(appInfo.baseDir, 'apollo_cache')`
- host: `'http://localhost:8070'`

`egg-apollo-plus` provides one more option:
- namespaces: `['application']`

```js
// {app_root}/config/config.default.js
exports.static = {
  // maxAge: 31536000,
};
```

## Usage

In controller, you can use `app.apollo.getConfigAll` and `app.apollo.getConfig` to get config.

```js
// app/controller/home.js

module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx, app } = this;
      // get all config
      const allConfig = await app.apollo.getConfigAll();
      // get config by key
      const someConfig = await app.apollo.getConfig('some key');
      ctx.body = 'config';
    }
  };
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/hm496/egg-apollo-plus/issues).

## License

[MIT](https://github.com/hm496/egg-apollo-plus/blob/master/LICENSE)
