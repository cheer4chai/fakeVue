const ARRAY = 0;
const OBJECT = 1;

import arrayAugmentations from '../observer/array-augmentations';
import objectAugmentations from '../observer/object-augmentations';

let uid = 0;

function Observer(value, type) {
    this.value = value;
    this.id = uid++;
    if(type === ARRAY) {
        value.__proto__ = arrayAugmentations;
        this.link(value);
    }else if(type === OBJECT) {
        value.__proto__ = objectAugmentations;
        this.walk(value);
    }
}

Observer.prototype = {
    constructor: Observer,
    walk: function (obj) {
        let val;
        for (let key in obj) {
            if(!obj.hasOwnProperty(key)) return;
            val = obj[key];
            this.observe(key, val);
            this.convert(key, val);
        }
    },
    link: function (items) {
        items.forEach((value, index) => {
            this.observe(index, value);
        })
    },
    convert: function (key, val) {
        let _this = this;
        Object.defineProperty(this.value, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                return val
            },
            set: function (newVal) {
                if(newVal === val) return;
                val = newVal;
                _this.notify('set', key, newVal);
            }
        })
    },
    observe: function (key, val) {
        let ob = Observer.create(val);
        if (!ob) return;
        ob.parent = {
            key,
            ob: this
        };
    },
    on: function (event, fn) {
        this._cbs = this._cbs || {};
        if(!this._cbs[event]) {
            this._cbs[event] = [];
        }
        this._cbs[event].push(fn);
    },
    off: function (event, fn) {
        this._cbs = this._cbs || {};
        //取消所有订阅时间
        if(!arguments.length) {
            this._cbs = {};
            return this;
        }
        //取消特定事件
        let callbacks = this._cbs[event];
        if (!callbacks) return this;

        // 取消特定事件
        if (arguments.length === 1) {
            delete this._cbs[event];
            return this;
        }
        // 取消特定事件的特定回调函数
        for (let i = 0, cb; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        return this;
    },
    notify: function (event, path, val) {
        this.emit(event, path, val);
        let parent = this.parent;
        if (!parent) return;
        let ob = parent.ob;
        ob.notify(event, path, val);
    },
    emit: function (event, path, val) {
        this._cbs = this._cbs || {};
        let callbacks = this._cbs[event];
        if (!callbacks) return;
        callbacks = callbacks.slice(0);
        callbacks.forEach((cb, i) => {
            callbacks[i].apply(this, arguments);
        })
    }
};
Observer.create = function (value) {
    if (Array.isArray(value)) {
        return new Observer(value, ARRAY);
    } else if (typeof value === 'object') {
        return new Observer(value, OBJECT);
    }
};
module.exports = Observer;
