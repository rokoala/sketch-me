var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname,'public')))
app.use('/bower_components',express.static(path.join(__dirname,'bower_components')))

app.listen(8080, function () {
  console.log("Server running on port 8080");
})
