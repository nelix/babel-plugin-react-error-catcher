import React        from 'react';
import fetch        from 'fetch';
import hotPlugin    from 'babel-plugin-react-hot';
import errorCatcher from 'babel-plugin-react-error-catcher';

const reportersDir = 'babel-plugin-react-error-catcher/reporters/';
const reporterPath = reportersDir+'same-size-reporter';

const systemFetch = System.fetch;
let appCode = null;

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

System.fetch = function (load) {
  if (load.address.match(/\/app\.jsx$/) && appCode !== null) {
    return appCode;
  } else {
    return systemFetch.apply(this, arguments);
  }
};

window.fetch('./app.jsx')
  .then(function (res) {
    return res.text();
  })
  .then(function (code) {
    const editor  = document.createElement('textarea');
    const button  = document.createElement('input');
    const appPath = System.normalizeSync('./app.jsx')
      .replace('/app.jsx', '//app.jsx') // bug with SystemJS
      .slice(0, -3);

    editor.value          = code;
    editor.style.position = 'fixed';
    editor.style.top      = '0';
    editor.style.bottom   = '40px';
    editor.style.left     = '0';
    editor.style.width    = '75%';
    editor.style.minWidth = '480px';
    editor.style.font     = 'monospace';

    button.type           = 'button';
    button.value          = 'Commit Changes';
    button.style.position = 'fixed';
    button.style.bottom   = '0';
    button.style.left     = '0';
    button.style.width    = '75%';
    button.style.minWidth = '480px';
    button.style.height   = '40px';
    button.style.fontSize = '20px';

    button.addEventListener('click', function () {
      // reload app component
      appCode = editor.value;
      System.delete(appPath);
      System.import(appPath);
    }, false);

    document.body.appendChild(editor);
    document.body.appendChild(button);
  });
