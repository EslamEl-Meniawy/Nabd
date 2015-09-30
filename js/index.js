/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-09 13:14:48
* @Last Modified by: eslam
* @Last Modified time: 2015-09-30 11:45:59
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var latestLink = 'http://188.40.75.156:8080/nabd/index.php/news/recent_news',
	resultsLink = 'http://188.40.75.156:8080/nabd/index.php/news?section=15&page=0';
var connected;
var loadedLatest = false, loadedResults = false;
var slideTemp = '<div class="swiper-slide"><a class="tdn" href="details.html?id={{id}}"><div class="slide-grid mdl-color--grey-300 nop"><div class="mdl-cell grid-30 nom" style="background: url(http://188.40.75.156:8080/nabd/images/news/{{image}});background-size: cover;"></div><div class="mdl-cell grid-70 rtl"><h5 class="mdl-color-text--grey-800 title-line-height">{{title}}</h5></div></div></a></div>';
$('.mdl-mega-footer').width(($(window).width() - 20) + 'px');
$('.grid-50').each(function() {
	$(this).width(((($(window).width() - 16) * 0.5) - 16) + 'px');
});
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadLatest();
		loadResults();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadLatestOffline();
		loadResultsOffline();
	}
	var push = PushNotification.init({
		"android": {
			"senderID": "512981003853"
		},
		"ios": {"alert": "true", "badge": "true", "sound": "true"}, 
		"windows": {} 
	});
	push.on('registration', function(data) {
		window.plugins.uniqueDeviceID.get(function(uuid) {
			$.ajax({
				type : 'POST',
				url : 'http://188.40.75.156:3030/register',
				data : {
					devId: uuid,
					regId: data.registrationId
				}
			});
		}, function() {});
	});
	push.on('notification', function(data) {
		if (!data.additionalData.foreground) {
			window.location = "details.html?id=" + data.additionalData.additionalData.id;
		}
	});
	push.on('error', function(e) {});
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		navigator.app.exitApp();
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
function loadLatest() {
	$.ajax({
		type : 'GET',
		url : latestLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedLatest', JSON.stringify(response));
		fillLatest(response);
	}).fail(function() {
		loadedLatest = true;
		if (loadedLatest && loadedResults) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل آخر الأخبار برجاء المحاولة مرة آخرى", 'إغلاق');
		loadLatestOffline();
	});
}
function loadResults() {
	$.ajax({
		type : 'GET',
		url : resultsLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedResults', JSON.stringify(response));
		fillResults(response);
	}).fail(function() {
		loadedResults = true;
		if (loadedLatest && loadedResults) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل النتائج برجاء المحاولة مرة آخرى", 'إغلاق');
		loadResultsOffline();
	});
}
function loadLatestOffline() {
	var savedLatest = window.localStorage.getItem('savedLatest');
	if (!(typeof savedLatest === 'undefined' || savedLatest === null)) {
		fillLatest(JSON.parse(savedLatest));
	}
}
function loadResultsOffline() {
	var savedResults = window.localStorage.getItem('savedResults');
	if (!(typeof savedResults === 'undefined' || savedResults === null)) {
		fillResults(JSON.parse(savedResults));
	}
}
function fillLatest(response) {
	for (var i = 0; i < response.length; i++) {
		$('#newsWrapper').append(slideTemp.replace(/{{id}}/g, response[i].id).replace(/{{image}}/g, response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.grid-30').each(function() {
		$(this).width((($(window).width() - 16) * 0.3) + 'px');
	});
	$('.grid-70').each(function() {
		$(this).width(((($(window).width() - 16) * 0.7) - 16) + 'px');
	});
	new Swiper('.swiper-container-news', {
		pagination: '.swiper-pagination-news',
		slidesPerView: 1,
		slidesPerColumn: 3,
		paginationClickable: true,
		autoplay: 5000,
		observer: true,
		observeParents: true
	});
	loadedLatest = true;
	if (loadedLatest && loadedResults) {
		$('#loading').hide();
	}
}
function fillResults(response) {
	for (var i = 0; i < response.length; i++) {
		$('#resultsWrapper').append(slideTemp.replace(/{{id}}/g, response[i].id).replace(/{{image}}/g, response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.grid-30').each(function() {
		$(this).width((($(window).width() - 16) * 0.3) + 'px');
	});
	$('.grid-70').each(function() {
		$(this).width(((($(window).width() - 16) * 0.7) - 16) + 'px');
	});
	new Swiper('.swiper-container-results', {
		pagination: '.swiper-pagination-results',
		slidesPerView: 1,
		slidesPerColumn: 3,
		paginationClickable: true,
		autoplay: 5000,
		observer: true,
		observeParents: true
	});
	loadedResults = true;
	if (loadedLatest && loadedResults) {
		$('#loading').hide();
	}
}