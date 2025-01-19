'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.useTensor = void 0
var tensor_ts_1 = require('./tensor.ts')
var useTensor = function (adapter) {
  return function (source, opts) {
    if (opts === void 0) opts = {}
    var data = adapter.createTensorFromArray(source)
    var tensor = new tensor_ts_1.CreatingTensor({
      adapter: adapter,
      data: data,
      requiresGrad: !!opts.requiresGrad,
    })
    return tensor
  }
}
exports.useTensor = useTensor
