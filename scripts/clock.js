function Clock(id, o) {
	var offset = o || 0;
	var clock  = document.querySelector(id);

	function t(offset) {
		var d = new Date();
		d.setHours(d.getHours() + offset);
		return d;
	}

	function rotate(el, deg) {
		return el.setAttribute("transform", "rotate("+deg+" 100 100)");
	}

	var h = {
		hour: function(time) {
			return ( time.getHours() * 30 + (time.getMinutes() * 0.5) );
		},
		min: function(time) { return time.getMinutes() * 6; },
		sec: function(time) { return time.getSeconds() * 6; }
	};

	// TODO: decide if this is an object or a function
	return function Clock() {
		var time   = t(offset);

		function set(clock, time) {
			rotate( clock.querySelector('.hourhand'),   h.hour(time) );
			rotate( clock.querySelector('.minutehand'), h.min(time) );
			rotate( clock.querySelector('.secondhand'), h.sec(time) );
		}

		function dim(clock, time) {
			var h = time.getHours();
			return (h <= 7 || h >= 20) ? clock.classList.add('night') : clock.classList.remove('night');
		}

		function render() {
			set(clock, time);
			dim(clock, time);
		}

		var api = {
			render: render,
			time: time
		};

		return api;
	};
}

function Template(location, offset) {
	// Loads the inner HTML of the template, replaces some placeholders.
	// Currently grabs <script id="clock-template">

	var t = document.getElementById('clock-template').innerHTML;

	function calcOffset(offset) {
		return (offset <0) ? offset *-1 + ' uur eerder' : offset + ' uur later';
	}

	var r = t
		.replace('{{id}}', location)
		.replace('{{location}}', location)
		.replace('{{offset}}', calcOffset(offset))
	;

	return r;
}


// Use the Clock:
var clocks = [
	Clock('#Baarn',    0),
	Clock('#Markham', -6),
	Clock('#Seoul',    7),
	Clock('#Beijing',  6)
];

function setClocks() {
	clocks.forEach(function(clock) {
		clock().render();
	});
}

setClocks();
setInterval(setClocks, 1000);