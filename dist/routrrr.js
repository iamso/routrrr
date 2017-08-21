/*!
 * routrrr - version 0.2.1
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Routrrr = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  /**
   * Routrrr class
   */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Routrrr = function () {

    /**
     * Routrrr constructor
     * @param  {Boolean} useHash    - whether to use hash urls
     * @param  {String}  hashPrefix - prefix for hash urls
     * @return {Object}             - a Routrrr instance
     */
    function Routrrr() {
      var _this = this;

      var useHash = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var hashPrefix = arguments.length <= 1 || arguments[1] === undefined ? '#!' : arguments[1];

      _classCallCheck(this, Routrrr);

      this.support = history && history.pushState;
      this.routes = [];
      this.mw = [];
      this.currentPath = '';
      this.currentHash = '';
      this.useHash = useHash;
      this.hashPrefix = hashPrefix;

      ['popstate', 'pushstate', 'replacestate'].forEach(function (event) {
        window.addEventListener(event, function (e) {
          if (!_this.useHash && _this.currentPath === e.target.location.pathname && _this.currentPath !== e.target.location.hash && e.target.location.hash) {
            e.preventDefault();
            return false;
          }
          _this.load();
        });
      });
    }

    /**
     * add route definition to the Routrrr instance
     * @param  {String}   path - the path as a string
     * @param  {Function} [mw] - middleware function
     * @param  {Function} fn   - callback function
     * @return {Object}        - the Routrrr instance
     */


    _createClass(Routrrr, [{
      key: 'get',
      value: function get(path, mw, fn) {

        var data = {
          path: path,
          mw: fn ? mw : null,
          fn: fn || mw,
          keys: [],
          params: {}
        };
        data.regex = pathToRegex(data.path, data.keys, false, false);
        this.routes.push(data);

        return this;
      }
    }, {
      key: 'use',
      value: function use(fn) {

        /^f/.test(typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) && this.mw.indexOf(fn) < 0 && this.mw.push(fn);

        return this;
      }
    }, {
      key: 'redirect',
      value: function redirect(path, replace) {

        this.useHash ? window.location.hash = this.hashPrefix + path : this.support ? (replace ? history.replaceState : history.pushState)({ url: path, date: new Date() }, null, path) : window.location.href = path;

        return this;
      }
    }, {
      key: 'load',
      value: function load(state) {
        var _this2 = this;

        var pathname = this.useHash ? location.hash.replace(hashPrefix, '') : (state && state.url ? state.url : window.location.pathname).split('?')[0];
        var params = {};
        var req = Object.assign({}, location, { params: params, pathname: pathname, query: getQueryParams() });
        var pass = true;
        var route = void 0;
        var matches = void 0;

        this.routes.forEach(function (r) {
          if (!route) {
            if (matches = pathname.match(r.regex)) {
              route = r;
            }
          }
        });

        if (route) {
          matches && matches.shift();

          matches.forEach(function (match, i) {
            params[route.keys[i].name] = match;
          });

          Object.assign(req, { route: route.path, params: params });
          callMiddleware.call(this, req).then(function () {
            if (route.mw) {
              route.mw.apply(_this2, [req]).then(function () {
                route.fn.apply(_this2, [req]);
              }).catch(function (e) {});
            } else {
              route.fn.apply(_this2, [req]);
            }
          }).catch(function (e) {});
        } else {
          callMiddleware.call(this, req).then(function () {
            Object.assign(req, { route: null });
            _this2.default && _this2.default.apply(_this2, [req]);
          }).catch(function (e) {});
        }
        this.currentPath = pathname;
        this.currentHash = location.hash;

        return this;
      }
    }, {
      key: 'init',
      value: function init() {

        return this.load();
      }
    }, {
      key: 'setDefault',
      value: function setDefault(fn) {

        /^f/.test(typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) && (this.default = fn);

        return this;
      }
    }]);

    return Routrrr;
  }();

  exports.default = Routrrr;


  /**
   * call all the middleware functions, combine the returned promises
   * @param  {Object} req - the current request object
   * @return {Promise}    - a promise
   */
  function callMiddleware(req) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {

      var promises = [];

      _this3.mw.forEach(function (fn) {
        promises.push(fn.apply(_this3, [req]));
      });

      Promise.all(promises).then(resolve).catch(reject);
    });
  }

  /**
   * convert a path string into a regex
   * @param  {String}  path        - path to convert
   * @param  {Object}  keys        - the keys array object for parameters
   * @param  {Boolean} [sensitive] - whether or not regex should be case sensitive
   * @param  {Boolean} [strict]    - whether or not the slash at the end is mandatory
   * @return {RegExp}              - the path as a regex
   */
  function pathToRegex(path, keys, sensitive, strict) {

    if (path instanceof RegExp) {
      return path;
    }
    if (path instanceof Array) {
      path = '(' + path.join('|') + ')';
    }

    path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/\+/g, '__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
      keys.push({ name: key, optional: !!optional });
      slash = slash || '';
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || format && '([^/.]+?)' || '([^/]+?)') + ')' + (optional || '');
    }).replace(/([\/.])/g, '\\$1').replace(/__plus__/g, '(.+)').replace(/\*/g, '(.*)');

    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

  /**
   * get query paramaters from the current search string
   * @param  {String} [queryString] - placeholder for the query string
   * @return {Object}               - object containing the parameters
   */
  function getQueryParams(queryString) {

    if (!(queryString = location.search.replace('?', ''))) {
      return;
    }

    var queryParams = queryString.split('&');
    var params = {};
    var regex = /\[\]$/;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = queryParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var param = _step.value;

        var _decodeURIComponent$s = decodeURIComponent(param).split('=');

        var _decodeURIComponent$s2 = _slicedToArray(_decodeURIComponent$s, 2);

        var name = _decodeURIComponent$s2[0];
        var value = _decodeURIComponent$s2[1];

        value = value ? value.split('+').join(' ') : '';
        if (regex.test(name)) {
          name = name.replace(regex, '');
          if (!Array.isArray(params[name])) {
            params[name] = [];
          }
          params[name] = [].concat(_toConsumableArray(params[name]), [value]);
        } else {
          params[name] = value;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return params;
  }

  /**
   * History API fix
   */
  ;(function (history) {
    'use strict';

    if (!history && !history.pushState) {
      return false;
    }
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function (state, title) {
      var returnValue = pushState.apply(history, arguments);
      title && (document.title = title);
      triggerEvent('push', state);
      return returnValue;
    };
    history.replaceState = function (state, title) {
      var returnValue = replaceState.apply(history, arguments);
      title && (document.title = title);
      triggerEvent('replace', state);
      return returnValue;
    };

    function triggerEvent(type, state) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(type + 'state', true, true, state);
      window.dispatchEvent(event);
    }
  })(window.history);
  module.exports = exports['default'];
});