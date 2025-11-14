# 快速参考卡片

## 可组合函数速查表

### useDeviceData()

```javascript
// 导入
import { useDeviceData } from '@/composables'

// 使用
const {
  REJECTION_POINTS,      // 剔除点列表
  MACHINES,              // 设备列表
  deviceData,            // 设备数据
  initializeDeviceData,  // 初始化数据
  getMachineData         // 获取设备数据
} = useDeviceData()

// 常用方法
initializeDeviceData('1')           // 初始化1小时数据
const data = getMachineData('J11')  // 获取J11设备数据
updateAllTrendData('24')            // 更新为24小时数据
```

### useCharts()

```javascript
// 导入
import { useCharts } from '@/composables'

// 使用
const {
  charts,                 // 图表实例
  initializeCharts,       // 初始化图表
  updateTrendChart,       // 更新趋势图
  updateRateChart,        // 更新对比图
  updateDistributionChart,// 更新分布图
  updateStatusChart,      // 更新状态图
  disposeAllCharts        // 清理图表
} = useCharts()

// 常用方法
initializeCharts()                    // 初始化所有图表
updateTrendChart(trendData)           // 更新趋势图
updateRateChart(rateData, 'J11')      // 更新对比图
updateStatusChart(85)                 // 更新状态图
disposeAllCharts()                    // 清理资源
```

### useUIState()

```javascript
// 导入
import { useUIState } from '@/composables'

// 使用
const {
  REGIONS,                // 区域列表
  TIME_RANGES,            // 时间范围列表
  currentRegion,          // 当前区域
  selectedMachine,        // 选中设备
  selectedPoints,         // 选中剔除点
  summaryData,            // 摘要数据
  showNotification,       // 显示通知
  switchRegion,           // 切换区域
  selectMachine,          // 选择设备
  filterBySelectedPoints  // 过滤数据
} = useUIState()

// 常用方法
showNotification('操作成功', 2000)        // 显示通知2秒
switchRegion('1', MACHINES)               // 切换到一区
selectMachine('J11')                      // 选择J11设备
const filtered = filterBySelectedPoints(data, 5)  // 过滤前5条
```

## 常用代码片段

### 初始化组件

```javascript
import { useDeviceData, useCharts, useUIState } from '@/composables'
import { onMounted, onUnmounted } from 'vue'

const { initializeDeviceData } = useDeviceData()
const { initializeCharts, disposeAllCharts } = useCharts()
const { initializeSelectedPoints } = useUIState()

onMounted(() => {
  initializeDeviceData('1')
  initializeCharts()
  initializeSelectedPoints(REJECTION_POINTS)
})

onUnmounted(() => {
  disposeAllCharts()
})
```

### 处理用户交互

```javascript
function handleSwitchRegion(region) {
  switchRegion(region, MACHINES)
  updateAllCharts()
}

function handleSelectMachine(machine) {
  selectMachine(machine)
  updateAllCharts()
}

function handleSwitchTimeRange(timeRange) {
  switchTimeRange(timeRange)
  updateAllTrendData(timeRange)
  updateAllCharts()
}
```

### 更新所有图表

```javascript
function updateAllCharts() {
  const machineData = getMachineData(selectedMachine.value)
  if (!machineData) return

  updateTrendChart(machineData.trendData)
  updateRateChart(filterBySelectedPoints(machineData.rateData), selectedMachine.value)
  updateDistributionChart(filterBySelectedPoints(machineData.distributionData))
  updateStatusChart(machineData.statusData)
  updateSummaryData(machineData.summaryData)
  updateCurrentTime()
  showNotification('数据已更新')
}
```

### 监听状态变化

```javascript
import { watch } from 'vue'

// 监听选中设备变化
watch(selectedMachine, (newMachine) => {
  const data = getMachineData(newMachine)
  updateAllCharts()
})

// 监听剔除点变化
watch(selectedPoints, () => {
  updateAllCharts()
}, { deep: true })

// 监听区域变化
watch(currentRegion, (newRegion) => {
  console.log('切换到区域:', newRegion)
})
```

## 常见操作

### 添加新设备

```javascript
// 在 useDeviceData.js 中修改
const MACHINES = {
  '1': ['J11', 'J12', 'J13'],  // 添加 J13
  '2': ['J63', 'J64', 'J65', 'J66', 'J67']
}
```

### 修改图表颜色

```javascript
// 在 useCharts.js 中修改
const CHART_COLORS = {
  primary: '#3a8ee6',      // 修改主题色
  danger: '#ff6b6b',       // 修改危险色
  // ...
}
```

### 添加新的时间范围

```javascript
// 在 useUIState.js 中修改
const TIME_RANGES = [
  { label: '1小时', value: '1' },
  { label: '4小时', value: '4' },
  { label: '24小时', value: '24' },
  { label: '7天', value: '168' },
  { label: '30天', value: '720' }  // 添加新范围
]

// 在 useDeviceData.js 中添加
const TIME_POINTS = {
  '1': 12,
  '4': 24,
  '24': 24,
  '168': 28,
  '720': 30  // 添加对应的数据点数
}
```

### 连接真实API

```javascript
// 在 useDeviceData.js 中修改 generateDeviceData
async function generateDeviceData(machine, currentTimeRange) {
  try {
    const response = await fetch(`/api/device/${machine}?timeRange=${currentTimeRange}`)
    return await response.json()
  } catch (error) {
    console.error('获取数据失败:', error)
    return null
  }
}
```

### 自定义样式

```css
/* 在 src/styles/dashboard.css 中修改 */

/* 修改背景色 */
.dashboard {
  background-color: #0f1c3c;  /* 修改此值 */
}

/* 修改主题色 */
.region-btn.active {
  background-color: #3a8ee6;  /* 修改此值 */
}

/* 修改文字颜色 */
.header h1 {
  color: #ffffff;  /* 修改此值 */
}
```

## 文件位置速查

| 功能 | 文件 | 行号 |
|------|------|------|
| 剔除点列表 | useDeviceData.js | 10-15 |
| 设备列表 | useDeviceData.js | 17-20 |
| 时间范围 | useUIState.js | 12-17 |
| 图表颜色 | useCharts.js | 15-25 |
| 组件模板 | DashboardBoard.vue | 1-110 |
| 样式文件 | dashboard.css | 全部 |

## 调试技巧

### 查看响应式状态

```javascript
console.log('当前区域:', currentRegion.value)
console.log('选中设备:', selectedMachine.value)
console.log('设备数据:', deviceData.value)
console.log('图表实例:', charts.value)
```

### 查看图表配置

```javascript
console.log('趋势图配置:', charts.value.trendChart.getOption())
console.log('对比图配置:', charts.value.rateChart.getOption())
```

### 监听状态变化

```javascript
watch(() => currentRegion.value, (newVal, oldVal) => {
  console.log(`区域从 ${oldVal} 变为 ${newVal}`)
})
```

### 测试数据生成

```javascript
const { generateTrendData, generateDeviceData } = useDeviceData()

// 测试生成趋势数据
const trendData = generateTrendData('1', 'J11')
console.log('趋势数据:', trendData)

// 测试生成设备数据
const deviceData = generateDeviceData('J11', '1')
console.log('设备数据:', deviceData)
```

## 性能优化建议

### 减少重新渲染
```javascript
// 使用 computed 避免重复计算
const filteredData = computed(() => {
  return filterBySelectedPoints(machineData.rateData)
})
```

### 缓存计算结果
```javascript
// 缓存图表配置
const cachedOptions = {}

function getChartOption(key, generator) {
  if (!cachedOptions[key]) {
    cachedOptions[key] = generator()
  }
  return cachedOptions[key]
}
```

### 使用虚拟滚动
```javascript
// 对于大列表使用虚拟滚动
import { VirtualScroller } from '@/components'

// 在模板中使用
<VirtualScroller :items="largeList" />
```

## 常见错误

### ❌ 错误: 图表不显示
```javascript
// 错误: 在 onMounted 之前调用 initializeCharts
initializeCharts()  // DOM还不存在

// 正确: 在 onMounted 中调用
onMounted(() => {
  initializeCharts()
})
```

### ❌ 错误: 状态不更新
```javascript
// 错误: 直接修改对象属性
deviceData.value.J11.trendData = newData

// 正确: 使用响应式方法
deviceData.value = {
  ...deviceData.value,
  J11: { ...deviceData.value.J11, trendData: newData }
}
```

### ❌ 错误: 内存泄漏
```javascript
// 错误: 忘记清理资源
onUnmounted(() => {
  // 没有清理
})

// 正确: 清理所有资源
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  disposeAllCharts()
})
```

## 快速命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 安装依赖
npm install

# 更新依赖
npm update

# 清理缓存
npm cache clean --force
```

## 有用的链接

- [Vue 3 文档](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [ECharts 文档](https://echarts.apache.org/)
- [Vite 文档](https://vitejs.dev/)

---

**提示**: 保存此文件以便快速查阅！
