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

        //用于返回的新的继承函数
        var NewClass = function() {

            //调用子类初始化构造方法
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
            //钩子函数---调用父类及其父类的构造方法 
            if (this._initHooks) {
                this.callInitHooks();
            }
        };

        //寄生组合式继承-创建无构造函数体的类
        var F = function() {};
        //引用父类的原型 --- 此时只是引用关系，如果改变F的prototype亦会修改父类的prototype
        F.prototype = this.prototype;
        //实例化F类
        var proto = new F();
        //显式指定构造函数,防止instanceof运算符被破坏
        proto.constructor = NewClass;
        //将原型赋值给NewClass,
        NewClass.prototype = proto;
        //复制L.Class基类方法复制至NewClass, 如L.Class.include、L.Class.mergeOptions等
        for (var item in this) {
            if (this.hasOwnProperty(item)) {
                NewClass[i] = this[i];
            }
        }
        //新增静态属性
        if (props.statics) {
            L.extend(NewClass, props.statics);
            //删除props.statics属性,防止后面L.extend(proto, props)重复新增
            delete props.statics;
        }

        if (props.includes) {
            //扩充子类的方法，在这里主要是为子类新增Events方法
            L.Util.extend.apply(null, [proto].concat(props.includes)); 
            //删除props.statics属性,防止后面L.extend(proto, props)重复新增
            delete props.includes;
        }
        //扩充options
        if (props.options && proto.options) {
            props.options = L.extend({}, proto.options, props.options);
        }

        //扩充子类静态属性
        L.extend(proto, props);
        //子类初始构造钩子函数数组，用于存放L.Class.addInitHook增加的初始化绑定事件钩子函数
        proto._initHooks = [];

        var parent = this;

        NewClass.__super__ = parent.prototype;
        //调用父类及其父类等的初始化绑定事件钩子函数
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