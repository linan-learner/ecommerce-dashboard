/**
 * 商品雷达状态管理
 * - 用了什么：可选商品集合、维度权重、加权评分计算函数。
 * - 为什么用：把“业务评分规则”集中管理，页面仅负责交互与展示。
 * - 怎么调用：`const { dimensions, selectedProducts, getProductValue, loadData } = useProductRadarState()`。
 */
import { computed, ref } from 'vue'
import { fetchRadarProducts } from '../../../api/radar'
import type { ProductData } from '../../../api/types'

export interface RadarDimension {
  name: string
  key: keyof Omit<ProductData, 'name' | 'color'>
  weight: number
}

const defaultDimensions: RadarDimension[] = [
  { name: '价格竞争力', key: 'price', weight: 1.0 },
  { name: '销量', key: 'sales', weight: 1.0 },
  { name: '库存充足度', key: 'stock', weight: 1.0 },
  { name: '用户评分', key: 'rating', weight: 1.0 },
  { name: '服务质量', key: 'service', weight: 1.0 },
  { name: '促销力度', key: 'promotion', weight: 1.0 }
]

const defaultSelectedProducts = ['智能手机 Pro', '笔记本电脑 Air', '无线耳机 Pro']

export function useProductRadarState() {
  const availableProducts = ref<ProductData[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const dimensions = ref<RadarDimension[]>([...defaultDimensions])
  const selectedProducts = ref<string[]>([...defaultSelectedProducts])

  const selectedProductData = computed(() => {
    return availableProducts.value.filter(product => selectedProducts.value.includes(product.name))
  })

  const getSafeWeight = (weight: unknown): number => {
    const normalized = Number(weight)
    return Number.isFinite(normalized) ? normalized : 0
  }

  const getProductValue = (product: ProductData, dimName: string): number => {
    const dim = dimensions.value.find(dimension => dimension.name === dimName)
    if (!dim) return 0
    const rawValue = product[dim.key]
    const weightedValue = rawValue * getSafeWeight(dim.weight)
    return Math.min(100, Math.round(weightedValue))
  }

  const loadData = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      availableProducts.value = await fetchRadarProducts()
      const first = availableProducts.value[0]
      if (first && selectedProducts.value.length === 0) {
        selectedProducts.value = [first.name]
      }
    } catch (error) {
      errorMessage.value = '商品数据加载失败，请稍后重试'
      console.warn(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    availableProducts,
    isLoading,
    errorMessage,
    dimensions,
    selectedProducts,
    selectedProductData,
    getSafeWeight,
    getProductValue,
    loadData
  }
}
