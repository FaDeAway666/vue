/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
// 使用数组的原型创建一个新的对象
export const arrayMethods = Object.create(arrayProto)
// 修改数组元素的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // 使用Object.defineProperty 修改数组的原始方法
  def(arrayMethods, method, function mutator (...args) {
    // 执行数组的原始方法，获取结果
    const result = original.apply(this, args)
    // 获取数组对象的 ob 对象
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 对插入的元素，重新遍历数组元素并设置为响应式数据
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
