'use strict';

var React = require('react');

var BasicReporter = React.createClass({
  getStyle: function () {
    var propsStyle = this.props.style || {};
    var style = {
      display     : 'inline-block',
      color       : '#ffffff',
      background  : '#aa0000',
      whiteSpace  : 'pre-wrap',
      wordSpacing : 'normal',
      wordBreak   : 'normal'
    };

    for (var key in propsStyle) {
      style[key] = propsStyle[key];
    }

    return style;
  },
  
  getContents: function () {
    return this.props.error && this.props.error.toString();
  },

  render: function () {
    return React.createElement(
      'div',
      {style: this.getStyle()},
      this.getContents()
    );
  }
});

module.exports = BasicReporter;
