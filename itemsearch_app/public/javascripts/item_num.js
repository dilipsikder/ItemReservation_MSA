var express = require('express'),
    app = express(),
    //http = require('https'),
    http = require('http'),
    bodyParser = require('body-parser');
var router = express.Router(), resp_data = [], result_data = '', cache_status = '';
app.use(bodyParser.raw());
router.use(function (request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/*****************************************
Logging framework initialization
*****************************************/
var logger = require('fluent-logger');
logger.configure('ibmms.itemsearch', {
  host: '168.1.140.231',
  port: 31224,
  timeout: 3.0,
  reconnectInterval: 600000 // 10 minutes
});


function find_item_api(res,itemNum,OrgCode){
	//var uname = 'SCM IMPU', pwd = 'Oracle123';
  var host_name="debanjande-eval-test.apigee.net";
	var item_str=(itemNum?"&q=ItemNumber='" + itemNum + "'":null);
	console.log(new Date(Date.now()).toLocaleString()+":: "+"Item string = "+item_str);
	var options = {
	  host: host_name,
	  port: 80,
	  path: "/v1/itemsearch/items?fields=ItemId,ItemNumber,ItemDescription,OrganizationCode&onlyData=true"+
	  //"OrganizationCode='" + OrgCode + "'" +
	  item_str,
	  method: 'GET'
	};
	var request = require('request'), resp_raw = '';
	console.log(new Date(Date.now()).toLocaleString()+":: Request Header => "+JSON.stringify(options,0,4));
	http.request(options, function(resp){
	  resp.on('data', function(chunk) {
		 resp_raw += chunk;
	  });
	  resp.on('end', function() {
  		console.log(new Date(Date.now()).toLocaleString()+":: "+"raw data: "+resp_raw);
  		resp_data = JSON.parse(resp_raw).items;
  		res.writeHead(200, {"Content-Type": "application/json"});
  		var output = { data: resp_data };
  		res.end(JSON.stringify(output) + "\n");
  		return;
	  });
	  resp.on('error', function(e) {
		  console.log(new Date(Date.now()).toLocaleString()+":: Got error => " + e.message);
		  res.writeHead(200, {"Content-Type": "application/json"});
		  var output = { error: "Failed in get On-hand details REST call", ItemNumber: itemNum };
		  res.end(JSON.stringify(output) + "\n");
		  return;
	  });
	}).end();
}

router.get('/find/:item_code', function(req, res) {
    logger.emit('ibmms.itemsearch.find_item', {source: 'ItemSearch', message: 'Finding item - '+req.params.item_code});
	find_item_api(res, req.params.item_code, req.params.orgcode);
});

module.exports = router;
