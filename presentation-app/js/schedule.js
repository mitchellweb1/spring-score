function ScheduleCtrl($scope, UpdateService, ScrollService) {
	var setData = function(data){
        $scope.matches = data.matches;
        $scope.fields = data.fields;
	}
	
	$scope.$on('scheduleUpdated', function(event, data) {
		setData(data);
		$scope.$apply();
    });
	
	if(UpdateService.scheduleData){
		setData(UpdateService.scheduleData);
	}
	
	$scope.sortFunction = function(item) {
		if(isNaN(item.match))
			return item.match;
		return parseInt(item.match);
	}
	
	ScrollService.tryScrolling();
}