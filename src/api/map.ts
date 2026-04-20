/**
 * 地图模块数据源（Mock）
 * - 用了什么：省份汇总数据 + 省份到城市的映射数据，统一走 `request` 包装。
 * - 为什么用：支持“省份总览 + 城市钻取”的双层展示，同时保留重试/超时行为与真实接口一致。
 * - 怎么调用：
 *   - `fetchProvinceSales()` 获取省级销售额；
 *   - `fetchProvinceCityMap()` 获取省到城市明细映射。
 */
import { request } from './request'
import type { CityMap, ProvinceData } from './types'

const mockProvinceData: ProvinceData[] = [
  { name: '广东省', value: 12580 },
  { name: '江苏省', value: 9850 },
  { name: '浙江省', value: 8760 },
  { name: '山东省', value: 7650 },
  { name: '上海市', value: 6540 },
  { name: '北京市', value: 5430 },
  { name: '福建省', value: 4320 },
  { name: '四川省', value: 3980 },
  { name: '湖北省', value: 3650 },
  { name: '湖南省', value: 3320 },
  { name: '河南省', value: 2980 },
  { name: '安徽省', value: 2650 },
  { name: '河北省', value: 2320 },
  { name: '陕西省', value: 1980 },
  { name: '重庆市', value: 1750 }
]

const mockCityMap: CityMap = {
  广东省: [
    { name: '深圳市', value: 4500 },
    { name: '广州市', value: 3800 },
    { name: '东莞市', value: 1800 },
    { name: '佛山市', value: 1500 },
    { name: '珠海市', value: 980 }
  ],
  江苏省: [
    { name: '苏州市', value: 3200 },
    { name: '南京市', value: 2500 },
    { name: '无锡市', value: 1800 },
    { name: '常州市', value: 1200 },
    { name: '南通市', value: 1150 }
  ],
  浙江省: [
    { name: '杭州市', value: 2800 },
    { name: '宁波市', value: 2200 },
    { name: '温州市', value: 1500 },
    { name: '绍兴市', value: 1200 },
    { name: '嘉兴市', value: 1060 }
  ],
  北京市: [
    { name: '朝阳区', value: 1800 },
    { name: '海淀区', value: 1600 },
    { name: '东城区', value: 950 },
    { name: '西城区', value: 780 },
    { name: '丰台区', value: 550 }
  ],
  上海市: [
    { name: '浦东新区', value: 2200 },
    { name: '黄浦区', value: 1500 },
    { name: '静安区', value: 1200 },
    { name: '徐汇区', value: 980 },
    { name: '长宁区', value: 660 }
  ]
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export async function fetchProvinceSales(): Promise<ProvinceData[]> {
  return request(async () => {
    await sleep(Math.random() * 250 + 80)
    return mockProvinceData
  }, { retries: 1 })
}

export async function fetchProvinceCityMap(): Promise<CityMap> {
  return request(async () => {
    await sleep(Math.random() * 200 + 80)
    return mockCityMap
  }, { retries: 1 })
}
