/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-10 14:24:54
* @Last Modified by: eslam
* @Last Modified time: 2015-09-30 14:34:32
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var id = GetDataValue('id');
var connected;
var page = 0;
var temp = '<a class="tdn" href="details.html?id={{id}}"><div class="mdl-grid mdl-color--grey-300 stroke rtl nop category-item"><div class="mdl-cell grid-25 nom" style="background: url({{image}});background-size: cover;"></div><div class="mdl-cell grid-75"><h5 class="mdl-color-text--grey-800 title-line-height">{{title}}</h5></div></div></a>';
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
		loadDataOffline();
	}
	$('#show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		window.location = "index.html";
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
		url : 'http://188.40.75.156:8080/nabd/index.php/news?section=' + id + '&page=' + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			window.localStorage.setItem('savedCategory' + id, JSON.stringify(response));
		}
		fillData(response);
		page ++;
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل لاأخبار برجاء المحاولة مرة آخرى", 'إغلاق');
		if (page == 0) {
			loadDataOffline();
		}
	});
}
function loadDataOffline() {
	var data = window.localStorage.getItem('savedCategory' + id);
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		var tempToAppend = temp;
		if (response[i].image != '' && response[i].image != null) {
			tempToAppend = tempToAppend.replace(/{{image}}/g, 'http://188.40.75.156:8080/nabd/images/news/' + response[i].image);
		} else {
			tempToAppend = tempToAppend.replace(/{{image}}/g, 'icon.png');
		}
		$('#main-data').append(tempToAppend.replace(/{{id}}/g, response[i].id).replace(/{{title}}/g, response[i].title));
	}
	$('.grid-25').each(function() {
		$(this).width(((($(window).width()) * 0.25)) + 'px');
	});
	$('.grid-75').each(function() {
		$(this).width((($(window).width() * 0.75) - 16) + 'px');
	});
}