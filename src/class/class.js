'use strict';

var Class = function(methods) {
	var ret = function() {
		//继承父类时返回父类对象
		if (ret.$prototyping) 
			return this;
		//实例初始化
		if (typeof this.initialize == 'function') 
			return this.initialize.apply(this, arguments);
	};
	if (methods.Extends) {
		ret.parent = methods.Extends;
		methods.Extends.$prototyping = true;
		ret.prototype = new methods.Extends;
		methods.Extends.$prototyping = false;
	}
	for (var key in methods) {
		if (methods.hasOwnProperty(key)) {
			ret.prototyping[key] = methods[key];
		}
	}
	return ret;
}