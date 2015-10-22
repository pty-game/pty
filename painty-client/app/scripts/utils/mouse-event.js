var dispatchEvent, e, evt, mouseEvent, prop;
mouseEvent = function(event) {
  var evt;
  return evt = void 0;
};
e = {
  bubbles: true,
  cancelable: event.type !== 'mousemove',
  view: window,
  detail: 0,
  screenX: event.screenX,
  screenY: event.screenY,
  clientX: event.clientX,
  clientY: event.clientY,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  button: 0,
  relatedTarget: void 0
};
if (typeof document.createEvent === 'function') {
  evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(event.type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
} else if (document.createEventObject) {
  evt = document.createEventObject();
  for (prop in e) {
    prop = prop;
    evt[prop] = e[prop];
  }
  evt.button = {
      0: 1,
      1: 4,
      2: 2
    }[evt.button] || evt.button;
}
evt;
dispatchEvent = function(el, evt) {
  if (el.dispatchEvent) {
    el.dispatchEvent(evt);
  } else if (el.fireEvent) {
    el.fireEvent('on' + type, evt);
  }
  return evt;
};
module.exports = function(elem, event) {
  return dispatchEvent(elem, mouseEvent(event));
};