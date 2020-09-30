/*!
 * routrrr - version 0.3.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
!function(t){if(!t&&!t.pushState)return!1;const e=t.pushState,s=t.replaceState;function a(t,e){const s=document.createEvent("CustomEvent");s.initCustomEvent(t+"state",!0,!0,e),window.dispatchEvent(s)}t.pushState=function(s,r){let n=e.apply(t,arguments);return r&&(document.title=r),a("push",s),n},t.replaceState=function(e,r){let n=s.apply(t,arguments);return r&&(document.title=r),a("replace",e),n}}(window.history);function t(t){return new Promise(((e,s)=>{const a=[];this.mw.forEach((e=>{a.push(e.apply(this,[t]))})),Promise.all(a).then(e).catch(s)}))}function e(t){if(!(t=location.search.replace("?","")))return;const e=t.split("&"),s={},a=/\[\]$/;for(let t of e){let[e,r]=decodeURIComponent(t).split("=");r=r?r.split("+").join(" "):"",a.test(e)?(e=e.replace(a,""),Array.isArray(s[e])||(s[e]=[]),s[e]=[...s[e],r]):s[e]=r}return s}export default class{constructor(t=!1,e="#!"){this.support=history&&history.pushState,this.routes=[],this.mw=[],this.currentPath="",this.currentHash="",this.useHash=t,this.hashPrefix=e,["popstate","pushstate","replacestate"].forEach((t=>{window.addEventListener(t,(t=>{if(!this.useHash&&this.currentPath===t.target.location.pathname&&this.currentPath!==t.target.location.hash&&t.target.location.hash)return t.preventDefault(),!1;this.load()}))}))}get(t,e,s){const a={path:t,mw:s?e:null,fn:s||e,keys:[],params:{}};return a.regex=function(t,e,s,a){if(t instanceof RegExp)return t;t instanceof Array&&(t="("+t.join("|")+")");return t=t.concat(a?"":"/?").replace(/\/\(/g,"(?:/").replace(/\+/g,"__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,(function(t,s,a,r,n,h){return e.push({name:r,optional:!!h}),s=s||"",(h?"":s)+"(?:"+(h?s:"")+(a||"")+(n||a&&"([^/.]+?)"||"([^/]+?)")+")"+(h||"")})).replace(/([\/.])/g,"\\$1").replace(/__plus__/g,"(.+)").replace(/\*/g,"(.*)"),new RegExp("^"+t+"$",s?"":"i")}(a.path,a.keys,!1,!1),this.routes.push(a),this}use(t){return/^f/.test(typeof t)&&this.mw.indexOf(t)<0&&this.mw.push(t),this}redirect(t,e){return this.useHash?window.location.hash=this.hashPrefix+t:this.support?(e?history.replaceState:history.pushState)({url:t,date:new Date},null,t):window.location.href=t,this}load(s){const a=this.useHash?location.hash.replace(hashPrefix,""):(s&&s.url?s.url:window.location.pathname).split("?")[0],r={};let n,h,i=Object.assign({},location,{params:r,pathname:a,query:e()});return this.routes.forEach((t=>{n||(h=a.match(t.regex))&&(n=t)})),n?(h&&h.shift(),h.forEach(((t,e)=>{r[n.keys[e].name]=t})),Object.assign(i,{route:n.path,params:r}),t.call(this,i).then((()=>{n.mw?n.mw.apply(this,[i]).then((()=>{n.fn.apply(this,[i])})).catch((t=>{})):n.fn.apply(this,[i])})).catch((t=>{}))):t.call(this,i).then((()=>{Object.assign(i,{route:null}),this.default&&this.default.apply(this,[i])})).catch((t=>{})),this.currentPath=a,this.currentHash=location.hash,this}init(){return this.load()}setDefault(t){return/^f/.test(typeof t)&&(this.default=t),this}}
