/*!
 * History API fix
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2025 Steve Ottoz
 */
!function(t){if(!t&&!t.pushState)return!1;var e=t.pushState,n=t.replaceState;function a(t,e){var n=new CustomEvent(t+"state",{detail:e});window.dispatchEvent(n)}t.pushState=function(n,r){var u=e.apply(t,arguments);return r&&(document.title=r),a("push",n),u},t.replaceState=function(e,r){var u=n.apply(t,arguments);return r&&(document.title=r),a("replace",e),u}}(window.history);
