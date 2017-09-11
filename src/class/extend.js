'use strict';

// inspired by leaflet v0.7.7   http://leafletjs.com


L.extend = function(dest) { // (Object[, Object, ...])
    var source = Array.prototype.slice.call(arguments, 1),
        i, item, src;

    for (i = source.length - 1; i >= 0; i--) {
        src = source[i] || {};
        for (item in src) {
            if (src.hasOwnProperty(item)) {
                dest[item] = src[item];
            }
        }
    }
    return dest;
}