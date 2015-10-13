/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-10 14:24:33
* @Last Modified by: eslam
* @Last Modified time: 2015-10-13 11:54:58
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
$('.mdl-mega-footer').width(($(window).width() - 20) + 'px');
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	window.addEventListener('orientationchange', function() {
		$('.mdl-mega-footer').width(($(window).width() - 20) + 'px');
	});
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
	}
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		window.history.back();
	}
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
		url : 'http://188.40.75.156/nabd/index.php/News/get_news/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		if (response[0].image != '' && response[0].image != null) {
			$('#news-image').attr('src', 'http://188.40.75.156/nabd/images/news/' + response[0].image);
		} else {
			$('#news-image').hide();
		}
		$('#news-title').html(response[0].title);
		$('#news-details').html(response[0].desciption);
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل الخبر برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}