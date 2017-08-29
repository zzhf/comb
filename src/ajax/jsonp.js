'use strict';

//easily jsonp Function  inspired by https://kickassapp.com/
var JSONP = (function() {
	var 
		head,
		query,
		key,
		counter,
		window;
		
	counter = 0;
	window = this; //ensure it's a global window variable --- window/global(node)

	function load(url) {
		var 
			script,
			done;

		script = document.createElement('script');
		done = false;

		script.src = url;
		script.async = true;

		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
				done = true;
				if (script && script.parentNode) {
					script.parentNode.removeChild(script);
					script.onload = script.onreadystatechange = null;
				}
			}
		};
		if (!head) {
			head = document.getElementsByTagName('head')[0];
			if (!head) {
				head = document.body;
			}
		}
		head.appendChild(script);
	}

	function jsonp(url, params, callback) {
		var 
			jsonp;

		query = '?';
		params = params || {};
		for(key in params) {
			if (params.hasOwnProperty(key)) {
				query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
			}
		}
		jsonp = '__jsonp' + (++counter);
		window[jsonp] = function(data) {
			callback(data);
			try {
				delete window[jsonp];
			} catch (e) {}
			window[jsonp] = null;  //TODO it's looks weird, refactor!!!
			load(url + query + 'callback=' + jsonp);
			return jsonp;
		}
	}

	return {
		get: jsonp
	}
}())