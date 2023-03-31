/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 61:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(698)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 698:
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 687:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(61)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(687);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// CONCATENATED MODULE: ./src/renderer.ts




/// <reference types="@webgpu/types" />
var Renderer = /*#__PURE__*/function () {
  // API Data Structures

  // Frame Backings

  // Compute vars

  function Renderer(canvas) {
    _classCallCheck(this, Renderer);
    this.canvas = canvas;
  }
  _createClass(Renderer, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.initializeAPI();
            case 2:
              if (!_context.sent) {
                _context.next = 5;
                break;
              }
              _context.next = 5;
              return this.onResize();
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "initializeAPI",
    value: function () {
      var _initializeAPI = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee2() {
        var entry, wgSize, width, height, bufferNumElements;
        return regenerator_default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              entry = navigator.gpu;
              if (entry) {
                _context2.next = 5;
                break;
              }
              console.log("WebGPU may not be supported in your browser");
              return _context2.abrupt("return", false);
            case 5:
              _context2.next = 7;
              return entry.requestAdapter();
            case 7:
              this.adapter = _context2.sent;
              _context2.next = 10;
              return this.adapter.requestDevice();
            case 10:
              this.device = _context2.sent;
              this.queue = this.device.queue;
              wgSize = 256;
              width = this.canvas.width;
              height = this.canvas.height;
              this.numGroups = width * height / wgSize;
              this.pipeline = this.device.createComputePipeline({
                layout: 'auto',
                compute: {
                  module: this.device.createShaderModule({
                    code: this.computeShader(wgSize)
                  }),
                  entryPoint: 'main'
                }
              });

              // Allocate a buffer to hold the output
              bufferNumElements = width * height;
              this.outputBuffer = this.device.createBuffer({
                size: bufferNumElements * Uint32Array.BYTES_PER_ELEMENT,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
                // mappedAtCreation: true,
              });
              // const data = new Uint32Array(this.outputBuffer.getMappedRange());
              // for (let i = 0; i < bufferNumElements; ++i) {
              //     data[i] = 0xFF0000FF;
              // }
              // this.outputBuffer.unmap();

              this.bindGroup = this.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [{
                  binding: 0,
                  resource: {
                    buffer: this.outputBuffer
                  }
                }]
              });
              _context2.next = 26;
              break;
            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](0);
              console.error(_context2.t0);
              return _context2.abrupt("return", false);
            case 26:
              return _context2.abrupt("return", true);
            case 27:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 22]]);
      }));
      function initializeAPI() {
        return _initializeAPI.apply(this, arguments);
      }
      return initializeAPI;
    }()
  }, {
    key: "onResize",
    value: function () {
      var _onResize = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee3() {
        var canvasConfig;
        return regenerator_default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.context) {
                this.context = this.canvas.getContext('webgpu');
                canvasConfig = {
                  device: this.device,
                  format: 'bgra8unorm',
                  // format: 'rgba8unorm',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
                };
                this.context.configure(canvasConfig);
              }
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function onResize() {
        return _onResize.apply(this, arguments);
      }
      return onResize;
    }() // Called once per frame
  }, {
    key: "render",
    value: function render(dt) {
      var commandBuffers = Array();

      // Run the compute shader
      {
        var computeEncoder = this.device.createCommandEncoder();
        var pass = computeEncoder.beginComputePass();
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.dispatchWorkgroups(this.numGroups);
        pass.end();
        commandBuffers.push(computeEncoder.finish());
      }
      {
        var renderEncoder = this.device.createCommandEncoder();
        var colorTexture = this.context.getCurrentTexture();
        var imageCopyBuffer = {
          buffer: this.outputBuffer,
          rowsPerImage: this.canvas.height,
          bytesPerRow: this.canvas.width * 4
        };
        var imageCopyTexture = {
          texture: colorTexture
        };
        var extent = {
          width: this.canvas.width,
          height: this.canvas.height
        };
        renderEncoder.copyBufferToTexture(imageCopyBuffer, imageCopyTexture, extent);
        commandBuffers.push(renderEncoder.finish());
      }
      this.queue.submit(commandBuffers);
    }
  }, {
    key: "computeShader",
    value: function computeShader(wgSize) {
      var width = this.canvas.width;
      var height = this.canvas.height;
      var wgsl = "\n///////////////////////////////////////////////////////////////////////////////\n// Ray\n\nstruct ray {\n    orig : vec3<f32>,\n    dir : vec3<f32>,\n}\n\nfn ray_at(r: ray, t: f32) -> vec3<f32> {\n    return r.orig + t * r.dir;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Color\n\nalias color = vec3<f32>;\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Utils\nfn length_squared(v: vec3<f32>) -> f32 {\n    let l = length(v);\n    return l * l;\n}\n\nfn near_zero(v: vec3<f32>) -> bool {\n    const s = 1e-8;\n    return length(v) < s;\n}\n\nfn random_in_unit_sphere() -> vec3<f32> {\n    var p : vec3<f32>;\n    while (true) {\n        p = random_range_vec3f(-1, 1);\n        if (length_squared(p) >= 1) {\n            continue;\n        }\n        break;\n    }\n    return p;\n}\n\nfn random_unit_vector() -> vec3<f32> {\n    return normalize(random_in_unit_sphere());\n}\n\nfn random_in_hemisphere(normal: vec3<f32>) -> vec3<f32> {\n    let in_unit_sphere = random_in_unit_sphere();\n    if (dot(in_unit_sphere, normal) > 0.0) { // In the same hemisphere as the normal\n        return in_unit_sphere;\n    }\n    else {\n        return -in_unit_sphere;\n    }\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable\nstruct hit_record {\n    p: vec3<f32>,\n    normal: vec3<f32>,\n    t: f32,\n    front_face: bool,\n    mat: material,\n}\n\nfn hit_record_set_face_normal(rec: ptr<function, hit_record>, r: ray, outward_normal: vec3<f32>) {\n    (*rec).front_face = dot(r.dir, outward_normal) < 0.0;\n    if ((*rec).front_face) {\n        (*rec).normal = outward_normal;\n    } else {\n        (*rec).normal = -outward_normal;\n    }\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Material\n\nalias material_type = u32;\nconst MATERIAL_LAMBERTIAN:  material_type = 0;\nconst MATERIAL_METAL:       material_type = 1;\nconst MATERIAL_DIELECTRIC:  material_type = 2;\n\nstruct lambertian_material {\n    albedo : color,\n}\n\nstruct metal_material {\n    albedo: color,\n    fuzz: f32,\n}\n\nstruct dielectric_material {\n    ir: f32 // index of refraction\n}\n\nstruct material {\n    // NOTE: ideally we'd use a discrimination union\n    ty: material_type,\n    lambertian: lambertian_material,\n    metal: metal_material,\n    dielectric: dielectric_material\n}\n\nfn material_create_lambertian(albedo: color) -> material {\n    var m: material;\n    m.ty = MATERIAL_LAMBERTIAN;\n    m.lambertian = lambertian_material(albedo);\n    return m;\n}\n\nfn material_create_metal(albedo: color, fuzz: f32) -> material {\n    var m: material;\n    m.ty = MATERIAL_METAL;\n    m.metal = metal_material(albedo, fuzz);\n    return m;\n}\n\nfn material_create_dielectric(ir: f32) -> material {\n    var m: material;\n    m.ty = MATERIAL_DIELECTRIC;\n    m.dielectric = dielectric_material(ir);\n    return m;\n}\n\n// For the input ray and hit on the input material, returns true if the ray bounces, and if so,\n// stores the color contribution (attenuation) from this material and the new bounce (scatter) ray.\nfn material_scatter(m: material, r_in: ray, rec: hit_record, attenuation: ptr<function, color>, scattered: ptr<function, ray>) -> bool {\n    if (m.ty == MATERIAL_LAMBERTIAN) {\n        var scatter_direction = rec.normal + random_unit_vector();\n\n        // Catch degenerate scatter direction\n        if (near_zero(scatter_direction)) {\n            scatter_direction = rec.normal;\n        }\n\n        *scattered = ray(rec.p, scatter_direction);\n        *attenuation = m.lambertian.albedo;\n        return true;\n\n    } else if (m.ty == MATERIAL_METAL) {\n        let reflected = reflect(normalize(r_in.dir), rec.normal);\n        *scattered = ray(rec.p, reflected + m.metal.fuzz * random_in_unit_sphere());\n        *attenuation = m.metal.albedo;\n        // Only bounce rays that reflect in the same direction as the incident normal\n        return dot((*scattered).dir, rec.normal) > 0;\n    \n    } else if (m.ty == MATERIAL_DIELECTRIC) {\n        *attenuation = color(1, 1, 1);\n        let refraction_ratio = select(m.dielectric.ir, 1.0 / m.dielectric.ir, rec.front_face);\n\n        let unit_direction = normalize(r_in.dir);\n        let cos_theta = min(dot(-unit_direction, rec.normal), 1.0);\n        let sin_theta = sqrt(1.0 - cos_theta * cos_theta);\n\n        let cannot_refract = (refraction_ratio * sin_theta) > 1.0;\n        var direction: vec3<f32>;\n\n        if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random_f32()) {\n            direction = reflect(unit_direction, rec.normal);\n        } else {\n            direction = refract(unit_direction, rec.normal, refraction_ratio);\n        }\n\n        *scattered = ray(rec.p, direction);\n        return true;\n    }\n\n    return false;\n}\n\nfn reflectance(cosine: f32, ref_idx: f32) -> f32 {\n    // Use Schlick's approximation for reflectance.\n    var r0 = (1-ref_idx) / (1+ref_idx);\n    r0 = r0*r0;\n    return r0 + (1-r0)*pow((1 - cosine),5);\n}\n\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Sphere\nstruct sphere {\n    center: vec3<f32>,\n    radius: f32,\n    mat: material, // TODO: index into storage buffer of materials\n}\n\nfn sphere_hit(s: sphere, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    let oc = r.orig - s.center;\n    let a = length_squared(r.dir);\n    let half_b = dot(oc, r.dir);\n    let c = length_squared(oc) - s.radius*s.radius;\n    let discriminant = half_b*half_b - a*c;\n\n    if (discriminant < 0) {\n        return false;\n    }\n\n    let sqrtd = sqrt(discriminant);\n\n    // Find the nearest root that lies in the acceptable range.\n    var root = (-half_b - sqrtd) / a;\n    if (root < t_min || t_max < root) {\n        root = (-half_b + sqrtd) / a;\n        if (root < t_min || t_max < root) {\n            return false;\n        }\n    }\n\n    (*rec).t = root;\n    (*rec).p = ray_at(r, (*rec).t);\n    let outward_normal = ((*rec).p - s.center) / s.radius;\n    hit_record_set_face_normal(rec, r, outward_normal);\n    (*rec).mat = s.mat;\n\n    return true;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable List\nconst MAX_NUM_SPHERES = 10;\nstruct hittable_list {\n    spheres: array<sphere, MAX_NUM_SPHERES>, // TODO: remove fixed size, make this a uniform input struct\n    spheres_size: u32,\n}\n\nfn hittable_list_add_sphere(list: ptr<function, hittable_list>, s: sphere) {\n    (*list).spheres[(*list).spheres_size] = s;\n    (*list).spheres_size += 1;\n}\n\nfn hittable_list_hit(list: ptr<function, hittable_list>, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    var temp_rec: hit_record;\n    var hit_anything = false;\n    var closest_so_far = t_max;\n\n    for (var i = 0u; i < (*list).spheres_size; i += 1u) {\n        let s = ((*list).spheres)[i];\n        // TODO: remove once we pass in this data as uniform\n        if (s.radius == 0.0) {\n            continue;\n        }\n        if (sphere_hit(s, r, t_min, closest_so_far, &temp_rec)) {\n            hit_anything = true;\n            closest_so_far = temp_rec.t;\n            *rec = temp_rec;\n        }\n    }\n    return hit_anything;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Camera\nstruct camera {\n    origin: vec3<f32>,\n    lower_left_corner: vec3<f32>,\n    horizontal: vec3<f32>,\n    vertical: vec3<f32>,\n}\n\nfn camera_create(aspect_ratio: f32) -> camera {\n    let viewport_height = 2.0;\n    let viewport_width = aspect_ratio * viewport_height;\n    const focal_length = 1.0;\n\n    let origin = vec3(0.0, 0.0, 0.0);\n    let horizontal = vec3(viewport_width, 0.0, 0.0);\n    let vertical = vec3(0.0, viewport_height, 0.0);\n    let lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);\n    return camera(origin, lower_left_corner, horizontal, vertical);\n}\n\nfn camera_get_ray(cam: ptr<function, camera>, u: f32, v: f32) -> ray {\n    return ray(\n        (*cam).origin,\n        (*cam).lower_left_corner + u * (*cam).horizontal + v * (*cam).vertical - (*cam).origin\n    );\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Random\n\n// Implementation copied from https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl\nvar<private> rand_seed : vec2<f32>;\n\nfn init_rand(invocation_id : u32, seed : vec4<f32>) {\n  rand_seed = seed.xz;\n  rand_seed = fract(rand_seed * cos(35.456+f32(invocation_id) * seed.yw));\n  rand_seed = fract(rand_seed * cos(41.235+f32(invocation_id) * seed.xw));\n}\n\n// Returns random value in [0.0, 1.0)\nfn random_f32() -> f32 {\n  rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);\n  rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);\n  return rand_seed.y;\n}\n\nfn random_range_f32(min: f32, max: f32) -> f32 {\n    return mix(min, max, random_f32());\n}\n\nfn random_vec3f() -> vec3<f32> {\n    return vec3(random_f32(), random_f32(), random_f32());\n}\n\nfn random_range_vec3f(min: f32, max: f32) -> vec3<f32> {\n    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Main\n\n@group(0) @binding(0)\nvar<storage, read_write> output : array<u32>;\n\nconst infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf\nconst pi = 3.1415926535897932385;\n\nfn ray_color(in_r: ray, world: ptr<function, hittable_list>, in_max_depth: i32) -> color {\n    // Book uses recursion for bouncing rays. We can't recurse in WGSL, so convert algorithm to procedural.\n    var r = in_r;\n    var c : color = color(1,1,1);\n    var rec: hit_record;\n    var max_depth = in_max_depth;\n\n    while (true) {\n        if (hittable_list_hit(world, r, 0.001, infinity, &rec)) {\n           var attenuation: color;\n           var scattered: ray;\n            if (material_scatter(rec.mat, r, rec, &attenuation, &scattered)) {\n                c *= attenuation;\n                r = scattered;\n            } else {\n                // Material does not contribute, final color is black\n                c *= color(0,0,0);\n                break;\n            }\n\n        } else {\n            // If we hit nothing, return a blue sky color (linear blend of ray direction with white and blue)\n            let unit_direction = normalize(r.dir);\n            let t = 0.5 * (unit_direction.y + 1.0);\n            c *= (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);\n            break;\n        }\n\n        // If we've exceeded the ray bounce limit, no more light is gathered.\n        max_depth -= 1;\n        if (max_depth <= 0) {\n            c *= color(0,0,0);\n            break;\n        }\n    }\n\n    return c;\n}\n\nfn color_to_u32(c: color) -> u32 {\n    let r = u32(c.r * 255.0);\n    let g = u32(c.g * 255.0);\n    let b = u32(c.b * 255.0);\n    let a = 255u;\n\n    // bgra8unorm\n    return (a << 24) | (r << 16) | (g << 8) | b;\n\n    // rgba8unorm\n    // return (a << 24) | (b << 16) | (g << 8) | r;\n}\n\nfn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {\n    var c = pixel_color;\n    // Divide the color by the number of samples.\n    c /= f32(samples_per_pixel);\n\n    // And gamma-correct for gamma=2.0.\n    c = sqrt(c);\n\n    output[offset] = color_to_u32(c);\n}\n\n@compute @workgroup_size(".concat(wgSize, ")\nfn main(\n    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,\n    ) {\n        init_rand(global_invocation_id.x, vec4(vec3<f32>(global_invocation_id), 1.0));\n\n        // Compute current x,y\n        let offset = global_invocation_id.x;\n        let x = f32(offset % ").concat(width, ");\n        let y = ").concat(height, " - f32(offset / ").concat(width, "); // Flip Y so Y+ is up\n\n        // Image\n        const aspect_ratio = ").concat(width, " / ").concat(height, ";\n        const image_width = ").concat(width, ";\n        const image_height = ").concat(height, ";\n        const samples_per_pixel = 100;\n        const max_depth = 50;\n\n        // World\n        var world: hittable_list;\n\n        let material_ground = material_create_lambertian(color(0.8, 0.8, 0.0));\n        let material_center = material_create_lambertian(color(0.1, 0.2, 0.5));\n        let material_left = material_create_dielectric(1.5);\n        let material_right = material_create_metal(color(0.8, 0.6, 0.2), 0.0);\n\n        hittable_list_add_sphere(&world, sphere(vec3( 0.0, -100.5, -1.0), 100.0, material_ground));\n        hittable_list_add_sphere(&world, sphere(vec3( 0.0,    0.0, -1.0),   0.5, material_center));\n        hittable_list_add_sphere(&world, sphere(vec3(-1.0,    0.0, -1.0),   0.5, material_left));\n        hittable_list_add_sphere(&world, sphere(vec3(-1.0,    0.0, -1.0),  -0.4, material_left));\n        hittable_list_add_sphere(&world, sphere(vec3( 1.0,    0.0, -1.0),   0.5, material_right));\n\n        // Camera\n        var cam = camera_create(aspect_ratio);\n\n        // Render\n        var pixel_color = color(0.0, 0.0, 0.0);\n        for (var i = 0; i < samples_per_pixel; i += 1) {\n            let u = (x + random_f32()) / (image_width - 1);\n            let v = (y + random_f32()) / (image_height - 1);\n            let r = camera_get_ray(&cam, u, v);\n            pixel_color += ray_color(r, &world, max_depth);\n        }\n\n        // Store color for current pixel\n        write_color(offset, pixel_color, samples_per_pixel);\n}\n///////////////////////////////////////////////////////////////////////////////\n        ");
      return wgsl;
    }
  }]);
  return Renderer;
}();

;// CONCATENATED MODULE: ./src/main.ts






var App = /*#__PURE__*/function () {
  function App(canvas) {
    _classCallCheck(this, App);
    _defineProperty(this, "elapsedTime", 0);
    _defineProperty(this, "keysPressed", {});
    canvas.width = canvas.height = 64 * 12;
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
  }
  _createClass(App, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        var _this = this;
        var updateLoop;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.init();
              _context.next = 3;
              return this.renderer.init();
            case 3:
              updateLoop = function updateLoop(timeStampMs) {
                // Compute delta time in seconds
                var dt = (timeStampMs - _this.lastTimeStampMs) / 1000;
                _this.lastTimeStampMs = timeStampMs;
                _this.render(dt);
                requestAnimationFrame(updateLoop);
              }; // Start the update loop
              this.lastTimeStampMs = performance.now();
              updateLoop(this.lastTimeStampMs);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function run() {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "render",
    value: function render(dt) {
      this.renderer.render(dt);
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      this.keysPressed[event.code] = true;
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(event) {
      delete this.keysPressed[event.code];
    }
  }]);
  return App;
}();
var canvas = document.getElementById('gfx');
var app = new App(canvas);
window.addEventListener("keydown", function (event) {
  app.onKeyDown(event);
}, true);
window.addEventListener("keyup", function (event) {
  app.onKeyUp(event);
}, true);
window.onload = function () {};
app.run();
})();

/******/ })()
;