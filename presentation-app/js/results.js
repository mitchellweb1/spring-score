function ResultsCtrl($scope, UpdateService, ScrollService) {
	var setData = function(data){
        $scope.results = data.results;
        $scope.fields = data.fields;
	}
	
	$scope.$on('resultsUpdated', function(event, data) {
		setData(data);
		$scope.$apply();
    });
	
	if(UpdateService.resultsData){
		setData(UpdateService.resultsData);
	}
	
	$scope.sortFunction = function(item) {
		if(isNaN(item.match))
			return item.match;
		return parseInt(item.match);
	}
	
	ScrollService.tryScrolling();
}