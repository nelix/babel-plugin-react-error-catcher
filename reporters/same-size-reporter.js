'use strict';

var React = require('react');
var BasicReporter = require('./basic-reporter');

var COPY_STYLES = [
  'display',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight'
];

/**
 * Upon an error, returns a BasicReporter of the same size and position of the 
 * target component.
 */
exports = module.exports = sameSizeReporter;
function sameSizeReporter (error, instance, filename, displayName) {
  var style = instance._reporterStyle || (instance._reporterStyle = {});
  var className = instance._reporterClassName;

  instance._reportingError = true;

  return React.createElement(
    BasicReporter,
    {
      error: error,
      style: style,
      className: className
    }
  );
}

/**
 * This function is called when the component makes it to `componentDidMount`
 * and `componentDidUpdate`.
 */
exports.rendered = rendered;
function rendered (instance, filename, displayName) {
  var style = instance._reporterStyle || (instance._reporterStyle = {});
  var element = React.findDOMNode(instance);
  var elementStyle = element && element.style;
  var elementClass = element && element.getAttribute('class');

  // don't track the style when reporting an error
  if (instance._reportingError) {
    delete instance._reportingError;
    return;
  }

  COPY_STYLES.forEach(function (key) {
    if (elementStyle[key]) {
      style[key] = elementStyle[key];
    }
  });

  if (style.display === 'none') {
    style.display = 'inline-block';
  }

  style.width  = element.offsetWidth;
  style.height = element.offsetHeight;

  instance._reporterClassName = elementClass;
}
