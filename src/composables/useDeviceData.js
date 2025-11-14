import { ref } from 'vue'

/**
 * 设备数据管理可组合函数
 * 处理设备数据的初始化和生成
 */
export function useDeviceData() {
  // ============ 常量定义 ============
  const REJECTION_POINTS = [
    '水松纸纸接头', '水松纸拼接剔除数', '缺胶水剔除数', 'ORIS剔除数量',
    '吸阻剔除数', '成型缺陷剔除数', '缺嘴剔除数', '空头剔除数',
    '通风剔除数', '漏气剔除数', 'SRM剔除数', '轻烟端剔除数',
    '硬点剔除数', '软点剔除数', '过重剔除数', '过轻剔除数'
  ]

  const MACHINES = {
    '1': ['J11', 'J12'],
    '2': ['J63', 'J64', 'J65', 'J66', 'J67']
  }

  const TIME_POINTS = {
    '1': 12,
    '4': 24,
    '24': 24,
    '168': 28
  }

  // ============ 响应式状态 ============
  const deviceData = ref({})

  // ============ 工具函数 ============
  /**
   * 格式化时间字符串
   * @param {Date} date - 日期对象
   * @param {string} timeRange - 时间范围 ('1', '4', '24', '168')
   * @returns {string} 格式化后的时间字符串
   */
  function formatTimeString(date, timeRange) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const month = date.getMonth() + 1
    const day = date.getDate()

    switch (timeRange) {
      case '1':
      case '4':
        return `${hours}:${minutes}`
      case '24':
        return `${hours}:00`
      case '168':
        return `${month}/${day} ${hours}:00`
      default:
        return `${hours}:${minutes}`
    }
  }

  /**
   * 生成趋势数据
   * @param {string} timeRange - 时间范围
   * @param {string} machine - 设备名称
   * @returns {Array} 趋势数据数组
   */
  function generateTrendData(timeRange, machine) {
    const data = []
    const now = new Date()
    const points = TIME_POINTS[timeRange] || 12
    const seed = machine.charCodeAt(0) + machine.charCodeAt(1)

    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - 1 - i) * (3600000 * 24 / points))
      const timeStr = formatTimeString(time, timeRange)
      const randomValue = Math.abs(Math.sin(seed + i)) * 1000 + 500

      data.push({
        time: timeStr,
        value: Math.floor(randomValue)
      })
    }
    return data
  }

  /**
   * 生成设备数据
   * @param {string} machine - 设备名称
   * @param {string} currentTimeRange - 当前时间范围
   * @returns {Object} 设备数据对象
   */
  function generateDeviceData(machine, currentTimeRange) {
    return {
      trendData: generateTrendData(currentTimeRange, machine),
      rateData: REJECTION_POINTS.map(point => ({
        name: point,
        value: (Math.random() * 2).toFixed(2)
      })),
      distributionData: REJECTION_POINTS.map(point => ({
        name: point,
        value: Math.floor(Math.random() * 300) + 100
      })),
      statusData: Math.floor(Math.random() * 30) + 70,
      summaryData: {
        totalRate: (Math.random() * 3 + 1).toFixed(2),
        totalRejection: Math.floor(Math.random() * 5000) + 10000,
        avgSlope: (Math.random() * 0.5).toFixed(2)
      }
    }
  }

  /**
   * 初始化所有设备数据
   * @param {string} currentTimeRange - 当前时间范围
   */
  function initializeDeviceData(currentTimeRange) {
    for (const region in MACHINES) {
      MACHINES[region].forEach(machine => {
        deviceData.value[machine] = generateDeviceData(machine, currentTimeRange)
      })
    }
  }

  /**
   * 更新所有设备的趋势数据
   * @param {string} timeRange - 新的时间范围
   */
  function updateAllTrendData(timeRange) {
    for (const region in MACHINES) {
      MACHINES[region].forEach(machine => {
        deviceData.value[machine].trendData = generateTrendData(timeRange, machine)
      })
    }
  }

  /**
   * 获取指定设备的数据
   * @param {string} machine - 设备名称
   * @returns {Object|null} 设备数据或null
   */
  function getMachineData(machine) {
    return deviceData.value[machine] || null
  }

  return {
    // 常量
    REJECTION_POINTS,
    MACHINES,
    TIME_POINTS,
    
    // 状态
    deviceData,
    
    // 方法
    formatTimeString,
    generateTrendData,
    generateDeviceData,
    initializeDeviceData,
    updateAllTrendData,
    getMachineData
  }
}
