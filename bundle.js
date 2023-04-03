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
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/common.js
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/vec3.js

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function vec3_length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = glMatrix.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function vec3_equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = (/* unused pure expression or super */ null && (subtract));
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = (/* unused pure expression or super */ null && (distance));
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (vec3_length));
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();
;// CONCATENATED MODULE: ./src/renderer.ts









function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/// <reference types="@webgpu/types" />


function Buf2Hex(buffer) {
  return _toConsumableArray(new Uint8Array(buffer)).map(function (x, i) {
    return (i % 4 == 0 ? '\n' : '') + x.toString(16).padStart(2, '0');
  }).join(' ');
}
;
function Merge() {
  for (var _len = arguments.length, buffers = new Array(_len), _key = 0; _key < _len; _key++) {
    buffers[_key] = arguments[_key];
  }
  var size = buffers.reduce(function (p, b) {
    return p + b.byteLength;
  }, 0);
  var merged = new Uint8Array(size);
  var offset = 0;
  buffers.forEach(function (b, i) {
    merged.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  });
  return merged;
}
function Copy(src, dst, offset) {
  new Uint8Array(dst, offset).set(new Uint8Array(src));
}
var DynamicBuffer = /*#__PURE__*/function () {
  function DynamicBuffer() {
    _classCallCheck(this, DynamicBuffer);
    _defineProperty(this, "count", 0);
  }
  _createClass(DynamicBuffer, [{
    key: "Add",
    value: function Add(in_buffer) {
      if (this.buffer === undefined) {
        this.buffer = in_buffer;
      } else {
        this.buffer = Merge(this.buffer, in_buffer);
      }
      this.count += 1;
    }
  }]);
  return DynamicBuffer;
}();
var Materials = /*#__PURE__*/function (_DynamicBuffer) {
  _inherits(Materials, _DynamicBuffer);
  var _super = _createSuper(Materials);
  function Materials() {
    _classCallCheck(this, Materials);
    return _super.apply(this, arguments);
  }
  _createClass(Materials, [{
    key: "AddLambertian",
    value:
    // /*            align(16) size(16) */ struct lambertian_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 1) size( 4) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*            align(16) size(16) */ struct metal_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   fuzz : f32;
    // /*                               */ };

    // /*           align(4) size(4) */ struct dielectric_material {
    // /* offset(0) align(4) size(4) */   ir : f32;
    // /*                            */ };

    // /*            align(16) size(64) */ struct material {
    // /* offset( 0) align( 4) size( 4) */   ty : u32;
    // /* offset( 4) align( 1) size(12) */   // -- implicit field alignment padding --;
    // /* offset(16) align(16) size(16) */   lambertian : lambertian_material;
    // /* offset(32) align(16) size(16) */   metal : metal_material;
    // /* offset(48) align( 4) size( 4) */   dielectric : dielectric_material;
    // /* offset(52) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };
    function AddLambertian(albedo) {
      var m = new ArrayBuffer(64);
      // ty
      new Uint32Array(m, 0).set([0]);
      // lambertian_material
      new Float32Array(m, 16).set([albedo[0], albedo[1], albedo[2]]);
      this.Add(m);
    }
  }, {
    key: "AddMetal",
    value: function AddMetal(albedo, fuzz) {
      var m = new ArrayBuffer(64);
      // ty
      new Uint32Array(m, 0).set([1]);
      // metal_material
      new Float32Array(m, 32).set([albedo[0], albedo[1], albedo[2], fuzz]);
      this.Add(m);
    }
  }, {
    key: "AddDieletric",
    value: function AddDieletric(ir) {
      var m = new ArrayBuffer(64);
      // ty
      new Uint32Array(m, 0).set([2]);
      // dielectric_material
      new Float32Array(m, 48).set([ir]);
      this.Add(m);
    }
  }]);
  return Materials;
}(DynamicBuffer);
var HittableList = /*#__PURE__*/function (_DynamicBuffer2) {
  _inherits(HittableList, _DynamicBuffer2);
  var _super2 = _createSuper(HittableList);
  function HittableList() {
    _classCallCheck(this, HittableList);
    return _super2.apply(this, arguments);
  }
  _createClass(HittableList, [{
    key: "AddSphere",
    value:
    // /*            align(16) size(32) */ struct sphere {
    // /* offset( 0) align(16) size(12) */   center : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   radius : f32;
    // /* offset(16) align( 4) size( 4) */   mat : u32;
    // /* offset(20) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*             align(16) size(???) */ struct hittable_list {
    // /* offset(  0) align(16) size(???) */   spheres : array<sphere, ?>;
    // /*                                 */ };
    function AddSphere(center, radius, mat) {
      var s = new ArrayBuffer(32);
      new Float32Array(s, 0).set([center[0], center[1], center[2]]);
      new Float32Array(s, 12).set([radius]);
      new Uint32Array(s, 16).set([mat]);
      this.Add(s);
    }
  }]);
  return HittableList;
}(DynamicBuffer);
var Renderer = /*#__PURE__*/function () {
  // API Data Structures

  // Frame Backings

  // Compute vars

  function Renderer(canvas) {
    _classCallCheck(this, Renderer);
    _defineProperty(this, "bindings", {
      output: 0,
      materials: 1,
      hittable_list: 2
    });
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
        var entry, wgSize, width, height, bufferNumElements, materials, world, code;
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

              // Output buffer
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
              // Materials buffer
              materials = new Materials();
              materials.AddLambertian(fromValues(0.8, 0.8, 0.0));
              materials.AddLambertian(fromValues(0.1, 0.2, 0.5));
              materials.AddDieletric(1.5);
              materials.AddMetal(fromValues(0.8, 0.6, 0.2), 0.0);
              this.materialsBuffer = this.device.createBuffer({
                size: materials.buffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true
              });
              Copy(materials.buffer, this.materialsBuffer.getMappedRange());
              this.materialsBuffer.unmap();
              // HittableList buffer
              world = new HittableList();
              world.AddSphere(fromValues(0.0, -100.5, -1.0), 100.0, 0);
              world.AddSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
              world.AddSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
              world.AddSphere(fromValues(-1.0, 0.0, -1.0), 0.5, 2);
              world.AddSphere(fromValues(-1.0, 0.0, -1.0), -0.4, 2);
              world.AddSphere(fromValues(1.0, 0.0, -1.0), 0.5, 3);
              this.hittableListBuffer = this.device.createBuffer({
                size: world.buffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true
              });
              Copy(world.buffer, this.hittableListBuffer.getMappedRange());
              this.hittableListBuffer.unmap();
              code = this.computeShader(wgSize, materials.count, world.count); // console.log(code);
              this.pipeline = this.device.createComputePipeline({
                layout: 'auto',
                compute: {
                  module: this.device.createShaderModule({
                    code: code
                  }),
                  entryPoint: 'main'
                }
              });
              this.bindGroup = this.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [{
                  binding: this.bindings.output,
                  resource: {
                    buffer: this.outputBuffer
                  }
                }, {
                  binding: this.bindings.materials,
                  resource: {
                    buffer: this.materialsBuffer
                  }
                }, {
                  binding: this.bindings.hittable_list,
                  resource: {
                    buffer: this.hittableListBuffer
                  }
                }]
              });
              _context2.next = 45;
              break;
            case 41:
              _context2.prev = 41;
              _context2.t0 = _context2["catch"](0);
              console.error(_context2.t0);
              return _context2.abrupt("return", false);
            case 45:
              return _context2.abrupt("return", true);
            case 46:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 41]]);
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
    value: function computeShader(wgSize, numMaterials, numSpheres) {
      var width = this.canvas.width;
      var height = this.canvas.height;
      var wgsl = "\n///////////////////////////////////////////////////////////////////////////////\n// Common\nalias material_index = u32;\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Ray\n\nstruct ray {\n    orig : vec3f,\n    dir : vec3f,\n}\n\nfn ray_at(r: ray, t: f32) -> vec3f {\n    return r.orig + t * r.dir;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Color\n\nalias color = vec3f;\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Utils\nfn length_squared(v: vec3f) -> f32 {\n    let l = length(v);\n    return l * l;\n}\n\nfn near_zero(v: vec3f) -> bool {\n    const s = 1e-8;\n    return length(v) < s;\n}\n\nfn random_in_unit_sphere() -> vec3f {\n    var p : vec3f;\n    while (true) {\n        p = random_range_vec3f(-1, 1);\n        if (length_squared(p) >= 1) {\n            continue;\n        }\n        break;\n    }\n    return p;\n}\n\nfn random_unit_vector() -> vec3f {\n    return normalize(random_in_unit_sphere());\n}\n\nfn random_in_hemisphere(normal: vec3f) -> vec3f {\n    let in_unit_sphere = random_in_unit_sphere();\n    if (dot(in_unit_sphere, normal) > 0.0) { // In the same hemisphere as the normal\n        return in_unit_sphere;\n    }\n    else {\n        return -in_unit_sphere;\n    }\n}\n\nfn random_in_unit_disk() -> vec3f {\n    var p : vec3f;\n    while (true) {\n        p = vec3f(random_range_f32(-1,1), random_range_f32(-1,1), 0);\n        if (length_squared(p) >= 1) {\n            continue;\n        }\n        break;\n    }\n    return p;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable\nstruct hit_record {\n    p: vec3f,\n    normal: vec3f,\n    t: f32,\n    front_face: bool,\n    mat: material_index,\n}\n\nfn hit_record_set_face_normal(rec: ptr<function, hit_record>, r: ray, outward_normal: vec3f) {\n    (*rec).front_face = dot(r.dir, outward_normal) < 0.0;\n    if ((*rec).front_face) {\n        (*rec).normal = outward_normal;\n    } else {\n        (*rec).normal = -outward_normal;\n    }\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Material\n\nalias material_type = u32;\nconst MATERIAL_LAMBERTIAN:  material_type = 0;\nconst MATERIAL_METAL:       material_type = 1;\nconst MATERIAL_DIELECTRIC:  material_type = 2;\n\nstruct lambertian_material {\n    albedo: color,\n}\n\nstruct metal_material {\n    albedo: color,\n    fuzz: f32,\n}\n\nstruct dielectric_material {\n    ir: f32 // index of refraction\n}\n\nstruct material {\n    // NOTE: ideally we'd use a discriminated union\n    ty: material_type,\n    lambertian: lambertian_material,\n    metal: metal_material,\n    dielectric: dielectric_material\n}\n\nconst NUM_MATERIALS = ".concat(numMaterials, ";\n\n@group(0) @binding(").concat(this.bindings.materials, ")\nvar<uniform> materials: array<material, NUM_MATERIALS>;\n\n\n// For the input ray and hit on the input material, returns true if the ray bounces, and if so,\n// stores the color contribution (attenuation) from this material and the new bounce (scatter) ray.\nfn material_scatter(mat: material_index, r_in: ray, rec: hit_record, attenuation: ptr<function, color>, scattered: ptr<function, ray>) -> bool {\n    let m = materials[mat];\n    if (m.ty == MATERIAL_LAMBERTIAN) {\n        var scatter_direction = rec.normal + random_unit_vector();\n\n        // Catch degenerate scatter direction\n        if (near_zero(scatter_direction)) {\n            scatter_direction = rec.normal;\n        }\n\n        *scattered = ray(rec.p, scatter_direction);\n        *attenuation = m.lambertian.albedo;\n        return true;\n\n    } else if (m.ty == MATERIAL_METAL) {\n        let reflected = reflect(normalize(r_in.dir), rec.normal);\n        *scattered = ray(rec.p, reflected + m.metal.fuzz * random_in_unit_sphere());\n        *attenuation = m.metal.albedo;\n        // Only bounce rays that reflect in the same direction as the incident normal\n        return dot((*scattered).dir, rec.normal) > 0;\n    \n    } else if (m.ty == MATERIAL_DIELECTRIC) {\n        *attenuation = color(1, 1, 1);\n        let refraction_ratio = select(m.dielectric.ir, 1.0 / m.dielectric.ir, rec.front_face);\n\n        let unit_direction = normalize(r_in.dir);\n        let cos_theta = min(dot(-unit_direction, rec.normal), 1.0);\n        let sin_theta = sqrt(1.0 - cos_theta * cos_theta);\n\n        let cannot_refract = (refraction_ratio * sin_theta) > 1.0;\n        var direction: vec3f;\n\n        if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random_f32()) {\n            direction = reflect(unit_direction, rec.normal);\n        } else {\n            direction = refract(unit_direction, rec.normal, refraction_ratio);\n        }\n\n        *scattered = ray(rec.p, direction);\n        return true;\n    }\n\n    return false;\n}\n\nfn reflectance(cosine: f32, ref_idx: f32) -> f32 {\n    // Use Schlick's approximation for reflectance.\n    var r0 = (1-ref_idx) / (1+ref_idx);\n    r0 = r0*r0;\n    return r0 + (1-r0)*pow((1 - cosine),5);\n}\n\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Sphere\nstruct sphere {\n    center: vec3f,\n    radius: f32,\n    mat: material_index,\n}\n\nfn sphere_hit(sphere_index: u32, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    let s = &world.spheres[sphere_index];\n    let oc = r.orig - (*s).center;\n    let a = length_squared(r.dir);\n    let half_b = dot(oc, r.dir);\n    let c = length_squared(oc) - (*s).radius*(*s).radius;\n    let discriminant = half_b*half_b - a*c;\n\n    if (discriminant < 0) {\n        return false;\n    }\n\n    let sqrtd = sqrt(discriminant);\n\n    // Find the nearest root that lies in the acceptable range.\n    var root = (-half_b - sqrtd) / a;\n    if (root < t_min || t_max < root) {\n        root = (-half_b + sqrtd) / a;\n        if (root < t_min || t_max < root) {\n            return false;\n        }\n    }\n\n    (*rec).t = root;\n    (*rec).p = ray_at(r, (*rec).t);\n    let outward_normal = ((*rec).p - (*s).center) / (*s).radius;\n    hit_record_set_face_normal(rec, r, outward_normal);\n    (*rec).mat = (*s).mat;\n\n    return true;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable List\nconst NUM_SPHERES = ").concat(numSpheres, ";\nstruct hittable_list {\n    spheres: array<sphere, NUM_SPHERES>,\n}\n\n@group(0) @binding(").concat(this.bindings.hittable_list, ")\nvar<uniform> world: hittable_list;\n\nfn hittable_list_hit(r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    var temp_rec: hit_record;\n    var hit_anything = false;\n    var closest_so_far = t_max;\n\n    for (var i = 0u; i < NUM_SPHERES; i += 1u) {\n        let s = &world.spheres[i];\n        if (sphere_hit(i, r, t_min, closest_so_far, &temp_rec)) {\n            hit_anything = true;\n            closest_so_far = temp_rec.t;\n            *rec = temp_rec;\n        }\n    }\n    return hit_anything;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Camera\nstruct camera {\n    origin: vec3f,\n    lower_left_corner: vec3f,\n    horizontal: vec3f,\n    vertical: vec3f,\n    u : vec3f,\n    v : vec3f,\n    w : vec3f,\n    lens_radius : f32,\n}\n\nfn camera_create(\n        lookfrom: vec3f,\n        lookat: vec3f,\n        vup : vec3f,\n        vfov: f32, // vertical field-of-view in degrees\n        aspect_ratio: f32,\n        aperture : f32,\n        focus_dist: f32\n        ) -> camera {\n    let theta = radians(vfov);\n    let h = tan(theta/2);\n    let viewport_height = 2.0 * h;\n    let viewport_width = aspect_ratio * viewport_height;\n\n    // Note: vup, v, and w are all in the same plane\n    let w = normalize(lookfrom - lookat);\n    let u = normalize(cross(vup, w));\n    let v = cross(w, u);\n\n    let origin = lookfrom;\n    let horizontal = focus_dist * viewport_width * u;\n    let vertical = focus_dist * viewport_height * v;\n    let lower_left_corner = origin - horizontal/2 - vertical/2 - focus_dist * w;\n    let lens_radius = aperture / 2;\n\n    return camera(origin, lower_left_corner, horizontal, vertical, u, v, w, lens_radius);\n}\n\nfn camera_get_ray(cam: ptr<function, camera>, s: f32, t: f32) -> ray {\n    let rd = (*cam).lens_radius * random_in_unit_disk();\n    let offset = (*cam).u * rd.x + (*cam).v * rd.y;\n    return ray(\n        (*cam).origin + offset,\n        (*cam).lower_left_corner + s * (*cam).horizontal + t * (*cam).vertical - (*cam).origin - offset\n    );\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Random\n\n// Implementation copied from https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl\nvar<private> rand_seed : vec2<f32>;\n\nfn init_rand(invocation_id : u32, seed : vec4<f32>) {\n  rand_seed = seed.xz;\n  rand_seed = fract(rand_seed * cos(35.456+f32(invocation_id) * seed.yw));\n  rand_seed = fract(rand_seed * cos(41.235+f32(invocation_id) * seed.xw));\n}\n\n// Returns random value in [0.0, 1.0)\nfn random_f32() -> f32 {\n  rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);\n  rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);\n  return rand_seed.y;\n}\n\nfn random_range_f32(min: f32, max: f32) -> f32 {\n    return mix(min, max, random_f32());\n}\n\nfn random_vec3f() -> vec3f {\n    return vec3(random_f32(), random_f32(), random_f32());\n}\n\nfn random_range_vec3f(min: f32, max: f32) -> vec3f {\n    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Main\n\n@group(0) @binding(").concat(this.bindings.output, ")\nvar<storage, read_write> output : array<u32>;\n\nconst infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf\nconst pi = 3.1415926535897932385;\n\nfn ray_color(in_r: ray, in_max_depth: i32) -> color {\n    // Book uses recursion for bouncing rays. We can't recurse in WGSL, so convert algorithm to procedural.\n    var r = in_r;\n    var c : color = color(1,1,1);\n    var rec: hit_record;\n    var max_depth = in_max_depth;\n\n    while (true) {\n        if (hittable_list_hit(r, 0.001, infinity, &rec)) {\n           var attenuation: color;\n           var scattered: ray;\n            if (material_scatter(rec.mat, r, rec, &attenuation, &scattered)) {\n                c *= attenuation;\n                r = scattered;\n            } else {\n                // Material does not contribute, final color is black\n                c *= color(0,0,0);\n                break;\n            }\n\n        } else {\n            // If we hit nothing, return a blue sky color (linear blend of ray direction with white and blue)\n            let unit_direction = normalize(r.dir);\n            let t = 0.5 * (unit_direction.y + 1.0);\n            c *= (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);\n            break;\n        }\n\n        // If we've exceeded the ray bounce limit, no more light is gathered.\n        max_depth -= 1;\n        if (max_depth <= 0) {\n            c *= color(0,0,0);\n            break;\n        }\n    }\n\n    return c;\n}\n\nfn color_to_u32(c: color) -> u32 {\n    let r = u32(c.r * 255.0);\n    let g = u32(c.g * 255.0);\n    let b = u32(c.b * 255.0);\n    let a = 255u;\n\n    // bgra8unorm\n    return (a << 24) | (r << 16) | (g << 8) | b;\n\n    // rgba8unorm\n    // return (a << 24) | (b << 16) | (g << 8) | r;\n}\n\nfn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {\n    var c = pixel_color;\n    // Divide the color by the number of samples.\n    c /= f32(samples_per_pixel);\n\n    // And gamma-correct for gamma=2.0.\n    c = sqrt(c);\n\n    output[offset] = color_to_u32(c);\n}\n\n@compute @workgroup_size(").concat(wgSize, ")\nfn main(\n    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,\n    ) {\n        init_rand(global_invocation_id.x, vec4(vec3f(global_invocation_id), 1.0));\n\n        // Image\n        const aspect_ratio = ").concat(width, "f / ").concat(height, "f;\n\n        // Camera\n        let lookfrom = vec3f(3,3,2);\n        let lookat = vec3f(0,0,-1);\n        let vup = vec3f(0,1,0);\n        let dist_to_focus = length(lookfrom - lookat);\n        let aperture = 2.0;\n        let vfov = 20.0;\n        var cam = camera_create(lookfrom, lookat, vup, vfov, aspect_ratio, aperture, dist_to_focus);\n\n        // Render\n        // Compute current x,y\n        let offset = global_invocation_id.x;\n        let x = f32(offset % ").concat(width, ");\n        let y = ").concat(height, " - f32(offset / ").concat(width, "); // Flip Y so Y+ is up\n        const image_height = ").concat(height, ";\n        const image_width = ").concat(width, ";\n        const samples_per_pixel = 100;\n        const max_depth = 50;\n\n        var pixel_color = color(0.0, 0.0, 0.0);\n        for (var i = 0; i < samples_per_pixel; i += 1) {\n            let u = (x + random_f32()) / (image_width - 1);\n            let v = (y + random_f32()) / (image_height - 1);\n            let r = camera_get_ray(&cam, u, v);\n            pixel_color += ray_color(r, max_depth);\n        }\n\n        // Store color for current pixel\n        write_color(offset, pixel_color, samples_per_pixel);\n}\n///////////////////////////////////////////////////////////////////////////////\n        ");
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
    var aspect_ratio = 16 / 9;
    canvas.width = 64 * 13;
    canvas.height = canvas.width / aspect_ratio;
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