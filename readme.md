	 _______                                      __                    _____                       __    
	|     __|.----..----..-----..---.-..--------.|__|.-----..-----.    |     |_.-----..-----..----.|  |--.
	|__     ||  __||   _||  -__||  _  ||        ||  ||     ||  _  |    |       |  -__||  -__||  __||     |
	|_______||____||__|  |_____||___._||__|__|__||__||__|__||___  |    |_______|_____||_____||____||__|__|
	                                                        |_____|                                       

SCREAMING LEECH
===============

If you regularly use iframes to load content from another site such as a web 
forms, you've probably run into XSS (cross-site security) issues when trying
to maintain the iframe height relative to the content. There are lots of
work arounds, but nothing terribly easy.

Enter the screaming leech.
--------------------------

Screaming Leech aims to provide a simple drop-in javascript library to make it
easy to manage iframe height and scroll position when loading web forms via
an iframe. Screaming Leech works by dynamically creating an iframe inside the
iframed page that loads javascript local to the host page. Since browsers allow
host pages to communicate with iframed pages we can circumvente XSS blocking.

NOTE: This requires that you have the ability to add a `<script>` tag to the
the bottom of your framed page.

How it works:
-------------

When you have access to both the host page and the iframed page on another
domain, screaming leech will dynamically create a nested iframe loading a helper
file on the host domain with querystring parameters containing instructions for
resize and scroll events.

	My Page
	 + Iframed Page
	 + + Dynamically created iframe to leech helper on the same domain as My Page.
  
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

