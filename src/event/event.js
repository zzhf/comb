var Events = {
	on: function(types, fn, context) {
		if (typeof types === 'object') {
			for (var item in types) {
				this._on(type, types[type], fn);
			}
		} else {
			types = Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++ ) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	off: function(types, fn, context) {
		if (!types) {

			delete this._events;

		} else if (typeof types === 'object') {

			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}

		}

		return this;
	},

	_on: function (type, fn, context) {
		var i,
			len,
			typeListeners,
			newListener;

		this._events = this._events || {};

		typeListeners = this._events[type];

		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			context = undefined;  //TODO cannot understand the use of this code;
		}

		newListener = {
			fn: fn,
			ctx: context
		};

		//防止重复注册事件
		for (i = 0, len = typeListeners.length; i < len; i++) {
			if (typeListeners[i].fn === fn && typeListeners[i].context === context) {
				return;
			}
		}

		typeListeners.push(newListener);
	},

	_off: function (type, fn, context) {
		var i, 
			l,
			len,
			listeners;

		listeners = this._events[type];

		if (!this._events || !listeners) {
			return;
		}

		if (!fn) {

			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = Util.falseFn;
			}

			delete this._events[type];
			return;
		}

		if (context == this) {
			context = undefined;
		}

		for (i = 0, len = listeners.length; i < len; i++) {
			l = listeners[i];
			if (l.ctx !== context) {
				continue;
			}
			if (l.fn === fn) {

				l.fn = Util.falseFn;

				if (this._firingCount) {
					this._events[type] = listeners = listeners.slice();
				}

				listeners.splice(i, 1);

				return;
			}
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listeners(type, propagate)) {
			return this;
		}

		var event = Util.extend({}, data, {type: type, target: this});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = ++this._firingCount || 1;

				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) {
			return true;
		}

		if (propagate) {
			for ( var item in this._eventParents) {
				if (this._eventParents[item].listens(type, propagate)) {
					return true;
				}
			}
		}

		return false;
	}
}