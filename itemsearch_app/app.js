var express = require('express')
    fs = require('fs')
    app = express();

/*var path = require('path')
    bodyParser = require('body-parser')
    request = require("request");*/
var item_num = require('./public/javascripts/item_num');
/*var item_img = require('./public/javascripts/item_img'),
    settings = require('./public/javascripts/settings');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));*/

/***********************************************
SSO Implementation code section
************************************************/
/*var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

//session
app.use(session({
  secret:'8328d0c9-790e-4196-92fb-f21c23ecb1fe',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware());*/

app.use('/item_num', item_num);

//app.use('/', keycloak.protect(), express.Router());
app.use('/', express.Router());
app.listen(8091,function(){
  console.log(new Date(Date.now()).toLocaleString()+"::   Live at Port " + 8091);
});

/*
var https = require('https');
https.createServer({
  key: fs.readFileSync('./public/security/server.key'),
  cert: fs.readFileSync('./public/security/server.cert')
}, app)
.listen(8091, function () {
  console.log(new Date(Date.now()).toLocaleString()+"::   Live at Port " + 8091)
})
*/
