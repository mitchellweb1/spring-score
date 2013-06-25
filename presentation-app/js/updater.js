function UpdateService($rootScope) {
	var o = this;
	o.client = new HTTPClient();
	
	this._updateSchedule = function(){
		o.client.doGet("www2.usfirst.org", 80, "/2013comp/events/MAWO/ScheduleQual.html", function(http_version, http_response_code, http_response_message, header_map, message_body){
			var dataTable = $(message_body).find('table:eq(2) tbody');
			var matches = new Array();
			dataTable.find('tr:gt(1)').each(function(){
				var match = new Object();
				match.time = $('td:eq(0)', this).text();
				match.match = $('td:eq(1)', this).text();
				
				match.r1 = $('td:eq(2)', this).text();
				match.r2 = $('td:eq(3)', this).text();
				match.r3 = $('td:eq(4)', this).text();
				
				match.b1 = $('td:eq(5)', this).text();
				match.b2 = $('td:eq(6)', this).text();
				match.b3 = $('td:eq(7)', this).text();
				matches.push(match);
			});
			
			var fields = [
				{ label: 'Time', id: 'time'},
				{ label: 'Match', id: 'match'},
				
				{ label: 'Red 1', id: 'r1'},
				{ label: 'Red 2', id: 'r2'},
				{ label: 'Red 3', id: 'r3'},
				
				{ label: 'Blue 1', id: 'b1'},
				{ label: 'Blue 2', id: 'b2'},
				{ label: 'Blue 3', id: 'b3'}
			];
			o.scheduleData = {matches: matches, fields: fields};
			$rootScope.$broadcast('scheduleUpdated', o.scheduleData);
		});
	}
	
	this._updateResults = function(){
		o.client.doGet("www2.usfirst.org", 80, "/2013comp/events/MAWO/matchresults.html", function(http_version, http_response_code, http_response_message, header_map, message_body){
			var dataTable = $(message_body).find('table:eq(2) tbody');
			var results = new Array();
			dataTable.find('tr:gt(1)').each(function(){
				var result = new Object();
				result.time = $('td:eq(0)', this).text();
				result.match = $('td:eq(1)', this).text();
				if(isNaN(result.match))
					return;//continue
				
				result.r1 = $('td:eq(2)', this).text();
				result.r2 = $('td:eq(3)', this).text();
				result.r3 = $('td:eq(4)', this).text();
				
				result.b1 = $('td:eq(5)', this).text();
				result.b2 = $('td:eq(6)', this).text();
				result.b3 = $('td:eq(7)', this).text();
				
				result.rScore = parseInt($('td:eq(8)', this).text());
				result.bScore = parseInt($('td:eq(9)', this).text());
				
				
				
				result.style = result.rScore<result.bScore?"info":"error";
				
				results.push(result);
			});
			
			var fields = [
				{ label: 'Time', id: 'time'},
				{ label: 'Match', id: 'match'},
				
				{ label: 'Red 1', id: 'r1'},
				{ label: 'Red 2', id: 'r2'},
				{ label: 'Red 3', id: 'r3'},
				
				{ label: 'Blue 1', id: 'b1'},
				{ label: 'Blue 2', id: 'b2'},
				{ label: 'Blue 3', id: 'b3'},
				
				{ label: 'Red Score', id: 'rScore'},
				{ label: 'Blue Score', id: 'bScore'}
			];
			o.resultsData = {results: results, fields: fields};
			$rootScope.$broadcast('resultsUpdated', o.resultsData);
		});
	}
	
	
	this._updateRankings = function(){
		o.client.doGet("www2.usfirst.org", 80, "/2013comp/events/MAWO/rankings.html", function(http_version, http_response_code, http_response_message, header_map, message_body){
			var dataTable = $(message_body).find('table:eq(2) tbody');
			var teams = new Array();
			dataTable.find('tr:gt(1)').each(function(){
				var team = new Object();
				team.rank = $('td:eq(0)', this).text();
				team.name = $('td:eq(1)', this).text();
				
				team.qs = $('td:eq(2)', this).text();
				team.ap = $('td:eq(3)', this).text();
				team.cp = $('td:eq(4)', this).text();
				team.tp = $('td:eq(5)', this).text();
				
				team.record = $('td:eq(6)', this).text();
				team.dq = $('td:eq(7)', this).text();
				team.played = $('td:eq(8)', this).text();
				
				teams.push(team);
			});
			
			var fields = [
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
			o.rankingsData = {teams: teams, fields: fields};
			$rootScope.$broadcast('rankingsUpdated', o.rankingsData);
		});
	}
	
	this._update = function(){
		this._updateSchedule();
		this._updateResults();
		this._updateRankings();
	}
	
	
	this._update();
	o.timer = setInterval(function(){
		o._update();
	}, 10000);
}