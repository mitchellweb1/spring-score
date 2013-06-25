function RankingsCtrl($scope, UpdateService, ScrollService) {
	var setData = function(data){
        $scope.teams = data.teams;
        $scope.fields = data.fields;
	}
	
	$scope.$on('rankingsUpdated', function(event, data) {
		setData(data);
		$scope.$apply();
    });
	
	if(UpdateService.rankingsData){
		setData(UpdateService.rankingsData);
	}
	
	$scope.sortFunction = function(item) {
		if(isNaN(item.rank))
			return item.rank;
		return parseInt(item.rank);
	}
	
	ScrollService.tryScrolling();
}