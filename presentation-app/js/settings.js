function SettingsCtrl($scope, SettingsService) {
	$scope.scrollingEnabled = SettingsService.scrollingEnabled;
	$scope.setScrollingEnabled = function(val){
		SettingsService.scrollingEnabled = val;
	}
}

function SettingsService($rootScope) {
	this.scrollingEnabled = true;
}