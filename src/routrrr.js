'use strict';

/**
 * Routrrr class
 */
export default class Routrrr {

  /**
   * Routrrr constructor
   * @param  {Boolean} useHash    - whether to use hash urls
   * @param  {String}  hashPrefix - prefix for hash urls
   * @return {Object}             - a Routrrr instance
   */
  constructor(useHash = false, hashPrefix = '#!') {

    this.support = history && history.pushState;
    this.routes = [];
    this.mw = [];
    this.currentPath = '';
    this.currentHash = '';
    this.useHash = useHash;
    this.hashPrefix = hashPrefix;

    ['popstate', 'pushstate', 'replacestate'].forEach(event => {
      window.addEventListener(event, (e) => {
        if (!this.useHash && this.currentPath === e.target.location.pathname && this.currentPath !== e.target.location.hash && e.target.location.hash) {
          e.preventDefault();
          return false;
        }
        this.load();
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
  get(path, mw, fn) {

    const data = {
      path: path,
      mw: fn ? mw : null,
      fn: fn || mw,
      keys: [],
      params: {},
    };
    data.regex = pathToRegex(data.path, data.keys, false, false);
    this.routes.push(data);

    return this;

  }

  /**
   * add middleware to the Routrrr instance
   * @param  {Function} fn - the middleware function
   * @return {Object}      - the Routrrr instance
   */
  use(fn) {

    (/^f/.test(typeof fn) && this.mw.indexOf(fn) < 0) && this.mw.push(fn);

    return this;

  }

  /**
   * redirect to another path
   * @param  {String}  path      - the path as a string
   * @param  {Boolean} [replace] - whether to replaceState instead of pushState
   * @return {Object}            - the Routrrr instance
   */
  redirect(path, replace) {

    this.useHash ?
      window.location.hash = this.hashPrefix + path :
      this.support ?
        (replace ? history.replaceState : history.pushState)({url: path, date: new Date()}, null, path) :
        window.location.href = path;

    return this;

  }

  /**
   * load the appropriate route
   * @param  {Object} [state] - history state object
   * @return {Object}         - the Routrrr instance
   */
  load(state) {

    const pathname = this.useHash ? location.hash.replace(hashPrefix, '') : (state && state.url ? state.url : window.location.pathname).split('?')[0];
    const params = {};
    let req = Object.assign({}, location, {params: params, pathname: pathname, query: getQueryParams()});
    let pass = true;
    let route;
    let matches;

    this.routes.forEach(r => {
      if (!route) {
        if (matches = pathname.match(r.regex)) {
          route = r;
        }
      }
    });

    if (route) {
      matches && matches.shift();

      matches.forEach((match, i) => {
        params[route.keys[i].name] = match;
      });

      Object.assign(req, {route: route.path, params: params});
      this::callMiddleware(req)
        .then(() => {
          if (route.mw) {
            route.mw.apply(this, [req]).then(() => {
              route.fn.apply(this, [req]);
            }).catch(e => {});
          }
          else {
            route.fn.apply(this, [req]);
          }
        })
        .catch(e => {});
    }
    else {
      this::callMiddleware(req)
        .then(() => {
          Object.assign(req, {route: null});
          this.default && this.default.apply(this, [req]);
        })
        .catch(e => {});
    }
    this.currentPath = pathname;
    this.currentHash = location.hash;

    return this;

  }

  /**
   * initialize Routrrr
   * @return {Object} - the Routrrr instance
   */
  init() {

    return this.load();

  }

  /**
   * set the default route callback
   * @param  {Function} fn - the callback function
   * @return {Object}     - the Routrrr instance
   */
  setDefault(fn) {

    /^f/.test(typeof fn) && (this.default = fn);

    return this;

  }

}

/**
 * call all the middleware functions, combine the returned promises
 * @param  {Object} req - the current request object
 * @return {Promise}    - a promise
 */
function callMiddleware(req) {

  return new Promise((resolve, reject) => {

    const promises = [];

    this.mw.forEach(fn => {
      promises.push(fn.apply(this, [req]));
    });

    Promise.all(promises)
      .then(resolve)
      .catch(reject);

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

  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/\+/g, '__plus__')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/__plus__/g, '(.+)')
    .replace(/\*/g, '(.*)');

  return new RegExp('^' + path + '$', sensitive ? '' : 'i');

}

/**
 * get query paramaters from the current search string
 * @param  {String} [queryString] - placeholder for the query string
 * @return {Object}               - object containing the parameters
 */
function getQueryParams(queryString) {

  if (!(queryString = location.search.replace('?',''))) {
    return;
  }

  const queryParams = queryString.split('&');
  const params = {};
  const regex = /\[\]$/;

  for (let param of queryParams) {
    let [name, value] = decodeURIComponent(param).split('=');
    value = value ? value.split('+').join(' ') : '';
    if (regex.test(name)) {
      name = name.replace(regex, '');
      if (!Array.isArray(params[name])) {
        params[name] = [];
      }
      params[name] = [...params[name], value];
    }
    else {
      params[name] = value;
    }
  }

  return params;

}
