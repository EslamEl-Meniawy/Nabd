/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-10 14:24:33
* @Last Modified by: eslam
* @Last Modified time: 2015-09-21 22:48:05
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
	}
}
function onBackKeyDown() {
	window.history.back();
}
function GetDataValue(VarSearch) {
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for (var i = 0; i < VariableArray.length; i++) {
		var KeyValuePair = VariableArray[i].split('=');
		if (KeyValuePair[0] == VarSearch) {
			return KeyValuePair[1];
		}
	}
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function loadData() {
	$.ajax({
		type : 'GET',
		url : 'http://188.40.75.156:8080/nabd/index.php/News/get_news/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		$('#news-image').attr('src', 'http://188.40.75.156:8080/nabd/images/news/' + response[0].image);
		$('#news-title').html(response[0].title);
		$('#news-details').html(response[0].desciption);
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل الخبر برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}