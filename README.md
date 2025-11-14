# 卷烟机剔除数据监控看板

基于 Vue 3 + ECharts 的数据监控仪表板。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   └── DashboardBoard.vue          # 主看板组件
├── composables/                    # 可组合函数
│   ├── useDeviceData.js            # 设备数据管理
│   ├── useCharts.js                # 图表管理
│   ├── useUIState.js               # UI状态管理
│   └── index.js                    # 导出索引
├── styles/
│   └── dashboard.css               # 看板样式
├── App.vue                         # 应用入口
├── main.js                         # 启动文件
└── style.css                       # 全局样式
```

## 🎯 核心功能

- **区域管理** - 一区/二区切换
- **设备选择** - 动态设备列表
- **剔除点过滤** - 16个剔除点复选框
- **时间范围** - 1小时/4小时/24小时/7天
- **数据可视化** - 趋势图、对比图、分布图、状态图
- **数据面板** - 实时数据摘要

## 🏗️ 架构

### 三个可组合函数

| 函数 | 职责 |
|------|------|
| `useDeviceData` | 设备数据管理 |
| `useCharts` | 图表管理 |
| `useUIState` | UI状态管理 |

## 📚 文档

- `COMPOSABLES_GUIDE.md` - 可组合函数详细说明
- `QUICK_REFERENCE.md` - 快速参考卡片

## 📦 技术栈

- Vue 3.5.24
- Vite 7.2.2
- ECharts 5.4.3
- CSS 3

---

**最后更新**: 2025-11-14
