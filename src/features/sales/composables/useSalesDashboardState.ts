/**
 * 销售看板状态管理
 * - 用了什么：Vue `ref/computed` + 订单队列 + 图表时间序列。
 * - 为什么用：把“数据更新逻辑”与“页面渲染”拆开，组件只关心展示。
 * - 怎么调用：在销售页面中执行 `const state = useSalesDashboardState()`，再消费返回的响应式状态与 `addOrder`。
 */
import { computed, ref } from 'vue'
import { fetchRealtimeOrder } from '../../../api/sales'
import type { Order } from '../../../api/types'

const itemHeight = 60
const visibleCount = 8
const maxOrders = 100
const maxChartPoints = 30

export function useSalesDashboardState() {
  const chartData = ref({
    times: [] as string[],
    amounts: [] as number[]
  })

  const allOrders = ref<Order[]>([])
  const scrollTop = ref(0)

  const scrollHeight = computed(() => allOrders.value.length * itemHeight)

  const visibleOrders = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(start + visibleCount, allOrders.value.length)
    return allOrders.value.slice(start, end)
  })

  const updateChartData = (time: string, amount: number) => {
    chartData.value.times.push(time)
    chartData.value.amounts.push(amount)

    if (chartData.value.times.length > maxChartPoints) {
      chartData.value.times.shift()
      chartData.value.amounts.shift()
    }
  }

  const addOrder = async () => {
    const newOrder = await fetchRealtimeOrder()
    allOrders.value.unshift(newOrder)
    if (allOrders.value.length > maxOrders) {
      allOrders.value.pop()
    }
    updateChartData(newOrder.time, newOrder.amount)
    return newOrder
  }

  return {
    chartData,
    allOrders,
    scrollTop,
    scrollHeight,
    visibleOrders,
    addOrder,
    itemHeight
  }
}
