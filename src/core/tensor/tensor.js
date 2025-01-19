'use strict'
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b
      }) ||
      function (d, b) {
        for (var p in b) {
          if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
        }
      }
    return extendStatics(d, b)
  }
  return function (d, b) {
    if (typeof b !== 'function' && b !== null) {
      throw new TypeError(
        'Class extends value ' + String(b) + ' is not a constructor or null',
      )
    }
    extendStatics(d, b)
    function __() {
      this.constructor = d
    }
    d.prototype = b === null
      ? Object.create(b)
      : (__.prototype = b.prototype, new __())
  }
})()
var __awaiter = (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value)
      })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1]
        return t[1]
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g = Object.create(
      (typeof Iterator === 'function' ? Iterator : Object).prototype,
    )
  return g.next = verb(0),
    g['throw'] = verb(1),
    g['return'] = verb(2),
    typeof Symbol === 'function' && (g[Symbol.iterator] = function () {
      return this
    }),
    g
  function verb(n) {
    return function (v) {
      return step([n, v])
    }
  }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.')
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (
          f = 1,
            y && (t = op[0] & 2
              ? y['return']
              : op[0]
              ? y['throw'] || ((t = y['return']) && t.call(y), 0)
              : y.next) &&
            !(t = t.call(y, op[1])).done
        ) return t
        if (y = 0, t) op = [op[0] & 2, t.value]
        switch (op[0]) {
          case 0:
          case 1:
            t = op
            break
          case 4:
            _.label++
            return { value: op[1], done: false }
          case 5:
            _.label++
            y = op[1]
            op = [0]
            continue
          case 7:
            op = _.ops.pop()
            _.trys.pop()
            continue
          default:
            if (
              !(t = _.trys, t = t.length > 0 && t[t.length - 1]) &&
              (op[0] === 6 || op[0] === 2)
            ) {
              _ = 0
              continue
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1]
              break
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1]
              t = op
              break
            }
            if (t && _.label < t[2]) {
              _.label = t[2]
              _.ops.push(op)
              break
            }
            if (t[2]) _.ops.pop()
            _.trys.pop()
            continue
        }
        op = body.call(thisArg, _)
      } catch (e) {
        op = [6, e]
        y = 0
      } finally {
        f = t = 0
      }
    }
    if (op[0] & 5) throw op[1]
    return { value: op[0] ? op[1] : void 0, done: true }
  }
}
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) {
      throw new TypeError('Private accessor was defined without a getter')
    }
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    ) {
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it',
      )
    }
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver)
  }
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable')
    if (kind === 'a' && !f) {
      throw new TypeError('Private accessor was defined without a setter')
    }
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    ) {
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it',
      )
    }
    return (kind === 'a'
      ? f.call(receiver, value)
      : f
      ? f.value = value
      : state.set(receiver, value)),
      value
  }
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
  if (pack || arguments.length === 2) {
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) {
          ar = Array.prototype.slice.call(from, 0, i)
        }
        ar[i] = from[i]
      }
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from))
}
var _TensorBase_instances,
  _TensorBase_createCalculatingTensorByNode,
  _CreatingTensor_resolved,
  _CreatingTensor_init,
  _CalculatingTensor_init,
  _CalculatingTensor_resolved,
  _CalculatingTensor_createdChildren
Object.defineProperty(exports, '__esModule', { value: true })
exports.CalculatingTensor =
  exports.CreatingTensor =
  exports.ResolvedTensor =
    void 0
var createCreatePromises = function (tensors) {
  var createPromises = []
  for (var _i = 0, tensors_1 = tensors; _i < tensors_1.length; _i++) {
    var tensor = tensors_1[_i]
    if (tensor.isCalculating || tensor.isCreating) {
      var promise = tensor.create()
      if (promise) {
        createPromises.push(promise)
      }
    }
  }
  return createPromises
}
var TensorBase = /** @class */ function () {
  function TensorBase(adapter) {
    _TensorBase_instances.add(this)
    this.id = Symbol('Unique ID')
    this.adapter = adapter
  }
  /**
   * Adds 2 tensors.
   */
  TensorBase.prototype.add = function (other) {
    return __classPrivateFieldGet(
      this,
      _TensorBase_instances,
      'm',
      _TensorBase_createCalculatingTensorByNode,
    ).call(this, {
      type: 'add',
      left: this.node,
      right: other.node,
    }, [other])
  }
  TensorBase.prototype.sub = function (other) {
    return __classPrivateFieldGet(
      this,
      _TensorBase_instances,
      'm',
      _TensorBase_createCalculatingTensorByNode,
    ).call(this, {
      type: 'sub',
      left: this.node,
      right: other.node,
    }, [other])
  }
  TensorBase.prototype.mv = function (other) {
    return __classPrivateFieldGet(
      this,
      _TensorBase_instances,
      'm',
      _TensorBase_createCalculatingTensorByNode,
    ).call(this, {
      type: 'matVecMul',
      left: this.node,
      right: other.node,
    }, [other])
  }
  TensorBase.prototype.matmul = function (other) {
    return __classPrivateFieldGet(
      this,
      _TensorBase_instances,
      'm',
      _TensorBase_createCalculatingTensorByNode,
    ).call(this, {
      type: 'matmul',
      left: this.node,
      right: other.node,
    }, [other])
  }
  return TensorBase
}()
_TensorBase_instances = new WeakSet(),
  _TensorBase_createCalculatingTensorByNode =
    function _TensorBase_createCalculatingTensorByNode(node, others) {
      return new CalculatingTensor({
        adapter: this.adapter,
        node: node,
        createPromises: createCreatePromises(
          __spreadArray([this], others, true),
        ),
      })
    }
var ResolvedTensor = /** @class */ function (_super) {
  __extends(ResolvedTensor, _super)
  function ResolvedTensor(init) {
    var _this = _super.call(this, init.adapter) || this
    _this.isResolved = true
    _this.isCreating = false
    _this.isCalculating = false
    _this.node = {
      type: 'tensor',
      data: init.data,
      id: _this.id,
    }
    return _this
  }
  ResolvedTensor.prototype.toArray = function () {
    return this.adapter.toArray(this.node.data)
  }
  return ResolvedTensor
}(TensorBase)
exports.ResolvedTensor = ResolvedTensor
/**
 * Tensor in a state where it has not been checked whether the tensor has been created or not.
 */
var CreatingTensor = /** @class */ function (_super) {
  __extends(CreatingTensor, _super)
  function CreatingTensor(init) {
    var _this = _super.call(this, init.adapter) || this
    _this.isResolved = false
    _this.isCreating = true
    _this.isCalculating = false
    _CreatingTensor_resolved.set(_this, void 0)
    _CreatingTensor_init.set(_this, void 0)
    __classPrivateFieldSet(_this, _CreatingTensor_init, init, 'f')
    if (init.data instanceof Promise) {
      _this.node = {
        type: 'tensor',
        data: undefined,
        requiresGrad: init.requiresGrad,
        id: _this.id,
      }
    } else {
      __classPrivateFieldSet(
        _this,
        _CreatingTensor_resolved,
        new ResolvedTensor({
          data: init.data,
          adapter: init.adapter,
        }),
        'f',
      )
      _this.node = {
        type: 'tensor',
        data: init.data,
        requiresGrad: init.requiresGrad,
        id: _this.id,
      }
    }
    return _this
  }
  CreatingTensor.prototype.create = function () {
    if (__classPrivateFieldGet(this, _CreatingTensor_resolved, 'f')) {
      return false
    }
    return this.resolve()
  }
  CreatingTensor.prototype.resolve = function () {
    return __awaiter(this, void 0, void 0, function () {
      var data
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (__classPrivateFieldGet(this, _CreatingTensor_resolved, 'f')) {
              return [
                2, /*return*/
                __classPrivateFieldGet(this, _CreatingTensor_resolved, 'f'),
              ]
            }
            return [
              4, /*yield*/
              __classPrivateFieldGet(this, _CreatingTensor_init, 'f').data,
            ]
          case 1:
            data = _a.sent()
            __classPrivateFieldSet(
              this,
              _CreatingTensor_resolved,
              new ResolvedTensor({
                data: data,
                adapter: __classPrivateFieldGet(this, _CreatingTensor_init, 'f')
                  .adapter,
              }),
              'f',
            )
            this.node.data = data
            return [
              2, /*return*/
              __classPrivateFieldGet(this, _CreatingTensor_resolved, 'f'),
            ]
        }
      })
    })
  }
  CreatingTensor.prototype.then = function (onfulfilled, onrejected) {
    return this.resolve().then(onfulfilled, onrejected)
  }
  CreatingTensor.prototype.toArray = function () {
    return this.resolve().then(function (tensor) {
      return tensor.toArray()
    })
  }
  return CreatingTensor
}(TensorBase)
exports.CreatingTensor = CreatingTensor
_CreatingTensor_resolved = new WeakMap(), _CreatingTensor_init = new WeakMap()
/**
 * Tensor with results not yet computed.
 */
var CalculatingTensor = /** @class */ function (_super) {
  __extends(CalculatingTensor, _super)
  function CalculatingTensor(init) {
    var _this = _super.call(this, init.adapter) || this
    _this.isResolved = false
    _this.isCreating = false
    _this.isCalculating = true
    _CalculatingTensor_init.set(_this, void 0)
    _CalculatingTensor_resolved.set(_this, void 0)
    _CalculatingTensor_createdChildren.set(
      _this,
      false, /**
       * Creates all tensors included in the calculate node in this tensor.
       */
    )
    __classPrivateFieldSet(_this, _CalculatingTensor_init, init, 'f')
    _this.node = init.node
    return _this
  }
  /**
   * Creates all tensors included in the calculate node in this tensor.
   */
  CalculatingTensor.prototype.create = function () {
    if (__classPrivateFieldGet(this, _CalculatingTensor_createdChildren, 'f')) {
      return false
    }
    var promises =
      __classPrivateFieldGet(this, _CalculatingTensor_init, 'f').createPromises
    return Promise.all(promises)
  }
  /**
   * Calculates the tensor.
   */
  CalculatingTensor.prototype.resolve = function () {
    return __awaiter(this, void 0, void 0, function () {
      var data
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (
              __classPrivateFieldGet(this, _CalculatingTensor_resolved, 'f')
            ) {
              return [
                2, /*return*/
                __classPrivateFieldGet(this, _CalculatingTensor_resolved, 'f'),
              ]
            }
            return [
              4, /*yield*/
              __classPrivateFieldGet(this, _CalculatingTensor_init, 'f').adapter
                .calculate(
                  __classPrivateFieldGet(this, _CalculatingTensor_init, 'f')
                    .node,
                ),
            ]
          case 1:
            data = _a.sent()
            __classPrivateFieldSet(
              this,
              _CalculatingTensor_resolved,
              new ResolvedTensor({
                data: data,
                adapter:
                  __classPrivateFieldGet(this, _CalculatingTensor_init, 'f')
                    .adapter,
              }),
              'f',
            )
            return [
              2, /*return*/
              __classPrivateFieldGet(this, _CalculatingTensor_resolved, 'f'),
            ]
        }
      })
    })
  }
  CalculatingTensor.prototype.then = function (onfulfilled, onrejected) {
    return this.resolve().then(onfulfilled, onrejected)
  }
  CalculatingTensor.prototype.toArray = function () {
    return this.resolve().then(function (tensor) {
      return tensor.toArray()
    })
  }
  return CalculatingTensor
}(TensorBase)
exports.CalculatingTensor = CalculatingTensor
_CalculatingTensor_init = new WeakMap(),
  _CalculatingTensor_resolved = new WeakMap(),
  _CalculatingTensor_createdChildren = new WeakMap()
