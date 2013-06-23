angular.module('spring-score-presentation', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/results', {templateUrl: 'results.html', controller: ResultsCtrl}).
      when('/schedule', {templateUrl: 'schedule.html', controller: ScheduleCtrl}).
      when('/standings', {templateUrl: 'standings.html', controller: RankingsCtrl}).
      when('/settings', {templateUrl: 'settings.html',   controller: SettingsCtrl}).
      otherwise({redirectTo: '/settings'});
}]);

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
	$(document).click(function(e) {
		if(document.webkitIsFullScreen)
			document.webkitCancelFullScreen();
	});
	
	$(document).keydown(function(event){
		if(event.which==49)//1
			window.location.hash = "/results";
		else if(event.which==50)//2
			window.location.hash = "/schedule";
		else if(event.which==51)//3
			window.location.hash = "/standings";
		else if(event.which==52)//4
			window.location.hash = "/settings";
		else if(event.which==27){//ESC
			if(document.webkitIsFullScreen)
				document.webkitCancelFullScreen();
			else
				document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	});
	
});

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
  
  $scope.setSettingsMode = function() {
	$scope.mode='/settings';
  };
  $scope.setResultsMode = function() {
	$scope.mode='/results';
  };
  $scope.setScheduleMode = function() {
	$scope.mode='/schedule';
  };
  $scope.setStandingsMode = function() {
	$scope.mode='/standings';
  };
}