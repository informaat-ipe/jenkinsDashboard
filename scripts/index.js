(function ($) {
	$.pluck = function(arr, key) { 
	    return $.map(arr, function(e) { return e[key]; }) 
	}

	// configuration
	var basePath = 'http://hudson.local:8080';
	var viewName = 'IPE Story Jobs';
	var apiJobListPath = basePath + '/view/' + encodeURIComponent(viewName) + '/api/json';
	var clientCoveragePath = "ws/coverage-reports/client-coverage.json";

	var koData = [];

	var getClientCoverage = function getClientCoverage(jobPath) {
		return $.ajax(jobPath + clientCoveragePath, {
			dataType: "json"
		});
	};

	var getServerCoverage = function getServerCoverage(jobPath, callback) {
		return callback(null, null);
	};

	var processJob = function processJob (idx, jobData) {
		// retrieve job information (name, status, path)
		var koJob = {
			name: jobData.name,
			buildSuccess: jobData.color === "blue",
			coverages: {
				client: "",
				server: ""
			}
		};

		// add job and coverage information to KO data source
		koData.push(koJob);
	};

	window.handleJenkinsCallback = function handleJenkinsCallback (data) {
		// for each job
		var jobs = $(data.jobs);

		jobs.each(processJob)
		$.when($.pluck(jobs, 'url').map(getClientCoverage)).done(function (results) {
			console.log(results);
		});

		// display KO template
	};

	// get a list of current jobs
	$.ajax(apiJobListPath, {
		dataType: "json",
		success: handleJenkinsCallback
	});
})(window.jQuery);