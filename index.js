'use strict';

var pluginName = 'babel-plugin-react-error-catcher';
var pluginPath = typeof __dirname === 'undefined' ? pluginName : __dirname;

var catcherName = 'errorCatcher';
var catcherPath = pluginPath+'/error-catcher.js';
var reporterName = 'errorReporter';

var reactName = 'React';
var reactPath = 'react';

function isRenderMethod (member) {
  return member.kind === 'method' &&
         member.key.name === 'render';
}

/**
 * Returns a plugin for Babel that catches and reports errors.  To display a
 * message in the event of an error, pass the path of a reporter module to be 
 * imported, which can be either of the following:
 *
 *   a) ReactComponent that may use the props below to render a message
 *   b) function that accepts the arguments below; it may also return a
 *      ReactComponent or ReactElement to be rendered
 *
 * Props:
 *   - error
 *   - instance
 *   - filename
 *   - displayName
 *
 * @param {String} reporterPath
 * @return {Function}
 * @api public
 */
module.exports = createErrorCatcher;
function createErrorCatcher (reporterPath) {
  return function transform (babel) {
    var t = babel.types;

    return new babel.Transformer(pluginName, {
      /**
       * ES6 ReactComponent
       */
      ClassDeclaration: function (node, parent, scope, file) {
        var hasRenderMethod = node.body.body.filter(isRenderMethod).length > 0;
        if (!hasRenderMethod) {
          return;
        }

        var React         = file.addImport(reactPath,    reactName);
        var errorCatcher  = file.addImport(catcherPath,  catcherName);
        var reporter      = file.addImport(reporterPath, reporterName);

        node.decorators = node.decorators || [];
        node.decorators.push(
          t.decorator(
            t.callExpression(
              errorCatcher,
              [
                React,
                t.literal(file.opts._address || file.opts.filename),
                t.literal(node.id && node.id.name || ''),
                reporter
              ]
            )
          )
        );
      },

      /**
       * ReactClassComponent
       */
      CallExpression: function (node, parent, scope, file) {
        var callee = this.get('callee');
        if (node._catchErrors || !callee.matchesPattern('React.createClass')) {
          return;
        }
        
        var React         = file.addImport(reactPath,    reactName);
        var errorCatcher  = file.addImport(catcherPath,  catcherName);
        var reporter      = file.addImport(reporterPath, reporterName);
        
        node._catchErrors = true;

        return t.callExpression(
          t.callExpression(
            errorCatcher,
            [
              React,
              t.literal(file.opts._address || file.opts.filename),
              t.literal(node.id && node.id.name || ''),
              reporter
            ]
          ),
          [node]
        );
      }
    });
  }
}
