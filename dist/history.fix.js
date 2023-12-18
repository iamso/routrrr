/*!
 * History API fix
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2023 Steve Ottoz
 */
!function(t){if(!t&&!t.pushState)return!1;var e=t.pushState,n=t.replaceState;function a(t,e){var n=document.createEvent("CustomEvent");n.initCustomEvent(t+"state",!0,!0,e),window.dispatchEvent(n)}t.pushState=function(n,u){var r=e.apply(t,arguments);return u&&(document.title=u),a("push",n),r},t.replaceState=function(e,u){var r=n.apply(t,arguments);return u&&(document.title=u),a("replace",e),r}}(window.history);
