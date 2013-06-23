function RankingsCtrl($scope) {
	$scope.fields = [
		{ label: 'Name', id: 'name'},
		{ label: 'Rank', id: 'rank'},
		
		{ label: 'QS', id: 'qs'},
		{ label: 'AP', id: 'ap'},
		{ label: 'CP', id: 'cp'},
		{ label: 'TP', id: 'tp'},
		
		{ label: 'Record (W-L-T)', id: 'record'},
		{ label: 'DQ', id: 'dq'},
		{ label: 'Played', id: 'played'}
	];
	
	$scope.teams = [
		{name: 'Team 1',
		rank: 10,
		qs: 1,
		ap: 2,
		cp: 3,
		tp: 4,
		record: '0 - 0 - 0',
		dq: 0,
		played: 0
		},
		{name: 'Team 2',
		rank: 20,
		qs: 7,
		ap: 8,
		cp: 12,
		tp: 5,
		record: '0 - 0 - 0',
		dq: 0,
		played: 0
		},
		{name: 'Team 3',
		rank: 1,
		qs: 6,
		ap: 5,
		cp: 4,
		tp: 3,
		record: '0 - 0 - 0',
		dq: 0,
		played: 0
		}
	];
}