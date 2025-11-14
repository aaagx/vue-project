import { ref } from 'vue'

/**
 * UI状态管理可组合函数
 * 处理用户交互状态和UI显示
 */
export function useUIState() {
  // ============ 常量定义 ============
  const REGIONS = ['1', '2']
  
  const TIME_RANGES = [
    { label: '1小时', value: '1' },
    { label: '4小时', value: '4' },
    { label: '24小时', value: '24' },
    { label: '7天', value: '168' }
  ]

  // ============ 响应式状态 ============
  // 用户交互状态
  const currentRegion = ref('1')
  const currentTimeRange = ref('1')
  const selectedPoints = ref([])
  const selectedMachine = ref('J11')

  // UI显示状态
  const updateTime = ref('')
  const notificationVisible = ref(false)
  const notificationMessage = ref('数据已更新')

  // 数据显示状态
  const summaryData = ref({
    totalRate: '1.85',
    totalRejection: '12,458',
    avgSlope: '0.23'
  })

  // ============ 通知函数 ============
  /**
   * 显示通知消息
   * @param {string} message - 通知消息
   * @param {number} duration - 显示时长（毫秒）
   */
  function showNotification(message, duration = 2000) {
    notificationMessage.value = message
    notificationVisible.value = true
    setTimeout(() => {
      notificationVisible.value = false
    }, duration)
  }

  // ============ 时间函数 ============
  /**
   * 格式化当前时间
   * @returns {string} 格式化后的时间字符串
   */
  function formatCurrentTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
  }

  /**
   * 更新当前时间显示
   */
  function updateCurrentTime() {
    updateTime.value = formatCurrentTime()
  }

  // ============ 摘要数据函数 ============
  /**
   * 更新摘要数据
   * @param {Object} data - 摘要数据对象
   */
  function updateSummaryData(data) {
    if (!data) return
    
    summaryData.value = {
      totalRate: data.totalRate || '0',
      totalRejection: data.totalRejection ? data.totalRejection.toLocaleString() : '0',
      avgSlope: data.avgSlope || '0'
    }
  }

  // ============ 区域和设备管理 ============
  /**
   * 切换区域
   * @param {string} region - 区域ID
   * @param {Array} machines - 该区域的设备列表
   */
  function switchRegion(region, machines) {
    currentRegion.value = region
    selectedMachine.value = machines[region][0]
  }

  /**
   * 选择设备
   * @param {string} machine - 设备名称
   */
  function selectMachine(machine) {
    selectedMachine.value = machine
  }

  /**
   * 切换时间范围
   * @param {string} timeRange - 时间范围值
   */
  function switchTimeRange(timeRange) {
    currentTimeRange.value = timeRange
  }

  // ============ 剔除点管理 ============
  /**
   * 初始化选中的剔除点
   * @param {Array} rejectionPoints - 所有剔除点列表
   */
  function initializeSelectedPoints(rejectionPoints) {
    selectedPoints.value = [...rejectionPoints]
  }

  /**
   * 获取选中的剔除点
   * @returns {Array} 选中的剔除点列表
   */
  function getSelectedPoints() {
    return selectedPoints.value
  }

  /**
   * 检查剔除点是否被选中
   * @param {string} point - 剔除点名称
   * @returns {boolean} 是否被选中
   */
  function isPointSelected(point) {
    return selectedPoints.value.includes(point)
  }

  // ============ 数据过滤函数 ============
  /**
   * 按选中的剔除点过滤数据
   * @param {Array} data - 原始数据数组
   * @param {number} limit - 限制数量
   * @returns {Array} 过滤后的数据
   */
  function filterBySelectedPoints(data, limit = 5) {
    return data
      .filter(item => selectedPoints.value.includes(item.name))
      .slice(0, limit)
  }

  return {
    // 常量
    REGIONS,
    TIME_RANGES,
    
    // 交互状态
    currentRegion,
    currentTimeRange,
    selectedPoints,
    selectedMachine,
    
    // UI状态
    updateTime,
    notificationVisible,
    notificationMessage,
    
    // 数据状态
    summaryData,
    
    // 通知函数
    showNotification,
    
    // 时间函数
    formatCurrentTime,
    updateCurrentTime,
    
    // 摘要数据函数
    updateSummaryData,
    
    // 区域和设备管理
    switchRegion,
    selectMachine,
    switchTimeRange,
    
    // 剔除点管理
    initializeSelectedPoints,
    getSelectedPoints,
    isPointSelected,
    
    // 数据过滤
    filterBySelectedPoints
  }
}
