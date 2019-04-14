var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    //request = require("request"),
    swig = require('swig'),
    swig = new swig.Swig();

var page_txt = {
    title : 'Manage your Item Reservations',
    description : 'A comprehensive tool to manage all your Item Reservations',
    page_title : 'Manage Reservations',
    app_name : 'Manage Reservations',
    about : 'About',
    services : 'Services',
    contact : 'Contact',
    languages : 'Languages',
    reset_txt : 'Reset',
    search_itemnum_txt : 'Search with Item Number',
    find_item_txt : 'Find Item',
    find_item_txt : 'Find Item',
    itemdatefrom_txt : 'Date From: ',
    itemdateto_txt : 'Date To: ',
    add_item_txt : 'Add Item',
    item_created_on_txt : 'Item Created on: ',
    item_desc_txt : 'Item Description',
    create_req_btn_txt : 'Reserve',
    qty_txt : 'Onhand Qty',
    itemnum_txt : 'Item Number',
    itemnum_txt_shrt : 'Itm #',
    itemdesc_txt : 'Item Desc',
    itemorg_txt : 'Item Org',
    itemdesc_txt_shrt : 'Itm Des',
    itemcat_txt : 'Item Category',
    itemcat_txt_shrt : 'Itm Cat',
    itemorg_txt_shrt : 'Itm Org',
    itemsuborg_txt : 'Sub Inventory',
    itemsuborg_txt_shrt : 'Itm SubInv',
    itemrsvqty_txt : 'Reserved Qty',
    itemrsvqty_txt_shrt : 'Rsv qty',
    itemrsv_id_txt : 'Reservation Id',
    unitprice_txt : 'Unit Price',
    unitprice_txt_shrt : 'Price',
    totalprice_txt : 'Total Price',
    reqprice_txt : 'Requisition Total Price',
    delrow_txt : 'Delete',
    onhandrow_txt : 'Onhand',
    home_txt : 'Home',
    settings: 'Settings',
    environment: 'Environment',
    item_limit: 'Set Item Limit',
    item_offset: 'Set Item Offset'
}, env = 'DEV', item_limit = 10, item_offset = 0, page_lang = 'en',
crt_rsv = require('./public/javascripts/crt_rsv');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//const onhand_source_init = `${process.env.ONHANDQUERY_DEBANJAN_V1_SERVICE_HOST}:${process.env.ONHANDQUERY_DEBANJAN_V1_SERVICE_PORT}`,
//      itemsearch_init = `${process.env.ITEM_SEARCH_DEBANJAN_V1_SERVICE_HOST}:${process.env.ITEM_SEARCH_DEBANJAN_V1_SERVICE_PORT}`;
var //onhand_source = onhand_source_init+"/onhandquery/find/",
    //onhand_source = "http://192.168.65.128:8092/onhandquery/find/",
    onhand_path = "/onhandquery/find/",
    //itemsrch_source = itemsearch_init+"/item_num/find/";
    //itemsrch_source = "http://192.168.65.128:8091/item_num/find/";
    itemsrch_path = "/item_num/find/",
    protocal = "http://",
    onhand_port = "31092",
    itemsearch_port = "31091";
    //onhand_port = "8092",
    //itemsearch_port = "8091";

function render_page(p_page_txt,res){
  res.render('index.html', {
    title:p_page_txt.title,
    description:p_page_txt.description,
    page_title:p_page_txt.page_title,
    app_name:p_page_txt.app_name,
    about:p_page_txt.about,
    services:p_page_txt.services,
    contact:p_page_txt.contact,
    languages:p_page_txt.languages,
    itemnum_txt:p_page_txt.itemnum_txt,
    itemcat_txt:p_page_txt.itemcat_txt,
    search_itemnum_txt:p_page_txt.search_itemnum_txt,
    reset_txt:p_page_txt.reset_txt,
    find_item_txt:p_page_txt.find_item_txt,
    itemdatefrom_txt:p_page_txt.itemdatefrom_txt,
    itemdateto_txt:p_page_txt.itemdateto_txt,
    add_item_txt:p_page_txt.add_item_txt,
    item_created_on_txt:p_page_txt.item_created_on_txt,
    item_desc_txt:p_page_txt.item_desc_txt,
    create_req_btn_txt:p_page_txt.create_req_btn_txt,
    qty_txt:p_page_txt.qty_txt,
    itemdesc_txt:p_page_txt.itemdesc_txt,
    itemnum_txt_shrt:p_page_txt.itemnum_txt_shrt,
    itemcat_txt_shrt:p_page_txt.itemcat_txt_shrt,
    itemorg_txt_shrt:p_page_txt.itemorg_txt_shrt,
    itemdesc_txt_shrt:p_page_txt.itemdesc_txt_shrt,
    itemrsv_id_txt:p_page_txt.itemrsv_id_txt,
    unitprice_txt:p_page_txt.unitprice_txt,
    unitprice_txt_shrt:p_page_txt.unitprice_txt_shrt,
    totalprice_txt:p_page_txt.totalprice_txt,
    reqprice_txt:p_page_txt.reqprice_txt,
    delrow_txt:p_page_txt.delrow_txt,
    onhandrow_txt:p_page_txt.onhandrow_txt,
    itemnum_srch_path:itemsrch_path,
    onhand_srch_path:onhand_path,
    protocal:protocal,
    itemnum_srch_port:itemsearch_port,
    onhand_srch_port:onhand_port,
    home_txt:p_page_txt.home_txt,
    settings: p_page_txt.settings,
    environment: p_page_txt.environment,
    item_limit: p_page_txt.item_limit,
    item_offset: p_page_txt.item_offset,
	  itemorg_txt: p_page_txt.itemorg_txt,
	  itemsuborg_txt: p_page_txt.itemsuborg_txt,
	  itemsuborg_txt_shrt: p_page_txt.itemsuborg_txt_shrt,
	  itemrsvqty_txt: p_page_txt.itemrsvqty_txt,
	  itemrsvqty_txt_shrt: p_page_txt.itemrsvqty_txt_shrt
  });
}

app.use('/crt_rsv', crt_rsv);

/***********************************************
SSO Implementation code section
************************************************/
/*var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

//session
app.use(session({
  secret:'a9fa6cf7-71c7-4515-96ac-dfb2c281ccc8',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware());*/

app.use('/reservation', function(req, res) {
//app.use('/reservation', keycloak.protect(), function(req, res) {
  render_page(page_txt,res);
});

/*app.get('/reservation', function(req, res) {
  render_page(page_txt,res);
});*/

//app.use('/', keycloak.protect(), express.Router());
app.use('/', express.Router());
app.listen(8093,function(){
  console.log(new Date(Date.now()).toLocaleString()+":: "+"Live at Port " + 8093);
});
/*app.listen(process.env.PORT || 8093,function(){
  console.log("Live at Port " + process.env.PORT || 8093);
});*/
