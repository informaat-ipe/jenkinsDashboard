(function ($) {
	$.pluck = function(arr, key) { 
	    return $.map(arr, function(e) { return e[key]; }) 
	}

	// configuration
	var basePath = 'http://hudson.local:8080';
	var viewName = 'IPE Story Jobs';
	var apiJobListPath = basePath + '/view/' + encodeURIComponent(viewName) + '/api/json';
	var clientCoveragePath = "ws/coverage-report/client-coverage.json";

	var koData = ko.observableArray([]);

	var getClientCoverage = function getClientCoverage(jobPath, callback) {
		return $.ajax(jobPath + clientCoveragePath, {
			dataType: "json",
			success: function (data) {
				callback(null, data);
			},
			error: function () {
				callback("failed")
			}
		});
	};

	var getServerCoverage = function getServerCoverage(jobPath, callback) {
		return callback(null, null);
	};

	var processJob = function processJob (idx, jobData) {
		// retrieve job information (name, status, path)
		var koJob = {
			name: ko.observable(jobData.name),
			buildSuccess: ko.computed(function () { return jobData.color === "blue"}),
			coverages: {
				client: ko.observable(""),
				server: ko.observable("")
			}
		};

		// add job and coverage information to KO data source
		koData.push(koJob);
	};

	handleJenkinsCallback = function handleJenkinsCallback (data) {
		// for each job
		var jobs = $(data.jobs);

		jobs.each(processJob);

		// display KO template
	};

	// get a list of current jobs
	$.ajax(apiJobListPath, {
		dataType: "json",
		success: handleJenkinsCallback
	});

	ko.applyBindings(koData);

	/*
		// When a job resolves, notify all
		// When all resolves, do the render callback

		// Create an array of promises for all jobs
		var allPromise = Q.all([
			processJob()
		]);

		// In each job, do two calls -- server and client
		var jobPromise = Q.all([
			getClient(),
			getServer()
		]);

		

	*/
})(window.jQuery);