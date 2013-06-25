angular.module('spring-score-presentation', [])
  .service('UpdateService', UpdateService)
  .service('SettingsService', SettingsService)
  .service('ScrollService', ScrollService)
  .config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/results', {templateUrl: 'results.html', controller: ResultsCtrl}).
      when('/schedule', {templateUrl: 'schedule.html', controller: ScheduleCtrl}).
      when('/standings', {templateUrl: 'standings.html', controller: RankingsCtrl}).
      when('/settings', {templateUrl: 'settings.html', controller: SettingsCtrl}).
      when('/help', {templateUrl: 'help.html'}).
      otherwise({redirectTo: '/help'})
  }])
  .run(['UpdateService', function(UpdateService){}])//force instanciation of update service
  .run(['ScrollService', function(ScrollService){}])//force instanciation of scroll service
  ;

function updateSize(){
	$('#content-root').width($(window).width());
	$('#content-root').height($(window).height());
}
  
$(document).ready(function(){
	/*
	* Fullscreen button
	*/
	$('#fullscreen-button').click(function(e) {
		document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	});
	
	/*
	* Unfullscreen click in fullscreen mode
	*/
	//$(document).click(function(e) {
	//	if(document.webkitIsFullScreen)
	//		document.webkitCancelFullScreen();
	//});
	
	$(document).keydown(function(event){
		if(event.which==27 || event.which==122){//ESC || F11
			if(document.webkitIsFullScreen)
				document.webkitCancelFullScreen();
			else
				document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
		else if(event.which==112)//F1
			window.location.hash = "/results";
		else if(event.which==113)//F2
			window.location.hash = "/schedule";
		else if(event.which==114)//F3
			window.location.hash = "/standings";
			
		else if(event.which==123)//F12
			window.location.hash = "/settings";
	});
	
	$(window).resize(function() {
		updateSize();
	});
	updateSize();
});

function ScrollService($rootScope, SettingsService) {
	var o = this;
	
	this.tryScrolling = function(){
		if(SettingsService.scrollingEnabled)
			o.startScrolling();
	}
	this.startScrolling = function(){
		o.stopScrolling();
		o.scrollInterval = setInterval(o.pageScroll, 50);
	}
	this.stopScrolling = function(){
		if(o.scrollInterval)
			clearInterval(o.scrollInterval);
		o.scrollInterval = null;
	}
	
	this.pageScroll = function() {
		var totalHeight = $("#content-inner").height();
		var totalScrolled = $("#content-root").height() + $("#content-root").scrollTop();
		if(totalHeight-totalScrolled <= 0){
			o.stopScrolling();
			setTimeout(function(){
				$("#content-root").scrollTop(0);
				o.startScrolling();
			}, 1000);
		}
		else{
			$("#content-root").scrollTop($("#content-root").scrollTop()+1);
		}
	}
	
	this.isScrolling = function(){
		return o.scrollInterval!=null;
	}
	
	this.startScrolling();
	
	$rootScope.$on('$routeChangeStart', function(current, previous) {//by default stop scrolling when transition to new page
		o.stopScrolling();
	});
}

function ModeCtrl($scope) {
  $scope.$on('$routeChangeStart', function(current, previous) {
	$scope.mode = window.location.hash.substring(1);//must remove hash
  });
  $scope.mode = 'settings';
  $scope.isSettingsMode = function() {
	return $scope.mode=='/settings';
  };
  $scope.isResultsMode = function() {
	return $scope.mode=='/results';
  };
  $scope.isScheduleMode = function() {
	return $scope.mode=='/schedule';
  };
  $scope.isStandingsMode = function() {
	return $scope.mode=='/standings';
  };
  $scope.isHelpMode = function() {
	return $scope.mode=='/help';
  };
}