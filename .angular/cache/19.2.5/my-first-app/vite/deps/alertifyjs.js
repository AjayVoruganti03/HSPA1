import {
  __commonJS
} from "./chunk-3OV72XIM.js";

// node_modules/alertifyjs/build/alertify.js
var require_alertify = __commonJS({
  "node_modules/alertifyjs/build/alertify.js"(exports, module) {
    (function(window2) {
      "use strict";
      var NOT_DISABLED_NOT_RESET = ":not(:disabled):not(.ajs-reset)";
      var keys = {
        ENTER: 13,
        ESC: 27,
        F1: 112,
        F12: 123,
        LEFT: 37,
        RIGHT: 39,
        TAB: 9
      };
      var defaults = {
        autoReset: true,
        basic: false,
        closable: true,
        closableByDimmer: true,
        invokeOnCloseOff: false,
        frameless: false,
        defaultFocusOff: false,
        maintainFocus: true,
        //global default not per instance, applies to all dialogs
        maximizable: true,
        modal: true,
        movable: true,
        moveBounded: false,
        overflow: true,
        padding: true,
        pinnable: true,
        pinned: true,
        preventBodyShift: false,
        //global default not per instance, applies to all dialogs
        resizable: true,
        startMaximized: false,
        transition: "pulse",
        transitionOff: false,
        tabbable: ["button", "[href]", "input", "select", "textarea", '[tabindex]:not([tabindex^="-"])' + NOT_DISABLED_NOT_RESET].join(NOT_DISABLED_NOT_RESET + ","),
        //global
        notifier: {
          delay: 5,
          position: "bottom-right",
          closeButton: false,
          classes: {
            base: "alertify-notifier",
            prefix: "ajs-",
            message: "ajs-message",
            top: "ajs-top",
            right: "ajs-right",
            bottom: "ajs-bottom",
            left: "ajs-left",
            center: "ajs-center",
            visible: "ajs-visible",
            hidden: "ajs-hidden",
            close: "ajs-close"
          }
        },
        glossary: {
          title: "AlertifyJS",
          ok: "OK",
          cancel: "Cancel",
          acccpt: "Accept",
          deny: "Deny",
          confirm: "Confirm",
          decline: "Decline",
          close: "Close",
          maximize: "Maximize",
          restore: "Restore"
        },
        theme: {
          input: "ajs-input",
          ok: "ajs-ok",
          cancel: "ajs-cancel"
        },
        hooks: {
          preinit: function() {
          },
          postinit: function() {
          }
        }
      };
      var openDialogs = [];
      function addClass(element, classNames) {
        element.className += " " + classNames;
      }
      function removeClass(element, classNames) {
        var original = element.className.split(" ");
        var toBeRemoved = classNames.split(" ");
        for (var x = 0; x < toBeRemoved.length; x += 1) {
          var index = original.indexOf(toBeRemoved[x]);
          if (index > -1) {
            original.splice(index, 1);
          }
        }
        element.className = original.join(" ");
      }
      function isRightToLeft() {
        return window2.getComputedStyle(document.body).direction === "rtl";
      }
      function getScrollTop() {
        return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
      }
      function getScrollLeft() {
        return document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft;
      }
      function clearContents(element) {
        while (element.lastChild) {
          element.removeChild(element.lastChild);
        }
      }
      function isString(thing) {
        return Object.prototype.toString.call(thing) === "[object String]";
      }
      function copy(src) {
        if (null === src) {
          return src;
        }
        var cpy;
        if (Array.isArray(src)) {
          cpy = [];
          for (var x = 0; x < src.length; x += 1) {
            cpy.push(copy(src[x]));
          }
          return cpy;
        }
        if (src instanceof Date) {
          return new Date(src.getTime());
        }
        if (src instanceof RegExp) {
          cpy = new RegExp(src.source);
          cpy.global = src.global;
          cpy.ignoreCase = src.ignoreCase;
          cpy.multiline = src.multiline;
          cpy.lastIndex = src.lastIndex;
          return cpy;
        }
        if (typeof src === "object") {
          cpy = {};
          for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
              cpy[prop] = copy(src[prop]);
            }
          }
          return cpy;
        }
        return src;
      }
      function destruct(instance, initialize) {
        if (instance.elements) {
          var root = instance.elements.root;
          root.parentNode.removeChild(root);
          delete instance.elements;
          instance.settings = copy(instance.__settings);
          instance.__init = initialize;
          delete instance.__internal;
        }
      }
      var IsPassiveSupported = false;
      try {
        var options = Object.defineProperty({}, "passive", {
          get: function() {
            IsPassiveSupported = true;
          }
        });
        window2.addEventListener("test", options, options);
        window2.removeEventListener("test", options, options);
      } catch (e) {
      }
      var on = function(el, event, fn, useCapture, passive) {
        el.addEventListener(event, fn, IsPassiveSupported ? {
          capture: useCapture,
          passive
        } : useCapture === true);
      };
      var off = function(el, event, fn, useCapture, passive) {
        el.removeEventListener(event, fn, IsPassiveSupported ? {
          capture: useCapture,
          passive
        } : useCapture === true);
      };
      var transition = function() {
        var t, type;
        var supported = false;
        var transitions = {
          "animation": "animationend",
          "OAnimation": "oAnimationEnd oanimationend",
          "msAnimation": "MSAnimationEnd",
          "MozAnimation": "animationend",
          "WebkitAnimation": "webkitAnimationEnd"
        };
        for (t in transitions) {
          if (document.documentElement.style[t] !== void 0) {
            type = transitions[t];
            supported = true;
            break;
          }
        }
        return {
          type,
          supported
        };
      }();
      function delegate(context, method) {
        return function() {
          if (arguments.length > 0) {
            var args = [];
            for (var x = 0; x < arguments.length; x += 1) {
              args.push(arguments[x]);
            }
            args.push(context);
            return method.apply(context, args);
          }
          return method.apply(context, [null, context]);
        };
      }
      function createCloseEvent(index, button) {
        return {
          index,
          button,
          cancel: false
        };
      }
      function dispatchEvent(eventType, instance) {
        if (typeof instance.get(eventType) === "function") {
          return instance.get(eventType).call(instance);
        }
      }
      var dialog = function() {
        var usedKeys = [], reflow = null, tabindex = false, isSafari = window2.navigator.userAgent.indexOf("Safari") > -1 && window2.navigator.userAgent.indexOf("Chrome") < 0, templates = {
          dimmer: '<div class="ajs-dimmer"></div>',
          /*tab index required to fire click event before body focus*/
          modal: '<div class="ajs-modal" tabindex="0"></div>',
          dialog: '<div class="ajs-dialog" tabindex="0"></div>',
          reset: '<button class="ajs-reset"></button>',
          commands: '<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',
          header: '<div class="ajs-header"></div>',
          body: '<div class="ajs-body"></div>',
          content: '<div class="ajs-content"></div>',
          footer: '<div class="ajs-footer"></div>',
          buttons: {
            primary: '<div class="ajs-primary ajs-buttons"></div>',
            auxiliary: '<div class="ajs-auxiliary ajs-buttons"></div>'
          },
          button: '<button class="ajs-button"></button>',
          resizeHandle: '<div class="ajs-handle"></div>'
        }, classes = {
          animationIn: "ajs-in",
          animationOut: "ajs-out",
          base: "alertify",
          basic: "ajs-basic",
          capture: "ajs-capture",
          closable: "ajs-closable",
          fixed: "ajs-fixed",
          frameless: "ajs-frameless",
          hidden: "ajs-hidden",
          maximize: "ajs-maximize",
          maximized: "ajs-maximized",
          maximizable: "ajs-maximizable",
          modeless: "ajs-modeless",
          movable: "ajs-movable",
          noSelection: "ajs-no-selection",
          noOverflow: "ajs-no-overflow",
          noPadding: "ajs-no-padding",
          pin: "ajs-pin",
          pinnable: "ajs-pinnable",
          prefix: "ajs-",
          resizable: "ajs-resizable",
          restore: "ajs-restore",
          shake: "ajs-shake",
          unpinned: "ajs-unpinned",
          noTransition: "ajs-no-transition"
        };
        function initialize(instance) {
          if (!instance.__internal) {
            alertify.defaults.hooks.preinit(instance);
            delete instance.__init;
            if (!instance.__settings) {
              instance.__settings = copy(instance.settings);
            }
            var setup;
            if (typeof instance.setup === "function") {
              setup = instance.setup();
              setup.options = setup.options || {};
              setup.focus = setup.focus || {};
            } else {
              setup = {
                buttons: [],
                focus: {
                  element: null,
                  select: false
                },
                options: {}
              };
            }
            if (typeof instance.hooks !== "object") {
              instance.hooks = {};
            }
            var buttonsDefinition = [];
            if (Array.isArray(setup.buttons)) {
              for (var b = 0; b < setup.buttons.length; b += 1) {
                var ref = setup.buttons[b], cpy = {};
                for (var i in ref) {
                  if (ref.hasOwnProperty(i)) {
                    cpy[i] = ref[i];
                  }
                }
                buttonsDefinition.push(cpy);
              }
            }
            var internal = instance.__internal = {
              /**
               * Flag holding the open state of the dialog
               * 
               * @type {Boolean}
               */
              isOpen: false,
              /**
               * Active element is the element that will receive focus after
               * closing the dialog. It defaults as the body tag, but gets updated
               * to the last focused element before the dialog was opened.
               *
               * @type {Node}
               */
              activeElement: document.body,
              timerIn: void 0,
              timerOut: void 0,
              buttons: buttonsDefinition,
              focus: setup.focus,
              options: {
                title: void 0,
                modal: void 0,
                basic: void 0,
                frameless: void 0,
                defaultFocusOff: void 0,
                pinned: void 0,
                movable: void 0,
                moveBounded: void 0,
                resizable: void 0,
                autoReset: void 0,
                closable: void 0,
                closableByDimmer: void 0,
                invokeOnCloseOff: void 0,
                maximizable: void 0,
                startMaximized: void 0,
                pinnable: void 0,
                transition: void 0,
                transitionOff: void 0,
                padding: void 0,
                overflow: void 0,
                onshow: void 0,
                onclosing: void 0,
                onclose: void 0,
                onfocus: void 0,
                onmove: void 0,
                onmoved: void 0,
                onresize: void 0,
                onresized: void 0,
                onmaximize: void 0,
                onmaximized: void 0,
                onrestore: void 0,
                onrestored: void 0
              },
              resetHandler: void 0,
              beginMoveHandler: void 0,
              beginResizeHandler: void 0,
              bringToFrontHandler: void 0,
              modalClickHandler: void 0,
              buttonsClickHandler: void 0,
              commandsClickHandler: void 0,
              transitionInHandler: void 0,
              transitionOutHandler: void 0,
              destroy: void 0
            };
            var elements = {};
            elements.root = document.createElement("div");
            elements.root.style.display = "none";
            elements.root.className = classes.base + " " + classes.hidden + " ";
            elements.root.innerHTML = templates.dimmer + templates.modal;
            elements.dimmer = elements.root.firstChild;
            elements.modal = elements.root.lastChild;
            elements.modal.innerHTML = templates.dialog;
            elements.dialog = elements.modal.firstChild;
            elements.dialog.innerHTML = templates.reset + templates.commands + templates.header + templates.body + templates.footer + templates.resizeHandle + templates.reset;
            elements.reset = [];
            elements.reset.push(elements.dialog.firstChild);
            elements.reset.push(elements.dialog.lastChild);
            elements.commands = {};
            elements.commands.container = elements.reset[0].nextSibling;
            elements.commands.pin = elements.commands.container.firstChild;
            elements.commands.maximize = elements.commands.pin.nextSibling;
            elements.commands.close = elements.commands.maximize.nextSibling;
            elements.header = elements.commands.container.nextSibling;
            elements.body = elements.header.nextSibling;
            elements.body.innerHTML = templates.content;
            elements.content = elements.body.firstChild;
            elements.footer = elements.body.nextSibling;
            elements.footer.innerHTML = templates.buttons.auxiliary + templates.buttons.primary;
            elements.resizeHandle = elements.footer.nextSibling;
            elements.buttons = {};
            elements.buttons.auxiliary = elements.footer.firstChild;
            elements.buttons.primary = elements.buttons.auxiliary.nextSibling;
            elements.buttons.primary.innerHTML = templates.button;
            elements.buttonTemplate = elements.buttons.primary.firstChild;
            elements.buttons.primary.removeChild(elements.buttonTemplate);
            for (var x = 0; x < instance.__internal.buttons.length; x += 1) {
              var button = instance.__internal.buttons[x];
              if (usedKeys.indexOf(button.key) < 0) {
                usedKeys.push(button.key);
              }
              button.element = elements.buttonTemplate.cloneNode();
              button.element.innerHTML = button.text;
              if (typeof button.className === "string" && button.className !== "") {
                addClass(button.element, button.className);
              }
              for (var key in button.attrs) {
                if (key !== "className" && button.attrs.hasOwnProperty(key)) {
                  button.element.setAttribute(key, button.attrs[key]);
                }
              }
              if (button.scope === "auxiliary") {
                elements.buttons.auxiliary.appendChild(button.element);
              } else {
                elements.buttons.primary.appendChild(button.element);
              }
            }
            instance.elements = elements;
            internal.resetHandler = delegate(instance, onReset);
            internal.beginMoveHandler = delegate(instance, beginMove);
            internal.beginResizeHandler = delegate(instance, beginResize);
            internal.bringToFrontHandler = delegate(instance, bringToFront);
            internal.modalClickHandler = delegate(instance, modalClickHandler);
            internal.buttonsClickHandler = delegate(instance, buttonsClickHandler);
            internal.commandsClickHandler = delegate(instance, commandsClickHandler);
            internal.transitionInHandler = delegate(instance, handleTransitionInEvent);
            internal.transitionOutHandler = delegate(instance, handleTransitionOutEvent);
            for (var opKey in internal.options) {
              if (setup.options[opKey] !== void 0) {
                instance.set(opKey, setup.options[opKey]);
              } else if (alertify.defaults.hasOwnProperty(opKey)) {
                instance.set(opKey, alertify.defaults[opKey]);
              } else if (opKey === "title") {
                instance.set(opKey, alertify.defaults.glossary[opKey]);
              }
            }
            if (typeof instance.build === "function") {
              instance.build();
            }
            alertify.defaults.hooks.postinit(instance);
          }
          document.body.appendChild(instance.elements.root);
        }
        var scrollX, scrollY;
        function saveScrollPosition() {
          scrollX = getScrollLeft();
          scrollY = getScrollTop();
        }
        function restoreScrollPosition() {
          window2.scrollTo(scrollX, scrollY);
        }
        function ensureNoOverflow() {
          var requiresNoOverflow = 0;
          for (var x = 0; x < openDialogs.length; x += 1) {
            var instance = openDialogs[x];
            if (instance.isModal() || instance.isMaximized()) {
              requiresNoOverflow += 1;
            }
          }
          if (requiresNoOverflow === 0 && document.body.className.indexOf(classes.noOverflow) >= 0) {
            removeClass(document.body, classes.noOverflow);
            preventBodyShift(false);
          } else if (requiresNoOverflow > 0 && document.body.className.indexOf(classes.noOverflow) < 0) {
            preventBodyShift(true);
            addClass(document.body, classes.noOverflow);
          }
        }
        var top = "", topScroll = 0;
        function preventBodyShift(add) {
          if (alertify.defaults.preventBodyShift) {
            if (add && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
              topScroll = scrollY;
              top = window2.getComputedStyle(document.body).top;
              addClass(document.body, classes.fixed);
              document.body.style.top = -scrollY + "px";
            } else if (!add) {
              scrollY = topScroll;
              document.body.style.top = top;
              removeClass(document.body, classes.fixed);
              restoreScrollPosition();
            }
          }
        }
        function updateTransition(instance, value, oldValue) {
          if (isString(oldValue)) {
            removeClass(instance.elements.root, classes.prefix + oldValue);
          }
          addClass(instance.elements.root, classes.prefix + value);
          reflow = instance.elements.root.offsetWidth;
        }
        function updateTransitionOff(instance) {
          if (instance.get("transitionOff")) {
            addClass(instance.elements.root, classes.noTransition);
          } else {
            removeClass(instance.elements.root, classes.noTransition);
          }
        }
        function updateDisplayMode(instance) {
          if (instance.get("modal")) {
            removeClass(instance.elements.root, classes.modeless);
            if (instance.isOpen()) {
              unbindModelessEvents(instance);
              updateAbsPositionFix(instance);
              ensureNoOverflow();
            }
          } else {
            addClass(instance.elements.root, classes.modeless);
            if (instance.isOpen()) {
              bindModelessEvents(instance);
              updateAbsPositionFix(instance);
              ensureNoOverflow();
            }
          }
        }
        function updateBasicMode(instance) {
          if (instance.get("basic")) {
            addClass(instance.elements.root, classes.basic);
          } else {
            removeClass(instance.elements.root, classes.basic);
          }
        }
        function updateFramelessMode(instance) {
          if (instance.get("frameless")) {
            addClass(instance.elements.root, classes.frameless);
          } else {
            removeClass(instance.elements.root, classes.frameless);
          }
        }
        function bringToFront(event, instance) {
          var index = openDialogs.indexOf(instance);
          for (var x = index + 1; x < openDialogs.length; x += 1) {
            if (openDialogs[x].isModal()) {
              return;
            }
          }
          if (document.body.lastChild !== instance.elements.root) {
            document.body.appendChild(instance.elements.root);
            openDialogs.splice(openDialogs.indexOf(instance), 1);
            openDialogs.push(instance);
            setFocus(instance);
          }
          return false;
        }
        function optionUpdated(instance, option, oldValue, newValue) {
          switch (option) {
            case "title":
              instance.setHeader(newValue);
              break;
            case "modal":
              updateDisplayMode(instance);
              break;
            case "basic":
              updateBasicMode(instance);
              break;
            case "frameless":
              updateFramelessMode(instance);
              break;
            case "pinned":
              updatePinned(instance);
              break;
            case "closable":
              updateClosable(instance);
              break;
            case "maximizable":
              updateMaximizable(instance);
              break;
            case "pinnable":
              updatePinnable(instance);
              break;
            case "movable":
              updateMovable(instance);
              break;
            case "resizable":
              updateResizable(instance);
              break;
            case "padding":
              if (newValue) {
                removeClass(instance.elements.root, classes.noPadding);
              } else if (instance.elements.root.className.indexOf(classes.noPadding) < 0) {
                addClass(instance.elements.root, classes.noPadding);
              }
              break;
            case "overflow":
              if (newValue) {
                removeClass(instance.elements.root, classes.noOverflow);
              } else if (instance.elements.root.className.indexOf(classes.noOverflow) < 0) {
                addClass(instance.elements.root, classes.noOverflow);
              }
              break;
            case "transition":
              updateTransition(instance, newValue, oldValue);
              break;
            case "transitionOff":
              updateTransitionOff(instance);
              break;
          }
          if (typeof instance.hooks.onupdate === "function") {
            instance.hooks.onupdate.call(instance, option, oldValue, newValue);
          }
        }
        function update(instance, obj, callback, key, value) {
          var result = {
            op: void 0,
            items: []
          };
          if (typeof value === "undefined" && typeof key === "string") {
            result.op = "get";
            if (obj.hasOwnProperty(key)) {
              result.found = true;
              result.value = obj[key];
            } else {
              result.found = false;
              result.value = void 0;
            }
          } else {
            var old;
            result.op = "set";
            if (typeof key === "object") {
              var args = key;
              for (var prop in args) {
                if (obj.hasOwnProperty(prop)) {
                  if (obj[prop] !== args[prop]) {
                    old = obj[prop];
                    obj[prop] = args[prop];
                    callback.call(instance, prop, old, args[prop]);
                  }
                  result.items.push({
                    "key": prop,
                    "value": args[prop],
                    "found": true
                  });
                } else {
                  result.items.push({
                    "key": prop,
                    "value": args[prop],
                    "found": false
                  });
                }
              }
            } else if (typeof key === "string") {
              if (obj.hasOwnProperty(key)) {
                if (obj[key] !== value) {
                  old = obj[key];
                  obj[key] = value;
                  callback.call(instance, key, old, value);
                }
                result.items.push({
                  "key": key,
                  "value": value,
                  "found": true
                });
              } else {
                result.items.push({
                  "key": key,
                  "value": value,
                  "found": false
                });
              }
            } else {
              throw new Error("args must be a string or object");
            }
          }
          return result;
        }
        function triggerClose(instance) {
          var found;
          triggerCallback(instance, function(button) {
            return found = instance.get("invokeOnCloseOff") !== true && button.invokeOnClose === true;
          });
          if (!found && instance.isOpen()) {
            instance.close();
          }
        }
        function commandsClickHandler(event, instance) {
          var target = event.srcElement || event.target;
          switch (target) {
            case instance.elements.commands.pin:
              if (!instance.isPinned()) {
                pin(instance);
              } else {
                unpin(instance);
              }
              break;
            case instance.elements.commands.maximize:
              if (!instance.isMaximized()) {
                maximize(instance);
              } else {
                restore(instance);
              }
              break;
            case instance.elements.commands.close:
              triggerClose(instance);
              break;
          }
          return false;
        }
        function pin(instance) {
          instance.set("pinned", true);
        }
        function unpin(instance) {
          instance.set("pinned", false);
        }
        function maximize(instance) {
          dispatchEvent("onmaximize", instance);
          addClass(instance.elements.root, classes.maximized);
          if (instance.isOpen()) {
            ensureNoOverflow();
          }
          dispatchEvent("onmaximized", instance);
        }
        function restore(instance) {
          dispatchEvent("onrestore", instance);
          removeClass(instance.elements.root, classes.maximized);
          if (instance.isOpen()) {
            ensureNoOverflow();
          }
          dispatchEvent("onrestored", instance);
        }
        function updatePinnable(instance) {
          if (instance.get("pinnable")) {
            addClass(instance.elements.root, classes.pinnable);
          } else {
            removeClass(instance.elements.root, classes.pinnable);
          }
        }
        function addAbsPositionFix(instance) {
          var scrollLeft = getScrollLeft();
          instance.elements.modal.style.marginTop = getScrollTop() + "px";
          instance.elements.modal.style.marginLeft = scrollLeft + "px";
          instance.elements.modal.style.marginRight = -scrollLeft + "px";
        }
        function removeAbsPositionFix(instance) {
          var marginTop = parseInt(instance.elements.modal.style.marginTop, 10);
          var marginLeft = parseInt(instance.elements.modal.style.marginLeft, 10);
          instance.elements.modal.style.marginTop = "";
          instance.elements.modal.style.marginLeft = "";
          instance.elements.modal.style.marginRight = "";
          if (instance.isOpen()) {
            var top2 = 0, left = 0;
            if (instance.elements.dialog.style.top !== "") {
              top2 = parseInt(instance.elements.dialog.style.top, 10);
            }
            instance.elements.dialog.style.top = top2 + (marginTop - getScrollTop()) + "px";
            if (instance.elements.dialog.style.left !== "") {
              left = parseInt(instance.elements.dialog.style.left, 10);
            }
            instance.elements.dialog.style.left = left + (marginLeft - getScrollLeft()) + "px";
          }
        }
        function updateAbsPositionFix(instance) {
          if (!instance.get("modal") && !instance.get("pinned")) {
            addAbsPositionFix(instance);
          } else {
            removeAbsPositionFix(instance);
          }
        }
        function updatePinned(instance) {
          if (instance.get("pinned")) {
            removeClass(instance.elements.root, classes.unpinned);
            if (instance.isOpen()) {
              removeAbsPositionFix(instance);
            }
          } else {
            addClass(instance.elements.root, classes.unpinned);
            if (instance.isOpen() && !instance.isModal()) {
              addAbsPositionFix(instance);
            }
          }
        }
        function updateMaximizable(instance) {
          if (instance.get("maximizable")) {
            addClass(instance.elements.root, classes.maximizable);
          } else {
            removeClass(instance.elements.root, classes.maximizable);
          }
        }
        function updateClosable(instance) {
          if (instance.get("closable")) {
            addClass(instance.elements.root, classes.closable);
            bindClosableEvents(instance);
          } else {
            removeClass(instance.elements.root, classes.closable);
            unbindClosableEvents(instance);
          }
        }
        var cancelClick = false, modalClickHandlerTS = 0;
        function modalClickHandler(event, instance) {
          if (event.timeStamp - modalClickHandlerTS > 200 && (modalClickHandlerTS = event.timeStamp) && !cancelClick) {
            var target = event.srcElement || event.target;
            if (instance.get("closableByDimmer") === true && target === instance.elements.modal) {
              triggerClose(instance);
            }
          }
          cancelClick = false;
        }
        var callbackTS = 0;
        var cancelKeyup = false;
        function triggerCallback(instance, check) {
          if (Date.now() - callbackTS > 200 && (callbackTS = Date.now())) {
            for (var idx = 0; idx < instance.__internal.buttons.length; idx += 1) {
              var button = instance.__internal.buttons[idx];
              if (!button.element.disabled && check(button)) {
                var closeEvent = createCloseEvent(idx, button);
                if (typeof instance.callback === "function") {
                  instance.callback.apply(instance, [closeEvent]);
                }
                if (closeEvent.cancel === false) {
                  instance.close();
                }
                break;
              }
            }
          }
        }
        function buttonsClickHandler(event, instance) {
          var target = event.srcElement || event.target;
          triggerCallback(instance, function(button) {
            return button.element.contains(target) && (cancelKeyup = true);
          });
        }
        function keyupHandler(event) {
          if (cancelKeyup) {
            cancelKeyup = false;
            return;
          }
          var instance = openDialogs[openDialogs.length - 1];
          var keyCode = event.keyCode;
          if (instance.__internal.buttons.length === 0 && keyCode === keys.ESC && instance.get("closable") === true) {
            triggerClose(instance);
            return false;
          } else if (usedKeys.indexOf(keyCode) > -1) {
            triggerCallback(instance, function(button) {
              return button.key === keyCode;
            });
            return false;
          }
        }
        function keydownHandler(event) {
          var instance = openDialogs[openDialogs.length - 1];
          var keyCode = event.keyCode;
          if (keyCode === keys.LEFT || keyCode === keys.RIGHT) {
            var buttons = instance.__internal.buttons;
            for (var x = 0; x < buttons.length; x += 1) {
              if (document.activeElement === buttons[x].element) {
                switch (keyCode) {
                  case keys.LEFT:
                    buttons[(x || buttons.length) - 1].element.focus();
                    return;
                  case keys.RIGHT:
                    buttons[(x + 1) % buttons.length].element.focus();
                    return;
                }
              }
            }
          } else if (keyCode < keys.F12 + 1 && keyCode > keys.F1 - 1 && usedKeys.indexOf(keyCode) > -1) {
            event.preventDefault();
            event.stopPropagation();
            triggerCallback(instance, function(button) {
              return button.key === keyCode;
            });
            return false;
          }
        }
        function setFocus(instance, resetTarget) {
          if (resetTarget) {
            resetTarget.focus();
          } else {
            var focus = instance.__internal.focus;
            var element = focus.element;
            switch (typeof focus.element) {
              // a number means a button index
              case "number":
                if (instance.__internal.buttons.length > focus.element) {
                  if (instance.get("basic") === true) {
                    element = instance.elements.reset[0];
                  } else {
                    element = instance.__internal.buttons[focus.element].element;
                  }
                }
                break;
              // a string means querySelector to select from dialog body contents.
              case "string":
                element = instance.elements.body.querySelector(focus.element);
                break;
              // a function should return the focus element.
              case "function":
                element = focus.element.call(instance);
                break;
            }
            if (instance.get("defaultFocusOff") === true || (typeof element === "undefined" || element === null) && instance.__internal.buttons.length === 0) {
              element = instance.elements.reset[0];
            }
            if (element && element.focus) {
              element.focus();
              if (focus.select && element.select) {
                element.select();
              }
            }
          }
        }
        function onReset(event, instance) {
          if (!instance) {
            for (var x = openDialogs.length - 1; x > -1; x -= 1) {
              if (openDialogs[x].isModal()) {
                instance = openDialogs[x];
                break;
              }
            }
          }
          if (instance) {
            if (instance.isModal()) {
              var firstReset = instance.elements.reset[0], lastReset = instance.elements.reset[1], lastFocusedElement = event.relatedTarget, within = instance.elements.root.contains(lastFocusedElement), target = event.srcElement || event.target, resetTarget;
              if (
                /*first show */
                target === firstReset && !within || /*focus cycle */
                target === lastReset && lastFocusedElement === firstReset
              ) {
                return;
              } else if (target === lastReset || target === document.body) {
                resetTarget = firstReset;
              } else if (target === firstReset && lastFocusedElement === lastReset) {
                resetTarget = findTabbable(instance);
              } else if (target === firstReset && within) {
                resetTarget = findTabbable(instance, true);
              }
              setFocus(instance, resetTarget);
            }
          }
        }
        function findTabbable(instance, last) {
          var tabbables = [].slice.call(instance.elements.dialog.querySelectorAll(defaults.tabbable));
          if (last) {
            tabbables.reverse();
          }
          for (var x = 0; x < tabbables.length; x += 1) {
            var tabbable = tabbables[x];
            if (!!(tabbable.offsetParent || tabbable.offsetWidth || tabbable.offsetHeight || tabbable.getClientRects().length)) {
              return tabbable;
            }
          }
        }
        function recycleTab(event) {
          var instance = openDialogs[openDialogs.length - 1];
          if (instance && event.shiftKey && event.keyCode === keys.TAB) {
            instance.elements.reset[1].focus();
          }
        }
        function handleTransitionInEvent(event, instance) {
          clearTimeout(instance.__internal.timerIn);
          setFocus(instance);
          cancelKeyup = false;
          dispatchEvent("onfocus", instance);
          off(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);
          removeClass(instance.elements.root, classes.animationIn);
        }
        function handleTransitionOutEvent(event, instance) {
          clearTimeout(instance.__internal.timerOut);
          off(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);
          resetMove(instance);
          resetResize(instance);
          if (instance.isMaximized() && !instance.get("startMaximized")) {
            restore(instance);
          }
          if (typeof instance.__internal.destroy === "function") {
            instance.__internal.destroy.apply(instance);
          }
        }
        var movable = null, offsetX = 0, offsetY = 0, xProp = "pageX", yProp = "pageY", bounds = null, refreshTop = false, moveDelegate = null;
        function moveElement(event, element) {
          var left = event[xProp] - offsetX, top2 = event[yProp] - offsetY;
          if (refreshTop) {
            top2 -= document.body.scrollTop;
          }
          element.style.left = left + "px";
          element.style.top = top2 + "px";
        }
        function moveElementBounded(event, element) {
          var left = event[xProp] - offsetX, top2 = event[yProp] - offsetY;
          if (refreshTop) {
            top2 -= document.body.scrollTop;
          }
          element.style.left = Math.min(bounds.maxLeft, Math.max(bounds.minLeft, left)) + "px";
          if (refreshTop) {
            element.style.top = Math.min(bounds.maxTop, Math.max(bounds.minTop, top2)) + "px";
          } else {
            element.style.top = Math.max(bounds.minTop, top2) + "px";
          }
        }
        function beginMove(event, instance) {
          if (resizable === null && !instance.isMaximized() && instance.get("movable")) {
            var eventSrc, left = 0, top2 = 0;
            if (event.type === "touchstart") {
              event.preventDefault();
              eventSrc = event.targetTouches[0];
              xProp = "clientX";
              yProp = "clientY";
            } else if (event.button === 0) {
              eventSrc = event;
            }
            if (eventSrc) {
              var element = instance.elements.dialog;
              addClass(element, classes.capture);
              if (element.style.left) {
                left = parseInt(element.style.left, 10);
              }
              if (element.style.top) {
                top2 = parseInt(element.style.top, 10);
              }
              offsetX = eventSrc[xProp] - left;
              offsetY = eventSrc[yProp] - top2;
              if (instance.isModal()) {
                offsetY += instance.elements.modal.scrollTop;
              } else if (instance.isPinned()) {
                offsetY -= document.body.scrollTop;
              }
              if (instance.get("moveBounded")) {
                var current = element, offsetLeft = -left, offsetTop = -top2;
                do {
                  offsetLeft += current.offsetLeft;
                  offsetTop += current.offsetTop;
                } while (current = current.offsetParent);
                bounds = {
                  maxLeft: offsetLeft,
                  minLeft: -offsetLeft,
                  maxTop: document.documentElement.clientHeight - element.clientHeight - offsetTop,
                  minTop: -offsetTop
                };
                moveDelegate = moveElementBounded;
              } else {
                bounds = null;
                moveDelegate = moveElement;
              }
              dispatchEvent("onmove", instance);
              refreshTop = !instance.isModal() && instance.isPinned();
              movable = instance;
              moveDelegate(eventSrc, element);
              addClass(document.body, classes.noSelection);
              return false;
            }
          }
        }
        function move(event) {
          if (movable) {
            var eventSrc;
            if (event.type === "touchmove") {
              event.preventDefault();
              eventSrc = event.targetTouches[0];
            } else if (event.button === 0) {
              eventSrc = event;
            }
            if (eventSrc) {
              moveDelegate(eventSrc, movable.elements.dialog);
            }
          }
        }
        function endMove() {
          if (movable) {
            var instance = movable;
            movable = bounds = null;
            removeClass(document.body, classes.noSelection);
            removeClass(instance.elements.dialog, classes.capture);
            dispatchEvent("onmoved", instance);
          }
        }
        function resetMove(instance) {
          movable = null;
          var element = instance.elements.dialog;
          element.style.left = element.style.top = "";
        }
        function updateMovable(instance) {
          if (instance.get("movable")) {
            addClass(instance.elements.root, classes.movable);
            if (instance.isOpen()) {
              bindMovableEvents(instance);
            }
          } else {
            resetMove(instance);
            removeClass(instance.elements.root, classes.movable);
            if (instance.isOpen()) {
              unbindMovableEvents(instance);
            }
          }
        }
        var resizable = null, startingLeft = Number.Nan, startingWidth = 0, minWidth = 0, handleOffset = 0;
        function resizeElement(event, element, pageRelative) {
          var current = element;
          var offsetLeft = 0;
          var offsetTop = 0;
          do {
            offsetLeft += current.offsetLeft;
            offsetTop += current.offsetTop;
          } while (current = current.offsetParent);
          var X, Y;
          if (pageRelative === true) {
            X = event.pageX;
            Y = event.pageY;
          } else {
            X = event.clientX;
            Y = event.clientY;
          }
          var isRTL = isRightToLeft();
          if (isRTL) {
            X = document.body.offsetWidth - X;
            if (!isNaN(startingLeft)) {
              offsetLeft = document.body.offsetWidth - offsetLeft - element.offsetWidth;
            }
          }
          element.style.height = Y - offsetTop + handleOffset + "px";
          element.style.width = X - offsetLeft + handleOffset + "px";
          if (!isNaN(startingLeft)) {
            var diff = Math.abs(element.offsetWidth - startingWidth) * 0.5;
            if (isRTL) {
              diff *= -1;
            }
            if (element.offsetWidth > startingWidth) {
              element.style.left = startingLeft + diff + "px";
            } else if (element.offsetWidth >= minWidth) {
              element.style.left = startingLeft - diff + "px";
            }
          }
        }
        function beginResize(event, instance) {
          if (!instance.isMaximized()) {
            var eventSrc;
            if (event.type === "touchstart") {
              event.preventDefault();
              eventSrc = event.targetTouches[0];
            } else if (event.button === 0) {
              eventSrc = event;
            }
            if (eventSrc) {
              dispatchEvent("onresize", instance);
              resizable = instance;
              handleOffset = instance.elements.resizeHandle.offsetHeight / 2;
              var element = instance.elements.dialog;
              addClass(element, classes.capture);
              startingLeft = parseInt(element.style.left, 10);
              element.style.height = element.offsetHeight + "px";
              element.style.minHeight = instance.elements.header.offsetHeight + instance.elements.footer.offsetHeight + "px";
              element.style.width = (startingWidth = element.offsetWidth) + "px";
              if (element.style.maxWidth !== "none") {
                element.style.minWidth = (minWidth = element.offsetWidth) + "px";
              }
              element.style.maxWidth = "none";
              addClass(document.body, classes.noSelection);
              return false;
            }
          }
        }
        function resize(event) {
          if (resizable) {
            var eventSrc;
            if (event.type === "touchmove") {
              event.preventDefault();
              eventSrc = event.targetTouches[0];
            } else if (event.button === 0) {
              eventSrc = event;
            }
            if (eventSrc) {
              resizeElement(eventSrc, resizable.elements.dialog, !resizable.get("modal") && !resizable.get("pinned"));
            }
          }
        }
        function endResize() {
          if (resizable) {
            var instance = resizable;
            resizable = null;
            removeClass(document.body, classes.noSelection);
            removeClass(instance.elements.dialog, classes.capture);
            cancelClick = true;
            dispatchEvent("onresized", instance);
          }
        }
        function resetResize(instance) {
          resizable = null;
          var element = instance.elements.dialog;
          if (element.style.maxWidth === "none") {
            element.style.maxWidth = element.style.minWidth = element.style.width = element.style.height = element.style.minHeight = element.style.left = "";
            startingLeft = Number.Nan;
            startingWidth = minWidth = handleOffset = 0;
          }
        }
        function updateResizable(instance) {
          if (instance.get("resizable")) {
            addClass(instance.elements.root, classes.resizable);
            if (instance.isOpen()) {
              bindResizableEvents(instance);
            }
          } else {
            resetResize(instance);
            removeClass(instance.elements.root, classes.resizable);
            if (instance.isOpen()) {
              unbindResizableEvents(instance);
            }
          }
        }
        function windowResize() {
          for (var x = 0; x < openDialogs.length; x += 1) {
            var instance = openDialogs[x];
            if (instance.get("autoReset")) {
              resetMove(instance);
              resetResize(instance);
            }
          }
        }
        function bindEvents(instance) {
          if (openDialogs.length === 1) {
            on(window2, "resize", windowResize);
            on(document.body, "keyup", keyupHandler);
            on(document.body, "keydown", keydownHandler);
            on(document.body, "focus", onReset);
            on(document.documentElement, "mousemove", move);
            on(document.documentElement, "touchmove", move, false, false);
            on(document.documentElement, "mouseup", endMove);
            on(document.documentElement, "touchend", endMove);
            on(document.documentElement, "mousemove", resize);
            on(document.documentElement, "touchmove", resize, false, false);
            on(document.documentElement, "mouseup", endResize);
            on(document.documentElement, "touchend", endResize);
          }
          on(instance.elements.commands.container, "click", instance.__internal.commandsClickHandler);
          on(instance.elements.footer, "click", instance.__internal.buttonsClickHandler);
          on(instance.elements.reset[0], "focusin", instance.__internal.resetHandler);
          on(instance.elements.reset[0], "keydown", recycleTab);
          on(instance.elements.reset[1], "focusin", instance.__internal.resetHandler);
          cancelKeyup = true;
          on(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);
          if (!instance.get("modal")) {
            bindModelessEvents(instance);
          }
          if (instance.get("resizable")) {
            bindResizableEvents(instance);
          }
          if (instance.get("movable")) {
            bindMovableEvents(instance);
          }
        }
        function unbindEvents(instance) {
          if (openDialogs.length === 1) {
            off(window2, "resize", windowResize);
            off(document.body, "keyup", keyupHandler);
            off(document.body, "keydown", keydownHandler);
            off(document.body, "focus", onReset);
            off(document.documentElement, "mousemove", move);
            off(document.documentElement, "mouseup", endMove);
            off(document.documentElement, "mousemove", resize);
            off(document.documentElement, "mouseup", endResize);
          }
          off(instance.elements.commands.container, "click", instance.__internal.commandsClickHandler);
          off(instance.elements.footer, "click", instance.__internal.buttonsClickHandler);
          off(instance.elements.reset[0], "focusin", instance.__internal.resetHandler);
          off(instance.elements.reset[0], "keydown", recycleTab);
          off(instance.elements.reset[1], "focusin", instance.__internal.resetHandler);
          on(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);
          if (!instance.get("modal")) {
            unbindModelessEvents(instance);
          }
          if (instance.get("movable")) {
            unbindMovableEvents(instance);
          }
          if (instance.get("resizable")) {
            unbindResizableEvents(instance);
          }
        }
        function bindModelessEvents(instance) {
          on(instance.elements.dialog, "focus", instance.__internal.bringToFrontHandler, true);
        }
        function unbindModelessEvents(instance) {
          off(instance.elements.dialog, "focus", instance.__internal.bringToFrontHandler, true);
        }
        function bindMovableEvents(instance) {
          on(instance.elements.header, "mousedown", instance.__internal.beginMoveHandler);
          on(instance.elements.header, "touchstart", instance.__internal.beginMoveHandler, false, false);
        }
        function unbindMovableEvents(instance) {
          off(instance.elements.header, "mousedown", instance.__internal.beginMoveHandler);
          off(instance.elements.header, "touchstart", instance.__internal.beginMoveHandler, false, false);
        }
        function bindResizableEvents(instance) {
          on(instance.elements.resizeHandle, "mousedown", instance.__internal.beginResizeHandler);
          on(instance.elements.resizeHandle, "touchstart", instance.__internal.beginResizeHandler, false, false);
        }
        function unbindResizableEvents(instance) {
          off(instance.elements.resizeHandle, "mousedown", instance.__internal.beginResizeHandler);
          off(instance.elements.resizeHandle, "touchstart", instance.__internal.beginResizeHandler, false, false);
        }
        function bindClosableEvents(instance) {
          on(instance.elements.modal, "click", instance.__internal.modalClickHandler);
        }
        function unbindClosableEvents(instance) {
          off(instance.elements.modal, "click", instance.__internal.modalClickHandler);
        }
        return {
          __init: initialize,
          /**
           * Check if dialog is currently open
           *
           * @return {Boolean}
           */
          isOpen: function() {
            return this.__internal.isOpen;
          },
          isModal: function() {
            return this.elements.root.className.indexOf(classes.modeless) < 0;
          },
          isMaximized: function() {
            return this.elements.root.className.indexOf(classes.maximized) > -1;
          },
          isPinned: function() {
            return this.elements.root.className.indexOf(classes.unpinned) < 0;
          },
          maximize: function() {
            if (!this.isMaximized()) {
              maximize(this);
            }
            return this;
          },
          restore: function() {
            if (this.isMaximized()) {
              restore(this);
            }
            return this;
          },
          pin: function() {
            if (!this.isPinned()) {
              pin(this);
            }
            return this;
          },
          unpin: function() {
            if (this.isPinned()) {
              unpin(this);
            }
            return this;
          },
          bringToFront: function() {
            bringToFront(null, this);
            return this;
          },
          /**
           * Move the dialog to a specific x/y coordinates
           *
           * @param {Number} x    The new dialog x coordinate in pixels.
           * @param {Number} y    The new dialog y coordinate in pixels.
           *
           * @return {Object} The dialog instance.
           */
          moveTo: function(x, y) {
            if (!isNaN(x) && !isNaN(y)) {
              dispatchEvent("onmove", this);
              var element = this.elements.dialog, current = element, offsetLeft = 0, offsetTop = 0;
              if (element.style.left) {
                offsetLeft -= parseInt(element.style.left, 10);
              }
              if (element.style.top) {
                offsetTop -= parseInt(element.style.top, 10);
              }
              do {
                offsetLeft += current.offsetLeft;
                offsetTop += current.offsetTop;
              } while (current = current.offsetParent);
              var left = x - offsetLeft;
              var top2 = y - offsetTop;
              if (isRightToLeft()) {
                left *= -1;
              }
              element.style.left = left + "px";
              element.style.top = top2 + "px";
              dispatchEvent("onmoved", this);
            }
            return this;
          },
          /**
           * Resize the dialog to a specific width/height (the dialog must be 'resizable').
           * The dialog can be resized to:
           *  A minimum width equal to the initial display width
           *  A minimum height equal to the sum of header/footer heights.
           *
           *
           * @param {Number or String} width    The new dialog width in pixels or in percent.
           * @param {Number or String} height   The new dialog height in pixels or in percent.
           *
           * @return {Object} The dialog instance.
           */
          resizeTo: function(width, height) {
            var w = parseFloat(width), h = parseFloat(height), regex = /(\d*\.\d+|\d+)%/;
            if (!isNaN(w) && !isNaN(h) && this.get("resizable") === true) {
              dispatchEvent("onresize", this);
              if (("" + width).match(regex)) {
                w = w / 100 * document.documentElement.clientWidth;
              }
              if (("" + height).match(regex)) {
                h = h / 100 * document.documentElement.clientHeight;
              }
              var element = this.elements.dialog;
              if (element.style.maxWidth !== "none") {
                element.style.minWidth = (minWidth = element.offsetWidth) + "px";
              }
              element.style.maxWidth = "none";
              element.style.minHeight = this.elements.header.offsetHeight + this.elements.footer.offsetHeight + "px";
              element.style.width = w + "px";
              element.style.height = h + "px";
              dispatchEvent("onresized", this);
            }
            return this;
          },
          /**
           * Gets or Sets dialog settings/options 
           *
           * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
           * @param {Object} value Optional, the value associated with the key (in case it was a string).
           *
           * @return {undefined}
           */
          setting: function(key, value) {
            var self = this;
            var result = update(this, this.__internal.options, function(k, o, n) {
              optionUpdated(self, k, o, n);
            }, key, value);
            if (result.op === "get") {
              if (result.found) {
                return result.value;
              } else if (typeof this.settings !== "undefined") {
                return update(this, this.settings, this.settingUpdated || function() {
                }, key, value).value;
              } else {
                return void 0;
              }
            } else if (result.op === "set") {
              if (result.items.length > 0) {
                var callback = this.settingUpdated || function() {
                };
                for (var x = 0; x < result.items.length; x += 1) {
                  var item = result.items[x];
                  if (!item.found && typeof this.settings !== "undefined") {
                    update(this, this.settings, callback, item.key, item.value);
                  }
                }
              }
              return this;
            }
          },
          /**
           * [Alias] Sets dialog settings/options 
           */
          set: function(key, value) {
            this.setting(key, value);
            return this;
          },
          /**
           * [Alias] Gets dialog settings/options 
           */
          get: function(key) {
            return this.setting(key);
          },
          /**
          * Sets dialog header
          * @content {string or element}
          *
          * @return {undefined}
          */
          setHeader: function(content) {
            if (isString(content)) {
              clearContents(this.elements.header);
              this.elements.header.innerHTML = content;
            } else if (content instanceof window2.HTMLElement && this.elements.header.firstChild !== content) {
              clearContents(this.elements.header);
              this.elements.header.appendChild(content);
            }
            return this;
          },
          /**
          * Sets dialog contents
          * @content {string or element}
          *
          * @return {undefined}
          */
          setContent: function(content) {
            if (isString(content)) {
              clearContents(this.elements.content);
              this.elements.content.innerHTML = content;
            } else if (content instanceof window2.HTMLElement && this.elements.content.firstChild !== content) {
              clearContents(this.elements.content);
              this.elements.content.appendChild(content);
            }
            return this;
          },
          /**
           * Show the dialog as modal
           *
           * @return {Object} the dialog instance.
           */
          showModal: function(className) {
            return this.show(true, className);
          },
          /**
           * Show the dialog
           *
           * @return {Object} the dialog instance.
           */
          show: function(modal, className) {
            initialize(this);
            if (!this.__internal.isOpen) {
              this.__internal.isOpen = true;
              openDialogs.push(this);
              if (alertify.defaults.maintainFocus) {
                this.__internal.activeElement = document.activeElement;
              }
              if (!document.body.hasAttribute("tabindex")) {
                document.body.setAttribute("tabindex", tabindex = "0");
              }
              if (typeof this.prepare === "function") {
                this.prepare();
              }
              bindEvents(this);
              if (modal !== void 0) {
                this.set("modal", modal);
              }
              saveScrollPosition();
              ensureNoOverflow();
              if (typeof className === "string" && className !== "") {
                this.__internal.className = className;
                addClass(this.elements.root, className);
              }
              if (this.get("startMaximized")) {
                this.maximize();
              } else if (this.isMaximized()) {
                restore(this);
              }
              updateAbsPositionFix(this);
              this.elements.root.removeAttribute("style");
              removeClass(this.elements.root, classes.animationOut);
              addClass(this.elements.root, classes.animationIn);
              clearTimeout(this.__internal.timerIn);
              this.__internal.timerIn = setTimeout(this.__internal.transitionInHandler, transition.supported ? 1e3 : 100);
              if (isSafari) {
                var root = this.elements.root;
                root.style.display = "none";
                setTimeout(function() {
                  root.style.display = "block";
                }, 0);
              }
              reflow = this.elements.root.offsetWidth;
              removeClass(this.elements.root, classes.hidden);
              restoreScrollPosition();
              if (typeof this.hooks.onshow === "function") {
                this.hooks.onshow.call(this);
              }
              dispatchEvent("onshow", this);
            } else {
              resetMove(this);
              resetResize(this);
              addClass(this.elements.dialog, classes.shake);
              var self = this;
              setTimeout(function() {
                removeClass(self.elements.dialog, classes.shake);
              }, 200);
            }
            return this;
          },
          /**
           * Close the dialog
           *
           * @return {Object} The dialog instance
           */
          close: function() {
            if (this.__internal.isOpen) {
              if (dispatchEvent("onclosing", this) !== false) {
                unbindEvents(this);
                removeClass(this.elements.root, classes.animationIn);
                addClass(this.elements.root, classes.animationOut);
                clearTimeout(this.__internal.timerOut);
                this.__internal.timerOut = setTimeout(this.__internal.transitionOutHandler, transition.supported ? 1e3 : 100);
                addClass(this.elements.root, classes.hidden);
                reflow = this.elements.modal.offsetWidth;
                if (alertify.defaults.maintainFocus && this.__internal.activeElement) {
                  this.__internal.activeElement.focus();
                  this.__internal.activeElement = null;
                }
                if (typeof this.__internal.className !== "undefined" && this.__internal.className !== "") {
                  removeClass(this.elements.root, this.__internal.className);
                }
                if (typeof this.hooks.onclose === "function") {
                  this.hooks.onclose.call(this);
                }
                dispatchEvent("onclose", this);
                openDialogs.splice(openDialogs.indexOf(this), 1);
                this.__internal.isOpen = false;
                ensureNoOverflow();
              }
            }
            if (!openDialogs.length && tabindex === "0") {
              document.body.removeAttribute("tabindex");
            }
            return this;
          },
          /**
           * Close all open dialogs except this.
           *
           * @return {undefined}
           */
          closeOthers: function() {
            alertify.closeAll(this);
            return this;
          },
          /**
           * Destroys this dialog instance
           *
           * @return {undefined}
           */
          destroy: function() {
            if (this.__internal) {
              if (this.__internal.isOpen) {
                this.__internal.destroy = function() {
                  destruct(this, initialize);
                };
                this.close();
              } else if (!this.__internal.destroy) {
                destruct(this, initialize);
              }
            }
            return this;
          }
        };
      }();
      var notifier = function() {
        var reflow, element, openInstances = [], classes = defaults.notifier.classes, baseClass = classes.base;
        function initialize(instance) {
          if (!instance.__internal) {
            instance.__internal = {
              position: alertify.defaults.notifier.position,
              delay: alertify.defaults.notifier.delay
            };
            element = document.createElement("DIV");
            var transitionOff = "transitionOff" in defaults.notifier ? defaults.notifier.transitionOff : defaults.transitionOff;
            if (transitionOff) {
              baseClass = classes.base + " ajs-no-transition";
            }
            updatePosition(instance);
          }
          if (element.parentNode !== document.body) {
            document.body.appendChild(element);
          }
        }
        function pushInstance(instance) {
          instance.__internal.pushed = true;
          openInstances.push(instance);
        }
        function popInstance(instance) {
          openInstances.splice(openInstances.indexOf(instance), 1);
          instance.__internal.pushed = false;
        }
        function updatePosition(instance) {
          element.className = baseClass;
          switch (instance.__internal.position) {
            case "top-right":
              addClass(element, classes.top + " " + classes.right);
              break;
            case "top-left":
              addClass(element, classes.top + " " + classes.left);
              break;
            case "top-center":
              addClass(element, classes.top + " " + classes.center);
              break;
            case "bottom-left":
              addClass(element, classes.bottom + " " + classes.left);
              break;
            case "bottom-center":
              addClass(element, classes.bottom + " " + classes.center);
              break;
            default:
            case "bottom-right":
              addClass(element, classes.bottom + " " + classes.right);
              break;
          }
        }
        function create(div, callback) {
          function clickDelegate(event, instance) {
            if (!instance.__internal.closeButton || event.target.getAttribute("data-close") === "true") {
              instance.dismiss(true);
            }
          }
          function transitionDone(event, instance) {
            off(instance.element, transition.type, transitionDone);
            element.removeChild(instance.element);
          }
          function initialize2(instance) {
            if (!instance.__internal) {
              instance.__internal = {
                pushed: false,
                delay: void 0,
                timer: void 0,
                clickHandler: void 0,
                transitionEndHandler: void 0,
                transitionTimeout: void 0
              };
              instance.__internal.clickHandler = delegate(instance, clickDelegate);
              instance.__internal.transitionEndHandler = delegate(instance, transitionDone);
            }
            return instance;
          }
          function clearTimers(instance) {
            clearTimeout(instance.__internal.timer);
            clearTimeout(instance.__internal.transitionTimeout);
          }
          return initialize2({
            /* notification DOM element*/
            element: div,
            /*
             * Pushes a notification message
             * @param {string or DOMElement} content The notification message content
             * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
             *
             */
            push: function(_content, _wait) {
              if (!this.__internal.pushed) {
                pushInstance(this);
                clearTimers(this);
                var content, wait;
                switch (arguments.length) {
                  case 0:
                    wait = this.__internal.delay;
                    break;
                  case 1:
                    if (typeof _content === "number") {
                      wait = _content;
                    } else {
                      content = _content;
                      wait = this.__internal.delay;
                    }
                    break;
                  case 2:
                    content = _content;
                    wait = _wait;
                    break;
                }
                this.__internal.closeButton = alertify.defaults.notifier.closeButton;
                if (typeof content !== "undefined") {
                  this.setContent(content);
                }
                if (notifier.__internal.position.indexOf("top") < 0) {
                  element.appendChild(this.element);
                } else {
                  element.insertBefore(this.element, element.firstChild);
                }
                reflow = this.element.offsetWidth;
                addClass(this.element, classes.visible);
                on(this.element, "click", this.__internal.clickHandler);
                return this.delay(wait);
              }
              return this;
            },
            /*
             * {Function} callback function to be invoked before dismissing the notification message.
             * Remarks: A return value === 'false' will cancel the dismissal
             *
             */
            ondismiss: function() {
            },
            /*
             * {Function} callback function to be invoked when the message is dismissed.
             *
             */
            callback,
            /*
             * Dismisses the notification message
             * @param {Boolean} clicked A flag indicating if the dismissal was caused by a click.
             *
             */
            dismiss: function(clicked) {
              if (this.__internal.pushed) {
                clearTimers(this);
                if (!(typeof this.ondismiss === "function" && this.ondismiss.call(this) === false)) {
                  off(this.element, "click", this.__internal.clickHandler);
                  if (typeof this.element !== "undefined" && this.element.parentNode === element) {
                    this.__internal.transitionTimeout = setTimeout(this.__internal.transitionEndHandler, transition.supported ? 1e3 : 100);
                    removeClass(this.element, classes.visible);
                    if (typeof this.callback === "function") {
                      this.callback.call(this, clicked);
                    }
                  }
                  popInstance(this);
                }
              }
              return this;
            },
            /*
             * Delays the notification message dismissal
             * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
             *
             */
            delay: function(wait) {
              clearTimers(this);
              this.__internal.delay = typeof wait !== "undefined" && !isNaN(+wait) ? +wait : notifier.__internal.delay;
              if (this.__internal.delay > 0) {
                var self = this;
                this.__internal.timer = setTimeout(function() {
                  self.dismiss();
                }, this.__internal.delay * 1e3);
              }
              return this;
            },
            /*
             * Sets the notification message contents
             * @param {string or DOMElement} content The notification message content
             *
             */
            setContent: function(content) {
              if (isString(content)) {
                clearContents(this.element);
                this.element.innerHTML = content;
              } else if (content instanceof window2.HTMLElement && this.element.firstChild !== content) {
                clearContents(this.element);
                this.element.appendChild(content);
              }
              if (this.__internal.closeButton) {
                var close = document.createElement("span");
                addClass(close, classes.close);
                close.setAttribute("data-close", true);
                this.element.appendChild(close);
              }
              return this;
            },
            /*
             * Dismisses all open notifications except this.
             *
             */
            dismissOthers: function() {
              notifier.dismissAll(this);
              return this;
            }
          });
        }
        return {
          /**
           * Gets or Sets notifier settings.
           *
           * @param {string} key The setting name
           * @param {Variant} value The setting value.
           *
           * @return {Object}	if the called as a setter, return the notifier instance.
           */
          setting: function(key, value) {
            initialize(this);
            if (typeof value === "undefined") {
              return this.__internal[key];
            } else {
              switch (key) {
                case "position":
                  this.__internal.position = value;
                  updatePosition(this);
                  break;
                case "delay":
                  this.__internal.delay = value;
                  break;
              }
            }
            return this;
          },
          /**
           * [Alias] Sets dialog settings/options
           */
          set: function(key, value) {
            this.setting(key, value);
            return this;
          },
          /**
           * [Alias] Gets dialog settings/options
           */
          get: function(key) {
            return this.setting(key);
          },
          /**
           * Creates a new notification message
           *
           * @param {string} type The type of notification message (simply a CSS class name 'ajs-{type}' to be added).
           * @param {Function} callback  A callback function to be invoked when the message is dismissed.
           *
           * @return {undefined}
           */
          create: function(type, callback) {
            initialize(this);
            var div = document.createElement("div");
            div.className = classes.message + (typeof type === "string" && type !== "" ? " " + classes.prefix + type : "");
            return create(div, callback);
          },
          /**
           * Dismisses all open notifications.
           *
           * @param {Object} excpet [optional] The notification object to exclude from dismissal.
           *
           */
          dismissAll: function(except) {
            var clone = openInstances.slice(0);
            for (var x = 0; x < clone.length; x += 1) {
              var instance = clone[x];
              if (except === void 0 || except !== instance) {
                instance.dismiss();
              }
            }
          }
        };
      }();
      function Alertify() {
        var dialogs = {};
        function extend(sub, base) {
          for (var prop in base) {
            if (base.hasOwnProperty(prop)) {
              sub[prop] = base[prop];
            }
          }
          return sub;
        }
        function get_dialog(name) {
          var dialog2 = dialogs[name].dialog;
          if (dialog2 && typeof dialog2.__init === "function") {
            dialog2.__init(dialog2);
          }
          return dialog2;
        }
        function register(name, Factory, transient, base) {
          var definition = {
            dialog: null,
            factory: Factory
          };
          if (base !== void 0) {
            definition.factory = function() {
              return extend(new dialogs[base].factory(), new Factory());
            };
          }
          if (!transient) {
            definition.dialog = extend(new definition.factory(), dialog);
          }
          return dialogs[name] = definition;
        }
        return {
          /**
           * Alertify defaults
           * 
           * @type {Object}
           */
          defaults,
          /**
           * Dialogs factory 
           *
           * @param {string}      Dialog name.
           * @param {Function}    A Dialog factory function.
           * @param {Boolean}     Indicates whether to create a singleton or transient dialog.
           * @param {String}      The name of the base type to inherit from.
           */
          dialog: function(name, Factory, transient, base) {
            if (typeof Factory !== "function") {
              return get_dialog(name);
            }
            if (this.hasOwnProperty(name)) {
              throw new Error("alertify.dialog: name already exists");
            }
            var definition = register(name, Factory, transient, base);
            if (transient) {
              this[name] = function() {
                if (arguments.length === 0) {
                  return definition.dialog;
                } else {
                  var instance = extend(new definition.factory(), dialog);
                  if (instance && typeof instance.__init === "function") {
                    instance.__init(instance);
                  }
                  instance["main"].apply(instance, arguments);
                  return instance["show"].apply(instance);
                }
              };
            } else {
              this[name] = function() {
                if (definition.dialog && typeof definition.dialog.__init === "function") {
                  definition.dialog.__init(definition.dialog);
                }
                if (arguments.length === 0) {
                  return definition.dialog;
                } else {
                  var dialog2 = definition.dialog;
                  dialog2["main"].apply(definition.dialog, arguments);
                  return dialog2["show"].apply(definition.dialog);
                }
              };
            }
          },
          /**
           * Close all open dialogs.
           *
           * @param {Object} excpet [optional] The dialog object to exclude from closing.
           *
           * @return {undefined}
           */
          closeAll: function(except) {
            var clone = openDialogs.slice(0);
            for (var x = 0; x < clone.length; x += 1) {
              var instance = clone[x];
              if (except === void 0 || except !== instance) {
                instance.close();
              }
            }
          },
          /**
           * Gets or Sets dialog settings/options. if the dialog is transient, this call does nothing.
           *
           * @param {string} name The dialog name.
           * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
           * @param {Variant} value Optional, the value associated with the key (in case it was a string).
           *
           * @return {undefined}
           */
          setting: function(name, key, value) {
            if (name === "notifier") {
              return notifier.setting(key, value);
            }
            var dialog2 = get_dialog(name);
            if (dialog2) {
              return dialog2.setting(key, value);
            }
          },
          /**
           * [Alias] Sets dialog settings/options 
           */
          set: function(name, key, value) {
            return this.setting(name, key, value);
          },
          /**
           * [Alias] Gets dialog settings/options 
           */
          get: function(name, key) {
            return this.setting(name, key);
          },
          /**
           * Creates a new notification message.
           * If a type is passed, a class name "ajs-{type}" will be added.
           * This allows for custom look and feel for various types of notifications.
           *
           * @param  {String | DOMElement}    [message=undefined]		Message text
           * @param  {String}                 [type='']				Type of log message
           * @param  {String}                 [wait='']				Time (in seconds) to wait before auto-close
           * @param  {Function}               [callback=undefined]	A callback function to be invoked when the log is closed.
           *
           * @return {Object} Notification object.
           */
          notify: function(message, type, wait, callback) {
            return notifier.create(type, callback).push(message, wait);
          },
          /**
           * Creates a new notification message.
           *
           * @param  {String}		[message=undefined]		Message text
           * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
           * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
           *
           * @return {Object} Notification object.
           */
          message: function(message, wait, callback) {
            return notifier.create(null, callback).push(message, wait);
          },
          /**
           * Creates a new notification message of type 'success'.
           *
           * @param  {String}		[message=undefined]		Message text
           * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
           * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
           *
           * @return {Object} Notification object.
           */
          success: function(message, wait, callback) {
            return notifier.create("success", callback).push(message, wait);
          },
          /**
           * Creates a new notification message of type 'error'.
           *
           * @param  {String}		[message=undefined]		Message text
           * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
           * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
           *
           * @return {Object} Notification object.
           */
          error: function(message, wait, callback) {
            return notifier.create("error", callback).push(message, wait);
          },
          /**
           * Creates a new notification message of type 'warning'.
           *
           * @param  {String}		[message=undefined]		Message text
           * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
           * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
           *
           * @return {Object} Notification object.
           */
          warning: function(message, wait, callback) {
            return notifier.create("warning", callback).push(message, wait);
          },
          /**
           * Dismisses all open notifications
           *
           * @return {undefined}
           */
          dismissAll: function() {
            notifier.dismissAll();
          }
        };
      }
      var alertify = new Alertify();
      alertify.dialog("alert", function() {
        return {
          main: function(_title, _message, _onok) {
            var title, message, onok;
            switch (arguments.length) {
              case 1:
                message = _title;
                break;
              case 2:
                if (typeof _message === "function") {
                  message = _title;
                  onok = _message;
                } else {
                  title = _title;
                  message = _message;
                }
                break;
              case 3:
                title = _title;
                message = _message;
                onok = _onok;
                break;
            }
            this.set("title", title);
            this.set("message", message);
            this.set("onok", onok);
            return this;
          },
          setup: function() {
            return {
              buttons: [{
                text: alertify.defaults.glossary.ok,
                key: keys.ESC,
                invokeOnClose: true,
                className: alertify.defaults.theme.ok
              }],
              focus: {
                element: 0,
                select: false
              },
              options: {
                maximizable: false,
                resizable: false
              }
            };
          },
          build: function() {
          },
          prepare: function() {
          },
          setMessage: function(message) {
            this.setContent(message);
          },
          settings: {
            message: void 0,
            onok: void 0,
            label: void 0
          },
          settingUpdated: function(key, oldValue, newValue) {
            switch (key) {
              case "message":
                this.setMessage(newValue);
                break;
              case "label":
                if (this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue;
                }
                break;
            }
          },
          callback: function(closeEvent) {
            if (typeof this.get("onok") === "function") {
              var returnValue = this.get("onok").call(this, closeEvent);
              if (typeof returnValue !== "undefined") {
                closeEvent.cancel = !returnValue;
              }
            }
          }
        };
      });
      alertify.dialog("confirm", function() {
        var autoConfirm = {
          timer: null,
          index: null,
          text: null,
          duration: null,
          task: function(event, self) {
            if (self.isOpen()) {
              self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text + " (&#8207;" + autoConfirm.duration + "&#8207;) ";
              autoConfirm.duration -= 1;
              if (autoConfirm.duration === -1) {
                clearAutoConfirm(self);
                var button = self.__internal.buttons[autoConfirm.index];
                var closeEvent = createCloseEvent(autoConfirm.index, button);
                if (typeof self.callback === "function") {
                  self.callback.apply(self, [closeEvent]);
                }
                if (closeEvent.close !== false) {
                  self.close();
                }
              }
            } else {
              clearAutoConfirm(self);
            }
          }
        };
        function clearAutoConfirm(self) {
          if (autoConfirm.timer !== null) {
            clearInterval(autoConfirm.timer);
            autoConfirm.timer = null;
            self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text;
          }
        }
        function startAutoConfirm(self, index, duration) {
          clearAutoConfirm(self);
          autoConfirm.duration = duration;
          autoConfirm.index = index;
          autoConfirm.text = self.__internal.buttons[index].element.innerHTML;
          autoConfirm.timer = setInterval(delegate(self, autoConfirm.task), 1e3);
          autoConfirm.task(null, self);
        }
        return {
          main: function(_title, _message, _onok, _oncancel) {
            var title, message, onok, oncancel;
            switch (arguments.length) {
              case 1:
                message = _title;
                break;
              case 2:
                message = _title;
                onok = _message;
                break;
              case 3:
                message = _title;
                onok = _message;
                oncancel = _onok;
                break;
              case 4:
                title = _title;
                message = _message;
                onok = _onok;
                oncancel = _oncancel;
                break;
            }
            this.set("title", title);
            this.set("message", message);
            this.set("onok", onok);
            this.set("oncancel", oncancel);
            return this;
          },
          setup: function() {
            return {
              buttons: [{
                text: alertify.defaults.glossary.ok,
                key: keys.ENTER,
                className: alertify.defaults.theme.ok
              }, {
                text: alertify.defaults.glossary.cancel,
                key: keys.ESC,
                invokeOnClose: true,
                className: alertify.defaults.theme.cancel
              }],
              focus: {
                element: 0,
                select: false
              },
              options: {
                maximizable: false,
                resizable: false
              }
            };
          },
          build: function() {
          },
          prepare: function() {
          },
          setMessage: function(message) {
            this.setContent(message);
          },
          settings: {
            message: null,
            labels: null,
            onok: null,
            oncancel: null,
            defaultFocus: null,
            reverseButtons: null
          },
          settingUpdated: function(key, oldValue, newValue) {
            switch (key) {
              case "message":
                this.setMessage(newValue);
                break;
              case "labels":
                if ("ok" in newValue && this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].text = newValue.ok;
                  this.__internal.buttons[0].element.innerHTML = newValue.ok;
                }
                if ("cancel" in newValue && this.__internal.buttons[1].element) {
                  this.__internal.buttons[1].text = newValue.cancel;
                  this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                }
                break;
              case "reverseButtons":
                if (newValue === true) {
                  this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                } else {
                  this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                }
                break;
              case "defaultFocus":
                this.__internal.focus.element = newValue === "ok" ? 0 : 1;
                break;
            }
          },
          callback: function(closeEvent) {
            clearAutoConfirm(this);
            var returnValue;
            switch (closeEvent.index) {
              case 0:
                if (typeof this.get("onok") === "function") {
                  returnValue = this.get("onok").call(this, closeEvent);
                  if (typeof returnValue !== "undefined") {
                    closeEvent.cancel = !returnValue;
                  }
                }
                break;
              case 1:
                if (typeof this.get("oncancel") === "function") {
                  returnValue = this.get("oncancel").call(this, closeEvent);
                  if (typeof returnValue !== "undefined") {
                    closeEvent.cancel = !returnValue;
                  }
                }
                break;
            }
          },
          autoOk: function(duration) {
            startAutoConfirm(this, 0, duration);
            return this;
          },
          autoCancel: function(duration) {
            startAutoConfirm(this, 1, duration);
            return this;
          }
        };
      });
      alertify.dialog("prompt", function() {
        var input = document.createElement("INPUT");
        var p = document.createElement("P");
        return {
          main: function(_title, _message, _value, _onok, _oncancel) {
            var title, message, value, onok, oncancel;
            switch (arguments.length) {
              case 1:
                message = _title;
                break;
              case 2:
                message = _title;
                value = _message;
                break;
              case 3:
                message = _title;
                value = _message;
                onok = _value;
                break;
              case 4:
                message = _title;
                value = _message;
                onok = _value;
                oncancel = _onok;
                break;
              case 5:
                title = _title;
                message = _message;
                value = _value;
                onok = _onok;
                oncancel = _oncancel;
                break;
            }
            this.set("title", title);
            this.set("message", message);
            this.set("value", value);
            this.set("onok", onok);
            this.set("oncancel", oncancel);
            return this;
          },
          setup: function() {
            return {
              buttons: [{
                text: alertify.defaults.glossary.ok,
                key: keys.ENTER,
                className: alertify.defaults.theme.ok
              }, {
                text: alertify.defaults.glossary.cancel,
                key: keys.ESC,
                invokeOnClose: true,
                className: alertify.defaults.theme.cancel
              }],
              focus: {
                element: input,
                select: true
              },
              options: {
                maximizable: false,
                resizable: false
              }
            };
          },
          build: function() {
            input.className = alertify.defaults.theme.input;
            input.setAttribute("type", "text");
            input.value = this.get("value");
            this.elements.content.appendChild(p);
            this.elements.content.appendChild(input);
          },
          prepare: function() {
          },
          setMessage: function(message) {
            if (isString(message)) {
              clearContents(p);
              p.innerHTML = message;
            } else if (message instanceof window2.HTMLElement && p.firstChild !== message) {
              clearContents(p);
              p.appendChild(message);
            }
          },
          settings: {
            message: void 0,
            labels: void 0,
            onok: void 0,
            oncancel: void 0,
            value: "",
            type: "text",
            reverseButtons: void 0
          },
          settingUpdated: function(key, oldValue, newValue) {
            switch (key) {
              case "message":
                this.setMessage(newValue);
                break;
              case "value":
                input.value = newValue;
                break;
              case "type":
                switch (newValue) {
                  case "text":
                  case "color":
                  case "date":
                  case "datetime-local":
                  case "email":
                  case "month":
                  case "number":
                  case "password":
                  case "search":
                  case "tel":
                  case "time":
                  case "week":
                    input.type = newValue;
                    break;
                  default:
                    input.type = "text";
                    break;
                }
                break;
              case "labels":
                if (newValue.ok && this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue.ok;
                }
                if (newValue.cancel && this.__internal.buttons[1].element) {
                  this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                }
                break;
              case "reverseButtons":
                if (newValue === true) {
                  this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                } else {
                  this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                }
                break;
            }
          },
          callback: function(closeEvent) {
            var returnValue;
            switch (closeEvent.index) {
              case 0:
                this.settings.value = input.value;
                if (typeof this.get("onok") === "function") {
                  returnValue = this.get("onok").call(this, closeEvent, this.settings.value);
                  if (typeof returnValue !== "undefined") {
                    closeEvent.cancel = !returnValue;
                  }
                }
                break;
              case 1:
                if (typeof this.get("oncancel") === "function") {
                  returnValue = this.get("oncancel").call(this, closeEvent);
                  if (typeof returnValue !== "undefined") {
                    closeEvent.cancel = !returnValue;
                  }
                }
                if (!closeEvent.cancel) {
                  input.value = this.settings.value;
                }
                break;
            }
          }
        };
      });
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = alertify;
      } else if (typeof define === "function" && define.amd) {
        define([], function() {
          return alertify;
        });
      } else if (!window2.alertify) {
        window2.alertify = alertify;
      }
    })(typeof window !== "undefined" ? window : exports);
  }
});
export default require_alertify();
//# sourceMappingURL=alertifyjs.js.map
