/**
 * 地图看板状态管理
 * - 用了什么：省份/城市双层数据状态、加载与错误状态、TopN 计算。
 * - 为什么用：把“加载数据、钻取逻辑、格式化工具”收敛到一个 composable，页面更清晰。
 * - 怎么调用：`const { provinceData, loadData, selectProvince, ... } = useMapDashboardState()`。
 */
import { computed, ref } from 'vue'
import { fetchProvinceCityMap, fetchProvinceSales } from '../../../api/map'
import type { CityData, CityMap, ProvinceData } from '../../../api/types'

export function useMapDashboardState() {
  const provinceData = ref<ProvinceData[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const selectedProvince = ref<string | null>(null)
  const cityData = ref<CityData[]>([])
  const cityMap = ref<CityMap>({})

  const topProvinces = computed(() => {
    return [...provinceData.value]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  })

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toLocaleString()
  }

  const calcBarWidth = (value: number): number => {
    const max = topProvinces.value[0]?.value ?? 1
    return (value / max) * 100
  }

  const loadData = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [provinces, cities] = await Promise.all([fetchProvinceSales(), fetchProvinceCityMap()])
      provinceData.value = provinces
      cityMap.value = cities
    } catch (error) {
      errorMessage.value = '地图数据加载失败，请稍后重试'
      console.warn(error)
    } finally {
      isLoading.value = false
    }
  }

  const selectProvince = (provinceName: string) => {
    const cities = cityMap.value[provinceName]
    if (!cities) return false
    selectedProvince.value = provinceName
    cityData.value = cities
    return true
  }

  const resetDrilldown = () => {
    selectedProvince.value = null
    cityData.value = []
  }

  return {
    provinceData,
    isLoading,
    errorMessage,
    selectedProvince,
    cityData,
    topProvinces,
    formatNumber,
    calcBarWidth,
    loadData,
    selectProvince,
    resetDrilldown
  }
}
