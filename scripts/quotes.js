// http://proverbs-app.antjan.us/random

function reqListener() {
	var q = document.querySelector('#quote');
	q.textContent=this.responseText;
}

function getQuote() {
	var req = new XMLHttpRequest();
	req.onload = reqListener;
	req.open('get', "http://proverbs-app.antjan.us/random", true);
	req.send();
}

getQuote();
setInterval(getQuote, 60 * 1000);