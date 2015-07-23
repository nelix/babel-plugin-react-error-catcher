'use strict';

var DEFAULT_STYLE = {
  display     : 'inline-block',
  color       : '#ffffff',
  background  : '#aa0000',
  whiteSpace  : 'pre-wrap',
  wordSpacing : 'normal',
  wordBreak   : 'normal'
};

var SAFE_RESULTS = {
  getInitialState: {},
  shouldComponentUpdate: true
};

var RENDERED_KEYS = {
  componentDidMount: true,
  componentDidUpdate: true
};

/**
 * Overloads some component's methods to catch errors and pass them to the 
 * report function.  The report function may return a ReactElement or 
 * ReactComponent to be rendered in the event of an error.
 *
 * @param {Object} React
 * @param {String} filename
 * @param {String} displayName
 * @param {ReactComponent|Function} reporter
 * @return {Function}
 * @api public
 */
module.exports = errorCatcher;
function errorCatcher (React, filename, displayName, reporter) {
  var report;

  if (reporter.prototype && typeof reporter.prototype.render === 'function') {
    report = function (error, instance, filename, displayName) {
      return React.createElement(reporter, {
        error: error,
        instance: instance,
        filename: filename,
        displayName: displayName
      });
    };
  } else {
    report = reporter;
  }

  return function patch (Component) {
    var proto = Component.prototype;
    var keys = Object.getOwnPropertyNames(proto);
    var nextRender = null;

    if (Component._patchedToCatch) {
      return Component;
    }
    Component._patchedToCatch = true;

    keys.forEach(function (key) {
      var method = proto[key];

      if (typeof method !== 'function') {
        return;
      }

      function getResult () {
        var result;

        try {
          result = method.apply(this, arguments);
        } catch (error) {
          nextRender = report(error, this, filename, displayName);

          if (nextRender) {
            setTimeout(function () {
              this.forceUpdate();
            }.bind(this));
          }
          
          if (SAFE_RESULTS[key]) {
            result = SAFE_RESULTS[key];
          }
        }

        return result;
      }

      if (key === 'render') {
        proto[key] = function () {
          var result = nextRender;  // render reporter's message if truthy
          nextRender = null;        // and then forget it

          return result
            || getResult.apply(this, arguments)
            || renderDefault(React, displayName);
        };
      } else if (report.rendered && RENDERED_KEYS[key]) {
        proto[key] = function () {
          report.rendered(this, filename, displayName);
          return getResult.apply(this, arguments);
        };
      } else {
        proto[key] = getResult;
      }
    });
    
    // ensure the reporter knows when the component has mounted/updated
    if (report.rendered) {
      for (var key in RENDERED_KEYS) {
        if (!proto[key]) {
          proto[key] = function () {
            report.rendered(this, filename, displayName);
          }
        }
      }
    }

    return Component;
  }
}

/**
 * Creates a ReactElement containing the `displayName`.
 *
 * @param {Object} React
 * @param {String} displayName
 * @return {ReactElement}
 * @api private
 */
function renderDefault (React, displayName) {
  return React.createElement('div', {style: DEFAULT_STYLE}, displayName);
}
