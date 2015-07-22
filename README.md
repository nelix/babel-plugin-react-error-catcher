# babel-plugin-react-error-catcher
Automatically adds a decorator as a higher-order component to React components.  If there's an error, it will catch it and display it within an overlay.  And if the error originated from a hot reload, it will revert the broken component(s) back to the last working code beneath the overlay.  (Although currently it just displays the error. ;)

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

## Usage
Simply add the module to either `.babelrc` or `options.plugins` for `babel.transform`.  See [Babel's plugin docs](https://babeljs.io/docs/advanced/plugins/).

This is currently used within [`web-tedit`](https://github.com/loggur/web-tedit) (extensive work-in-progress) and it is designed to work with React hot reloading.  See [`babel-plugin-react-hot`](https://github.com/loggur/babel-plugin-react-hot) for said Babel plugin.

## Temporary Disclaimer
This plugin is just a few hours old at the time of this writing, so I've only had a chance to test it with [`jspm`](https://github.com/jspm/jspm-cli)/[`systemjs`](https://github.com/systemjs/systemjs) so far, but it should work (in theory) with [`webpack`](https://github.com/webpack/webpack) and the right configuration.  When I get a chance, I'll add a couple of detailed examples for both [`jspm`](https://github.com/jspm/jspm-cli)/[`systemjs`](https://github.com/systemjs/systemjs) and [`webpack`](https://github.com/webpack/webpack) that make use of the hot reloading and error catcher.  :)

I expect this plugin to evolve quite a bit so please don't hesitate to break it, submit issues and pull requests, and/or request features!

## License
MIT
