(function() {
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
}())


// inspired by leaflet v0.7.7 http://leafletjs.com
(function() {
    'use strict';

    L.Class = function() {};

    L.Class.extend = function(props) {

        var NewClass = function() {

            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }

            if (this._initHooks) {
                this.callInitHooks();
            }
        };

        //寄生组合式继承
        var F = function() {};
        F.prototype = this.prototype;

        var proto = new F();
        //显式指定构造函数
        proto.constructor = NewClass;

        NewClass.prototype = proto;
        //复制L.Class基类方法复制至NewClass
        for (var item in this) {
            if (this.hasOwnProperty(item)) {
                NewClass[i] = this[i];
            }
        }
        //新增静态属性
        if (props.statics) {
            L.extend(NewClass, props.statics);
            delete props.statics;
        }

        if (props.includes) {
            L.Util.extend.apply(null, [proto].concat(props.includes)); //need to be tested;
            delete props.includes;
        }
        //扩充options
        if (props.options && proto.options) {
            props.options = L.extend({}, proto.options, props.options);
        }

        //扩充子类静态属性
        L.extend(proto, props);

        proto._initHooks = [];

        var parent = this;
        NewClass.__super__ = parent.prototype;
        
        proto.callInitHooks = function() {

            if (this._initHooksCalled) {return};

            if (parent.prototype.callInitHooks) {
                parent.prototype.callInitHooks.call(this);
            }

            this._initHooksCalled = true;

            for (var i = proto.length - 1; i >= 0; i--) {
                proto._initHooks[i].call(this);
            }
        };

        return NewClass;
    };
    
}())