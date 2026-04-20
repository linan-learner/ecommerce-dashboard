/**
 * API 与业务模块共享类型定义
 * - 用了什么：TypeScript interface/type。
 * - 为什么用：统一约束数据结构，避免组件、图表、接口层字段不一致。
 * - 怎么调用：在任意模块中 `import type { Xxx } from './types'`。
 */
export interface Order {
  id: string
  time: string
  product: string
  amount: number
}

export interface ProvinceData {
  name: string
  value: number
}

export interface CityData {
  name: string
  value: number
}

export type CityMap = Record<string, CityData[]>

export interface ProductData {
  name: string
  color: string
  price: number
  sales: number
  stock: number
  rating: number
  service: number
  promotion: number
}

