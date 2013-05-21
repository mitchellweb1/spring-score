angular.module('spring-score-presentation', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/settings', {templateUrl: 'settings.html',   controller: SettingsCtrl}).
      when('/standings', {templateUrl: 'standings.html', controller: RankingsCtrl}).
      otherwise({redirectTo: '/settings'});
}]);

/*
 * Fullscreen button
 */
document.addEventListener('click', function(e) {
	if(document.webkitIsFullScreen)
		document.webkitCancelFullScreen();
});
var client;
document.addEventListener('DOMContentLoaded', function(e) {
	/*
	* Unfullscreen click in fullscreen mode
	*/
	var closeButton = document.querySelector('#fullscreen-button');
	closeButton.addEventListener('click', function(e) {
		document.body.webkitRequestFullScreen();
	});
	
	client = new HTTPClient("www.cnn.com", 80,
	function(){
		client.doGet("/index.html");
	},
	function(http_version, http_response_code, http_response_message, header_map, message_body){
		console.log(header_map, message_body);
	});
});

function ModeCtrl($scope) {
  $scope.mode = 'settings';
  $scope.isSettingsMode = function() {
	return $scope.mode=='settings';
  };
  $scope.isResultsMode = function() {
	return $scope.mode=='results';
  };
  $scope.isScheduleMode = function() {
	return $scope.mode=='schedule';
  };
  $scope.isStandingsMode = function() {
	return $scope.mode=='standings';
  };
  
  $scope.setSettingsMode = function() {
	$scope.mode='settings';
  };
  $scope.setResultsMode = function() {
	$scope.mode='results';
  };
  $scope.setScheduleMode = function() {
	$scope.mode='schedule';
  };
  $scope.setStandingsMode = function() {
	$scope.mode='standings';
  };
}