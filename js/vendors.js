(function (global, factory) {
  typeof exports === `object` && typeof module !== `undefined` ? factory(exports) :
    typeof define === `function` && define.amd ? define([`exports`], factory) :
      (global = typeof globalThis !== `undefined` ? globalThis : global || self, factory(global.IMask = {}));
}(this, (function (exports) {


  let commonjsGlobal = typeof globalThis !== `undefined` ? globalThis : typeof window !== `undefined` ? window : typeof global !== `undefined` ? global : typeof self !== `undefined` ? self : {};

  function createCommonjsModule(fn) {
    let module = {
      exports: {}
    };
    return fn(module, module.exports), module.exports;
  }

  let check = function (it) {
    return it && it.Math == Math && it;
  }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


  let global$1 = // eslint-disable-next-line no-undef
    check(typeof globalThis === `object` && globalThis) || check(typeof window === `object` && window) || check(typeof self === `object` && self) || check(typeof commonjsGlobal === `object` && commonjsGlobal) || // eslint-disable-next-line no-new-func
    function () {
      return this;
    }() || Function(`return this`)();

  let fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation


  let descriptors = !fails(function () {
    return Object.defineProperty({}, 1, {
      get() {
        return 7;
      }
    })[1] != 7;
  });

  let nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  let getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  let NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

  let f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    let descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  let objectPropertyIsEnumerable = {
    f
  };

  let createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value
    };
  };

  let toString = {}.toString;

  let classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  let split = ``.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

  let indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object(`z`).propertyIsEnumerable(0);
  }) ? function (it) {
      return classofRaw(it) == `String` ? split.call(it, ``) : Object(it);
    } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  let requireObjectCoercible = function (it) {
    if (it == undefined) {
      throw TypeError(`Can't call method on ` + it);
    }
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings


  let toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  let isObject = function (it) {
    return typeof it === `object` ? it !== null : typeof it === `function`;
  };

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string


  let toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) {
      return input;
    }
    let fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) === `function` && !isObject(val = fn.call(input))) {
      return val;
    }
    if (typeof (fn = input.valueOf) === `function` && !isObject(val = fn.call(input))) {
      return val;
    }
    if (!PREFERRED_STRING && typeof (fn = input.toString) === `function` && !isObject(val = fn.call(input))) {
      return val;
    }
    throw TypeError(`Can't convert object to primitive value`);
  };

  let hasOwnProperty = {}.hasOwnProperty;

  let has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  let document$1 = global$1.document; // typeof document.createElement is 'object' in old IE

  let EXISTS = isObject(document$1) && isObject(document$1.createElement);

  let documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty


  let ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement(`div`), `a`, {
      get() {
        return 7;
      }
    }).a != 7;
  });

  let nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

  let f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) {
      try {
        return nativeGetOwnPropertyDescriptor(O, P);
      } catch (error) {
      /* empty */
      }
    }
    if (has(O, P)) {
      return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
    }
  };

  let objectGetOwnPropertyDescriptor = {
    f: f$1
  };

  let anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ` is not an object`);
    }

    return it;
  };

  let nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty

  let f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) {
      try {
        return nativeDefineProperty(O, P, Attributes);
      } catch (error) {
      /* empty */
      }
    }
    if (`get` in Attributes || `set` in Attributes) {
      throw TypeError(`Accessors not supported`);
    }
    if (`value` in Attributes) {
      O[P] = Attributes.value;
    }
    return O;
  };

  let objectDefineProperty = {
    f: f$2
  };

  let createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  let setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global$1, key, value);
    } catch (error) {
      global$1[key] = value;
    }

    return value;
  };

  let SHARED = `__core-js_shared__`;
  let store = global$1[SHARED] || setGlobal(SHARED, {});
  let sharedStore = store;

  let functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

  if (typeof sharedStore.inspectSource !== `function`) {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  let inspectSource = sharedStore.inspectSource;

  let WeakMap = global$1.WeakMap;
  let nativeWeakMap = typeof WeakMap === `function` && /native code/.test(inspectSource(WeakMap));

  let shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })(`versions`, []).push({
      version: `3.8.3`,
      mode: `global`,
      copyright: `© 2021 Denis Pushkarev (zloirock.ru)`
    });
  });

  let id = 0;
  let postfix = Math.random();

  let uid = function (key) {
    return `Symbol(` + String(key === undefined ? `` : key) + `)_` + (++id + postfix).toString(36);
  };

  let keys = shared(`keys`);

  let sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  let hiddenKeys = {};

  let WeakMap$1 = global$1.WeakMap;
  let set, get, has$1;

  let enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  let getterFor = function (TYPE) {
    return function (it) {
      let state;

      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError(`Incompatible receiver, ` + TYPE + ` required`);
      }

      return state;
    };
  };

  if (nativeWeakMap) {
    let store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
    let wmget = store$1.get;
    let wmhas = store$1.has;
    let wmset = store$1.set;

    set = function (it, metadata) {
      metadata.facade = it;
      wmset.call(store$1, it, metadata);
      return metadata;
    };

    get = function (it) {
      return wmget.call(store$1, it) || {};
    };

    has$1 = function (it) {
      return wmhas.call(store$1, it);
    };
  } else {
    let STATE = sharedKey(`state`);
    hiddenKeys[STATE] = true;

    set = function (it, metadata) {
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };

    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };

    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  let internalState = {
    set,
    get,
    has: has$1,
    enforce,
    getterFor
  };

  let redefine = createCommonjsModule(function (module) {
    let getInternalState = internalState.get;
    let enforceInternalState = internalState.enforce;
    let TEMPLATE = String(String).split(`String`);
    (module.exports = function (O, key, value, options) {
      let unsafe = options ? !!options.unsafe : false;
      let simple = options ? !!options.enumerable : false;
      let noTargetGet = options ? !!options.noTargetGet : false;
      let state;

      if (typeof value === `function`) {
        if (typeof key === `string` && !has(value, `name`)) {
          createNonEnumerableProperty(value, `name`, key);
        }

        state = enforceInternalState(value);

        if (!state.source) {
          state.source = TEMPLATE.join(typeof key === `string` ? key : ``);
        }
      }

      if (O === global$1) {
        if (simple) {
          O[key] = value;
        } else {
          setGlobal(key, value);
        }
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }

      if (simple) {
        O[key] = value;
      } else {
        createNonEnumerableProperty(O, key, value);
      } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, `toString`, function toString() {
      return typeof this === `function` && getInternalState(this).source || inspectSource(this);
    });
  });

  let path = global$1;

  let aFunction = function (variable) {
    return typeof variable === `function` ? variable : undefined;
  };

  let getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global$1[namespace]) : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
  };

  let ceil = Math.ceil;
  let floor = Math.floor; // `ToInteger` abstract operation
  // https://tc39.es/ecma262/#sec-tointeger

  let toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  let min = Math.min; // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength

  let toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  let max = Math.max;
  let min$1 = Math.min; // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

  let toAbsoluteIndex = function (index, length) {
    let integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation


  let createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      let O = toIndexedObject($this);
      let length = toLength(O.length);
      let index = toAbsoluteIndex(fromIndex, length);
      let value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el) {
        while (length > index) {
          value = O[index++]; // eslint-disable-next-line no-self-compare

          if (value != value) {
            return true;
          } // Array#indexOf ignores holes, Array#includes - not
        }
      } else {
        for (; length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el) {
            return IS_INCLUDES || index || 0;
          }
        }
      }
      return !IS_INCLUDES && -1;
    };
  };

  let arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  let indexOf = arrayIncludes.indexOf;


  let objectKeysInternal = function (object, names) {
    let O = toIndexedObject(object);
    let i = 0;
    let result = [];
    let key;

    for (key in O) {
      !has(hiddenKeys, key) && has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys


    while (names.length > i) {
      if (has(O, key = names[i++])) {
        ~indexOf(result, key) || result.push(key);
      }
    }

    return result;
  };

  // IE8- don't enum bug keys
  let enumBugKeys = [`constructor`, `hasOwnProperty`, `isPrototypeOf`, `propertyIsEnumerable`, `toLocaleString`, `toString`, `valueOf`];

  let hiddenKeys$1 = enumBugKeys.concat(`length`, `prototype`); // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames

  let f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  let objectGetOwnPropertyNames = {
    f: f$3
  };

  let f$4 = Object.getOwnPropertySymbols;

  let objectGetOwnPropertySymbols = {
    f: f$4
  };

  // all object keys, includes non-enumerable and symbols


  let ownKeys = getBuiltIn(`Reflect`, `ownKeys`) || function ownKeys(it) {
    let keys = objectGetOwnPropertyNames.f(anObject(it));
    let getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  let copyConstructorProperties = function (target, source) {
    let keys = ownKeys(source);
    let defineProperty = objectDefineProperty.f;
    let getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (!has(target, key)) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };

  let replacement = /#|\.prototype\./;

  let isForced = function (feature, detection) {
    let value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : typeof detection === `function` ? fails(detection) : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, `.`).toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = `N`;
  var POLYFILL = isForced.POLYFILL = `P`;
  let isForced_1 = isForced;

  let getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;


  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */


  let _export = function (options, source) {
    let TARGET = options.target;
    let GLOBAL = options.global;
    let STATIC = options.stat;
    let FORCED, target, key, targetProperty, sourceProperty, descriptor;

    if (GLOBAL) {
      target = global$1;
    } else if (STATIC) {
      target = global$1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$1[TARGET] || {}).prototype;
    }

    if (target) {
      for (key in source) {
        sourceProperty = source[key];

        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor$1(target, key);
          targetProperty = descriptor && descriptor.value;
        } else {
          targetProperty = target[key];
        }

        FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? `.` : `#`) + key, options.forced); // contained in target

        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty === typeof targetProperty) {
            continue;
          }
          copyConstructorProperties(sourceProperty, targetProperty);
        } // add a flag to not completely full polyfills


        if (options.sham || targetProperty && targetProperty.sham) {
          createNonEnumerableProperty(sourceProperty, `sham`, true);
        } // extend global


        redefine(target, key, sourceProperty, options);
      }
    }
  };

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys


  let objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject


  let toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  let nativeAssign = Object.assign;
  let defineProperty = Object.defineProperty; // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign

  let objectAssign = !nativeAssign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && nativeAssign({
      b: 1
    }, nativeAssign(defineProperty({}, `a`, {
      enumerable: true,
      get() {
        defineProperty(this, `b`, {
          value: 3,
          enumerable: false
        });
      }
    }), {
      b: 2
    })).b !== 1) {
      return true;
    } // should work with symbols and should have deterministic property order (V8 bug)

    let A = {};
    let B = {}; // eslint-disable-next-line no-undef

    let symbol = Symbol();
    let alphabet = `abcdefghijklmnopqrst`;
    A[symbol] = 7;
    alphabet.split(``).forEach(function (chr) {
      B[chr] = chr;
    });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join(``) != alphabet;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
      let T = toObject(target);
      let argumentsLength = arguments.length;
      let index = 1;
      let getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      let propertyIsEnumerable = objectPropertyIsEnumerable.f;

      while (argumentsLength > index) {
        let S = indexedObject(arguments[index++]);
        let keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
        let length = keys.length;
        let j = 0;
        var key;

        while (length > j) {
          key = keys[j++];
          if (!descriptors || propertyIsEnumerable.call(S, key)) {
            T[key] = S[key];
          }
        }
      }

      return T;
    } : nativeAssign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign


  _export({
    target: `Object`,
    stat: true,
    forced: Object.assign !== objectAssign
  }, {
    assign: objectAssign
  });

  // `String.prototype.repeat` method implementation
  // https://tc39.es/ecma262/#sec-string.prototype.repeat


  let stringRepeat = ``.repeat || function repeat(count) {
    let str = String(requireObjectCoercible(this));
    let result = ``;
    let n = toInteger(count);
    if (n < 0 || n == Infinity) {
      throw RangeError(`Wrong number of repetitions`);
    }

    for (; n > 0;
      (n >>>= 1) && (str += str)) {
      if (n & 1) {
        result += str;
      }
    }

    return result;
  };

  // https://github.com/tc39/proposal-string-pad-start-end


  let ceil$1 = Math.ceil; // `String.prototype.{ padStart, padEnd }` methods implementation

  let createMethod$1 = function (IS_END) {
    return function ($this, maxLength, fillString) {
      let S = String(requireObjectCoercible($this));
      let stringLength = S.length;
      let fillStr = fillString === undefined ? ` ` : String(fillString);
      let intMaxLength = toLength(maxLength);
      let fillLen, stringFiller;
      if (intMaxLength <= stringLength || fillStr == ``) {
        return S;
      }
      fillLen = intMaxLength - stringLength;
      stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) {
        stringFiller = stringFiller.slice(0, fillLen);
      }
      return IS_END ? S + stringFiller : stringFiller + S;
    };
  };

  let stringPad = {
    // `String.prototype.padStart` method
    // https://tc39.es/ecma262/#sec-string.prototype.padstart
    start: createMethod$1(false),
    // `String.prototype.padEnd` method
    // https://tc39.es/ecma262/#sec-string.prototype.padend
    end: createMethod$1(true)
  };

  let engineUserAgent = getBuiltIn(`navigator`, `userAgent`) || ``;

  // https://github.com/zloirock/core-js/issues/280
  // eslint-disable-next-line unicorn/no-unsafe-regex


  let stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

  let $padEnd = stringPad.end;

  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend


  _export({
    target: `String`,
    proto: true,
    forced: stringPadWebkitBug
  }, {
    padEnd: function padEnd(maxLength
        /* , fillString = ' ' */
    ) {
      return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  let $padStart = stringPad.start;

  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart


  _export({
    target: `String`,
    proto: true,
    forced: stringPadWebkitBug
  }, {
    padStart: function padStart(maxLength
        /* , fillString = ' ' */
    ) {
      return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `String.prototype.repeat` method
  // https://tc39.es/ecma262/#sec-string.prototype.repeat


  _export({
    target: `String`,
    proto: true
  }, {
    repeat: stringRepeat
  });

  // `globalThis` object
  // https://tc39.es/ecma262/#sec-globalthis


  _export({
    global: true
  }, {
    globalThis: global$1
  });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === `function` && typeof Symbol.iterator === `symbol`) {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === `function` && obj.constructor === Symbol && obj !== Symbol.prototype ? `symbol` : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError(`Cannot call a class as a function`);
    }
  }

  function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      let descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if (`value` in descriptor) {
        descriptor.writable = true;
      }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
      _defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
      _defineProperties(Constructor, staticProps);
    }
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== `function` && superClass !== null) {
      throw new TypeError(`Super expression must either be null or a function`);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) {
      _setPrototypeOf(subClass, superClass);
    }
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === `undefined` || !Reflect.construct) {
      return false;
    }
    if (Reflect.construct.sham) {
      return false;
    }
    if (typeof Proxy === `function`) {
      return true;
    }

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) {
      return {};
    }
    let target = {};
    let sourceKeys = Object.keys(source);
    let key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) {
        continue;
      }
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) {
      return {};
    }

    let target = _objectWithoutPropertiesLoose(source, excluded);

    let key, i;

    if (Object.getOwnPropertySymbols) {
      let sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) {
          continue;
        }
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
          continue;
        }
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(`this hasn't been initialised - super() hasn't been called`);
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === `object` || typeof call === `function`)) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    let hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      let Super = _getPrototypeOf(Derived),
        result;

      if (hasNativeReflectConstruct) {
        let NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) {
        break;
      }
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== `undefined` && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        let base = _superPropBase(target, property);

        if (!base) {
          return;
        }
        let desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set$1(target, property, value, receiver) {
    if (typeof Reflect !== `undefined` && Reflect.set) {
      set$1 = Reflect.set;
    } else {
      set$1 = function set(target, property, value, receiver) {
        let base = _superPropBase(target, property);

        let desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set$1(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    let s = set$1(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error(`failed to set property`);
    }

    return value;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) {
      return arr;
    }
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === `undefined` || !(Symbol.iterator in Object(arr))) {
      return;
    }
    let _arr = [];
    let _n = true;
    let _d = false;
    let _e;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) {
          break;
        }
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i[`return`] != null) {
          _i[`return`]();
        }
      } finally {
        if (_d) {
          throw _e;
        }
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
      return;
    }
    if (typeof o === `string`) {
      return _arrayLikeToArray(o, minLen);
    }
    let n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === `Object` && o.constructor) {
      n = o.constructor.name;
    }
    if (n === `Map` || n === `Set`) {
      return Array.from(o);
    }
    if (n === `Arguments` || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
      return _arrayLikeToArray(o, minLen);
    }
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) {
      len = arr.length;
    }

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }

  /** Checks if value is string */
  function isString(str) {
    return typeof str === `string` || str instanceof String;
  }
  /**
    Direction
    @prop {string} NONE
    @prop {string} LEFT
    @prop {string} FORCE_LEFT
    @prop {string} RIGHT
    @prop {string} FORCE_RIGHT
  */

  let DIRECTION = {
    NONE: `NONE`,
    LEFT: `LEFT`,
    FORCE_LEFT: `FORCE_LEFT`,
    RIGHT: `RIGHT`,
    FORCE_RIGHT: `FORCE_RIGHT`
  };
  /** */

  function forceDirection(direction) {
    switch (direction) {
      case DIRECTION.LEFT:
        return DIRECTION.FORCE_LEFT;

      case DIRECTION.RIGHT:
        return DIRECTION.FORCE_RIGHT;

      default:
        return direction;
    }
  }
  /** Escapes regular expression control chars */

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, `\\$1`);
  } // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes

  function objectIncludes(b, a) {
    if (a === b) {
      return true;
    }
    let arrA = Array.isArray(a),
      arrB = Array.isArray(b),
      i;

    if (arrA && arrB) {
      if (a.length != b.length) {
        return false;
      }

      for (i = 0; i < a.length; i++) {
        if (!objectIncludes(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    if (arrA != arrB) {
      return false;
    }

    if (a && b && _typeof(a) === `object` && _typeof(b) === `object`) {
      let dateA = a instanceof Date,
        dateB = b instanceof Date;
      if (dateA && dateB) {
        return a.getTime() == b.getTime();
      }
      if (dateA != dateB) {
        return false;
      }
      let regexpA = a instanceof RegExp,
        regexpB = b instanceof RegExp;
      if (regexpA && regexpB) {
        return a.toString() == b.toString();
      }
      if (regexpA != regexpB) {
        return false;
      }
      let keys = Object.keys(a); // if (keys.length !== Object.keys(b).length) return false;

      for (i = 0; i < keys.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
          return false;
        }
      }

      for (i = 0; i < keys.length; i++) {
        if (!objectIncludes(b[keys[i]], a[keys[i]])) {
          return false;
        }
      }

      return true;
    } else if (a && b && typeof a === `function` && typeof b === `function`) {
      return a.toString() === b.toString();
    }

    return false;
  }
  /** Selection range */

  /** Provides details of changing input */

  let ActionDetails = /* #__PURE__*/ function () {
    /** Current input value */

    /** Current cursor position */

    /** Old input value */

    /** Old selection */
    function ActionDetails(value, cursorPos, oldValue, oldSelection) {
      _classCallCheck(this, ActionDetails);

      this.value = value;
      this.cursorPos = cursorPos;
      this.oldValue = oldValue;
      this.oldSelection = oldSelection; // double check if left part was changed (autofilling, other non-standard input triggers)

      while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
        --this.oldSelection.start;
      }
    }
    /**
      Start changing position
      @readonly
    */


    _createClass(ActionDetails, [{
      key: `startChangePos`,
      get: function get() {
        return Math.min(this.cursorPos, this.oldSelection.start);
      }
      /**
        Inserted symbols count
        @readonly
      */

    }, {
      key: `insertedCount`,
      get: function get() {
        return this.cursorPos - this.startChangePos;
      }
      /**
        Inserted symbols
        @readonly
      */

    }, {
      key: `inserted`,
      get: function get() {
        return this.value.substr(this.startChangePos, this.insertedCount);
      }
      /**
        Removed symbols count
        @readonly
      */

    }, {
      key: `removedCount`,
      get: function get() {
        // Math.max for opposite operation
        return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
          this.oldValue.length - this.value.length, 0);
      }
      /**
        Removed symbols
        @readonly
      */

    }, {
      key: `removed`,
      get: function get() {
        return this.oldValue.substr(this.startChangePos, this.removedCount);
      }
      /**
        Unchanged head symbols
        @readonly
      */

    }, {
      key: `head`,
      get: function get() {
        return this.value.substring(0, this.startChangePos);
      }
      /**
        Unchanged tail symbols
        @readonly
      */

    }, {
      key: `tail`,
      get: function get() {
        return this.value.substring(this.startChangePos + this.insertedCount);
      }
      /**
        Remove direction
        @readonly
      */

    }, {
      key: `removeDirection`,
      get: function get() {
        if (!this.removedCount || this.insertedCount) {
          return DIRECTION.NONE;
        } // align right if delete at right or if range removed (event with backspace)

        return this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos ? DIRECTION.RIGHT : DIRECTION.LEFT;
      }
    }]);

    return ActionDetails;
  }();

  /**
    Provides details of changing model value
    @param {Object} [details]
    @param {string} [details.inserted] - Inserted symbols
    @param {boolean} [details.skip] - Can skip chars
    @param {number} [details.removeCount] - Removed symbols count
    @param {number} [details.tailShift] - Additional offset if any changes occurred before tail
  */
  let ChangeDetails = /* #__PURE__*/ function () {
    /** Inserted symbols */

    /** Can skip chars */

    /** Additional offset if any changes occurred before tail */

    /** Raw inserted is used by dynamic mask */
    function ChangeDetails(details) {
      _classCallCheck(this, ChangeDetails);

      Object.assign(this, {
        inserted: ``,
        rawInserted: ``,
        skip: false,
        tailShift: 0
      }, details);
    }
    /**
      Aggregate changes
      @returns {ChangeDetails} `this`
    */


    _createClass(ChangeDetails, [{
      key: `aggregate`,
      value: function aggregate(details) {
        this.rawInserted += details.rawInserted;
        this.skip = this.skip || details.skip;
        this.inserted += details.inserted;
        this.tailShift += details.tailShift;
        return this;
      }
      /** Total offset considering all changes */

    }, {
      key: `offset`,
      get: function get() {
        return this.tailShift + this.inserted.length;
      }
    }]);

    return ChangeDetails;
  }();

  /** Provides details of continuous extracted tail */
  let ContinuousTailDetails = /* #__PURE__*/ function () {
    /** Tail value as string */

    /** Tail start position */

    /** Start position */
    function ContinuousTailDetails() {
      let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ``;
      let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      let stop = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, ContinuousTailDetails);

      this.value = value;
      this.from = from;
      this.stop = stop;
    }

    _createClass(ContinuousTailDetails, [{
      key: `toString`,
      value: function toString() {
        return this.value;
      }
    }, {
      key: `extend`,
      value: function extend(tail) {
        this.value += String(tail);
      }
    }, {
      key: `appendTo`,
      value: function appendTo(masked) {
        return masked.append(this.toString(), {
          tail: true
        }).aggregate(masked._appendPlaceholder());
      }
    }, {
      key: `state`,
      get: function get() {
        return {
          value: this.value,
          from: this.from,
          stop: this.stop
        };
      },
      set: function set(state) {
        Object.assign(this, state);
      }
    }, {
      key: `shiftBefore`,
      value: function shiftBefore(pos) {
        if (this.from >= pos || !this.value.length) {
          return ``;
        }
        let shiftChar = this.value[0];
        this.value = this.value.slice(1);
        return shiftChar;
      }
    }]);

    return ContinuousTailDetails;
  }();

  /**
   * Applies mask on element.
   * @constructor
   * @param {HTMLInputElement|HTMLTextAreaElement|MaskElement} el - Element to apply mask
   * @param {Object} opts - Custom mask options
   * @return {InputMask}
   */
  function IMask(el) {
    let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // currently available only for input-like elements
    return new IMask.InputMask(el, opts);
  }

  /** Supported mask type */

  /** Provides common masking stuff */
  let Masked = /* #__PURE__*/ function () {
    // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773

    /** @type {Mask} */

    /** */
    // $FlowFixMe no ideas

    /** Transforms value before mask processing */

    /** Validates if value is acceptable */

    /** Does additional processing in the end of editing */

    /** Format typed value to string */

    /** Parse strgin to get typed value */

    /** Enable characters overwriting */

    /** */
    function Masked(opts) {
      _classCallCheck(this, Masked);

      this._value = ``;

      this._update(Object.assign({}, Masked.DEFAULTS, opts));

      this.isInitialized = true;
    }
    /** Sets and applies new options */


    _createClass(Masked, [{
      key: `updateOptions`,
      value: function updateOptions(opts) {
        if (!Object.keys(opts).length) {
          return;
        }
        this.withValueRefresh(this._update.bind(this, opts));
      }
      /**
        Sets new options
        @protected
      */

    }, {
      key: `_update`,
      value: function _update(opts) {
        Object.assign(this, opts);
      }
      /** Mask state */

    }, {
      key: `state`,
      get: function get() {
        return {
          _value: this.value
        };
      },
      set: function set(state) {
        this._value = state._value;
      }
      /** Resets value */

    }, {
      key: `reset`,
      value: function reset() {
        this._value = ``;
      }
      /** */

    }, {
      key: `value`,
      get: function get() {
        return this._value;
      },
      set: function set(value) {
        this.resolve(value);
      }
      /** Resolve new value */

    }, {
      key: `resolve`,
      value: function resolve(value) {
        this.reset();
        this.append(value, {
          input: true
        }, ``);
        this.doCommit();
        return this.value;
      }
      /** */

    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        this.reset();
        this.append(value, {}, ``);
        this.doCommit();
      }
      /** */

    }, {
      key: `typedValue`,
      get: function get() {
        return this.doParse(this.value);
      },
      set: function set(value) {
        this.value = this.doFormat(value);
      }
      /** Value that includes raw user input */

    }, {
      key: `rawInputValue`,
      get: function get() {
        return this.extractInput(0, this.value.length, {
          raw: true
        });
      },
      set: function set(value) {
        this.reset();
        this.append(value, {
          raw: true
        }, ``);
        this.doCommit();
      }
      /** */

    }, {
      key: `isComplete`,
      get: function get() {
        return true;
      }
      /** Finds nearest input position in direction */

    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos(cursorPos, direction) {
        return cursorPos;
      }
      /** Extracts value in range considering flags */

    }, {
      key: `extractInput`,
      value: function extractInput() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        return this.value.slice(fromPos, toPos);
      }
      /** Extracts tail in range */

    }, {
      key: `extractTail`,
      value: function extractTail() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
      }
      /** Appends tail */
      // $FlowFixMe no ideas

    }, {
      key: `appendTail`,
      value: function appendTail(tail) {
        if (isString(tail)) {
          tail = new ContinuousTailDetails(String(tail));
        }
        return tail.appendTo(this);
      }
      /** Appends char */

    }, {
      key: `_appendCharRaw`,
      value: function _appendCharRaw(ch) {
        if (!ch) {
          return new ChangeDetails();
        }
        this._value += ch;
        return new ChangeDetails({
          inserted: ch,
          rawInserted: ch
        });
      }
      /** Appends char */

    }, {
      key: `_appendChar`,
      value: function _appendChar(ch) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let checkTail = arguments.length > 2 ? arguments[2] : undefined;
        let consistentState = this.state;

        let details = this._appendCharRaw(this.doPrepare(ch, flags), flags);

        if (details.inserted) {
          let consistentTail;
          let appended = this.doValidate(flags) !== false;

          if (appended && checkTail != null) {
            // validation ok, check tail
            let beforeTailState = this.state;

            if (this.overwrite) {
              consistentTail = checkTail.state;
              checkTail.shiftBefore(this.value.length);
            }

            let tailDetails = this.appendTail(checkTail);
            appended = tailDetails.rawInserted === checkTail.toString(); // if ok, rollback state after tail

            if (appended && tailDetails.inserted) {
              this.state = beforeTailState;
            }
          } // revert all if something went wrong


          if (!appended) {
            details = new ChangeDetails();
            this.state = consistentState;
            if (checkTail && consistentTail) {
              checkTail.state = consistentTail;
            }
          }
        }

        return details;
      }
      /** Appends optional placeholder at end */

    }, {
      key: `_appendPlaceholder`,
      value: function _appendPlaceholder() {
        return new ChangeDetails();
      }
      /** Appends symbols considering flags */
      // $FlowFixMe no ideas

    }, {
      key: `append`,
      value: function append(str, flags, tail) {
        if (!isString(str)) {
          throw new Error(`value should be string`);
        }
        let details = new ChangeDetails();
        let checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
        if (flags && flags.tail) {
          flags._beforeTailState = this.state;
        }

        for (let ci = 0; ci < str.length; ++ci) {
          details.aggregate(this._appendChar(str[ci], flags, checkTail));
        } // append tail but aggregate only tailShift


        if (checkTail != null) {
          details.tailShift += this.appendTail(checkTail).tailShift; // TODO it's a good idea to clear state after appending ends
          // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
          // this._resetBeforeTailState();
        }

        return details;
      }
      /** */

    }, {
      key: `remove`,
      value: function remove() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
        return new ChangeDetails();
      }
      /** Calls function and reapplies current value */

    }, {
      key: `withValueRefresh`,
      value: function withValueRefresh(fn) {
        if (this._refreshing || !this.isInitialized) {
          return fn();
        }
        this._refreshing = true;
        let rawInput = this.rawInputValue;
        let value = this.value;
        let ret = fn();
        this.rawInputValue = rawInput; // append lost trailing chars at end

        if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
          this.append(value.slice(this.value.length), {}, ``);
        }

        delete this._refreshing;
        return ret;
      }
      /** */

    }, {
      key: `runIsolated`,
      value: function runIsolated(fn) {
        if (this._isolated || !this.isInitialized) {
          return fn(this);
        }
        this._isolated = true;
        let state = this.state;
        let ret = fn(this);
        this.state = state;
        delete this._isolated;
        return ret;
      }
      /**
        Prepares string before mask processing
        @protected
      */

    }, {
      key: `doPrepare`,
      value: function doPrepare(str) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this.prepare ? this.prepare(str, this, flags) : str;
      }
      /**
        Validates if value is acceptable
        @protected
      */

    }, {
      key: `doValidate`,
      value: function doValidate(flags) {
        return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
      }
      /**
        Does additional processing in the end of editing
        @protected
      */

    }, {
      key: `doCommit`,
      value: function doCommit() {
        if (this.commit) {
          this.commit(this.value, this);
        }
      }
      /** */

    }, {
      key: `doFormat`,
      value: function doFormat(value) {
        return this.format ? this.format(value, this) : value;
      }
      /** */

    }, {
      key: `doParse`,
      value: function doParse(str) {
        return this.parse ? this.parse(str, this) : str;
      }
      /** */

    }, {
      key: `splice`,
      value: function splice(start, deleteCount, inserted, removeDirection) {
        let tailPos = start + deleteCount;
        let tail = this.extractTail(tailPos);
        let startChangePos = this.nearestInputPos(start, removeDirection);
        let changeDetails = new ChangeDetails({
          tailShift: startChangePos - start // adjust tailShift if start was aligned

        }).aggregate(this.remove(startChangePos)).aggregate(this.append(inserted, {
          input: true
        }, tail));
        return changeDetails;
      }
    }]);

    return Masked;
  }();
  Masked.DEFAULTS = {
    format: function format(v) {
      return v;
    },
    parse: function parse(v) {
      return v;
    }
  };
  IMask.Masked = Masked;

  /** Get Masked class by mask type */

  function maskedClass(mask) {
    if (mask == null) {
      throw new Error(`mask property should be defined`);
    } // $FlowFixMe


    if (mask instanceof RegExp) {
      return IMask.MaskedRegExp;
    } // $FlowFixMe

    if (isString(mask)) {
      return IMask.MaskedPattern;
    } // $FlowFixMe

    if (mask instanceof Date || mask === Date) {
      return IMask.MaskedDate;
    } // $FlowFixMe

    if (mask instanceof Number || typeof mask === `number` || mask === Number) {
      return IMask.MaskedNumber;
    } // $FlowFixMe

    if (Array.isArray(mask) || mask === Array) {
      return IMask.MaskedDynamic;
    } // $FlowFixMe

    if (IMask.Masked && mask.prototype instanceof IMask.Masked) {
      return mask;
    } // $FlowFixMe

    if (mask instanceof Function) {
      return IMask.MaskedFunction;
    } // $FlowFixMe

    if (mask instanceof IMask.Masked) {
      return mask.constructor;
    }
    console.warn(`Mask not found for mask`, mask); // eslint-disable-line no-console
    // $FlowFixMe

    return IMask.Masked;
  }
  /** Creates new {@link Masked} depending on mask type */

  function createMask(opts) {
    // $FlowFixMe
    if (IMask.Masked && opts instanceof IMask.Masked) {
      return opts;
    }
    opts = Object.assign({}, opts);
    let mask = opts.mask; // $FlowFixMe

    if (IMask.Masked && mask instanceof IMask.Masked) {
      return mask;
    }
    let MaskedClass = maskedClass(mask);
    if (!MaskedClass) {
      throw new Error(`Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.`);
    }
    return new MaskedClass(opts);
  }
  IMask.createMask = createMask;

  let DEFAULT_INPUT_DEFINITIONS = {
    '0': /\d/,
    'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    // http://stackoverflow.com/a/22075070
    '*': /./
  };
  /** */

  let PatternInputDefinition = /* #__PURE__*/ function () {
    /** */

    /** */

    /** */

    /** */

    /** */

    /** */
    function PatternInputDefinition(opts) {
      _classCallCheck(this, PatternInputDefinition);

      let mask = opts.mask,
        blockOpts = _objectWithoutProperties(opts, [`mask`]);

      this.masked = createMask({
        mask
      });
      Object.assign(this, blockOpts);
    }

    _createClass(PatternInputDefinition, [{
      key: `reset`,
      value: function reset() {
        this._isFilled = false;
        this.masked.reset();
      }
    }, {
      key: `remove`,
      value: function remove() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

        if (fromPos === 0 && toPos >= 1) {
          this._isFilled = false;
          return this.masked.remove(fromPos, toPos);
        }

        return new ChangeDetails();
      }
    }, {
      key: `value`,
      get: function get() {
        return this.masked.value || (this._isFilled && !this.isOptional ? this.placeholderChar : ``);
      }
    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this.masked.unmaskedValue;
      }
    }, {
      key: `isComplete`,
      get: function get() {
        return Boolean(this.masked.value) || this.isOptional;
      }
    }, {
      key: `_appendChar`,
      value: function _appendChar(str) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (this._isFilled) {
          return new ChangeDetails();
        }
        let state = this.masked.state; // simulate input

        let details = this.masked._appendChar(str, flags);

        if (details.inserted && this.doValidate(flags) === false) {
          details.inserted = details.rawInserted = ``;
          this.masked.state = state;
        }

        if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
          details.inserted = this.placeholderChar;
        }

        details.skip = !details.inserted && !this.isOptional;
        this._isFilled = Boolean(details.inserted);
        return details;
      }
    }, {
      key: `append`,
      value: function append() {
        let _this$masked;

        return (_this$masked = this.masked).append.apply(_this$masked, arguments);
      }
    }, {
      key: `_appendPlaceholder`,
      value: function _appendPlaceholder() {
        let details = new ChangeDetails();
        if (this._isFilled || this.isOptional) {
          return details;
        }
        this._isFilled = true;
        details.inserted = this.placeholderChar;
        return details;
      }
    }, {
      key: `extractTail`,
      value: function extractTail() {
        let _this$masked2;

        return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
      }
    }, {
      key: `appendTail`,
      value: function appendTail() {
        let _this$masked3;

        return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
      }
    }, {
      key: `extractInput`,
      value: function extractInput() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        let flags = arguments.length > 2 ? arguments[2] : undefined;
        return this.masked.extractInput(fromPos, toPos, flags);
      }
    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos(cursorPos) {
        let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
        let minPos = 0;
        let maxPos = this.value.length;
        let boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);

        switch (direction) {
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT:
            return this.isComplete ? boundPos : minPos;

          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT:
            return this.isComplete ? boundPos : maxPos;

          case DIRECTION.NONE:
          default:
            return boundPos;
        }
      }
    }, {
      key: `doValidate`,
      value: function doValidate() {
        let _this$masked4, _this$parent;

        return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
      }
    }, {
      key: `doCommit`,
      value: function doCommit() {
        this.masked.doCommit();
      }
    }, {
      key: `state`,
      get: function get() {
        return {
          masked: this.masked.state,
          _isFilled: this._isFilled
        };
      },
      set: function set(state) {
        this.masked.state = state.masked;
        this._isFilled = state._isFilled;
      }
    }]);

    return PatternInputDefinition;
  }();

  let PatternFixedDefinition = /* #__PURE__*/ function () {
    /** */

    /** */

    /** */

    /** */
    function PatternFixedDefinition(opts) {
      _classCallCheck(this, PatternFixedDefinition);

      Object.assign(this, opts);
      this._value = ``;
    }

    _createClass(PatternFixedDefinition, [{
      key: `value`,
      get: function get() {
        return this._value;
      }
    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this.isUnmasking ? this.value : ``;
      }
    }, {
      key: `reset`,
      value: function reset() {
        this._isRawInput = false;
        this._value = ``;
      }
    }, {
      key: `remove`,
      value: function remove() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
        this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
        if (!this._value) {
          this._isRawInput = false;
        }
        return new ChangeDetails();
      }
    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos(cursorPos) {
        let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
        let minPos = 0;
        let maxPos = this._value.length;

        switch (direction) {
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT:
            return minPos;

          case DIRECTION.NONE:
          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT:
          default:
            return maxPos;
        }
      }
    }, {
      key: `extractInput`,
      value: function extractInput() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
        let flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || ``;
      }
    }, {
      key: `isComplete`,
      get: function get() {
        return true;
      }
    }, {
      key: `_appendChar`,
      value: function _appendChar(str) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let details = new ChangeDetails();
        if (this._value) {
          return details;
        }
        let appended = this.char === str[0];
        let isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && !flags.tail;
        if (isResolved) {
          details.rawInserted = this.char;
        }
        this._value = details.inserted = this.char;
        this._isRawInput = isResolved && (flags.raw || flags.input);
        return details;
      }
    }, {
      key: `_appendPlaceholder`,
      value: function _appendPlaceholder() {
        let details = new ChangeDetails();
        if (this._value) {
          return details;
        }
        this._value = details.inserted = this.char;
        return details;
      }
    }, {
      key: `extractTail`,
      value: function extractTail() {
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        return new ContinuousTailDetails(``);
      } // $FlowFixMe no ideas

    }, {
      key: `appendTail`,
      value: function appendTail(tail) {
        if (isString(tail)) {
          tail = new ContinuousTailDetails(String(tail));
        }
        return tail.appendTo(this);
      }
    }, {
      key: `append`,
      value: function append(str, flags, tail) {
        let details = this._appendChar(str, flags);

        if (tail != null) {
          details.tailShift += this.appendTail(tail).tailShift;
        }

        return details;
      }
    }, {
      key: `doCommit`,
      value: function doCommit() {}
    }, {
      key: `state`,
      get: function get() {
        return {
          _value: this._value,
          _isRawInput: this._isRawInput
        };
      },
      set: function set(state) {
        Object.assign(this, state);
      }
    }]);

    return PatternFixedDefinition;
  }();

  let ChunksTailDetails = /* #__PURE__*/ function () {
    /** */
    function ChunksTailDetails() {
      let chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, ChunksTailDetails);

      this.chunks = chunks;
      this.from = from;
    }

    _createClass(ChunksTailDetails, [{
      key: `toString`,
      value: function toString() {
        return this.chunks.map(String).join(``);
      } // $FlowFixMe no ideas

    }, {
      key: `extend`,
      value: function extend(tailChunk) {
        if (!String(tailChunk)) {
          return;
        }
        if (isString(tailChunk)) {
          tailChunk = new ContinuousTailDetails(String(tailChunk));
        }
        let lastChunk = this.chunks[this.chunks.length - 1];
        let extendLast = lastChunk && ( // if stops are same or tail has no stop
          lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
          tailChunk.from === lastChunk.from + lastChunk.toString().length;

        if (tailChunk instanceof ContinuousTailDetails) {
          // check the ability to extend previous chunk
          if (extendLast) {
            // extend previous chunk
            lastChunk.extend(tailChunk.toString());
          } else {
            // append new chunk
            this.chunks.push(tailChunk);
          }
        } else if (tailChunk instanceof ChunksTailDetails) {
          if (tailChunk.stop == null) {
            // unwrap floating chunks to parent, keeping `from` pos
            let firstTailChunk;

            while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
              firstTailChunk = tailChunk.chunks.shift();
              firstTailChunk.from += tailChunk.from;
              this.extend(firstTailChunk);
            }
          } // if tail chunk still has value


          if (tailChunk.toString()) {
            // if chunks contains stops, then popup stop to container
            tailChunk.stop = tailChunk.blockIndex;
            this.chunks.push(tailChunk);
          }
        }
      }
    }, {
      key: `appendTo`,
      value: function appendTo(masked) {
        // $FlowFixMe
        if (!(masked instanceof IMask.MaskedPattern)) {
          let tail = new ContinuousTailDetails(this.toString());
          return tail.appendTo(masked);
        }

        let details = new ChangeDetails();

        for (let ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
          let chunk = this.chunks[ci];

          let lastBlockIter = masked._mapPosToBlock(masked.value.length);

          let stop = chunk.stop;
          let chunkBlock = void 0;

          if (stop != null && ( // if block not found or stop is behind lastBlock
            !lastBlockIter || lastBlockIter.index <= stop)) {
            if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
              masked._stops.indexOf(stop) >= 0) {
              details.aggregate(masked._appendPlaceholder(stop));
            }

            chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
          }

          if (chunkBlock) {
            let tailDetails = chunkBlock.appendTail(chunk);
            tailDetails.skip = false; // always ignore skip, it will be set on last

            details.aggregate(tailDetails);
            masked._value += tailDetails.inserted; // get not inserted chars

            let remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
            if (remainChars) {
              details.aggregate(masked.append(remainChars, {
                tail: true
              }));
            }
          } else {
            details.aggregate(masked.append(chunk.toString(), {
              tail: true
            }));
          }
        }
        return details;
      }
    }, {
      key: `state`,
      get: function get() {
        return {
          chunks: this.chunks.map(function (c) {
            return c.state;
          }),
          from: this.from,
          stop: this.stop,
          blockIndex: this.blockIndex
        };
      },
      set: function set(state) {
        let chunks = state.chunks,
          props = _objectWithoutProperties(state, [`chunks`]);

        Object.assign(this, props);
        this.chunks = chunks.map(function (cstate) {
          let chunk = `chunks` in cstate ? new ChunksTailDetails() : new ContinuousTailDetails(); // $FlowFixMe already checked above

          chunk.state = cstate;
          return chunk;
        });
      }
    }, {
      key: `shiftBefore`,
      value: function shiftBefore(pos) {
        if (this.from >= pos || !this.chunks.length) {
          return ``;
        }
        let chunkShiftPos = pos - this.from;
        let ci = 0;

        while (ci < this.chunks.length) {
          let chunk = this.chunks[ci];
          let shiftChar = chunk.shiftBefore(chunkShiftPos);

          if (chunk.toString()) {
            // chunk still contains value
            // but not shifted - means no more available chars to shift
            if (!shiftChar) {
              break;
            }
            ++ci;
          } else {
            // clean if chunk has no value
            this.chunks.splice(ci, 1);
          }

          if (shiftChar) {
            return shiftChar;
          }
        }

        return ``;
      }
    }]);

    return ChunksTailDetails;
  }();

  /** Masking by RegExp */

  let MaskedRegExp = /* #__PURE__*/ function (_Masked) {
    _inherits(MaskedRegExp, _Masked);

    let _super = _createSuper(MaskedRegExp);

    function MaskedRegExp() {
      _classCallCheck(this, MaskedRegExp);

      return _super.apply(this, arguments);
    }

    _createClass(MaskedRegExp, [{
      key: `_update`,
      value:
        /**
          @override
          @param {Object} opts
        */
        function _update(opts) {
          if (opts.mask) {
            opts.validate = function (value) {
              return value.search(opts.mask) >= 0;
            };
          }

          _get(_getPrototypeOf(MaskedRegExp.prototype), `_update`, this).call(this, opts);
        }
    }]);

    return MaskedRegExp;
  }(Masked);
  IMask.MaskedRegExp = MaskedRegExp;

  /**
    Pattern mask
    @param {Object} opts
    @param {Object} opts.blocks
    @param {Object} opts.definitions
    @param {string} opts.placeholderChar
    @param {boolean} opts.lazy
  */
  let MaskedPattern = /* #__PURE__*/ function (_Masked) {
    _inherits(MaskedPattern, _Masked);

    let _super = _createSuper(MaskedPattern);

    /** */

    /** */

    /** Single char for empty input */

    /** Show placeholder only when needed */
    function MaskedPattern() {
      let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, MaskedPattern);

      // TODO type $Shape<MaskedPatternOptions>={} does not work
      opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
      return _super.call(this, Object.assign({}, MaskedPattern.DEFAULTS, opts));
    }
    /**
      @override
      @param {Object} opts
    */


    _createClass(MaskedPattern, [{
      key: `_update`,
      value: function _update() {
        let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        opts.definitions = Object.assign({}, this.definitions, opts.definitions);

        _get(_getPrototypeOf(MaskedPattern.prototype), `_update`, this).call(this, opts);

        this._rebuildMask();
      }
      /** */

    }, {
      key: `_rebuildMask`,
      value: function _rebuildMask() {
        let _this = this;

        let defs = this.definitions;
        this._blocks = [];
        this._stops = [];
        this._maskedBlocks = {};
        let pattern = this.mask;
        if (!pattern || !defs) {
          return;
        }
        let unmaskingBlock = false;
        let optionalBlock = false;

        for (var i = 0; i < pattern.length; ++i) {
          if (this.blocks) {
            let _ret = function () {
              let p = pattern.slice(i);
              let bNames = Object.keys(_this.blocks).filter(function (bName) {
                return p.indexOf(bName) === 0;
              }); // order by key length

              bNames.sort(function (a, b) {
                return b.length - a.length;
              }); // use block name with max length

              let bName = bNames[0];

              if (bName) {
                // $FlowFixMe no ideas
                let maskedBlock = createMask(Object.assign({
                  parent: _this,
                  lazy: _this.lazy,
                  placeholderChar: _this.placeholderChar,
                  overwrite: _this.overwrite
                }, _this.blocks[bName]));

                if (maskedBlock) {
                  _this._blocks.push(maskedBlock); // store block index


                  if (!_this._maskedBlocks[bName]) {
                    _this._maskedBlocks[bName] = [];
                  }

                  _this._maskedBlocks[bName].push(_this._blocks.length - 1);
                }

                i += bName.length - 1;
                return `continue`;
              }
            }();

            if (_ret === `continue`) {
              continue;
            }
          }

          let char = pattern[i];

          let _isInput = (char in defs);

          if (char === MaskedPattern.STOP_CHAR) {
            this._stops.push(this._blocks.length);

            continue;
          }

          if (char === `{` || char === `}`) {
            unmaskingBlock = !unmaskingBlock;
            continue;
          }

          if (char === `[` || char === `]`) {
            optionalBlock = !optionalBlock;
            continue;
          }

          if (char === MaskedPattern.ESCAPE_CHAR) {
            ++i;
            char = pattern[i];
            if (!char) {
              break;
            }
            _isInput = false;
          }

          let def = _isInput ? new PatternInputDefinition({
            parent: this,
            lazy: this.lazy,
            placeholderChar: this.placeholderChar,
            mask: defs[char],
            isOptional: optionalBlock
          }) : new PatternFixedDefinition({
            char,
            isUnmasking: unmaskingBlock
          });

          this._blocks.push(def);
        }
      }
      /**
        @override
      */

    }, {
      key: `state`,
      get: function get() {
        return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), `state`, this), {
          _blocks: this._blocks.map(function (b) {
            return b.state;
          })
        });
      },
      set: function set(state) {
        let _blocks = state._blocks,
          maskedState = _objectWithoutProperties(state, [`_blocks`]);

        this._blocks.forEach(function (b, bi) {
          return b.state = _blocks[bi];
        });

        _set(_getPrototypeOf(MaskedPattern.prototype), `state`, maskedState, this, true);
      }
      /**
        @override
      */

    }, {
      key: `reset`,
      value: function reset() {
        _get(_getPrototypeOf(MaskedPattern.prototype), `reset`, this).call(this);

        this._blocks.forEach(function (b) {
          return b.reset();
        });
      }
      /**
        @override
      */

    }, {
      key: `isComplete`,
      get: function get() {
        return this._blocks.every(function (b) {
          return b.isComplete;
        });
      }
      /**
        @override
      */

    }, {
      key: `doCommit`,
      value: function doCommit() {
        this._blocks.forEach(function (b) {
          return b.doCommit();
        });

        _get(_getPrototypeOf(MaskedPattern.prototype), `doCommit`, this).call(this);
      }
      /**
        @override
      */

    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this._blocks.reduce(function (str, b) {
          return str += b.unmaskedValue;
        }, ``);
      },
      set: function set(unmaskedValue) {
        _set(_getPrototypeOf(MaskedPattern.prototype), `unmaskedValue`, unmaskedValue, this, true);
      }
      /**
        @override
      */

    }, {
      key: `value`,
      get: function get() {
        // TODO return _value when not in change?
        return this._blocks.reduce(function (str, b) {
          return str += b.value;
        }, ``);
      },
      set: function set(value) {
        _set(_getPrototypeOf(MaskedPattern.prototype), `value`, value, this, true);
      }
      /**
        @override
      */

    }, {
      key: `appendTail`,
      value: function appendTail(tail) {
        return _get(_getPrototypeOf(MaskedPattern.prototype), `appendTail`, this).call(this, tail).aggregate(this._appendPlaceholder());
      }
      /**
        @override
      */

    }, {
      key: `_appendCharRaw`,
      value: function _appendCharRaw(ch) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        let blockIter = this._mapPosToBlock(this.value.length);

        let details = new ChangeDetails();
        if (!blockIter) {
          return details;
        }

        for (let bi = blockIter.index; ; ++bi) {
          let _block = this._blocks[bi];
          if (!_block) {
            break;
          }

          let blockDetails = _block._appendChar(ch, flags);

          let skip = blockDetails.skip;
          details.aggregate(blockDetails);
          if (skip || blockDetails.rawInserted) {
            break;
          } // go next char
        }

        return details;
      }
      /**
        @override
      */

    }, {
      key: `extractTail`,
      value: function extractTail() {
        let _this2 = this;

        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        let chunkTail = new ChunksTailDetails();
        if (fromPos === toPos) {
          return chunkTail;
        }

        this._forEachBlocksInRange(fromPos, toPos, function (b, bi, bFromPos, bToPos) {
          let blockChunk = b.extractTail(bFromPos, bToPos);
          blockChunk.stop = _this2._findStopBefore(bi);
          blockChunk.from = _this2._blockStartPos(bi);
          if (blockChunk instanceof ChunksTailDetails) {
            blockChunk.blockIndex = bi;
          }
          chunkTail.extend(blockChunk);
        });

        return chunkTail;
      }
      /**
        @override
      */

    }, {
      key: `extractInput`,
      value: function extractInput() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        let flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        if (fromPos === toPos) {
          return ``;
        }
        let input = ``;

        this._forEachBlocksInRange(fromPos, toPos, function (b, _, fromPos, toPos) {
          input += b.extractInput(fromPos, toPos, flags);
        });

        return input;
      }
    }, {
      key: `_findStopBefore`,
      value: function _findStopBefore(blockIndex) {
        let stopBefore;

        for (let si = 0; si < this._stops.length; ++si) {
          let stop = this._stops[si];
          if (stop <= blockIndex) {
            stopBefore = stop;
          } else {
            break;
          }
        }

        return stopBefore;
      }
      /** Appends placeholder depending on laziness */

    }, {
      key: `_appendPlaceholder`,
      value: function _appendPlaceholder(toBlockIndex) {
        let _this3 = this;

        let details = new ChangeDetails();
        if (this.lazy && toBlockIndex == null) {
          return details;
        }

        let startBlockIter = this._mapPosToBlock(this.value.length);

        if (!startBlockIter) {
          return details;
        }
        let startBlockIndex = startBlockIter.index;
        let endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;

        this._blocks.slice(startBlockIndex, endBlockIndex).forEach(function (b) {
          if (!b.lazy || toBlockIndex != null) {
            // $FlowFixMe `_blocks` may not be present
            let args = b._blocks != null ? [b._blocks.length] : [];

            let bDetails = b._appendPlaceholder(...args);

            _this3._value += bDetails.inserted;
            details.aggregate(bDetails);
          }
        });

        return details;
      }
      /** Finds block in pos */

    }, {
      key: `_mapPosToBlock`,
      value: function _mapPosToBlock(pos) {
        let accVal = ``;

        for (let bi = 0; bi < this._blocks.length; ++bi) {
          let _block2 = this._blocks[bi];
          let blockStartPos = accVal.length;
          accVal += _block2.value;

          if (pos <= accVal.length) {
            return {
              index: bi,
              offset: pos - blockStartPos
            };
          }
        }
      }
      /** */

    }, {
      key: `_blockStartPos`,
      value: function _blockStartPos(blockIndex) {
        return this._blocks.slice(0, blockIndex).reduce(function (pos, b) {
          return pos += b.value.length;
        }, 0);
      }
      /** */

    }, {
      key: `_forEachBlocksInRange`,
      value: function _forEachBlocksInRange(fromPos) {
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        let fn = arguments.length > 2 ? arguments[2] : undefined;

        let fromBlockIter = this._mapPosToBlock(fromPos);

        if (fromBlockIter) {
          let toBlockIter = this._mapPosToBlock(toPos); // process first block


          let isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
          let fromBlockStartPos = fromBlockIter.offset;
          let fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
          fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);

          if (toBlockIter && !isSameBlock) {
            // process intermediate blocks
            for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
              fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
            } // process last block


            fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
          }
        }
      }
      /**
        @override
      */

    }, {
      key: `remove`,
      value: function remove() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

        let removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), `remove`, this).call(this, fromPos, toPos);

        this._forEachBlocksInRange(fromPos, toPos, function (b, _, bFromPos, bToPos) {
          removeDetails.aggregate(b.remove(bFromPos, bToPos));
        });

        return removeDetails;
      }
      /**
        @override
      */

    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos(cursorPos) {
        let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
        // TODO refactor - extract alignblock
        let beginBlockData = this._mapPosToBlock(cursorPos) || {
          index: 0,
          offset: 0
        };
        let beginBlockOffset = beginBlockData.offset,
          beginBlockIndex = beginBlockData.index;
        let beginBlock = this._blocks[beginBlockIndex];
        if (!beginBlock) {
          return cursorPos;
        }
        let beginBlockCursorPos = beginBlockOffset; // if position inside block - try to adjust it

        if (beginBlockCursorPos !== 0 && beginBlockCursorPos < beginBlock.value.length) {
          beginBlockCursorPos = beginBlock.nearestInputPos(beginBlockOffset, forceDirection(direction));
        }

        let cursorAtRight = beginBlockCursorPos === beginBlock.value.length;
        let cursorAtLeft = beginBlockCursorPos === 0; //  cursor is INSIDE first block (not at bounds)

        if (!cursorAtLeft && !cursorAtRight) {
          return this._blockStartPos(beginBlockIndex) + beginBlockCursorPos;
        }
        let searchBlockIndex = cursorAtRight ? beginBlockIndex + 1 : beginBlockIndex;

        if (direction === DIRECTION.NONE) {
          // NONE direction used to calculate start input position if no chars were removed
          // FOR NONE:
          // -
          // input|any
          // ->
          //  any|input
          // <-
          //  filled-input|any
          // check if first block at left is input
          if (searchBlockIndex > 0) {
            let blockIndexAtLeft = searchBlockIndex - 1;
            let blockAtLeft = this._blocks[blockIndexAtLeft];
            let blockInputPos = blockAtLeft.nearestInputPos(0, DIRECTION.NONE); // is input

            if (!blockAtLeft.value.length || blockInputPos !== blockAtLeft.value.length) {
              return this._blockStartPos(searchBlockIndex);
            }
          } // ->


          let firstInputAtRight = searchBlockIndex;

          for (let bi = firstInputAtRight; bi < this._blocks.length; ++bi) {
            let blockAtRight = this._blocks[bi];

            let _blockInputPos = blockAtRight.nearestInputPos(0, DIRECTION.NONE);

            if (!blockAtRight.value.length || _blockInputPos !== blockAtRight.value.length) {
              return this._blockStartPos(bi) + _blockInputPos;
            }
          } // <-
          // find first non-fixed symbol


          for (let _bi = searchBlockIndex - 1; _bi >= 0; --_bi) {
            let _block3 = this._blocks[_bi];

            let _blockInputPos2 = _block3.nearestInputPos(0, DIRECTION.NONE); // is input


            if (!_block3.value.length || _blockInputPos2 !== _block3.value.length) {
              return this._blockStartPos(_bi) + _block3.value.length;
            }
          }

          return cursorPos;
        }

        if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
          // -
          //  any|filled-input
          // <-
          //  any|first not empty is not-len-aligned
          //  not-0-aligned|any
          // ->
          //  any|not-len-aligned or end
          // check if first block at right is filled input
          let firstFilledBlockIndexAtRight;

          for (let _bi2 = searchBlockIndex; _bi2 < this._blocks.length; ++_bi2) {
            if (this._blocks[_bi2].value) {
              firstFilledBlockIndexAtRight = _bi2;
              break;
            }
          }

          if (firstFilledBlockIndexAtRight != null) {
            let filledBlock = this._blocks[firstFilledBlockIndexAtRight];

            let _blockInputPos3 = filledBlock.nearestInputPos(0, DIRECTION.RIGHT);

            if (_blockInputPos3 === 0 && filledBlock.unmaskedValue.length) {
              // filled block is input
              return this._blockStartPos(firstFilledBlockIndexAtRight) + _blockInputPos3;
            }
          } // <-
          // find this vars


          let firstFilledInputBlockIndex = -1;
          let firstEmptyInputBlockIndex; // TODO consider nested empty inputs

          for (let _bi3 = searchBlockIndex - 1; _bi3 >= 0; --_bi3) {
            let _block4 = this._blocks[_bi3];

            let _blockInputPos4 = _block4.nearestInputPos(_block4.value.length, DIRECTION.FORCE_LEFT);

            if (!_block4.value || _blockInputPos4 !== 0) {
              firstEmptyInputBlockIndex = _bi3;
            }

            if (_blockInputPos4 !== 0) {
              if (_blockInputPos4 !== _block4.value.length) {
                // aligned inside block - return immediately
                return this._blockStartPos(_bi3) + _blockInputPos4;
              } else {
                // found filled
                firstFilledInputBlockIndex = _bi3;
                break;
              }
            }
          }

          if (direction === DIRECTION.LEFT) {
            // try find first empty input before start searching position only when not forced
            for (let _bi4 = firstFilledInputBlockIndex + 1; _bi4 <= Math.min(searchBlockIndex, this._blocks.length - 1); ++_bi4) {
              let _block5 = this._blocks[_bi4];

              let _blockInputPos5 = _block5.nearestInputPos(0, DIRECTION.NONE);

              let blockAlignedPos = this._blockStartPos(_bi4) + _blockInputPos5;

              if (blockAlignedPos > cursorPos) {
                break;
              } // if block is not lazy input

              if (_blockInputPos5 !== _block5.value.length) {
                return blockAlignedPos;
              }
            }
          } // process overflow


          if (firstFilledInputBlockIndex >= 0) {
            return this._blockStartPos(firstFilledInputBlockIndex) + this._blocks[firstFilledInputBlockIndex].value.length;
          } // for lazy if has aligned left inside fixed and has came to the start - use start position


          if (direction === DIRECTION.FORCE_LEFT || this.lazy && !this.extractInput() && !isInput(this._blocks[searchBlockIndex])) {
            return 0;
          }

          if (firstEmptyInputBlockIndex != null) {
            return this._blockStartPos(firstEmptyInputBlockIndex);
          } // find first input


          for (let _bi5 = searchBlockIndex; _bi5 < this._blocks.length; ++_bi5) {
            let _block6 = this._blocks[_bi5];

            let _blockInputPos6 = _block6.nearestInputPos(0, DIRECTION.NONE); // is input


            if (!_block6.value.length || _blockInputPos6 !== _block6.value.length) {
              return this._blockStartPos(_bi5) + _blockInputPos6;
            }
          }

          return 0;
        }

        if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
          // ->
          //  any|not-len-aligned and filled
          //  any|not-len-aligned
          // <-
          //  not-0-aligned or start|any
          let firstInputBlockAlignedIndex;
          let firstInputBlockAlignedPos;

          for (let _bi6 = searchBlockIndex; _bi6 < this._blocks.length; ++_bi6) {
            let _block7 = this._blocks[_bi6];

            let _blockInputPos7 = _block7.nearestInputPos(0, DIRECTION.NONE);

            if (_blockInputPos7 !== _block7.value.length) {
              firstInputBlockAlignedPos = this._blockStartPos(_bi6) + _blockInputPos7;
              firstInputBlockAlignedIndex = _bi6;
              break;
            }
          }

          if (firstInputBlockAlignedIndex != null && firstInputBlockAlignedPos != null) {
            for (let _bi7 = firstInputBlockAlignedIndex; _bi7 < this._blocks.length; ++_bi7) {
              let _block8 = this._blocks[_bi7];

              let _blockInputPos8 = _block8.nearestInputPos(0, DIRECTION.FORCE_RIGHT);

              if (_blockInputPos8 !== _block8.value.length) {
                return this._blockStartPos(_bi7) + _blockInputPos8;
              }
            }

            return direction === DIRECTION.FORCE_RIGHT ? this.value.length : firstInputBlockAlignedPos;
          }

          for (let _bi8 = Math.min(searchBlockIndex, this._blocks.length - 1); _bi8 >= 0; --_bi8) {
            let _block9 = this._blocks[_bi8];

            let _blockInputPos9 = _block9.nearestInputPos(_block9.value.length, DIRECTION.LEFT);

            if (_blockInputPos9 !== 0) {
              let alignedPos = this._blockStartPos(_bi8) + _blockInputPos9;

              if (alignedPos >= cursorPos) {
                return alignedPos;
              }
              break;
            }
          }
        }

        return cursorPos;
      }
      /** Get block by name */

    }, {
      key: `maskedBlock`,
      value: function maskedBlock(name) {
        return this.maskedBlocks(name)[0];
      }
      /** Get all blocks by name */

    }, {
      key: `maskedBlocks`,
      value: function maskedBlocks(name) {
        let _this4 = this;

        let indices = this._maskedBlocks[name];
        if (!indices) {
          return [];
        }
        return indices.map(function (gi) {
          return _this4._blocks[gi];
        });
      }
    }]);

    return MaskedPattern;
  }(Masked);
  MaskedPattern.DEFAULTS = {
    lazy: true,
    placeholderChar: `_`
  };
  MaskedPattern.STOP_CHAR = `\``;
  MaskedPattern.ESCAPE_CHAR = `\\`;
  MaskedPattern.InputDefinition = PatternInputDefinition;
  MaskedPattern.FixedDefinition = PatternFixedDefinition;

  function isInput(block) {
    if (!block) {
      return false;
    }
    let value = block.value;
    return !value || block.nearestInputPos(0, DIRECTION.NONE) !== value.length;
  }

  IMask.MaskedPattern = MaskedPattern;

  /** Pattern which accepts ranges */

  let MaskedRange = /* #__PURE__*/ function (_MaskedPattern) {
    _inherits(MaskedRange, _MaskedPattern);

    let _super = _createSuper(MaskedRange);

    function MaskedRange() {
      _classCallCheck(this, MaskedRange);

      return _super.apply(this, arguments);
    }

    _createClass(MaskedRange, [{
      key: `_matchFrom`,
      get:
        /**
          Optionally sets max length of pattern.
          Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
        */

        /** Min bound */

        /** Max bound */

        /** */
        function get() {
          return this.maxLength - String(this.from).length;
        }
      /**
        @override
      */

    }, {
      key: `_update`,
      value: function _update(opts) {
        // TODO type
        opts = Object.assign({
          to: this.to || 0,
          from: this.from || 0
        }, opts);
        let maxLength = String(opts.to).length;
        if (opts.maxLength != null) {
          maxLength = Math.max(maxLength, opts.maxLength);
        }
        opts.maxLength = maxLength;
        let fromStr = String(opts.from).padStart(maxLength, `0`);
        let toStr = String(opts.to).padStart(maxLength, `0`);
        let sameCharsCount = 0;

        while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) {
          ++sameCharsCount;
        }

        opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, `\\0`) + `0`.repeat(maxLength - sameCharsCount);

        _get(_getPrototypeOf(MaskedRange.prototype), `_update`, this).call(this, opts);
      }
      /**
        @override
      */

    }, {
      key: `isComplete`,
      get: function get() {
        return _get(_getPrototypeOf(MaskedRange.prototype), `isComplete`, this) && Boolean(this.value);
      }
    }, {
      key: `boundaries`,
      value: function boundaries(str) {
        let minstr = ``;
        let maxstr = ``;

        let _ref = str.match(/^(\D*)(\d*)(\D*)/) || [],
          _ref2 = _slicedToArray(_ref, 3),
          placeholder = _ref2[1],
          num = _ref2[2];

        if (num) {
          minstr = `0`.repeat(placeholder.length) + num;
          maxstr = `9`.repeat(placeholder.length) + num;
        }

        minstr = minstr.padEnd(this.maxLength, `0`);
        maxstr = maxstr.padEnd(this.maxLength, `9`);
        return [minstr, maxstr];
      }
      /**
        @override
      */

    }, {
      key: `doPrepare`,
      value: function doPrepare(str) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        str = _get(_getPrototypeOf(MaskedRange.prototype), `doPrepare`, this).call(this, str, flags).replace(/\D/g, ``);
        if (!this.autofix) {
          return str;
        }
        let fromStr = String(this.from).padStart(this.maxLength, `0`);
        let toStr = String(this.to).padStart(this.maxLength, `0`);
        let val = this.value;
        let prepStr = ``;

        for (let ci = 0; ci < str.length; ++ci) {
          let nextVal = val + prepStr + str[ci];

          let _this$boundaries = this.boundaries(nextVal),
            _this$boundaries2 = _slicedToArray(_this$boundaries, 2),
            minstr = _this$boundaries2[0],
            maxstr = _this$boundaries2[1];

          if (Number(maxstr) < this.from) {
            prepStr += fromStr[nextVal.length - 1];
          } else if (Number(minstr) > this.to) {
            prepStr += toStr[nextVal.length - 1];
          } else {
            prepStr += str[ci];
          }
        }

        return prepStr;
      }
      /**
        @override
      */

    }, {
      key: `doValidate`,
      value: function doValidate() {
        let _get2;

        let str = this.value;
        let firstNonZero = str.search(/[^0]/);
        if (firstNonZero === -1 && str.length <= this._matchFrom) {
          return true;
        }

        let _this$boundaries3 = this.boundaries(str),
          _this$boundaries4 = _slicedToArray(_this$boundaries3, 2),
          minstr = _this$boundaries4[0],
          maxstr = _this$boundaries4[1];

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), `doValidate`, this)).call.apply(_get2, [this].concat(args));
      }
    }]);

    return MaskedRange;
  }(MaskedPattern);
  IMask.MaskedRange = MaskedRange;

  /** Date mask */

  let MaskedDate = /* #__PURE__*/ function (_MaskedPattern) {
    _inherits(MaskedDate, _MaskedPattern);

    let _super = _createSuper(MaskedDate);

    /** Pattern mask for date according to {@link MaskedDate#format} */

    /** Start date */

    /** End date */

    /** */

    /**
      @param {Object} opts
    */
    function MaskedDate(opts) {
      _classCallCheck(this, MaskedDate);

      return _super.call(this, Object.assign({}, MaskedDate.DEFAULTS, opts));
    }
    /**
      @override
    */


    _createClass(MaskedDate, [{
      key: `_update`,
      value: function _update(opts) {
        if (opts.mask === Date) {
          delete opts.mask;
        }
        if (opts.pattern) {
          opts.mask = opts.pattern;
        }
        let blocks = opts.blocks;
        opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS()); // adjust year block

        if (opts.min) {
          opts.blocks.Y.from = opts.min.getFullYear();
        }
        if (opts.max) {
          opts.blocks.Y.to = opts.max.getFullYear();
        }

        if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
          opts.blocks.m.from = opts.min.getMonth() + 1;
          opts.blocks.m.to = opts.max.getMonth() + 1;

          if (opts.blocks.m.from === opts.blocks.m.to) {
            opts.blocks.d.from = opts.min.getDate();
            opts.blocks.d.to = opts.max.getDate();
          }
        }

        Object.assign(opts.blocks, blocks); // add autofix

        Object.keys(opts.blocks).forEach(function (bk) {
          let b = opts.blocks[bk];
          if (!(`autofix` in b)) {
            b.autofix = opts.autofix;
          }
        });

        _get(_getPrototypeOf(MaskedDate.prototype), `_update`, this).call(this, opts);
      }
      /**
        @override
      */

    }, {
      key: `doValidate`,
      value: function doValidate() {
        let _get2;

        let date = this.date;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), `doValidate`, this)).call.apply(_get2, [this].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
      }
      /** Checks if date is exists */

    }, {
      key: `isDateExist`,
      value: function isDateExist(str) {
        return this.format(this.parse(str, this), this).indexOf(str) >= 0;
      }
      /** Parsed Date */

    }, {
      key: `date`,
      get: function get() {
        return this.typedValue;
      },
      set: function set(date) {
        this.typedValue = date;
      }
      /**
        @override
      */

    }, {
      key: `typedValue`,
      get: function get() {
        return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), `typedValue`, this) : null;
      },
      set: function set(value) {
        _set(_getPrototypeOf(MaskedDate.prototype), `typedValue`, value, this, true);
      }
    }]);

    return MaskedDate;
  }(MaskedPattern);
  MaskedDate.DEFAULTS = {
    pattern: `d{.}\`m{.}\`Y`,
    format: function format(date) {
      let day = String(date.getDate()).padStart(2, `0`);
      let month = String(date.getMonth() + 1).padStart(2, `0`);
      let year = date.getFullYear();
      return [day, month, year].join(`.`);
    },
    parse: function parse(str) {
      let _str$split = str.split(`.`),
        _str$split2 = _slicedToArray(_str$split, 3),
        day = _str$split2[0],
        month = _str$split2[1],
        year = _str$split2[2];

      return new Date(year, month - 1, day);
    }
  };

  MaskedDate.GET_DEFAULT_BLOCKS = function () {
    return {
      d: {
        mask: MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2
      },
      m: {
        mask: MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2
      },
      Y: {
        mask: MaskedRange,
        from: 1900,
        to: 9999
      }
    };
  };

  IMask.MaskedDate = MaskedDate;

  /**
    Generic element API to use with mask
    @interface
  */
  let MaskElement = /* #__PURE__*/ function () {
    function MaskElement() {
      _classCallCheck(this, MaskElement);
    }

    _createClass(MaskElement, [{
      key: `selectionStart`,
      get:
        /** */

        /** */

        /** */

        /** Safely returns selection start */
        function get() {
          let start;

          try {
            start = this._unsafeSelectionStart;
          } catch (e) {}

          return start != null ? start : this.value.length;
        }
      /** Safely returns selection end */

    }, {
      key: `selectionEnd`,
      get: function get() {
        let end;

        try {
          end = this._unsafeSelectionEnd;
        } catch (e) {}

        return end != null ? end : this.value.length;
      }
      /** Safely sets element selection */

    }, {
      key: `select`,
      value: function select(start, end) {
        if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) {
          return;
        }

        try {
          this._unsafeSelect(start, end);
        } catch (e) {}
      }
      /** Should be overriden in subclasses */

    }, {
      key: `_unsafeSelect`,
      value: function _unsafeSelect(start, end) {}
      /** Should be overriden in subclasses */

    }, {
      key: `isActive`,
      get: function get() {
        return false;
      }
      /** Should be overriden in subclasses */

    }, {
      key: `bindEvents`,
      value: function bindEvents(handlers) {}
      /** Should be overriden in subclasses */

    }, {
      key: `unbindEvents`,
      value: function unbindEvents() {}
    }]);

    return MaskElement;
  }();
  IMask.MaskElement = MaskElement;

  /** Bridge between HTMLElement and {@link Masked} */

  let HTMLMaskElement = /* #__PURE__*/ function (_MaskElement) {
    _inherits(HTMLMaskElement, _MaskElement);

    let _super = _createSuper(HTMLMaskElement);

    /** Mapping between HTMLElement events and mask internal events */

    /** HTMLElement to use mask on */

    /**
      @param {HTMLInputElement|HTMLTextAreaElement} input
    */
    function HTMLMaskElement(input) {
      let _this;

      _classCallCheck(this, HTMLMaskElement);

      _this = _super.call(this);
      _this.input = input;
      _this._handlers = {};
      return _this;
    }
    /** */
    // $FlowFixMe https://github.com/facebook/flow/issues/2839


    _createClass(HTMLMaskElement, [{
      key: `rootElement`,
      get: function get() {
        return this.input.getRootNode ? this.input.getRootNode() : document;
      }
      /**
        Is element in focus
        @readonly
      */

    }, {
      key: `isActive`,
      get: function get() {
        // $FlowFixMe
        return this.input === this.rootElement.activeElement;
      }
      /**
        Returns HTMLElement selection start
        @override
      */

    }, {
      key: `_unsafeSelectionStart`,
      get: function get() {
        return this.input.selectionStart;
      }
      /**
        Returns HTMLElement selection end
        @override
      */

    }, {
      key: `_unsafeSelectionEnd`,
      get: function get() {
        return this.input.selectionEnd;
      }
      /**
        Sets HTMLElement selection
        @override
      */

    }, {
      key: `_unsafeSelect`,
      value: function _unsafeSelect(start, end) {
        this.input.setSelectionRange(start, end);
      }
      /**
        HTMLElement value
        @override
      */

    }, {
      key: `value`,
      get: function get() {
        return this.input.value;
      },
      set: function set(value) {
        this.input.value = value;
      }
      /**
        Binds HTMLElement events to mask internal events
        @override
      */

    }, {
      key: `bindEvents`,
      value: function bindEvents(handlers) {
        let _this2 = this;

        Object.keys(handlers).forEach(function (event) {
          return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
        });
      }
      /**
        Unbinds HTMLElement events to mask internal events
        @override
      */

    }, {
      key: `unbindEvents`,
      value: function unbindEvents() {
        let _this3 = this;

        Object.keys(this._handlers).forEach(function (event) {
          return _this3._toggleEventHandler(event);
        });
      }
      /** */

    }, {
      key: `_toggleEventHandler`,
      value: function _toggleEventHandler(event, handler) {
        if (this._handlers[event]) {
          this.input.removeEventListener(event, this._handlers[event]);
          delete this._handlers[event];
        }

        if (handler) {
          this.input.addEventListener(event, handler);
          this._handlers[event] = handler;
        }
      }
    }]);

    return HTMLMaskElement;
  }(MaskElement);
  HTMLMaskElement.EVENTS_MAP = {
    selectionChange: `keydown`,
    input: `input`,
    drop: `drop`,
    click: `click`,
    focus: `focus`,
    commit: `blur`
  };
  IMask.HTMLMaskElement = HTMLMaskElement;

  let HTMLContenteditableMaskElement = /* #__PURE__*/ function (_HTMLMaskElement) {
    _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);

    let _super = _createSuper(HTMLContenteditableMaskElement);

    function HTMLContenteditableMaskElement() {
      _classCallCheck(this, HTMLContenteditableMaskElement);

      return _super.apply(this, arguments);
    }

    _createClass(HTMLContenteditableMaskElement, [{
      key: `_unsafeSelectionStart`,
      get:
        /**
          Returns HTMLElement selection start
          @override
        */
        function get() {
          let root = this.rootElement;
          let selection = root.getSelection && root.getSelection();
          return selection && selection.anchorOffset;
        }
      /**
        Returns HTMLElement selection end
        @override
      */

    }, {
      key: `_unsafeSelectionEnd`,
      get: function get() {
        let root = this.rootElement;
        let selection = root.getSelection && root.getSelection();
        return selection && this._unsafeSelectionStart + String(selection).length;
      }
      /**
        Sets HTMLElement selection
        @override
      */

    }, {
      key: `_unsafeSelect`,
      value: function _unsafeSelect(start, end) {
        if (!this.rootElement.createRange) {
          return;
        }
        let range = this.rootElement.createRange();
        range.setStart(this.input.firstChild || this.input, start);
        range.setEnd(this.input.lastChild || this.input, end);
        let root = this.rootElement;
        let selection = root.getSelection && root.getSelection();

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      /**
        HTMLElement value
        @override
      */

    }, {
      key: `value`,
      get: function get() {
        // $FlowFixMe
        return this.input.textContent;
      },
      set: function set(value) {
        this.input.textContent = value;
      }
    }]);

    return HTMLContenteditableMaskElement;
  }(HTMLMaskElement);
  IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;

  /** Listens to element events and controls changes between element and {@link Masked} */

  let InputMask = /* #__PURE__*/ function () {
    /**
      View element
      @readonly
    */

    /**
      Internal {@link Masked} model
      @readonly
    */

    /**
      @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
      @param {Object} opts
    */
    function InputMask(el, opts) {
      _classCallCheck(this, InputMask);

      this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== `INPUT` && el.tagName !== `TEXTAREA` ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
      this.masked = createMask(opts);
      this._listeners = {};
      this._value = ``;
      this._unmaskedValue = ``;
      this._saveSelection = this._saveSelection.bind(this);
      this._onInput = this._onInput.bind(this);
      this._onChange = this._onChange.bind(this);
      this._onDrop = this._onDrop.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onClick = this._onClick.bind(this);
      this.alignCursor = this.alignCursor.bind(this);
      this.alignCursorFriendly = this.alignCursorFriendly.bind(this);

      this._bindEvents(); // refresh


      this.updateValue();

      this._onChange();
    }
    /** Read or update mask */


    _createClass(InputMask, [{
      key: `mask`,
      get: function get() {
        return this.masked.mask;
      },
      set: function set(mask) {
        if (this.maskEquals(mask)) {
          return;
        }

        if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
          this.masked.updateOptions({
            mask
          });
          return;
        }

        let masked = createMask({
          mask
        });
        masked.unmaskedValue = this.masked.unmaskedValue;
        this.masked = masked;
      }
      /** Raw value */

    }, {
      key: `maskEquals`,
      value: function maskEquals(mask) {
        return mask == null || mask === this.masked.mask || mask === Date && this.masked instanceof MaskedDate;
      }
    }, {
      key: `value`,
      get: function get() {
        return this._value;
      },
      set: function set(str) {
        this.masked.value = str;
        this.updateControl();
        this.alignCursor();
      }
      /** Unmasked value */

    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this._unmaskedValue;
      },
      set: function set(str) {
        this.masked.unmaskedValue = str;
        this.updateControl();
        this.alignCursor();
      }
      /** Typed unmasked value */

    }, {
      key: `typedValue`,
      get: function get() {
        return this.masked.typedValue;
      },
      set: function set(val) {
        this.masked.typedValue = val;
        this.updateControl();
        this.alignCursor();
      }
      /**
        Starts listening to element events
        @protected
      */

    }, {
      key: `_bindEvents`,
      value: function _bindEvents() {
        this.el.bindEvents({
          selectionChange: this._saveSelection,
          input: this._onInput,
          drop: this._onDrop,
          click: this._onClick,
          focus: this._onFocus,
          commit: this._onChange
        });
      }
      /**
        Stops listening to element events
        @protected
       */

    }, {
      key: `_unbindEvents`,
      value: function _unbindEvents() {
        if (this.el) {
          this.el.unbindEvents();
        }
      }
      /**
        Fires custom event
        @protected
       */

    }, {
      key: `_fireEvent`,
      value: function _fireEvent(ev) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        let listeners = this._listeners[ev];
        if (!listeners) {
          return;
        }
        listeners.forEach(function (l) {
          return l(...args);
        });
      }
      /**
        Current selection start
        @readonly
      */

    }, {
      key: `selectionStart`,
      get: function get() {
        return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
      }
      /** Current cursor position */

    }, {
      key: `cursorPos`,
      get: function get() {
        return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
      },
      set: function set(pos) {
        if (!this.el || !this.el.isActive) {
          return;
        }
        this.el.select(pos, pos);

        this._saveSelection();
      }
      /**
        Stores current selection
        @protected
      */

    }, {
      key: `_saveSelection`,
      value: function _saveSelection()
      /* ev */
      {
        if (this.value !== this.el.value) {
          console.warn(`Element value was changed outside of mask. Syncronize mask using \`mask.updateValue()\` to work properly.`); // eslint-disable-line no-console
        }

        this._selection = {
          start: this.selectionStart,
          end: this.cursorPos
        };
      }
      /** Syncronizes model value from view */

    }, {
      key: `updateValue`,
      value: function updateValue() {
        this.masked.value = this.el.value;
        this._value = this.masked.value;
      }
      /** Syncronizes view from model value, fires change events */

    }, {
      key: `updateControl`,
      value: function updateControl() {
        let newUnmaskedValue = this.masked.unmaskedValue;
        let newValue = this.masked.value;
        let isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
        this._unmaskedValue = newUnmaskedValue;
        this._value = newValue;
        if (this.el.value !== newValue) {
          this.el.value = newValue;
        }
        if (isChanged) {
          this._fireChangeEvents();
        }
      }
      /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */

    }, {
      key: `updateOptions`,
      value: function updateOptions(opts) {
        let mask = opts.mask,
          restOpts = _objectWithoutProperties(opts, [`mask`]);

        let updateMask = !this.maskEquals(mask);
        let updateOpts = !objectIncludes(this.masked, restOpts);
        if (updateMask) {
          this.mask = mask;
        }
        if (updateOpts) {
          this.masked.updateOptions(restOpts);
        }
        if (updateMask || updateOpts) {
          this.updateControl();
        }
      }
      /** Updates cursor */

    }, {
      key: `updateCursor`,
      value: function updateCursor(cursorPos) {
        if (cursorPos == null) {
          return;
        }
        this.cursorPos = cursorPos; // also queue change cursor for mobile browsers

        this._delayUpdateCursor(cursorPos);
      }
      /**
        Delays cursor update to support mobile browsers
        @private
      */

    }, {
      key: `_delayUpdateCursor`,
      value: function _delayUpdateCursor(cursorPos) {
        let _this = this;

        this._abortUpdateCursor();

        this._changingCursorPos = cursorPos;
        this._cursorChanging = setTimeout(function () {
          if (!_this.el) {
            return;
          } // if was destroyed

          _this.cursorPos = _this._changingCursorPos;

          _this._abortUpdateCursor();
        }, 10);
      }
      /**
        Fires custom events
        @protected
      */

    }, {
      key: `_fireChangeEvents`,
      value: function _fireChangeEvents() {
        this._fireEvent(`accept`, this._inputEvent);

        if (this.masked.isComplete) {
          this._fireEvent(`complete`, this._inputEvent);
        }
      }
      /**
        Aborts delayed cursor update
        @private
      */

    }, {
      key: `_abortUpdateCursor`,
      value: function _abortUpdateCursor() {
        if (this._cursorChanging) {
          clearTimeout(this._cursorChanging);
          delete this._cursorChanging;
        }
      }
      /** Aligns cursor to nearest available position */

    }, {
      key: `alignCursor`,
      value: function alignCursor() {
        this.cursorPos = this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT);
      }
      /** Aligns cursor only if selection is empty */

    }, {
      key: `alignCursorFriendly`,
      value: function alignCursorFriendly() {
        if (this.selectionStart !== this.cursorPos) {
          return;
        } // skip if range is selected

        this.alignCursor();
      }
      /** Adds listener on custom event */

    }, {
      key: `on`,
      value: function on(ev, handler) {
        if (!this._listeners[ev]) {
          this._listeners[ev] = [];
        }

        this._listeners[ev].push(handler);

        return this;
      }
      /** Removes custom event listener */

    }, {
      key: `off`,
      value: function off(ev, handler) {
        if (!this._listeners[ev]) {
          return this;
        }

        if (!handler) {
          delete this._listeners[ev];
          return this;
        }

        let hIndex = this._listeners[ev].indexOf(handler);

        if (hIndex >= 0) {
          this._listeners[ev].splice(hIndex, 1);
        }
        return this;
      }
      /** Handles view input event */

    }, {
      key: `_onInput`,
      value: function _onInput(e) {
        this._inputEvent = e;

        this._abortUpdateCursor(); // fix strange IE behavior


        if (!this._selection) {
          return this.updateValue();
        }
        let details = new ActionDetails( // new state
            this.el.value, this.cursorPos, // old state
            this.value, this._selection);
        let oldRawValue = this.masked.rawInputValue;
        let offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection).offset; // force align in remove direction only if no input chars were removed
        // otherwise we still need to align with NONE (to get out from fixed symbols for instance)

        let removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
        let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
        this.updateControl();
        this.updateCursor(cursorPos);
        delete this._inputEvent;
      }
      /** Handles view change event and commits model value */

    }, {
      key: `_onChange`,
      value: function _onChange() {
        if (this.value !== this.el.value) {
          this.updateValue();
        }

        this.masked.doCommit();
        this.updateControl();

        this._saveSelection();
      }
      /** Handles view drop event, prevents by default */

    }, {
      key: `_onDrop`,
      value: function _onDrop(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      /** Restore last selection on focus */

    }, {
      key: `_onFocus`,
      value: function _onFocus(ev) {
        this.alignCursorFriendly();
      }
      /** Restore last selection on focus */

    }, {
      key: `_onClick`,
      value: function _onClick(ev) {
        this.alignCursorFriendly();
      }
      /** Unbind view events and removes element reference */

    }, {
      key: `destroy`,
      value: function destroy() {
        this._unbindEvents(); // $FlowFixMe why not do so?


        this._listeners.length = 0; // $FlowFixMe

        delete this.el;
      }
    }]);

    return InputMask;
  }();
  IMask.InputMask = InputMask;

  /** Pattern which validates enum values */

  let MaskedEnum = /* #__PURE__*/ function (_MaskedPattern) {
    _inherits(MaskedEnum, _MaskedPattern);

    let _super = _createSuper(MaskedEnum);

    function MaskedEnum() {
      _classCallCheck(this, MaskedEnum);

      return _super.apply(this, arguments);
    }

    _createClass(MaskedEnum, [{
      key: `_update`,
      value:
        /**
          @override
          @param {Object} opts
        */
        function _update(opts) {
          // TODO type
          if (opts.enum) {
            opts.mask = `*`.repeat(opts.enum[0].length);
          }

          _get(_getPrototypeOf(MaskedEnum.prototype), `_update`, this).call(this, opts);
        }
      /**
        @override
      */

    }, {
      key: `doValidate`,
      value: function doValidate() {
        let _this = this,
          _get2;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.enum.some(function (e) {
          return e.indexOf(_this.unmaskedValue) >= 0;
        }) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), `doValidate`, this)).call.apply(_get2, [this].concat(args));
      }
    }]);

    return MaskedEnum;
  }(MaskedPattern);
  IMask.MaskedEnum = MaskedEnum;

  /**
    Number mask
    @param {Object} opts
    @param {string} opts.radix - Single char
    @param {string} opts.thousandsSeparator - Single char
    @param {Array<string>} opts.mapToRadix - Array of single chars
    @param {number} opts.min
    @param {number} opts.max
    @param {number} opts.scale - Digits after point
    @param {boolean} opts.signed - Allow negative
    @param {boolean} opts.normalizeZeros - Flag to remove leading and trailing zeros in the end of editing
    @param {boolean} opts.padFractionalZeros - Flag to pad trailing zeros after point in the end of editing
  */
  let MaskedNumber = /* #__PURE__*/ function (_Masked) {
    _inherits(MaskedNumber, _Masked);

    let _super = _createSuper(MaskedNumber);

    /** Single char */

    /** Single char */

    /** Array of single chars */

    /** */

    /** */

    /** Digits after point */

    /** */

    /** Flag to remove leading and trailing zeros in the end of editing */

    /** Flag to pad trailing zeros after point in the end of editing */
    function MaskedNumber(opts) {
      _classCallCheck(this, MaskedNumber);

      return _super.call(this, Object.assign({}, MaskedNumber.DEFAULTS, opts));
    }
    /**
      @override
    */


    _createClass(MaskedNumber, [{
      key: `_update`,
      value: function _update(opts) {
        _get(_getPrototypeOf(MaskedNumber.prototype), `_update`, this).call(this, opts);

        this._updateRegExps();
      }
      /** */

    }, {
      key: `_updateRegExps`,
      value: function _updateRegExps() {
        // use different regexp to process user input (more strict, input suffix) and tail shifting
        let start = `^` + (this.allowNegative ? `[+|\\-]?` : ``);
        let midInput = `(0|([1-9]+\\d*))?`;
        let mid = `\\d*`;
        let end = (this.scale ? `(` + escapeRegExp(this.radix) + `\\d{0,` + this.scale + `})?` : ``) + `$`;
        this._numberRegExpInput = new RegExp(start + midInput + end);
        this._numberRegExp = new RegExp(start + mid + end);
        this._mapToRadixRegExp = new RegExp(`[` + this.mapToRadix.map(escapeRegExp).join(``) + `]`, `g`);
        this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), `g`);
      }
      /** */

    }, {
      key: `_removeThousandsSeparators`,
      value: function _removeThousandsSeparators(value) {
        return value.replace(this._thousandsSeparatorRegExp, ``);
      }
      /** */

    }, {
      key: `_insertThousandsSeparators`,
      value: function _insertThousandsSeparators(value) {
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        let parts = value.split(this.radix);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
        return parts.join(this.radix);
      }
      /**
        @override
      */

    }, {
      key: `doPrepare`,
      value: function doPrepare(str) {
        let _get2;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return (_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), `doPrepare`, this)).call.apply(_get2, [this, this._removeThousandsSeparators(str.replace(this._mapToRadixRegExp, this.radix))].concat(args));
      }
      /** */

    }, {
      key: `_separatorsCount`,
      value: function _separatorsCount(to) {
        let extendOnSeparators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        let count = 0;

        for (let pos = 0; pos < to; ++pos) {
          if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
            ++count;
            if (extendOnSeparators) {
              to += this.thousandsSeparator.length;
            }
          }
        }

        return count;
      }
      /** */

    }, {
      key: `_separatorsCountFromSlice`,
      value: function _separatorsCountFromSlice() {
        let slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._value;
        return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
      }
      /**
        @override
      */

    }, {
      key: `extractInput`,
      value: function extractInput() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
        let flags = arguments.length > 2 ? arguments[2] : undefined;

        let _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);

        let _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);

        fromPos = _this$_adjustRangeWit2[0];
        toPos = _this$_adjustRangeWit2[1];
        return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), `extractInput`, this).call(this, fromPos, toPos, flags));
      }
      /**
        @override
      */

    }, {
      key: `_appendCharRaw`,
      value: function _appendCharRaw(ch) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (!this.thousandsSeparator) {
          return _get(_getPrototypeOf(MaskedNumber.prototype), `_appendCharRaw`, this).call(this, ch, flags);
        }
        let prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

        let prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);

        this._value = this._removeThousandsSeparators(this.value);

        let appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), `_appendCharRaw`, this).call(this, ch, flags);

        this._value = this._insertThousandsSeparators(this._value);
        let beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

        let beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);

        appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
        appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
        return appendDetails;
      }
      /** */

    }, {
      key: `_findSeparatorAround`,
      value: function _findSeparatorAround(pos) {
        if (this.thousandsSeparator) {
          let searchFrom = pos - this.thousandsSeparator.length + 1;
          let separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
          if (separatorPos <= pos) {
            return separatorPos;
          }
        }

        return -1;
      }
    }, {
      key: `_adjustRangeWithSeparators`,
      value: function _adjustRangeWithSeparators(from, to) {
        let separatorAroundFromPos = this._findSeparatorAround(from);

        if (separatorAroundFromPos >= 0) {
          from = separatorAroundFromPos;
        }

        let separatorAroundToPos = this._findSeparatorAround(to);

        if (separatorAroundToPos >= 0) {
          to = separatorAroundToPos + this.thousandsSeparator.length;
        }
        return [from, to];
      }
      /**
        @override
      */

    }, {
      key: `remove`,
      value: function remove() {
        let fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

        let _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);

        let _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);

        fromPos = _this$_adjustRangeWit4[0];
        toPos = _this$_adjustRangeWit4[1];
        let valueBeforePos = this.value.slice(0, fromPos);
        let valueAfterPos = this.value.slice(toPos);

        let prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);

        this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));

        let beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);

        return new ChangeDetails({
          tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
        });
      }
      /**
        @override
      */

    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos(cursorPos, direction) {
        if (!this.thousandsSeparator) {
          return cursorPos;
        }

        switch (direction) {
          case DIRECTION.NONE:
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT: {
            let separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);

            if (separatorAtLeftPos >= 0) {
              let separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;

              if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
                return separatorAtLeftPos;
              }
            }

            break;
          }

          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT: {
            let separatorAtRightPos = this._findSeparatorAround(cursorPos);

            if (separatorAtRightPos >= 0) {
              return separatorAtRightPos + this.thousandsSeparator.length;
            }
          }
        }

        return cursorPos;
      }
      /**
        @override
      */

    }, {
      key: `doValidate`,
      value: function doValidate(flags) {
        let regexp = flags.input ? this._numberRegExpInput : this._numberRegExp; // validate as string

        let valid = regexp.test(this._removeThousandsSeparators(this.value));

        if (valid) {
          // validate as number
          let number = this.number;
          valid = valid && !isNaN(number) && ( // check min bound for negative values
            this.min == null || this.min >= 0 || this.min <= this.number) && ( // check max bound for positive values
              this.max == null || this.max <= 0 || this.number <= this.max);
        }

        return valid && _get(_getPrototypeOf(MaskedNumber.prototype), `doValidate`, this).call(this, flags);
      }
      /**
        @override
      */

    }, {
      key: `doCommit`,
      value: function doCommit() {
        if (this.value) {
          let number = this.number;
          let validnum = number; // check bounds

          if (this.min != null) {
            validnum = Math.max(validnum, this.min);
          }
          if (this.max != null) {
            validnum = Math.min(validnum, this.max);
          }
          if (validnum !== number) {
            this.unmaskedValue = String(validnum);
          }
          let formatted = this.value;
          if (this.normalizeZeros) {
            formatted = this._normalizeZeros(formatted);
          }
          if (this.padFractionalZeros) {
            formatted = this._padFractionalZeros(formatted);
          }
          this._value = formatted;
        }

        _get(_getPrototypeOf(MaskedNumber.prototype), `doCommit`, this).call(this);
      }
      /** */

    }, {
      key: `_normalizeZeros`,
      value: function _normalizeZeros(value) {
        let parts = this._removeThousandsSeparators(value).split(this.radix); // remove leading zeros


        parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, function (match, sign, zeros, num) {
          return sign + num;
        }); // add leading zero

        if (value.length && !/\d$/.test(parts[0])) {
          parts[0] = parts[0] + `0`;
        }

        if (parts.length > 1) {
          parts[1] = parts[1].replace(/0*$/, ``); // remove trailing zeros

          if (!parts[1].length) {
            parts.length = 1;
          } // remove fractional
        }

        return this._insertThousandsSeparators(parts.join(this.radix));
      }
      /** */

    }, {
      key: `_padFractionalZeros`,
      value: function _padFractionalZeros(value) {
        if (!value) {
          return value;
        }
        let parts = value.split(this.radix);
        if (parts.length < 2) {
          parts.push(``);
        }
        parts[1] = parts[1].padEnd(this.scale, `0`);
        return parts.join(this.radix);
      }
      /**
        @override
      */

    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, `.`);
      },
      set: function set(unmaskedValue) {
        _set(_getPrototypeOf(MaskedNumber.prototype), `unmaskedValue`, unmaskedValue.replace(`.`, this.radix), this, true);
      }
      /**
        @override
      */

    }, {
      key: `typedValue`,
      get: function get() {
        return Number(this.unmaskedValue);
      },
      set: function set(n) {
        _set(_getPrototypeOf(MaskedNumber.prototype), `unmaskedValue`, String(n), this, true);
      }
      /** Parsed Number */

    }, {
      key: `number`,
      get: function get() {
        return this.typedValue;
      },
      set: function set(number) {
        this.typedValue = number;
      }
      /**
        Is negative allowed
        @readonly
      */

    }, {
      key: `allowNegative`,
      get: function get() {
        return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
      }
    }]);

    return MaskedNumber;
  }(Masked);
  MaskedNumber.DEFAULTS = {
    radix: `,`,
    thousandsSeparator: ``,
    mapToRadix: [`.`],
    scale: 2,
    signed: false,
    normalizeZeros: true,
    padFractionalZeros: false
  };
  IMask.MaskedNumber = MaskedNumber;

  /** Masking by custom Function */

  let MaskedFunction = /* #__PURE__*/ function (_Masked) {
    _inherits(MaskedFunction, _Masked);

    let _super = _createSuper(MaskedFunction);

    function MaskedFunction() {
      _classCallCheck(this, MaskedFunction);

      return _super.apply(this, arguments);
    }

    _createClass(MaskedFunction, [{
      key: `_update`,
      value:
        /**
          @override
          @param {Object} opts
        */
        function _update(opts) {
          if (opts.mask) {
            opts.validate = opts.mask;
          }

          _get(_getPrototypeOf(MaskedFunction.prototype), `_update`, this).call(this, opts);
        }
    }]);

    return MaskedFunction;
  }(Masked);
  IMask.MaskedFunction = MaskedFunction;

  /** Dynamic mask for choosing apropriate mask in run-time */
  let MaskedDynamic = /* #__PURE__*/ function (_Masked) {
    _inherits(MaskedDynamic, _Masked);

    let _super = _createSuper(MaskedDynamic);

    /** Currently chosen mask */

    /** Compliled {@link Masked} options */

    /** Chooses {@link Masked} depending on input value */

    /**
      @param {Object} opts
    */
    function MaskedDynamic(opts) {
      let _this;

      _classCallCheck(this, MaskedDynamic);

      _this = _super.call(this, Object.assign({}, MaskedDynamic.DEFAULTS, opts));
      _this.currentMask = null;
      return _this;
    }
    /**
      @override
    */


    _createClass(MaskedDynamic, [{
      key: `_update`,
      value: function _update(opts) {
        _get(_getPrototypeOf(MaskedDynamic.prototype), `_update`, this).call(this, opts);

        if (`mask` in opts) {
          // mask could be totally dynamic with only `dispatch` option
          this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(function (m) {
            return createMask(m);
          }) : [];
        }
      }
      /**
        @override
      */

    }, {
      key: `_appendCharRaw`,
      value: function _appendCharRaw(ch) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        let details = this._applyDispatch(ch, flags);

        if (this.currentMask) {
          details.aggregate(this.currentMask._appendChar(ch, flags));
        }

        return details;
      }
    }, {
      key: `_applyDispatch`,
      value: function _applyDispatch() {
        let appended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ``;
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
        let inputValue = this.rawInputValue;
        let insertValue = flags.tail && flags._beforeTailState != null ? // $FlowFixMe - tired to fight with type system
          flags._beforeTailState._rawInputValue : inputValue;
        let tailValue = inputValue.slice(insertValue.length);
        let prevMask = this.currentMask;
        let details = new ChangeDetails();
        let prevMaskState = prevMask && prevMask.state; // clone flags to prevent overwriting `_beforeTailState`

        this.currentMask = this.doDispatch(appended, Object.assign({}, flags)); // restore state after dispatch

        if (this.currentMask) {
          if (this.currentMask !== prevMask) {
            // if mask changed reapply input
            this.currentMask.reset();

            if (insertValue) {
              // $FlowFixMe - it's ok, we don't change current mask above
              let d = this.currentMask.append(insertValue, {
                raw: true
              });
              details.tailShift = d.inserted.length - prevValueBeforeTail.length;
            }

            if (tailValue) {
              // $FlowFixMe - it's ok, we don't change current mask above
              details.tailShift += this.currentMask.append(tailValue, {
                raw: true,
                tail: true
              }).tailShift;
            }
          } else {
            // Dispatch can do something bad with state, so
            // restore prev mask state
            this.currentMask.state = prevMaskState;
          }
        }

        return details;
      }
    }, {
      key: `_appendPlaceholder`,
      value: function _appendPlaceholder() {
        let details = this._applyDispatch.apply(this, arguments);

        if (this.currentMask) {
          details.aggregate(this.currentMask._appendPlaceholder());
        }

        return details;
      }
      /**
        @override
      */

    }, {
      key: `doDispatch`,
      value: function doDispatch(appended) {
        let flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this.dispatch(appended, this, flags);
      }
      /**
        @override
      */

    }, {
      key: `doValidate`,
      value: function doValidate() {
        let _get2, _this$currentMask;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), `doValidate`, this)).call.apply(_get2, [this].concat(args)) && (!this.currentMask || (_this$currentMask = this.currentMask).doValidate.apply(_this$currentMask, args));
      }
      /**
        @override
      */

    }, {
      key: `reset`,
      value: function reset() {
        if (this.currentMask) {
          this.currentMask.reset();
        }
        this.compiledMasks.forEach(function (m) {
          return m.reset();
        });
      }
      /**
        @override
      */

    }, {
      key: `value`,
      get: function get() {
        return this.currentMask ? this.currentMask.value : ``;
      },
      set: function set(value) {
        _set(_getPrototypeOf(MaskedDynamic.prototype), `value`, value, this, true);
      }
      /**
        @override
      */

    }, {
      key: `unmaskedValue`,
      get: function get() {
        return this.currentMask ? this.currentMask.unmaskedValue : ``;
      },
      set: function set(unmaskedValue) {
        _set(_getPrototypeOf(MaskedDynamic.prototype), `unmaskedValue`, unmaskedValue, this, true);
      }
      /**
        @override
      */

    }, {
      key: `typedValue`,
      get: function get() {
        return this.currentMask ? this.currentMask.typedValue : ``;
      }, // probably typedValue should not be used with dynamic
      set: function set(value) {
        let unmaskedValue = String(value); // double check it

        if (this.currentMask) {
          this.currentMask.typedValue = value;
          unmaskedValue = this.currentMask.unmaskedValue;
        }

        this.unmaskedValue = unmaskedValue;
      }
      /**
        @override
      */

    }, {
      key: `isComplete`,
      get: function get() {
        return !!this.currentMask && this.currentMask.isComplete;
      }
      /**
        @override
      */

    }, {
      key: `remove`,
      value: function remove() {
        let details = new ChangeDetails();

        if (this.currentMask) {
          let _this$currentMask2;

          details.aggregate((_this$currentMask2 = this.currentMask).remove.apply(_this$currentMask2, arguments)) // update with dispatch
              .aggregate(this._applyDispatch());
        }

        return details;
      }
      /**
        @override
      */

    }, {
      key: `state`,
      get: function get() {
        return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), `state`, this), {
          _rawInputValue: this.rawInputValue,
          compiledMasks: this.compiledMasks.map(function (m) {
            return m.state;
          }),
          currentMaskRef: this.currentMask,
          currentMask: this.currentMask && this.currentMask.state
        });
      },
      set: function set(state) {
        let compiledMasks = state.compiledMasks,
          currentMaskRef = state.currentMaskRef,
          currentMask = state.currentMask,
          maskedState = _objectWithoutProperties(state, [`compiledMasks`, `currentMaskRef`, `currentMask`]);

        this.compiledMasks.forEach(function (m, mi) {
          return m.state = compiledMasks[mi];
        });

        if (currentMaskRef != null) {
          this.currentMask = currentMaskRef;
          this.currentMask.state = currentMask;
        }

        _set(_getPrototypeOf(MaskedDynamic.prototype), `state`, maskedState, this, true);
      }
      /**
        @override
      */

    }, {
      key: `extractInput`,
      value: function extractInput() {
        let _this$currentMask3;

        return this.currentMask ? (_this$currentMask3 = this.currentMask).extractInput.apply(_this$currentMask3, arguments) : ``;
      }
      /**
        @override
      */

    }, {
      key: `extractTail`,
      value: function extractTail() {
        let _this$currentMask4, _get3;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this.currentMask ? (_this$currentMask4 = this.currentMask).extractTail.apply(_this$currentMask4, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), `extractTail`, this)).call.apply(_get3, [this].concat(args));
      }
      /**
        @override
      */

    }, {
      key: `doCommit`,
      value: function doCommit() {
        if (this.currentMask) {
          this.currentMask.doCommit();
        }

        _get(_getPrototypeOf(MaskedDynamic.prototype), `doCommit`, this).call(this);
      }
      /**
        @override
      */

    }, {
      key: `nearestInputPos`,
      value: function nearestInputPos() {
        let _this$currentMask5, _get4;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this.currentMask ? (_this$currentMask5 = this.currentMask).nearestInputPos.apply(_this$currentMask5, args) : (_get4 = _get(_getPrototypeOf(MaskedDynamic.prototype), `nearestInputPos`, this)).call.apply(_get4, [this].concat(args));
      }
    }, {
      key: `overwrite`,
      get: function get() {
        return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), `overwrite`, this);
      },
      set: function set(overwrite) {
        console.warn(`"overwrite" option is not available in dynamic mask, use this option in siblings`);
      }
    }]);

    return MaskedDynamic;
  }(Masked);
  MaskedDynamic.DEFAULTS = {
    dispatch: function dispatch(appended, masked, flags) {
      if (!masked.compiledMasks.length) {
        return;
      }
      let inputValue = masked.rawInputValue; // simulate input

      let inputs = masked.compiledMasks.map(function (m, index) {
        m.reset();
        m.append(inputValue, {
          raw: true
        });
        m.append(appended, flags);
        let weight = m.rawInputValue.length;
        return {
          weight,
          index
        };
      }); // pop masks with longer values first

      inputs.sort(function (i1, i2) {
        return i2.weight - i1.weight;
      });
      return masked.compiledMasks[inputs[0].index];
    }
  };
  IMask.MaskedDynamic = MaskedDynamic;

  /** Mask pipe source and destination types */

  let PIPE_TYPE = {
    MASKED: `value`,
    UNMASKED: `unmaskedValue`,
    TYPED: `typedValue`
  };
  /** Creates new pipe function depending on mask type, source and destination options */

  function createPipe(mask) {
    let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIPE_TYPE.MASKED;
    let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIPE_TYPE.MASKED;
    let masked = createMask(mask);
    return function (value) {
      return masked.runIsolated(function (m) {
        m[from] = value;
        return m[to];
      });
    };
  }
  /** Pipes value through mask depending on mask type, source and destination options */

  function pipe(value) {
    for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      pipeArgs[_key - 1] = arguments[_key];
    }

    return createPipe(...pipeArgs)(value);
  }
  IMask.PIPE_TYPE = PIPE_TYPE;
  IMask.createPipe = createPipe;
  IMask.pipe = pipe;

  try {
    globalThis.IMask = IMask;
  } catch (e) {}

  exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
  exports.HTMLMaskElement = HTMLMaskElement;
  exports.InputMask = InputMask;
  exports.MaskElement = MaskElement;
  exports.Masked = Masked;
  exports.MaskedDate = MaskedDate;
  exports.MaskedDynamic = MaskedDynamic;
  exports.MaskedEnum = MaskedEnum;
  exports.MaskedFunction = MaskedFunction;
  exports.MaskedNumber = MaskedNumber;
  exports.MaskedPattern = MaskedPattern;
  exports.MaskedRange = MaskedRange;
  exports.MaskedRegExp = MaskedRegExp;
  exports.PIPE_TYPE = PIPE_TYPE;
  exports.createMask = createMask;
  exports.createPipe = createPipe;
  exports.default = IMask;
  exports.pipe = pipe;

  Object.defineProperty(exports, `__esModule`, {
    value: true
  });

})));
// # sourceMappingURL=imask.js.map
;
/* !
 * Accordion v3.1.1
 * Simple accordion created in pure Javascript.
 * https://github.com/michu2k/Accordion
 *
 * Copyright (c) Michał Strumpf
 * Published under MIT License
 */
!function (e) {
  let t = 0, n = function e(n, i) {
    let s = this, r = this, o = !1; if (Array.isArray(n)) {
      return !!n.length && n.map((function (t) {
        return new e(t, i);
      }));
    } let a = {init() {
      let e = this; this.options = Object.assign({duration: 600, ariaEnabled: !0, collapse: !0, showMultiple: !1, openOnInit: [], elementClass: `ac`, triggerClass: `ac-trigger`, panelClass: `ac-panel`, activeClass: `is-active`, beforeOpen() {}, onOpen() {}, beforeClose() {}, onClose() {}}, i); let s = this.options, o = s.elementClass, a = s.openOnInit, c = `string` === typeof n; this.container = c ? document.querySelector(n) : n, this.elements = Array.from(this.container.childNodes).filter((function (e) {
        return e.classList && e.classList.contains(o);
      })), this.firstElement = this.elements[0], this.lastElement = this.elements[this.elements.length - 1], this.currFocusedIdx = 0, this.elements.map((function (n, i) {
        return n.classList.add(`js-enabled`), e.generateIDs(n), e.setARIA(n), e.setTransition(n), t++, a.includes(i) ? e.showElement(n, !1) : e.closeElement(n, !1);
      })), r.attachEvents();
    }, setTransition(e) {
      let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = this.options, i = n.duration, s = n.panelClass, r = e.querySelector(`.`.concat(s)), o = c(`transitionDuration`); r.style[o] = t ? null : ``.concat(i, `ms`);
    }, generateIDs(e) {
      let n = this.options, i = n.triggerClass, s = n.panelClass, r = e.querySelector(`.`.concat(i)), o = e.querySelector(`.`.concat(s)); e.setAttribute(`id`, `ac-`.concat(t)), r.setAttribute(`id`, `ac-trigger-`.concat(t)), o.setAttribute(`id`, `ac-panel-`.concat(t));
    }, removeIDs(e) {
      let t = this.options, n = t.triggerClass, i = t.panelClass, s = e.querySelector(`.`.concat(n)), r = e.querySelector(`.`.concat(i)); e.removeAttribute(`id`), s.removeAttribute(`id`), r.removeAttribute(`id`);
    }, setARIA(e) {
      let n = this.options, i = n.ariaEnabled, s = n.triggerClass, r = n.panelClass; if (i) {
        let o = e.querySelector(`.`.concat(s)), a = e.querySelector(`.`.concat(r)); o.setAttribute(`role`, `button`), o.setAttribute(`aria-controls`, `ac-panel-`.concat(t)), o.setAttribute(`aria-disabled`, !1), o.setAttribute(`aria-expanded`, !1), a.setAttribute(`role`, `region`), a.setAttribute(`aria-labelledby`, `ac-trigger-`.concat(t));
      }
    }, updateARIA(e, t) {
      let n = t.ariaExpanded, i = t.ariaDisabled, s = this.options, r = s.ariaEnabled, o = s.triggerClass; if (r) {
        let a = e.querySelector(`.`.concat(o)); a.setAttribute(`aria-expanded`, n), a.setAttribute(`aria-disabled`, i);
      }
    }, removeARIA(e) {
      let t = this.options, n = t.ariaEnabled, i = t.triggerClass, s = t.panelClass; if (n) {
        let r = e.querySelector(`.`.concat(i)), o = e.querySelector(`.`.concat(s)); r.removeAttribute(`role`), r.removeAttribute(`aria-controls`), r.removeAttribute(`aria-disabled`), r.removeAttribute(`aria-expanded`), o.removeAttribute(`role`), o.removeAttribute(`aria-labelledby`);
      }
    }, focus(e, t) {
      e.preventDefault(); let n = this.options.triggerClass; t.querySelector(`.`.concat(n)).focus();
    }, focusFirstElement(e) {
      this.focus(e, this.firstElement), this.currFocusedIdx = 0;
    }, focusLastElement(e) {
      this.focus(e, this.lastElement), this.currFocusedIdx = this.elements.length - 1;
    }, focusNextElement(e) {
      let t = this.currFocusedIdx + 1; if (t > this.elements.length - 1) {
        return this.focusFirstElement(e);
      } this.focus(e, this.elements[t]), this.currFocusedIdx = t;
    }, focusPrevElement(e) {
      let t = this.currFocusedIdx - 1; if (t < 0) {
        return this.focusLastElement(e);
      } this.focus(e, this.elements[t]), this.currFocusedIdx = t;
    }, showElement(e) {
      let t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], n = this.options, i = n.panelClass, s = n.activeClass, r = n.collapse, o = n.beforeOpen, a = e.querySelector(`.`.concat(i)), c = a.scrollHeight; e.classList.add(s), t && o(e), requestAnimationFrame((function () {
        requestAnimationFrame((function () {
          a.style.height = t ? ``.concat(c, `px`) : `auto`;
        }));
      })), this.updateARIA(e, {ariaExpanded: !0, ariaDisabled: !r});
    }, closeElement(e) {
      let t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], n = this.options, i = n.panelClass, s = n.activeClass, r = n.beforeClose, o = e.querySelector(`.`.concat(i)), a = o.scrollHeight; e.classList.remove(s), t ? (r(e), requestAnimationFrame((function () {
        o.style.height = ``.concat(a, `px`), requestAnimationFrame((function () {
          o.style.height = 0;
        }));
      })), this.updateARIA(e, {ariaExpanded: !1, ariaDisabled: !1})) : o.style.height = 0;
    }, toggleElement(e) {
      let t = this.options, n = t.activeClass, i = t.collapse, s = e.classList.contains(n); if (!s || i) {
        return s ? this.closeElement(e) : this.showElement(e);
      }
    }, closeElements() {
      let e = this, t = this.options, n = t.activeClass; t.showMultiple || this.elements.map((function (t, i) {
        t.classList.contains(n) && i != e.currFocusedIdx && e.closeElement(t);
      }));
    }, handleClick(e) {
      let t = this, n = e.currentTarget; this.elements.map((function (i, s) {
        i.contains(n) && `A` !== e.target.nodeName && (t.currFocusedIdx = s, t.closeElements(), t.focus(e, i), t.toggleElement(i));
      }));
    }, handleKeydown(e) {
      let t = 38, n = 40, i = 36, s = 35; switch (e.keyCode) {
        case t:return this.focusPrevElement(e); case n:return this.focusNextElement(e); case i:return this.focusFirstElement(e); case s:return this.focusLastElement(e); default:return null;
      }
    }, handleTransitionEnd(e) {
      if (`height` === e.propertyName) {
        let t = this.options, n = t.onOpen, i = t.onClose, s = e.currentTarget, r = parseInt(s.style.height), o = this.elements.find((function (e) {
          return e.contains(s);
        })); r > 0 ? (s.style.height = `auto`, n(o)) : i(o);
      }
    }}; this.attachEvents = function () {
      if (!o) {
        let e = a.options, t = e.triggerClass, n = e.panelClass; a.handleClick = a.handleClick.bind(a), a.handleKeydown = a.handleKeydown.bind(a), a.handleTransitionEnd = a.handleTransitionEnd.bind(a), a.elements.map((function (e) {
          let i = e.querySelector(`.`.concat(t)), s = e.querySelector(`.`.concat(n)); i.addEventListener(`click`, a.handleClick), i.addEventListener(`keydown`, a.handleKeydown), s.addEventListener(`webkitTransitionEnd`, a.handleTransitionEnd), s.addEventListener(`transitionend`, a.handleTransitionEnd);
        })), o = !0;
      }
    }, this.detachEvents = function () {
      if (o) {
        let e = a.options, t = e.triggerClass, n = e.panelClass; a.elements.map((function (e) {
          let i = e.querySelector(`.`.concat(t)), s = e.querySelector(`.`.concat(n)); i.removeEventListener(`click`, a.handleClick), i.removeEventListener(`keydown`, a.handleKeydown), s.removeEventListener(`webkitTransitionEnd`, a.handleTransitionEnd), s.removeEventListener(`transitionend`, a.handleTransitionEnd);
        })), o = !1;
      }
    }, this.toggle = function (e) {
      let t = a.elements.find((function (t, n) {
        return n === e;
      })); t && a.toggleElement(t);
    }, this.open = function (e) {
      let t = a.elements.find((function (t, n) {
        return n === e;
      })); t && a.showElement(t);
    }, this.openAll = function () {
      a.elements.map((function (e) {
        return a.showElement(e, !1);
      }));
    }, this.close = function (e) {
      let t = a.elements.find((function (t, n) {
        return n === e;
      })); t && a.closeElement(t);
    }, this.closeAll = function () {
      a.elements.map((function (e) {
        return a.closeElement(e, !1);
      }));
    }, this.destroy = function () {
      s.detachEvents(), s.openAll(), a.elements.map((function (e) {
        a.removeIDs(e), a.removeARIA(e), a.setTransition(e, !0);
      })), o = !0;
    }; var c = function (e) {
        return `string` === typeof document.documentElement.style[e] ? e : (e = l(e), e = `webkit`.concat(e));
      }, l = function (e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
      }; a.init();
  }; `undefined` !== typeof module && void 0 !== module.exports ? module.exports = n : e.Accordion = n;
}(window);
;