<template>
  <div class="dashboard">
    <div class="header">
      <h1>卷烟机剔除数据监控看板</h1>
      <div class="region-selector">
        <button 
          v-for="region in REGIONS" 
          :key="region"
          class="region-btn"
          :class="{ active: currentRegion === region }"
          @click="handleSwitchRegion(region)"
        >
          {{ region === '1' ? '一区' : '二区' }}
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="sidebar">
        <h3>剔除点选择</h3>
        <div class="checkbox-group">
          <div v-for="point in REJECTION_POINTS" :key="point" class="checkbox-item">
            <input 
              type="checkbox" 
              :id="point" 
              v-model="selectedPoints"
              :value="point"
            >
            <label :for="point">{{ point }}</label>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-row">
          <div class="chart-card">
            <div class="chart-title">设备剔除趋势图</div>
            <div class="current-machine">当前设备: {{ selectedMachine }}</div>
            <div id="trend-chart" class="chart"></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">剔除率对比</div>
            <div class="current-machine">当前设备: {{ selectedMachine }}</div>
            <div id="rate-chart" class="chart"></div>
          </div>
        </div>
        <div class="chart-row">
          <div class="chart-card">
            <div class="chart-title">剔除量分布</div>
            <div class="current-machine">当前设备: {{ selectedMachine }}</div>
            <div id="distribution-chart" class="chart"></div>
          </div>
          <div class="chart-card">
            <div class="chart-title">设备状态概览</div>
            <div class="current-machine">当前设备: {{ selectedMachine }}</div>
            <div id="status-chart" class="chart"></div>
          </div>
        </div>
      </div>

      <div class="data-panel">
        <div class="data-card">
          <h3>当前区域设备</h3>
          <div class="machine-list">
            <div 
              v-for="machine in currentMachines" 
              :key="machine"
              class="machine-item"
              :class="{ active: selectedMachine === machine }"
              @click="handleSelectMachine(machine)"
            >
              {{ machine }}
            </div>
          </div>
        </div>
        <div class="data-card">
          <h3>总剔除率</h3>
          <div class="data-value">{{ summaryData.totalRate }}<span class="data-unit">%</span></div>
        </div>
        <div class="data-card">
          <h3>总剔除量</h3>
          <div class="data-value">{{ summaryData.totalRejection }}<span class="data-unit">支</span></div>
        </div>
        <div class="data-card">
          <h3>平均斜率</h3>
          <div class="data-value">{{ summaryData.avgSlope }}<span class="data-unit">/h</span></div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="time-range">
        <button 
          v-for="time in TIME_RANGES" 
          :key="time.value"
          class="time-btn"
          :class="{ active: currentTimeRange === time.value }"
          @click="handleSwitchTimeRange(time.value)"
        >
          {{ time.label }}
        </button>
      </div>
      <div class="update-time">最后更新: {{ updateTime }}</div>
    </div>

    <div class="notification" :class="{ show: notificationVisible }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useDeviceData, useCharts, useUIState } from '../composables'
import '../styles/dashboard.css'

// ============ 使用可组合函数 ============
const { 
  REJECTION_POINTS, 
  MACHINES, 
  TIME_POINTS,
  deviceData, 
  initializeDeviceData, 
  updateAllTrendData, 
  getMachineData 
} = useDeviceData()

const { 
  REGIONS, 
  TIME_RANGES,
  currentRegion, 
  currentTimeRange, 
  selectedPoints, 
  selectedMachine,
  updateTime, 
  notificationVisible, 
  notificationMessage,
  summaryData,
  showNotification,
  updateCurrentTime,
  updateSummaryData,
  switchRegion,
  selectMachine,
  switchTimeRange,
  initializeSelectedPoints,
  filterBySelectedPoints
} = useUIState()

const { 
  charts, 
  initializeCharts, 
  disposeAllCharts, 
  handleResize,
  updateTrendChart, 
  updateRateChart, 
  updateDistributionChart, 
  updateStatusChart 
} = useCharts()

// ============ 计算属性 ============
const currentMachines = computed(() => MACHINES[currentRegion.value])

// ============ 事件处理函数 ============
/**
 * 处理区域切换
 */
function handleSwitchRegion(region) {
  switchRegion(region, MACHINES)
  updateAllCharts()
}

/**
 * 处理设备选择
 */
function handleSelectMachine(machine) {
  selectMachine(machine)
  updateAllCharts()
}

/**
 * 处理时间范围切换
 */
function handleSwitchTimeRange(timeRange) {
  switchTimeRange(timeRange)
  updateAllTrendData(timeRange)
  updateAllCharts()
}

// ============ 图表更新函数 ============
/**
 * 更新所有图表
 */
function updateAllCharts() {
  setTimeout(() => {
    const machineData = getMachineData(selectedMachine.value)
    if (!machineData) return

    // 更新趋势图
    updateTrendChart(machineData.trendData)

    // 更新对比图
    const rateData = filterBySelectedPoints(machineData.rateData)
    updateRateChart(rateData, selectedMachine.value)

    // 更新分布图
    const distributionData = filterBySelectedPoints(machineData.distributionData)
    updateDistributionChart(distributionData)

    // 更新状态图
    updateStatusChart(machineData.statusData)

    // 更新摘要数据
    updateSummaryData(machineData.summaryData)

    // 更新时间
    updateCurrentTime()

    // 显示通知
    showNotification('数据已更新')
  }, 300)
}

// ============ 生命周期钩子 ============
/**
 * 组件挂载
 */
onMounted(() => {
  initializeDeviceData(currentTimeRange.value)
  initializeSelectedPoints(REJECTION_POINTS)
  initializeCharts()
  updateAllCharts()
  window.addEventListener('resize', handleResize)
})

/**
 * 组件卸载
 */
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  disposeAllCharts()
})

// ============ 监听器 ============
/**
 * 监听选中的剔除点变化
 */
watch(selectedPoints, () => {
  updateAllCharts()
}, { deep: true })
</script>
