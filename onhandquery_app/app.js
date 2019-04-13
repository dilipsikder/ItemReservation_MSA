var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require("request");
var onhandquery = require('./public/javascripts/onhandquery');
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views'));

app.get('/onhand',function(req, res){
  console.log(new Date(Date.now()).toLocaleString()+":: "+"Onhand called....");
  res.writeHead(200, {"Content-Type": "application/json"});
  var output = { error: "Failed in get On-hand details REST call"};
  res.end(JSON.stringify(output) + "\n");
});
app.use('/onhandquery', onhandquery);

app.use('/', express.Router());
app.listen(8092,function(){
  console.log(new Date(Date.now()).toLocaleString()+":: "+"Live at Port " + 8092);
});
