'use strict';

// initialize express
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 8080);

/**
 * Expose object.
 */
module.exports = app;

// log errors
app.on('error', function (err) {
  console.log('App Error:', err);
});

// serve static assets
app.use(express.static(__dirname+'/../client'));
