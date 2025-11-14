# 可组合函数使用指南

## 概述

项目已将所有业务逻辑分离为三个独立的可组合函数，提高了代码的复用性和可维护性。

## 文件结构

```
src/composables/
├── index.js              # 导出索引
├── useDeviceData.js      # 设备数据管理
├── useCharts.js          # 图表管理
└── useUIState.js         # UI状态管理
```

## 可组合函数详解

### 1. useDeviceData - 设备数据管理

**职责**: 管理设备数据的生成、初始化和更新

**导出内容**:

```javascript
const {
  // 常量
  REJECTION_POINTS,    // 16个剔除点
  MACHINES,            // 设备列表
  TIME_POINTS,         // 时间点数映射
  
  // 状态
  deviceData,          // 设备数据响应式对象
  
  // 方法
  formatTimeString,    // 格式化时间字符串
  generateTrendData,   // 生成趋势数据
  generateDeviceData,  // 生成设备数据
  initializeDeviceData,// 初始化所有设备数据
  updateAllTrendData,  // 更新所有趋势数据
  getMachineData       // 获取指定设备数据
} = useDeviceData()
```

**使用示例**:

```javascript
const { deviceData, initializeDeviceData, getMachineData } = useDeviceData()

// 初始化数据
onMounted(() => {
  initializeDeviceData('1')  // 参数: 时间范围
})

// 获取设备数据
const machineData = getMachineData('J11')
console.log(machineData.trendData)
console.log(machineData.statusData)
```

**关键方法**:

#### `initializeDeviceData(timeRange)`
初始化所有设备的数据

```javascript
initializeDeviceData('1')  // 初始化1小时数据
```

#### `updateAllTrendData(timeRange)`
更新所有设备的趋势数据

```javascript
updateAllTrendData('24')  // 更新为24小时数据
```

#### `getMachineData(machine)`
获取指定设备的数据

```javascript
const data = getMachineData('J11')
// {
//   trendData: [...],
//   rateData: [...],
//   distributionData: [...],
//   statusData: 85,
//   summaryData: {...}
// }
```

---

### 2. useCharts - 图表管理

**职责**: 管理ECharts图表的初始化、配置和更新

**导出内容**:

```javascript
const {
  // 状态
  charts,                      // 图表实例对象
  
  // 常量
  CHART_COLORS,               // 图表颜色配置
  
  // 初始化和清理
  initializeCharts,           // 初始化所有图表
  disposeAllCharts,           // 清理所有图表
  handleResize,               // 处理窗口大小变化
  
  // 配置生成
  generateTrendChartOption,   // 生成趋势图配置
  generateRateChartOption,    // 生成对比图配置
  generateDistributionChartOption,  // 生成分布图配置
  generateStatusChartOption,  // 生成状态图配置
  
  // 更新函数
  updateTrendChart,           // 更新趋势图
  updateRateChart,            // 更新对比图
  updateDistributionChart,    // 更新分布图
  updateStatusChart           // 更新状态图
} = useCharts()
```

**使用示例**:

```javascript
const { charts, initializeCharts, updateTrendChart } = useCharts()

// 初始化图表
onMounted(() => {
  initializeCharts()
})

// 更新图表
const trendData = [
  { time: '12:00', value: 1234 },
  { time: '12:05', value: 1256 }
]
updateTrendChart(trendData)
```

**关键方法**:

#### `initializeCharts()`
初始化所有图表实例

```javascript
initializeCharts()
// 需要DOM中存在对应的元素:
// <div id="trend-chart"></div>
// <div id="rate-chart"></div>
// <div id="distribution-chart"></div>
// <div id="status-chart"></div>
```

#### `updateTrendChart(trendData)`
更新趋势图

```javascript
updateTrendChart([
  { time: '12:00', value: 1234 },
  { time: '12:05', value: 1256 }
])
```

#### `updateRateChart(rateData, machineName)`
更新对比图

```javascript
updateRateChart([
  { name: '水松纸纸接头', value: 1.85 },
  { name: '缺胶水剔除数', value: 2.1 }
], 'J11')
```

#### `updateDistributionChart(distributionData)`
更新分布图

```javascript
updateDistributionChart([
  { name: '水松纸纸接头', value: 150 },
  { name: '缺胶水剔除数', value: 200 }
])
```

#### `updateStatusChart(statusData)`
更新状态图

```javascript
updateStatusChart(85)  // 运行效率 85%
```

#### `disposeAllCharts()`
清理所有图表实例，防止内存泄漏

```javascript
onUnmounted(() => {
  disposeAllCharts()
})
```

**颜色配置**:

```javascript
const CHART_COLORS = {
  primary: '#3a8ee6',      // 主题蓝
  dark: '#1a2b4d',         // 深色背景
  text: '#e0e0e0',         // 文字颜色
  lightText: '#a0c0ff',    // 浅色文字
  axisLine: '#5a7bb4',     // 轴线颜色
  axisBg: 'rgba(...)',     // 轴背景
  danger: '#ff6b6b',       // 危险色
  warning: '#feca57',      // 警告色
  success: '#3a8ee6'       // 成功色
}
```

---

### 3. useUIState - UI状态管理

**职责**: 管理用户交互状态和UI显示

**导出内容**:

```javascript
const {
  // 常量
  REGIONS,              // 区域列表
  TIME_RANGES,          // 时间范围选项
  
  // 交互状态
  currentRegion,        // 当前区域
  currentTimeRange,     // 当前时间范围
  selectedPoints,       // 选中的剔除点
  selectedMachine,      // 选中的设备
  
  // UI状态
  updateTime,           // 更新时间
  notificationVisible,  // 通知是否可见
  notificationMessage,  // 通知消息
  
  // 数据状态
  summaryData,          // 摘要数据
  
  // 方法
  showNotification,     // 显示通知
  formatCurrentTime,    // 格式化当前时间
  updateCurrentTime,    // 更新当前时间
  updateSummaryData,    // 更新摘要数据
  switchRegion,         // 切换区域
  selectMachine,        // 选择设备
  switchTimeRange,      // 切换时间范围
  initializeSelectedPoints,  // 初始化选中点
  getSelectedPoints,    // 获取选中点
  isPointSelected,      // 检查点是否选中
  filterBySelectedPoints // 按选中点过滤数据
} = useUIState()
```

**使用示例**:

```javascript
const { 
  currentRegion, 
  selectedMachine, 
  showNotification,
  switchRegion
} = useUIState()

// 显示通知
showNotification('操作成功', 2000)

// 切换区域
switchRegion('2', MACHINES)

// 监听状态变化
watch(currentRegion, (newRegion) => {
  console.log('区域已切换到:', newRegion)
})
```

**关键方法**:

#### `showNotification(message, duration)`
显示通知消息

```javascript
showNotification('数据已更新', 2000)  // 显示2秒
```

#### `updateSummaryData(data)`
更新摘要数据

```javascript
updateSummaryData({
  totalRate: 1.85,
  totalRejection: 12458,
  avgSlope: 0.23
})
```

#### `switchRegion(region, machines)`
切换区域

```javascript
switchRegion('1', MACHINES)
```

#### `filterBySelectedPoints(data, limit)`
按选中的剔除点过滤数据

```javascript
const filtered = filterBySelectedPoints(rateData, 5)
// 返回前5个选中的剔除点数据
```

---

## 在组件中使用

### 基础用法

```javascript
<script setup>
import { useDeviceData, useCharts, useUIState } from '@/composables'
import { onMounted, onUnmounted, watch } from 'vue'

// 导入可组合函数
const { deviceData, initializeDeviceData, getMachineData } = useDeviceData()
const { charts, initializeCharts, updateTrendChart } = useCharts()
const { currentRegion, selectedMachine, showNotification } = useUIState()

// 初始化
onMounted(() => {
  initializeDeviceData('1')
  initializeCharts()
})

// 清理
onUnmounted(() => {
  disposeAllCharts()
})

// 监听状态
watch(selectedMachine, (newMachine) => {
  const data = getMachineData(newMachine)
  updateTrendChart(data.trendData)
})
</script>
```

### 高级用法

```javascript
// 创建自定义可组合函数，组合多个基础可组合函数
export function useDashboard() {
  const { deviceData, initializeDeviceData } = useDeviceData()
  const { charts, initializeCharts } = useCharts()
  const { currentRegion, showNotification } = useUIState()

  function initializeDashboard() {
    initializeDeviceData('1')
    initializeCharts()
    showNotification('仪表板已初始化')
  }

  return {
    deviceData,
    charts,
    currentRegion,
    initializeDashboard
  }
}
```

---

## 扩展指南

### 添加新的可组合函数

创建 `src/composables/useNewFeature.js`:

```javascript
import { ref } from 'vue'

export function useNewFeature() {
  const state = ref({})

  function doSomething() {
    // 实现逻辑
  }

  return {
    state,
    doSomething
  }
}
```

在 `src/composables/index.js` 中导出:

```javascript
export { useNewFeature } from './useNewFeature'
```

### 修改现有可组合函数

直接编辑对应的文件，所有使用该可组合函数的组件会自动获得更新。

### 测试可组合函数

```javascript
import { describe, it, expect } from 'vitest'
import { useDeviceData } from '@/composables'

describe('useDeviceData', () => {
  it('should initialize device data', () => {
    const { deviceData, initializeDeviceData } = useDeviceData()
    initializeDeviceData('1')
    expect(Object.keys(deviceData.value).length).toBeGreaterThan(0)
  })
})
```

---

## 最佳实践

### ✅ 推荐做法

1. **分离关注点**: 每个可组合函数只负责一个功能
2. **导出常量**: 在可组合函数中导出常量供外部使用
3. **提供方法**: 提供清晰的API方法
4. **添加文档**: 为每个方法添加JSDoc注释
5. **处理清理**: 在卸载时清理资源

### ❌ 避免做法

1. **过度耦合**: 不要在可组合函数中直接操作DOM
2. **副作用**: 避免在可组合函数中产生不必要的副作用
3. **状态混乱**: 不要混淆响应式和非响应式状态
4. **命名冲突**: 使用清晰的命名避免冲突

---

## 常见问题

### Q: 如何在多个组件中共享状态?
A: 使用可组合函数返回的响应式对象，它们会自动同步。

### Q: 如何添加新的图表?
A: 在 `useCharts.js` 中添加新的生成和更新函数。

### Q: 如何修改数据生成逻辑?
A: 编辑 `useDeviceData.js` 中的 `generateDeviceData()` 函数。

### Q: 如何连接真实API?
A: 在 `initializeDeviceData()` 中替换为API调用。

---

## 性能优化

### 内存管理
- 使用 `disposeAllCharts()` 清理图表实例
- 及时移除事件监听器

### 响应式优化
- 使用 `computed` 避免重复计算
- 使用 `watch` 监听必要的状态变化

### 数据优化
- 使用 `filterBySelectedPoints()` 减少渲染数据
- 缓存计算结果

---

## 总结

通过将代码分离为可组合函数，我们获得了：

- **更好的代码复用**: 可组合函数可以在多个组件中使用
- **更清晰的逻辑**: 每个可组合函数只负责一个功能
- **更易于测试**: 独立的函数更容易编写单元测试
- **更好的维护性**: 修改逻辑只需修改一个文件
- **更灵活的扩展**: 轻松添加新功能而不影响现有代码
