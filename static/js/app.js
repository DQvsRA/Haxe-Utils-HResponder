// Generated by Haxe 3.4.7
(function () { "use strict";
var HxOverrides = function() { };
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
var example_Main = function() { };
example_Main.main = function() {
	var action1 = "ACTION";
	hresponder_HResponder.add(action1,function(answer) {
		console.log("> Action 1 -> Hello: " + answer);
	});
	hresponder_HResponder.dispatch(action1,"World");
	hresponder_HResponder.dispatch(action1,"Massive");
	hresponder_HResponder.dispatch(action1,"Vladimir");
	hresponder_HResponder.remove(action1);
	hresponder_HResponder.add(action1,function(answer1) {
		console.log("> Action 1 (limit 1) -> Goodbye: " + answer1);
	},1);
	hresponder_HResponder.dispatch(action1,"World");
	hresponder_HResponder.dispatch(action1,"Massive");
	hresponder_HResponder.dispatch(action1,"Vladimir");
	var action2 = "ACTION";
	hresponder_HResponder.add(action2,function(answer2) {
		console.log("> Action 2 -> I do: " + answer2);
	});
	hresponder_HResponder.dispatch(action2,"Code");
	hresponder_HResponder.dispatch(action2,"Gym");
	hresponder_HResponder.dispatch(action2,"Eat");
	hresponder_HResponder.dispatch(action2,"Sleep (sometimes)");
};
var haxe_IMap = function() { };
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	setReserved: function(key,value) {
		if(this.rh == null) {
			this.rh = { };
		}
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) {
			return null;
		} else {
			return this.rh["$" + key];
		}
	}
	,existsReserved: function(key) {
		if(this.rh == null) {
			return false;
		}
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) {
				return false;
			}
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) {
				return false;
			}
			delete(this.h[key]);
			return true;
		}
	}
};
var hresponder_HResponderCore = function() {
	this._hashsByAction = new haxe_ds_StringMap();
	this._responderByHash = new haxe_ds_IntMap();
};
hresponder_HResponderCore.prototype = {
	register: function(responder) {
		var hash = responder.get_hash();
		var action = responder.get_action();
		this._responderByHash.h[hash] = responder;
		var _this = this._hashsByAction;
		if(__map_reserved[action] != null ? _this.existsReserved(action) : _this.h.hasOwnProperty(action)) {
			var _this1 = this._hashsByAction;
			(__map_reserved[action] != null ? _this1.getReserved(action) : _this1.h[action]).push(hash);
		} else {
			var _this2 = this._hashsByAction;
			var value = [hash];
			if(__map_reserved[action] != null) {
				_this2.setReserved(action,value);
			} else {
				_this2.h[action] = value;
			}
		}
	}
	,dispatch: function(action,args) {
		var result = true;
		var _this = this._hashsByAction;
		if(__map_reserved[action] != null ? _this.existsReserved(action) : _this.h.hasOwnProperty(action)) {
			var responder;
			var replies;
			var _this1 = this._hashsByAction;
			var hashes = __map_reserved[action] != null ? _this1.getReserved(action) : _this1.h[action];
			var _g = 0;
			while(_g < hashes.length) {
				var hash = hashes[_g];
				++_g;
				responder = this._responderByHash.h[hash];
				replies = responder.replies;
				if(replies > 0) {
					if(--replies == 0 && this.RemoveResponder(responder)) {
						result = false;
					}
					responder.replies = replies;
				}
				responder.perform(args);
			}
		}
		return result;
	}
	,remove: function(action) {
		var _this = this._hashsByAction;
		if(__map_reserved[action] != null ? _this.existsReserved(action) : _this.h.hasOwnProperty(action)) {
			var _this1 = this._hashsByAction;
			var hashes = __map_reserved[action] != null ? _this1.getReserved(action) : _this1.h[action];
			var _g = 0;
			while(_g < hashes.length) {
				var hash = hashes[_g];
				++_g;
				this.RemoveResponder(this._responderByHash.h[hash]);
			}
			return true;
		} else {
			return false;
		}
	}
	,RemoveResponder: function(responder) {
		var hash = responder.get_hash();
		var action = responder.get_action();
		var noMoreActions = false;
		this._responderByHash.remove(hash);
		var _this = this._hashsByAction;
		var hashesForAction = __map_reserved[action] != null ? _this.getReserved(action) : _this.h[action];
		HxOverrides.remove(hashesForAction,hash);
		if(hashesForAction.length == 0) {
			this._hashsByAction.remove(action);
			noMoreActions = true;
		}
		return noMoreActions;
	}
};
var hresponder_HResponder = function(action,listener,replies) {
	this._action = action;
	this._listener = listener;
	this.replies = replies;
	this._hash = ++hresponder_HResponder.INDEX << 8;
	hresponder_HResponder.CORE.register(this);
};
hresponder_HResponder.add = function(action,listener,replies) {
	if(replies == null) {
		replies = 0;
	}
	return new hresponder_HResponder(action,listener,replies);
};
hresponder_HResponder.dispatch = function(action,args) {
	return hresponder_HResponder.CORE.dispatch(action,args);
};
hresponder_HResponder.remove = function(action) {
	return hresponder_HResponder.CORE.remove(action);
};
hresponder_HResponder.prototype = {
	perform: function(params) {
		if(params != null) {
			this._listener(params);
		} else {
			this._listener(null);
		}
	}
	,get_action: function() {
		return this._action;
	}
	,get_listener: function() {
		return this._listener;
	}
	,get_hash: function() {
		return this._hash;
	}
};
var __map_reserved = {};
hresponder_HResponder.INDEX = 0;
hresponder_HResponder.CORE = new hresponder_HResponderCore();
example_Main.main();
})();

//# sourceMappingURL=app.js.map