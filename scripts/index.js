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
	var refresh = 60;
	var lowCoveragePercentage = 70;

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
		if (jobData.color === "disabled") {
			return;
		}
		
		var koJob = {
			name: ko.observable(jobData.name),
			buildSuccess: ko.computed(function () { return jobData.color === "blue" }),
			buildFailed: ko.computed(function () { return jobData.color === "red" }),
			buildPending: ko.computed(function () { return jobData.color === "blue_anime"}),
			coverages: {
				_client: ko.observable(0),
				_server: ko.observable(0),
				client: null,
				server: null
			},
			buildStatus: {
				person: ko.observable(),
				status: ko.observable(),
				message: ko.observable(),
				time: ko.observable()
			}
		};

		koJob.coverages.client = ko.computed(function () {
			return parseFloat(koJob.coverages._client()).toFixed(2) + "%";
		});

		koJob.coverages.server = ko.computed(function () {
			return parseFloat(koJob.coverages._server()).toFixed(2) + "%";
		});

		koJob.coverages.clientLow = ko.computed(function () {
			return koJob.coverages._client() < lowCoveragePercentage;
		});

		koJob.coverages.serverLow = ko.computed(function () {
			return koJob.coverages._server() < lowCoveragePercentage;
		});

		getClientCoverage(jobData.url, function (err, results) {
			if (!err) {
				koJob.coverages._client(results.coverage);
			}
		});

		getServerCoverage(jobData.url, function (err, results) {
			if (!err) {
				koJob.coverages._server(results.coverage);
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
		koData([]);

		jobs.each(processJob);

		// display KO template
	};

	var init = function init () {
		$.ajax(apiJobListPath, {
			dataType: "json",
			success: handleJenkinsCallback
		});
	}
	// get a list of current jobs
	setInterval(init, refresh * 1000);

	ko.applyBindings(koData);


	init();
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