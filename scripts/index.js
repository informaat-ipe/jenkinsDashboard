(function ($) {
	// configuration
	var basePath = 'http://hudson.local:8080';
	var viewName = 'IPE Story Jobs';
	var apiJobListPath = basePath + '/view/' + encodeURIComponent(viewName) + '/api/json';
	var clientCoveragePath = "ws/client/client.json";

	var koData = [];

	var getClientCoverage = function getClientCoverage(jobPath, callback) {
		$.ajax(jobPath + clientCoveragePath, {
			dataType: "json",
			success: function (data) {
				console.log(arguments);
				return callback(null, data);
			},
			error: function () {
				console.log("ERROR");
				return callback(new Error("client coverage not found: " + jobPath));
			}
		});
	};

	var getServerCoverage = function getServerCoverage(jobPath, callback) {
		return callback(null, null);
	};

	var processJob = function processJob (idx, jobData) {
		var koJob = {
			name: jobData.name,
			buildSuccess: jobData.color === "blue",
			coverages: {
				client: "",
				server: ""
			}
		};

		getClientCoverage(jobData.url, function (err, data) {
			if (err) {
				return console.log(err);
			}
			koJob.coverages.client = data.coverage;
		});

		// getServerCoverage(jobData.url, function (err, data) {
		// 	if (err) {
		// 		return console.log(err);
		// 	}
		// 	koJob.coverages.server = data.coverage;
		// });

		koData.push(koJob);
	};

	window.handleJenkinsCallback = function handleJenkinsCallback (data) {
		$(data.jobs).each(processJob);
	};

	// get a list of current jobs
	$.ajax(apiJobListPath, {
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "handleJenkinsCallback"
	});
	// for each job

		// retrieve job information (name, status, path)

		// get coverage information for client

		// get coverage information for server

		// add job and coverage information to KO data source

	// display KO template
})(window.jQuery);