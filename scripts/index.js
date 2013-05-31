(function ($) {
	$.pluck = function(arr, key) { 
	    return $.map(arr, function(e) { return e[key]; }) 
	}

	// configuration
	var basePath = 'http://hudson.local:8080';
	var viewName = 'IPE Story Jobs';
	var apiJobListPath = basePath + '/view/' + encodeURIComponent(viewName) + '/api/json';
	var clientCoveragePath = "ws/coverage-report/client-coverage.json";
	var serverCoveragePath = "ws/coverage-report/coverage.json";
	var buildStatusPath = "/lastBuild/api/json";

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
		return $.ajax(jobPath + serverCoveragePath, {
			dataType: "json",
			success: function (data) {
				callback(null, data);
			},
			error: function () {
				callback("failed")
			}
		});
	};

	var getLastBuildStatus = function getLastBuildStatus(jobPath, callback) {
		return $.ajax(jobPath + buildStatusPath, {
			dataType: "json",
			success: function (data) {
				callback(null, data);
			},
			error: function () {
				callback("failed");
			}
		});
	}

	var processJob = function processJob (idx, jobData) {
		// retrieve job information (name, status, path)
		var koJob = {
			name: ko.observable(jobData.name),
			buildSuccess: ko.computed(function () { return jobData.color === "blue" }),
			buildFailed: ko.computed(function () { return jobData.color === "red" }),
			buildPending: ko.computed(function () { return jobData.color === "blue_anime"}),
			coverages: {
				client: ko.observable(0),
				server: ko.observable(0)

			},
			buildStatus: {
				person: ko.observable(),
				status: ko.observable(),
				message: ko.observable(),
				time: ko.observable()
			}
		};

		getClientCoverage(jobData.url, function (err, results) {
			if (!err) {
				koJob.coverages.client(parseFloat(results.coverage).toFixed(2)+"%");
			}
		});

		getServerCoverage(jobData.url, function (err, results) {
			if (!err) {
				koJob.coverages.server(parseFloat(results.coverage, 2).toFixed(2)+"%");
			}
		});

		getLastBuildStatus(jobData.url, function (err, build) {
			koJob.buildStatus.person(build.culprits.length >= 1 ? build.culprits[0].fullName.split(' ')[0] : 'Anonymous');
			koJob.buildStatus.status(build.result || 'No status message');
			koJob.buildStatus.message((build.changeSet.items.length) ? build.changeSet.items[0].msg : 'No message');
			koJob.buildStatus.time(new Date( build.timestamp ).toLocaleString());
		});

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