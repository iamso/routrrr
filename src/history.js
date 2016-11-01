
/**
 * History API fix
 */
;(function(history){
  'use strict';
  if (!history && !history.pushState) {
    return false;
  }
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function(state, title) {
    let returnValue = pushState.apply(history, arguments);
    title && (document.title = title);
    triggerEvent('push', state);
    return returnValue;
  };
  history.replaceState = function(state, title) {
    let returnValue = replaceState.apply(history, arguments);
    title && (document.title = title);
    triggerEvent('replace', state);
    return returnValue;
  };

  function triggerEvent(type, state) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(type + 'state', true, true, state);
    window.dispatchEvent(event);
  }
})(window.history);
