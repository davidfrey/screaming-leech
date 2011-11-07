/**
 * Screaming Leech
 * A javascript pattern to grant cross-domain iframes back door access to 
 * leech's internal methods.
 *
 * Author: David Frey <watchtower@facesofdave.com>
 * Created: November 5, 2011
 */

function ScreamingLeech() {

	this.createIframe = function() {
		body = document.getElementsByTagName("body")[0];

		id = leech_helper.getParam('id');
		resize = leech_helper.getParam('resize');
		scroll = leech_helper.getParam('scroll');
		
		// Pass the iframe ID
		querystring = '?id=' + id;

		// Pass the height of the iframe
		if (resize != '') {
			querystring = querystring + '&resize=' + page_height;
		}

		// Pass a scroll-to-top command to host page on iframe load
		if (scroll != '') {
			querystring = querystring + '&scroll=top';
		}

		iframe = document.createElement('iframe');
		iframe.src = leech_helper.removeQuerystring() + querystring;
		iframe.height = "1";
		iframe.width = "1";
		iframe.frameBorder = "0";

		body.appendChild(iframe);
	}
	
    this.resizeFrame = function(id, height) {
    	iframe = window.parent.parent.document.getElementById(id);

    	if (iframe != null) {
    		iframe.height = parseInt(height)+60;
    	}
    	else {
    		this.notify(' unable to locate iframe for resize.')
    	}
        // this.notify("attempt to resize frame [" + id + "] to " + height +"px.");
    }

	this.scrollToTop = function() {
		window.parent.parent.scrollTo(0,0);
		// this.notify("attempt to scroll to top of page.");
	}

	this.pageHeight = function() {
		return document.documentElement.scrollHeight;	
	}
	
	this.notify = function(message) {
		console.log("Screaming Leech Says: " + message);
	}
}

// Extract the hostname of url
// 
// http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
String.prototype.getHostname = function() {
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	return this.match(re)[1].toString();
}

// Remove the querystring from a URL
String.prototype.removeQuerystring = function() {
	return this.split("?")[0];
}

// Get the value of a querystring parameter by name
String.prototype.getParam = function(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(this);

	if(results == null) {
		return "";
	}
	else {
		return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}


// Dynamically create an iframe when the leech parameter is present
// in the query string.

var leech_helper = window.location.href.getParam('leech');

if (leech_helper != '') {
	var page_height = document.documentElement.scrollHeight;

	screaming_leach = new ScreamingLeech();
	screaming_leach.createIframe();
}