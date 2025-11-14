import { ref } from 'vue'
import * as echarts from 'echarts'

/**
 * 图表管理可组合函数
 * 处理ECharts图表的初始化、更新和清理
 */
export function useCharts() {
  // ============ 响应式状态 ============
  const charts = ref({})

  // ============ 图表配置常量 ============
  const CHART_COLORS = {
    primary: '#3a8ee6',
    dark: '#1a2b4d',
    text: '#e0e0e0',
    lightText: '#a0c0ff',
    axisLine: '#5a7bb4',
    axisBg: 'rgba(90, 123, 180, 0.3)',
    danger: '#ff6b6b',
    warning: '#feca57',
    success: '#3a8ee6'
  }

  // ============ 初始化函数 ============
  /**
   * 初始化所有图表实例
   */
  function initializeCharts() {
    charts.value.trendChart = echarts.init(document.getElementById('trend-chart'))
    charts.value.rateChart = echarts.init(document.getElementById('rate-chart'))
    charts.value.distributionChart = echarts.init(document.getElementById('distribution-chart'))
    charts.value.statusChart = echarts.init(document.getElementById('status-chart'))
  }

  // ============ 清理函数 ============
  /**
   * 清理所有图表实例
   */
  function disposeAllCharts() {
    Object.values(charts.value).forEach(chart => {
      if (chart) chart.dispose()
    })
    charts.value = {}
  }

  /**
   * 处理窗口大小变化
   */
  function handleResize() {
    Object.values(charts.value).forEach(chart => {
      if (chart) chart.resize()
    })
  }

  // ============ 趋势图配置 ============
  /**
   * 生成趋势图配置
   * @param {Array} trendData - 趋势数据
   * @returns {Object} ECharts配置对象
   */
  function generateTrendChartOption(trendData) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['剔除量', '剔除率'],
        textStyle: { color: CHART_COLORS.text }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: trendData.map(item => item.time),
        axisLine: { lineStyle: { color: CHART_COLORS.axisLine } },
        axisLabel: { color: CHART_COLORS.lightText }
      },
      yAxis: [
        {
          type: 'value',
          name: '剔除量',
          axisLine: { lineStyle: { color: CHART_COLORS.axisLine } },
          axisLabel: { color: CHART_COLORS.lightText },
          splitLine: { lineStyle: { color: CHART_COLORS.axisBg } }
        },
        {
          type: 'value',
          name: '剔除率(%)',
          axisLine: { lineStyle: { color: CHART_COLORS.axisLine } },
          axisLabel: { color: CHART_COLORS.lightText, formatter: '{value}%' },
          splitLine: { lineStyle: { color: CHART_COLORS.axisBg } }
        }
      ],
      series: [
        {
          name: '剔除量',
          type: 'bar',
          data: trendData.map(item => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: CHART_COLORS.primary },
              { offset: 1, color: CHART_COLORS.dark }
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            fontSize: 10,
            formatter: '{c}'
          }
        },
        {
          name: '剔除率',
          type: 'line',
          yAxisIndex: 1,
          data: trendData.map(() => (Math.random() * 3).toFixed(2)),
          itemStyle: { color: CHART_COLORS.danger },
          lineStyle: { width: 3 },
          label: {
            show: true,
            position: 'top',
            color: CHART_COLORS.danger,
            fontSize: 10,
            formatter: '{c}%'
          }
        }
      ]
    }
  }

  // ============ 对比图配置 ============
  /**
   * 生成对比图配置
   * @param {Array} rateData - 对比数据
   * @param {string} machineName - 设备名称
   * @returns {Object} ECharts配置对象
   */
  function generateRateChartOption(rateData, machineName) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: rateData.map(item => item.name),
        axisLine: { lineStyle: { color: CHART_COLORS.axisLine } },
        axisLabel: { color: CHART_COLORS.lightText, interval: 0, rotate: 30 }
      },
      yAxis: {
        type: 'value',
        name: '剔除率(%)',
        axisLine: { lineStyle: { color: CHART_COLORS.axisLine } },
        axisLabel: { color: CHART_COLORS.lightText, formatter: '{value}%' },
        splitLine: { lineStyle: { color: CHART_COLORS.axisBg } }
      },
      series: [
        {
          name: machineName,
          type: 'bar',
          data: rateData.map(item => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: CHART_COLORS.primary },
              { offset: 1, color: CHART_COLORS.dark }
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            fontSize: 10,
            formatter: '{c}%'
          }
        }
      ]
    }
  }

  // ============ 分布图配置 ============
  /**
   * 生成分布图配置
   * @param {Array} distributionData - 分布数据
   * @returns {Object} ECharts配置对象
   */
  function generateDistributionChartOption(distributionData) {
    return {
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: CHART_COLORS.text }
      },
      series: [
        {
          name: '剔除量分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#0f1c3c',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: CHART_COLORS.text
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: '#ffffff'
            }
          },
          labelLine: { show: true },
          data: distributionData
        }
      ]
    }
  }

  // ============ 状态图配置 ============
  /**
   * 生成状态图配置
   * @param {number} statusData - 状态数值 (0-100)
   * @returns {Object} ECharts配置对象
   */
  function generateStatusChartOption(statusData) {
    return {
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '运行效率',
          type: 'gauge',
          radius: '100%',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.3, CHART_COLORS.danger],
                [0.7, CHART_COLORS.warning],
                [1, CHART_COLORS.success]
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 10,
            offsetCenter: [0, '-60%'],
            itemStyle: { color: 'auto' }
          },
          axisTick: {
            length: 8,
            lineStyle: { color: 'auto', width: 2 }
          },
          splitLine: {
            length: 12,
            lineStyle: { color: 'auto', width: 3 }
          },
          axisLabel: {
            color: CHART_COLORS.lightText,
            fontSize: 12,
            distance: -40,
            formatter: function (value) {
              if (value === 0 || value === 50 || value === 100) {
                return value + '%'
              }
              return ''
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 14,
            color: CHART_COLORS.lightText
          },
          detail: {
            fontSize: 24,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: '{value}%',
            color: 'auto'
          },
          data: [
            {
              value: statusData,
              name: '运行效率'
            }
          ]
        }
      ]
    }
  }

  // ============ 更新函数 ============
  /**
   * 更新趋势图
   * @param {Array} trendData - 趋势数据
   */
  function updateTrendChart(trendData) {
    if (!charts.value.trendChart) return
    const option = generateTrendChartOption(trendData)
    charts.value.trendChart.setOption(option, true)
  }

  /**
   * 更新对比图
   * @param {Array} rateData - 对比数据
   * @param {string} machineName - 设备名称
   */
  function updateRateChart(rateData, machineName) {
    if (!charts.value.rateChart) return
    const option = generateRateChartOption(rateData, machineName)
    charts.value.rateChart.setOption(option, true)
  }

  /**
   * 更新分布图
   * @param {Array} distributionData - 分布数据
   */
  function updateDistributionChart(distributionData) {
    if (!charts.value.distributionChart) return
    const option = generateDistributionChartOption(distributionData)
    charts.value.distributionChart.setOption(option, true)
  }

  /**
   * 更新状态图
   * @param {number} statusData - 状态数值
   */
  function updateStatusChart(statusData) {
    if (!charts.value.statusChart) return
    const option = generateStatusChartOption(statusData)
    charts.value.statusChart.setOption(option, true)
  }

  return {
    // 状态
    charts,
    
    // 常量
    CHART_COLORS,
    
    // 初始化和清理
    initializeCharts,
    disposeAllCharts,
    handleResize,
    
    // 配置生成
    generateTrendChartOption,
    generateRateChartOption,
    generateDistributionChartOption,
    generateStatusChartOption,
    
    // 更新函数
    updateTrendChart,
    updateRateChart,
    updateDistributionChart,
    updateStatusChart
  }
}
