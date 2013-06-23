function ScheduleCtrl($scope) {
	$scope.fields = [
		{ label: 'Time', id: 'time'},
		{ label: 'Match', id: 'match'}
	];
	
	$scope.matches = [
		{time: '9:10',
		match: '1'
		},
		{time: '9:20',
		match: '2'
		},
		{time: '9:30',
		match: '3'
		}
	];
}