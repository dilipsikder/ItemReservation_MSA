function clearText(field){
    if (field.defaultValue == field.value) field.value = '';
    else if (field.value == '') field.value = field.defaultValue;
}

function getItemDetailsText(){
  var inp = document.getElementById("itemnum").value, itemsearch_url = "{{ protocal }}"+window.location.hostname+":{{ itemnum_srch_port }}{{ itemnum_srch_path }}"+inp;
  //alert(itemsearch_url);
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();//for Chrome, mozilla etc
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");//for IE only
  }
  var page_lang = document.getElementById("language_hidden").innerHTML,
      env_name = document.getElementById("env_hidden").innerHTML,
      item_limit = document.getElementById("item_limit_hidden").innerHTML,
      item_offset = document.getElementById("item_offset_hidden").innerHTML;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        document.getElementById("srchresp").innerHTML = this.responseText;
        var allItems = JSON.parse(this.responseText).data;
        var itemDescMap = {};
        var itemCatMap = {};
        var itemPrcMap = {};
        var i = null;
        for (i = 0; i < allItems.length; i++) {
            itemDescMap[allItems[i].ItemNumber] = allItems[i].ItemDescription;
            itemCatMap[allItems[i].ItemNumber] = allItems[i].OrganizationCode;
            itemPrcMap[allItems[i].ItemNumber] = (allItems[i].ListPrice==null)?"0":allItems[i].ListPrice;
        }
        var hashItemDesc = function(itemNo) {
            return itemDescMap[itemNo];
        };
        var hashItemCat = function(itemNo) {
            return itemCatMap[itemNo];
        };
        var hashItemPrc = function(itemNo) {
            return itemPrcMap[itemNo];
        };
        page_reset("srch_itm");
        /*if (inp.length > 0) {
          addItemSearchTab(inp,hashItemDesc(inp),hashItemCat(inp),hashItemPrc(inp),1);
        }else*/ {
          for (x in allItems) {
            addItemSearchTab(allItems[x].ItemNumber,allItems[x].ItemDescription,allItems[x].OrganizationCode,allItems[x].ListPrice,x);
          }
        }
      }else{
        document.body.innerHTML = this.responseText;
      }
    }
  };
  //xhttp.open("POST", "{{ itemnum_srch_url }}" + env_name + "/" + item_limit + "/" + item_offset + "/" + inp,true);
  //alert("Calling URL - " + "{{ itemnum_srch_url }}" + inp);
  xhttp.open("GET", itemsearch_url, true);
  xhttp.send();
}

function checkAllSrchTab() {
  var chkStatus = document.getElementById("srchtable").rows[0].cells[0].firstChild.checked;
  var len = document.getElementById("srchtable").rows.length;
  var i = null;
  for (i = 1; i < len; i++) {
    document.getElementById("srchtable").rows[i].cells[0].firstChild.checked = chkStatus;
  }
}

function page_reset(instr){
  if (instr == "srch_itm") {
    document.getElementById("itemnum").value = "";
    var len = parseInt(document.getElementById("srchtable").rows.length);
    for (i = 1; i < len; i++) {
      document.getElementById("srchtable").deleteRow(-1);
    }
  }else if (instr == "crt_req"){
    document.getElementById("reqprice").innerHTML = "0";
    var len = parseInt(document.getElementById("reqtable").rows.length);
    for (i = 1; i < len; i++) {
      document.getElementById("reqtable").deleteRow(-1);
    }
  }
}

function addItem() {
  var i = null;
  var len = parseInt(document.getElementById("srchtable").rows.length);
  for (i = 1; i < len; i++) {
    if (document.getElementById("srchtable").rows[i].cells[0].firstChild.checked == true) {
      var itemno = document.getElementById("srchtable").rows[i].cells[1].innerHTML;
      var itemdesc = document.getElementById("srchtable").rows[i].cells[2].innerHTML;
      var itemprc = document.getElementById("srchtable").rows[i].cells[4].innerHTML;
      addItemReqTab(itemno,itemdesc,itemprc,i); //hashUnitPrice(itemno),i);
    }
  }
}

function deleteRow(rw) {
  var i = rw.parentNode.parentNode.rowIndex;
  document.getElementById("reqtable").deleteRow(i);
};

function updateTotal(rw) {
  var i = rw.parentNode.parentNode.rowIndex;
  var qty = parseFloat(document.getElementById("reqtable").rows[i].cells[1].firstChild.value),
      untprc = parseFloat(document.getElementById("reqtable").rows[i].cells[3].innerHTML);
  if (qty > 0 && untprc > 0) {
    document.getElementById("reqtable").rows[i].cells[4].innerHTML = qty * untprc;
  }else {
    document.getElementById("reqtable").rows[i].cells[4].innerHTML = 0;
  }
  var len = parseInt(document.getElementById("reqtable").rows.length), sum = 0;
  for (i = 1; i < len; i++) {
    sum += parseFloat(document.getElementById("reqtable").rows[i].cells[4].innerHTML);
  }
  document.getElementById("reqprice").innerHTML = sum;
}

function addItemSearchTab(inum,idsc,icat,iprc,idx) {
  var cell_chkbx = document.createElement("td"),
      cell_itmnum = document.createElement("td"),
      cell_itmdsc = document.createElement("td"),
      cell_itmcat = document.createElement("td"),
      cell_itmprc = document.createElement("td");
  cell_chkbx.innerHTML = '<input type="checkbox">';
  var row = document.createElement("tr");
  row.appendChild(cell_chkbx);
  cell_itmnum.innerHTML = inum;
  row.appendChild(cell_itmnum);
  cell_itmdsc.innerHTML = icat;
  row.appendChild(cell_itmdsc);
  cell_itmcat.innerHTML = icat;
  row.appendChild(cell_itmcat);
  cell_itmprc.innerHTML = (iprc==null)?"0":iprc;
  row.appendChild(cell_itmprc);
  document.getElementById("srchtable").appendChild(row);
}

function createReservation(rw) {
  var i = rw.parentNode.parentNode.rowIndex;
  var org_code = document.getElementById("reqtable").rows[i].cells[2].innerHTML,
      sub_inv = document.getElementById("reqtable").rows[i].cells[3].innerHTML,
      item_num = document.getElementById("reqtable").rows[i].cells[0].innerHTML,
      onhand_qty = parseInt(document.getElementById("reqtable").rows[i].cells[1].innerHTML),
      rsv_qty = parseInt(document.getElementById("reqtable").rows[i].cells[4].firstChild.value);
  /*if(!(sub_inv)){
    alert("Subinventory can not be blank");
    return;
  }
  if((onhand_qty<=0)||(onhand_qty<rsv_qty){
    alert("Either On-hand should be a positive non-zero value, and/or on-hand should be equal to or higher than reserved quantity.");
    return;
  }*/
  var inp = org_code+"/"+sub_inv+"/"+item_num+"/"+rsv_qty;
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();//for Chrome, mozilla etc
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");//for IE only
  }
  //var page_lang = document.getElementById("language_hidden").innerHTML,
  //    env_name = document.getElementById("env_hidden").innerHTML;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var crt_rsv_resp = JSON.parse(this.responseText);
        if(crt_rsv_resp.status == "Success"){
          document.getElementById("reqtable").rows[i].cells[5].innerHTML = crt_rsv_resp.data.ReservationId;
          alert("Reservation created successfully, Reservation id: " + crt_rsv_resp.data.ReservationId);
        }else{
          alert("Error: "+crt_rsv_resp.data);
        }
      }else{
        document.body.innerHTML = this.responseText;
      }
    }
  }
  xhttp.open("POST", "/crt_rsv/rsv/" + inp,true);
  xhttp.send();
}

function getOnhandDetailsText(rw){
  var i = rw.parentNode.parentNode.rowIndex;
  var orgcode = document.getElementById("reqtable").rows[i].cells[2].innerHTML,
      itemnum = document.getElementById("reqtable").rows[i].cells[0].innerHTML;
  var inp = orgcode+"/"+itemnum;
  var onhand_url = "{{ protocal }}"+window.location.hostname+":{{ onhand_srch_port }}{{ onhand_srch_path }}"+inp;
  //alert(onhand_url);
  if(window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();//for Chrome, mozilla etc
  }else if(window.ActiveXObject){
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");//for IE only
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        document.getElementById("srchresp").innerHTML = this.responseText;
        var onhand_resp = JSON.parse(this.responseText).data;
        document.getElementById("onhand_qty_row").innerHTML = onhand_resp[0].OnhandQuantity;
        document.getElementById("subinv_row").innerHTML = onhand_resp[0].SubinventoryCode;
      }else{
        document.body.innerHTML = this.responseText;
      }
    }
  };
  xhttp.open("GET", onhand_url, true);
  xhttp.send();
}

function addItemReqTab(inum,idsc,iunit,idx) {
  var cell_itmnum = document.createElement("td"),
      cell_qty = document.createElement("td"),
      cell_itmdsc = document.createElement("td"),
      cell_unit = document.createElement("td"),
      cell_tot = document.createElement("td"),
      cell_rsv_id = document.createElement("td"),
      cell_del_btn = document.createElement("td"),
      cell_rsv_btn = document.createElement("td"),
      cell_onhand_btn = document.createElement("td");
  cell_itmnum.innerHTML = inum;
  var row = document.createElement("tr");
  row.appendChild(cell_itmnum);
  cell_qty.innerHTML = "0";
  cell_qty.setAttribute("id","onhand_qty_row");
  row.appendChild(cell_qty);
  cell_itmdsc.innerHTML = idsc;
  row.appendChild(cell_itmdsc);
  cell_unit.innerHTML = "";
  cell_unit.setAttribute("id","subinv_row");
  row.appendChild(cell_unit);
  cell_tot.innerHTML = "<input type='text' id='rsvqty'" + idx + " placeholder='0' class='form-control'/>";
  row.appendChild(cell_tot);
  cell_rsv_id.innerHTML = "";
  cell_rsv_id.setAttribute("id","rsvid_row");
  row.appendChild(cell_rsv_id);
  cell_onhand_btn.innerHTML = "<a id='onhand_row'" + idx + " class='btn btn-default' onclick='getOnhandDetailsText(this)'>{{ onhandrow_txt }}</a>";
  row.appendChild(cell_onhand_btn);
  cell_rsv_btn.innerHTML = "<a id='rsvbutton_row'" + idx + " class='btn btn-default' onclick='createReservation(this)'>{{ create_req_btn_txt }}</a>";
  row.appendChild(cell_rsv_btn);
  /*cell_del_btn.innerHTML = "<a id='delete_row'" + idx + " class='btn btn-default' onclick='deleteRow(this)'>{{ delrow_txt }}</a>";
  row.appendChild(cell_del_btn);*/
  document.getElementById("reqtable").appendChild(row);
}

function set_env_name(env_name){
  document.getElementById("env_hidden").innerHTML = env_name;
  alert("Environment value set: "+document.getElementById("env_hidden").innerHTML);
}
function set_item_limit(item_limit){
  document.getElementById("item_limit_hidden").innerHTML = item_limit;
}
function set_item_offset(item_offset){
  document.getElementById("item_offset_hidden").innerHTML = item_offset;
}
