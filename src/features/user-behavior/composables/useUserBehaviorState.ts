/**
 * 用户行为分析状态管理
 * - 用了什么：漏斗数据、桑基节点/连线数据、统计衍生计算（转化率等）。
 * - 为什么用：把行为分析业务模型集中在一个可复用状态层，页面专注可视化展示。
 * - 怎么调用：`const { funnelData, conversionRate, getSankeyData } = useUserBehaviorState()`。
 */
import { computed, ref } from 'vue'

export interface FunnelStep {
  name: string
  value: number
  rate: number
}

export interface SankeyNode {
  name: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export function useUserBehaviorState() {
  const isCalculating = ref(false)

  const funnelData = ref<FunnelStep[]>([
    { name: '访问首页', value: 100000, rate: 100 },
    { name: '浏览商品', value: 65000, rate: 65 },
    { name: '加入购物车', value: 42000, rate: 42 },
    { name: '开始结算', value: 28000, rate: 28 },
    { name: '提交订单', value: 21000, rate: 21 },
    { name: '支付成功', value: 18500, rate: 18.5 }
  ])

  const totalUsers = computed(() => funnelData.value[0]?.value || 0)
  const convertedUsers = computed(() => funnelData.value[funnelData.value.length - 1]?.value || 0)
  const conversionRate = computed(() => {
    if (totalUsers.value === 0) return 0
    return ((convertedUsers.value / totalUsers.value) * 100).toFixed(1)
  })
  const avgTimeSpent = computed(() => Math.floor(45 + Math.random() * 20))

  const formatNumber = (num: number): string => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
    return num.toLocaleString()
  }

  const getSankeyData = (): { nodes: SankeyNode[]; links: SankeyLink[] } => {
    return {
      nodes: [
        { name: '访问首页' },
        { name: '浏览商品' },
        { name: '搜索商品' },
        { name: '查看详情' },
        { name: '加入购物车' },
        { name: '收藏商品' },
        { name: '开始结算' },
        { name: '提交订单' },
        { name: '支付成功' },
        { name: '支付失败' },
        { name: '放弃购买' }
      ],
      links: [
        { source: '访问首页', target: '浏览商品', value: 65000 },
        { source: '访问首页', target: '搜索商品', value: 35000 },
        { source: '浏览商品', target: '查看详情', value: 55000 },
        { source: '搜索商品', target: '查看详情', value: 28000 },
        { source: '查看详情', target: '加入购物车', value: 42000 },
        { source: '查看详情', target: '收藏商品', value: 15000 },
        { source: '加入购物车', target: '开始结算', value: 28000 },
        { source: '收藏商品', target: '开始结算', value: 8000 },
        { source: '开始结算', target: '提交订单', value: 21000 },
        { source: '提交订单', target: '支付成功', value: 18500 },
        { source: '提交订单', target: '支付失败', value: 2500 },
        { source: '查看详情', target: '放弃购买', value: 15000 },
        { source: '开始结算', target: '放弃购买', value: 7000 }
      ]
    }
  }

  return {
    isCalculating,
    funnelData,
    totalUsers,
    convertedUsers,
    conversionRate,
    avgTimeSpent,
    formatNumber,
    getSankeyData
  }
}
