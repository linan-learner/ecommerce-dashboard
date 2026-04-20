/**
 * 商品雷达模块数据源（Mock）
 * - 用了什么：多维商品指标（价格、销量、库存、评分、服务、促销）。
 * - 为什么用：雷达图需要固定维度结构，这里集中维护样例数据，便于前端先完成交互。
 * - 怎么调用：`await fetchRadarProducts()`，返回商品指标数组。
 */
import { request } from './request'
import type { ProductData } from './types'

const mockProducts: ProductData[] = [
  {
    name: '智能手机 Pro',
    color: '#409eff',
    price: 75,
    sales: 92,
    stock: 68,
    rating: 88,
    service: 82,
    promotion: 70
  },
  {
    name: '笔记本电脑 Air',
    color: '#67c23a',
    price: 65,
    sales: 78,
    stock: 55,
    rating: 85,
    service: 79,
    promotion: 65
  },
  {
    name: '无线耳机 Pro',
    color: '#e6a23c',
    price: 85,
    sales: 95,
    stock: 45,
    rating: 82,
    service: 75,
    promotion: 88
  },
  {
    name: '智能手表 S',
    color: '#f56c6c',
    price: 70,
    sales: 72,
    stock: 82,
    rating: 79,
    service: 80,
    promotion: 60
  },
  {
    name: '平板电脑 Plus',
    color: '#909399',
    price: 60,
    sales: 68,
    stock: 90,
    rating: 84,
    service: 78,
    promotion: 55
  }
]

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export async function fetchRadarProducts(): Promise<ProductData[]> {
  return request(async () => {
    await sleep(Math.random() * 220 + 80)
    return mockProducts
  }, { retries: 1 })
}

