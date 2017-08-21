/*!
 * History API fix
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
 */
'use strict';

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