if (typeof global === 'undefined' && typeof window !== 'undefined') {
  global = window;
}

var System = global && global.System;
var pluginPath = 'babel-plugin-react-error-catcher';

var catcherName = 'ErrorCatcher';
var catcherPath = (System && __dirname || pluginPath)+'/error-catcher.jsx';

var reactName = 'React';
var reactPath = 'react';

function isRenderMethod (member) {
  return member.kind === 'method' &&
         member.key.name === 'render';
}

exports = module.exports = transform;
function transform (babel) {
  var t = babel.types;

  return new babel.Transformer(pluginPath, {
    /**
     * ES6 ReactComponent
     */
    ClassDeclaration: function (node, parent, scope, file) {
      var hasRenderMethod = node.body.body.filter(isRenderMethod).length > 0;
      if (!hasRenderMethod) {
        return;
      }

      var ErrorCatcher  = file.addImport(catcherPath, catcherName);
      var React         = file.addImport(reactPath,   reactName);

      node.decorators = node.decorators || [];
      node.decorators.push(
        t.decorator(
          t.callExpression(
            ErrorCatcher,
            [
              React,
              t.literal(file.opts._address || file.opts.filename),
              t.literal(node.id.name)
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
      if (node._errDecorated || !callee.matchesPattern('React.createClass')) {
        return;
      }
      
      var ErrorCatcher  = file.addImport(catcherPath, catcherName);
      var React         = file.addImport(reactPath,   reactName);
      
      node._errDecorated = true;

      return t.callExpression(
        t.callExpression(
          ErrorCatcher,
          [
            React,
            t.literal(file.opts._address || file.opts.filename),
            t.literal(node && node.id && node.id.name || '')
          ]
        ),
        [node]
      );
    }
  });
}
