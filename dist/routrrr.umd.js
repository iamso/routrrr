/*!
 * routrrr - version 0.3.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Routrrr=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=t[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(t){o=!0,a=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return n}(t,e)||a(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t){return function(t){if(Array.isArray(t))return i(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||a(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){if(t){if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(t,e):void 0}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function u(t){var e=this;return new Promise((function(n,r){var o=[];e.mw.forEach((function(n){o.push(n.apply(e,[t]))})),Promise.all(o).then(n).catch(r)}))}function c(t){if(t=location.search.replace("?","")){var e,n={},i=/\[\]$/,u=function(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=a(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,c=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){c=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(c)throw i}}}}(t.split("&"));try{for(u.s();!(e=u.n()).done;){var c=e.value,s=r(decodeURIComponent(c).split("="),2),l=s[0],f=s[1];f=f?f.split("+").join(" "):"",i.test(l)?(l=l.replace(i,""),Array.isArray(n[l])||(n[l]=[]),n[l]=[].concat(o(n[l]),[f])):n[l]=f}}catch(t){u.e(t)}finally{u.f()}return n}}return function(t){if(!t&&!t.pushState)return!1;var e=t.pushState,n=t.replaceState;function r(t,e){var n=document.createEvent("CustomEvent");n.initCustomEvent(t+"state",!0,!0,e),window.dispatchEvent(n)}t.pushState=function(n,o){var a=e.apply(t,arguments);return o&&(document.title=o),r("push",n),a},t.replaceState=function(e,o){var a=n.apply(t,arguments);return o&&(document.title=o),r("replace",e),a}}(window.history),function(){function r(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"#!";e(this,r),this.support=history&&history.pushState,this.routes=[],this.mw=[],this.currentPath="",this.currentHash="",this.useHash=n,this.hashPrefix=o,["popstate","pushstate","replacestate"].forEach((function(e){window.addEventListener(e,(function(e){if(!t.useHash&&t.currentPath===e.target.location.pathname&&t.currentPath!==e.target.location.hash&&e.target.location.hash)return e.preventDefault(),!1;t.load()}))}))}var o,a,i;return o=r,(a=[{key:"get",value:function(t,e,n){var r={path:t,mw:n?e:null,fn:n||e,keys:[],params:{}};return r.regex=function(t,e,n,r){return t instanceof RegExp?t:(t instanceof Array&&(t="("+t.join("|")+")"),t=t.concat(r?"":"/?").replace(/\/\(/g,"(?:/").replace(/\+/g,"__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,(function(t,n,r,o,a,i){return e.push({name:o,optional:!!i}),n=n||"",(i?"":n)+"(?:"+(i?n:"")+(r||"")+(a||r&&"([^/.]+?)"||"([^/]+?)")+")"+(i||"")})).replace(/([\/.])/g,"\\$1").replace(/__plus__/g,"(.+)").replace(/\*/g,"(.*)"),new RegExp("^"+t+"$",n?"":"i"))}(r.path,r.keys,!1,!1),this.routes.push(r),this}},{key:"use",value:function(e){return/^f/.test(t(e))&&this.mw.indexOf(e)<0&&this.mw.push(e),this}},{key:"redirect",value:function(t,e){return this.useHash?window.location.hash=this.hashPrefix+t:this.support?(e?history.replaceState:history.pushState)({url:t,date:new Date},null,t):window.location.href=t,this}},{key:"load",value:function(t){var e,n,r=this,o=this.useHash?location.hash.replace(hashPrefix,""):(t&&t.url?t.url:window.location.pathname).split("?")[0],a={},i=Object.assign({},location,{params:a,pathname:o,query:c()});return this.routes.forEach((function(t){e||(n=o.match(t.regex))&&(e=t)})),e?(n&&n.shift(),n.forEach((function(t,n){a[e.keys[n].name]=t})),Object.assign(i,{route:e.path,params:a}),u.call(this,i).then((function(){e.mw?e.mw.apply(r,[i]).then((function(){e.fn.apply(r,[i])})).catch((function(t){})):e.fn.apply(r,[i])})).catch((function(t){}))):u.call(this,i).then((function(){Object.assign(i,{route:null}),r.default&&r.default.apply(r,[i])})).catch((function(t){})),this.currentPath=o,this.currentHash=location.hash,this}},{key:"init",value:function(){return this.load()}},{key:"setDefault",value:function(e){return/^f/.test(t(e))&&(this.default=e),this}}])&&n(o.prototype,a),i&&n(o,i),r}()}));
