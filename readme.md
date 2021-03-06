	 _______                                      __                    _____                       __    
	|     __|.----..----..-----..---.-..--------.|__|.-----..-----.    |     |_.-----..-----..----.|  |--.
	|__     ||  __||   _||  -__||  _  ||        ||  ||     ||  _  |    |       |  -__||  -__||  __||     |
	|_______||____||__|  |_____||___._||__|__|__||__||__|__||___  |    |_______|_____||_____||____||__|__|
	                                                        |_____|                                       

SCREAMING LEECH
===============

If you regularly use iframes to load content from another site with the 
intention that the content looks like its part of your site, you've probably 
run into XSS (cross-site scripting) security measures when attempting to resize
a frame relative to its content. There are lots of work arounds, but nothing 
I've seen that doesn't require a bit of tearing your hair out.

Enter the screaming leech.
--------------------------

Screaming Leech aims to provide a simple drop-in javascript library to make it
easy to manage iframe height and scroll position when loading remote pages via
an iframe. Screaming Leech works by dynamically creating a nested iframe inside
the remote page to permit access to host page javascript. 

NOTE: This solution requires that you have the ability to alter the HTML of the 
remote page.

How it works:
-------------

When you have access to both the host page and the iframed page on another
domain, screaming leech will dynamically create a nested iframe loading a helper
file on the host domain with querystring parameters containing instructions for
resize and scroll events.

	*---------------------------------------------------------*
	| HOST PAGE  mydomain.com                                 |
	| <script src="mydomain.com/screaming-leech.js">          |
	|                                                         |
	| Page content, when an iframe is created, a querystring  |
	| is appended to pass instructions to the remote page.    |
	| *-----------------------------------------------------* |
	| | REMOTE PAGE  otherdomain.com/page.html?query        | |
	| |                                                     | |
	| | Page content of unknown length.                     | |
	| | <script src="mydomain.com/screaming-leech.js">      | |
	| |                                                     | |
	| | Screaming Leech parses the querystring for          | |
	| | instructions and dynamically creates a nested       | |
	| | iframe to a helper page hosted on mydomain.com.     | |
	| | The dynamic iframe contains querystring             | |
	| | instructions interpreting the height of the content | |
	| | and any passthrough instructions like scroll.       | |
	| | *-------------------------------------------------* | |
	| | | DYNAMIC IFRAME mydomain.com/leechhelper?query   | | |
	| | | <script src="mydomain.com/screaming-leech.js">  | | |
	| | |                                                 | | |
	| | | Since the helper page and the host page are on  | | |
	| | | the same domain, the helper can make javascript | | |
	| | | calls to the host page without triggering       | | |
	| | | browser XSS security measures.                  | | |
	| | |                                                 | | |
	| | | window.parent.parent.resize();                  | | |
	| | | window.parent.parent.scrollTo();                | | |
	| | |                                                 | | |
	| | | window = dynamic iframe                         | | |
	| | | window.parent = remote page iframe              | | |
	| | | window.parent.parent = host page                | | |
	| | *-------------------------------------------------* | |
	| *-----------------------------------------------------* |
	|                                                         |
	| Additional host page content can follow the remote      |
	| iframe without any additional scrollbars.               |
	*---------------------------------------------------------*
  
The dynamically created iframe requires a path to the leech helper along with 
querystring instructions url encoded into the source of the iframe. So for 
example if you wanted to resize your iframe dynamically and the path to your 
local install of leech is:

http://mydomain.com/screaming-leech/leech.html

Then the url required to resize an iframe with the id 'testleech' would look like:

http://mydomain.com/screaming-leech/leech.html?id=testleech&resize=true

Since this url needs to be passed as a querystring parameter in your iframe src,
the full src url should look something like this:

http://example.com/framedpage.html?leech=http%3A%2F%2Fmydomain.com%2Fscreaming-leech%2Fleech.html%3Fid%3Dtestleech%26resize%3Dtrue

Known Issues
------------

* Iframed page reloads do not retain querystring instructions.

TODOs
-----

* Simplify integration by dynamically generating remote page iframe from hyperlink
* Enable local cookies to preserve instructions through a simulated session.