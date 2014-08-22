/*!
 *	Modernizr.prefixed() like Javascript DOM prefixer
 * @author @dalisoft, (https://github.com/dalisoft)
 * @license MIT-License, (http://bit.ly/mit-license)
 * @copyright (c) 2014, @dalisoft. All right reserved
 */

function pre(s) {
	var r,
	p = navigator.userAgent.match(/WebKit|Firefox|Opera|M(S|s)/g).toString().toLowerCase();
	r = p == 'firefox' ? 'Moz' : p == 'opera' ? 'O' : p;
	if (s)
		r = p + (s.charAt(0).toUpperCase() + s.substr(1));
	return r;
}
