# babel-plugin-react-error-catcher

> Feel free to try to break this, submit issues and pull requests, and/or request features!

Automatically adds a decorator to React components.  Accepts a single argument, a path to some module for error reporting, and if there's an error, it will catch it and pass it to the reporter.  The reporter can be either of the following:

  * ReactComponent that may use the props below to render a message
  * function that accepts the arguments below; it may also return a ReactComponent or ReactElement to be rendered


Props/Arguments:

  - error
  - instance
  - filename
  - displayName


## Installation

```
jspm install babel-plugin-react-error-catcher=github:loggur/babel-plugin-react-error-catcher
```
or
```
jspm install npm:babel-plugin-react-error-catcher
```
or
```
npm install babel-plugin-react-error-catcher
```


## Brief API Overview

There's not much to it, really.  All you do is provide the plugin to Babel with the path to a reporter module.  Use whatever reporter you want, or try out one of the three included:

1. [Function that log errors to console](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/reporters/console.js)

2. [Component that displays the error string with white text on a red background](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/reporters/basic-reporter.js)

3. [Function that uses the component from #2 but ensures it's the same size as the originating component](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/reporters/same-size-reporter.js)


**Note:**  The reporter may also export a `rendered` function that you can use to obtain information about components as soon as they've successfully rendered.  See [`same-size-reporter`](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/reporters/same-size-reporter.js#L41-L72) for an example.


## JSPM Example ([Quick Link](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/examples/jspm))

From [`examples/jspm/client/minimal-editor.js`](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/examples/jspm/client/minimal-editor.js):
```js
import hotPlugin    from 'babel-plugin-react-hot';
import errorCatcher from 'babel-plugin-react-error-catcher';

const reportersDir = 'babel-plugin-react-error-catcher/reporters/';
const reporterPath = reportersDir+'same-size-reporter';

System.config({
  "trace": true,
  "babelOptions": {
    "stage": 0,
    "optional": [
      "runtime"
    ],
    "plugins": [
      hotPlugin,
      errorCatcher(reporterPath)
    ]
  }
});
```

That's it!  Try it yourself:

> **Note:**  NPM likes to timeout sometimes when downloading packages, so if this happens, just keep trying `npm install` and `npm run jspm-install` before `npm start`.

```
git clone git@github.com:loggur/babel-plugin-react-error-catcher.git
cd babel-plugin-react-error-catcher/examples/jspm
npm install
npm run jspm-install
npm start
open http://localhost:8080
```


## WebPack Example ([Quick Link](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/examples/webpack))

[`examples/webpack/.babelrc`](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/examples/webpack/.babelrc):
```json
{
  "stage": 0,
  "optional": [
    "runtime"
  ],
  "plugins": [
    "react-hot",
    "./error-catcher"
  ]
}
```

[`examples/webpack/error-catcher.js`](https://github.com/loggur/babel-plugin-react-error-catcher/blob/master/examples/webpack/error-catcher.js):
```js
var catcherPath = 'babel-plugin-react-error-catcher';
var reporterPath = catcherPath+'/reporters/same-size-reporter';

module.exports = require(catcherPath)(reporterPath);
```

That's it!  Try it yourself:

> **Note:**  NPM likes to timeout sometimes when downloading packages, so if this happens, just keep trying `npm install` before `npm start`.

```
git clone git@github.com:loggur/babel-plugin-react-error-catcher.git
cd babel-plugin-react-error-catcher/examples/webpack
npm install
npm start
open http://localhost:8080
```


## Real World Example

This is currently used within [`web-tedit`](https://github.com/loggur/web-tedit) (extensive work-in-progress) and it is designed to work with React hot reloading.  See [`babel-plugin-react-hot`](https://github.com/loggur/babel-plugin-react-hot) for said Babel plugin.


## License

MIT
