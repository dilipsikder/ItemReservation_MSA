var express = require('express'),
    app = express(),
    //https = require('https'),
    http = require('http'),
    bodyParser = require('body-parser'),
    url = require('url');
var router = express.Router(), resp_data = '', result_data = '', cache_status = '';
app.use(bodyParser.raw());
/*router.use(function (request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});*/

function writeHeader(res) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  var res_head = {'Content-Type' : 'application/json'
  ,'Access-Control-Allow-Origin' : '*'};
  res.writeHead(200, res_head);
}

function create_reservation_direct(res,ItemNum,OrgCode,SubInv,OnhandQty){
	var uname = "SCM IMPU", pwd = "Oracle123";
  var callback_url = "https://edrx-dev1.fa.us2.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryReservations";
  var callback = url.parse(callback_url);
  var req_body = {
    'OrganizationCode' : OrgCode,
    'ItemNumber' : ItemNum,
    'RequirementDate' : '2018-12-01T00:00:00+00:00',
    'DemandSourceType' : 'User Defined',
    'DemandSourceName' : 'SAAS-Data-Import1',
    'SupplySourceType' : 'On hand',
    'SubinventoryCode' : SubInv,
    'ReservationQuantity' : OnhandQty
  };
	const options = {
	  host: callback.hostname,
	  port: callback.port,
	  path: callback.path,
	  method: 'POST',
	  headers: {
		 'Authorization': 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64'),
     'Content-Type': 'application/json',
     'Accept': 'application/json',
     'Content-Length': Buffer.byteLength(JSON.stringify(req_body)),
     'Referer': callback.protocol + '//' + callback.hostname
	  }
	};
  var resp_raw = '';
	console.log(new Date(Date.now()).toLocaleString()+":: "+JSON.stringify(options,0,4));
	const req = https.request(options, function(resp){
	  resp.on('data', function(chunk) {
		 resp_raw += chunk;
	  });
	  resp.on('end', function() {
  		console.log(new Date(Date.now()).toLocaleString()+":: "+"Response data: "+resp_raw);
  		resp_data = JSON.parse(resp_raw);
  		res.writeHead(200, {"Content-Type": "application/json"});
  		var output = { status:"Success", data: resp_data };
  		res.end(JSON.stringify(output) + "\n");
  		return;
	  });
	});
  req.on('error', function(e) {
    console.log(new Date(Date.now()).toLocaleString()+":: "+"Got error: " + e.message);
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { status:"Error", data: e.message };
    res.end(JSON.stringify(output) + "\n");
    return;
  });
  req.write(JSON.stringify(req_body));
  req.end();
}

function create_reservation_api(res,ItemNum,OrgCode,SubInv,OnhandQty){
	//var uname = "SCM IMPU", pwd = "Oracle123";
  var callback_url = "http://debanjande-eval-test.apigee.net/v1/reservation/inventoryReservations";
  var callback = url.parse(callback_url);
  var req_body = {
    'OrganizationCode' : OrgCode,
    'ItemNumber' : ItemNum,
    'RequirementDate' : '2018-12-01T00:00:00+00:00',
    'DemandSourceType' : 'User Defined',
    'DemandSourceName' : 'SAAS-Data-Import1',
    'SupplySourceType' : 'On hand',
    'SubinventoryCode' : SubInv,
    'ReservationQuantity' : OnhandQty
  };
	const options = {
	  host: callback.hostname,
	  port: callback.port,
	  path: callback.path,
	  method: 'POST',
	  headers: {
     'Content-Type': 'application/json',
     'Accept': 'application/json',
     //'Content-Length': Buffer.byteLength(JSON.stringify(req_body)),
     //'Referer': callback.protocol + '//' + callback.hostname
	  }
	};
  var resp_raw = '';
	console.log(new Date(Date.now()).toLocaleString()+":: "+JSON.stringify(options,0,4));
	const req = http.request(options, function(resp){
	  resp.on('data', function(chunk) {
		 resp_raw += chunk;
	  });
	  resp.on('end', function() {
  		console.log(new Date(Date.now()).toLocaleString()+":: "+"Response data: "+resp_raw);
  		resp_data = JSON.parse(resp_raw);
  		res.writeHead(200, {"Content-Type": "application/json"});
  		var output = { status:"Success", data: resp_data };
      logger.emit('ibmms.itemsearch.create_reservation', {source: 'CreateReservation',
        message: 'Successful, Reservation Id - '+output.data.ReservationId});
  		res.end(JSON.stringify(output) + "\n");
  		return;
	  });
	});
  req.on('error', function(e) {
    console.log(new Date(Date.now()).toLocaleString()+":: "+"Got error: " + e.message);
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { status:"Error", data: e.message };
    res.end(JSON.stringify(output) + "\n");
    return;
  });
  req.write(JSON.stringify(req_body));
  req.end();
}
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

router.post('/rsv/:org_code/:sub_inv/:item_num/:onhand_qty', function (req, res) {
  logger.emit('ibmms.itemsearch.create_reservation', {source: 'CreateReservation',
    message: 'Create Reservation for Item - '+req.params.item_num});
  create_reservation_api(res, req.params.item_num, req.params.org_code,req.params.sub_inv,req.params.onhand_qty);
});

module.exports = router;
