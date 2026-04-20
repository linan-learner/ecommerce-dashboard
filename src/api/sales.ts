/**
 * 销售模块数据源（Mock）
 * - 用了什么：本地随机数据 + 异步延迟模拟。
 * - 为什么用：在没有后端接口时先打通页面与状态逻辑，后续可只替换本文件实现。
 * - 怎么调用：`await fetchRealtimeOrder()`，返回单条实时订单。
 */
import type { Order } from './types'

const products = ['智能手机', '笔记本电脑', '无线耳机', '智能手表', '平板电脑']

const pad2 = (n: number) => String(n).padStart(2, '0')

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/**
 * Mock realtime order.
 * 面试可解释：真实接口可替换此实现，组件不需要改动。
 */
export async function fetchRealtimeOrder(): Promise<Order> {
  // 模拟网络延迟
  await sleep(Math.random() * 200 + 50)

  const now = new Date()
  const hours = pad2(now.getHours())
  const minutes = pad2(now.getMinutes())
  const seconds = pad2(now.getSeconds())

  const product = products[Math.floor(Math.random() * products.length)]!

  return {
    id: Date.now().toString(),
    time: `${hours}:${minutes}:${seconds}`,
    product,
    amount: Math.floor(Math.random() * 1000) + 50
  }
}

