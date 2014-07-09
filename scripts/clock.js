var view = {
	rotate: function(el, deg) {
		el.setAttribute("transform", "rotate("+deg+" 100 100)");
	},

	// TODO: Make this a factory where `offset` is already set
	// TOOD: This procedure has two functionalities: rotating hands and setting day/night. Split it.
	animate: function(id, date, offset) {
		var o = offset || 0;
		var t = date.getHours() + o;

		view.rotate( document.querySelector(id + ' .hourhand'),   t * 30 );
		view.rotate( document.querySelector(id + ' .minutehand'), date.getMinutes() * 6 );
		view.rotate( document.querySelector(id + ' .secondhand'), date.getSeconds() * 6 );

		function night() {
			document.querySelector(id).classList.add('night');
		}

		function day() {
			document.querySelector(id).classList.remove('night');
		}

		return (t <= 7 || t >= 20) ? night() : day();
	}
};

// Time to Degrees:
var ttd = {
	s: function(d) { return d.getSeconds() * 6; },
	m: function(d) { return d.getMinutes() * 6; },
	h: function(d) { return d.getHours()   * 30; }
};


function draw() {
	var d = new Date();
	
	view.animate('#Baarn', d);
	view.animate('#Markham', d, -6);
	view.animate('#Seoul', d, 7);
	view.animate('#Beijing', d, 6);
}

draw();
setInterval(draw, 1000);

(typeof module !== 'undefined') && (module.exports = time);