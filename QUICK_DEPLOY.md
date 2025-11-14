# ⚡ 快速部署指南

## 🎯 5分钟快速部署

### 最简单的方式: Netlify (推荐)

#### 步骤1: 推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 步骤2: 连接 Netlify
1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择 GitHub，授权
4. 选择你的仓库
5. 点击 "Deploy"

**完成！** 你的应用已自动部署 🎉

---

## 🖥️ 部署到自己的服务器 (10分钟)

### 前置条件
- 一台 Linux 服务器 (Ubuntu 20.04+)
- SSH 访问权限

### 快速部署脚本

```bash
# 1. SSH 连接到服务器
ssh user@your-server-ip

# 2. 运行一键部署脚本
curl -fsSL https://raw.githubusercontent.com/your-username/vue-project/main/deploy.sh | bash
```

或者手动部署:

```bash
# 1. 克隆项目
git clone https://github.com/your-username/vue-project.git
cd vue-project

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 启动应用
npm install -g pm2
pm2 start "npm run preview" --name dashboard
pm2 save
pm2 startup
```

---

## 🔄 自动化部署 (GitHub Actions)

### 步骤1: 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下密钥:

```
SERVER_HOST = 你的服务器IP
SERVER_USER = SSH用户名
SERVER_SSH_KEY = SSH私钥内容
```

### 步骤2: 自动部署

每次推送到 `main` 分支时自动:
1. ✅ 安装依赖
2. ✅ 构建项目
3. ✅ 上传到服务器
4. ✅ 重启应用

---

## 📊 部署方案对比

| 方案 | 时间 | 难度 | 成本 | 推荐 |
|------|------|------|------|------|
| Netlify | 5分钟 | ⭐ | 免费 | ✅ 最简单 |
| Vercel | 5分钟 | ⭐ | 免费 | ✅ 最简单 |
| 自己服务器 | 10分钟 | ⭐⭐ | 付费 | ✅ 完全控制 |
| Docker | 15分钟 | ⭐⭐⭐ | 付费 | ✅ 容器化 |

---

## 🚀 推荐流程

### 开发阶段
```bash
npm run dev  # 本地开发
```

### 测试阶段
```bash
npm run build  # 构建
npm run preview  # 预览
```

### 部署阶段
```bash
git push origin main  # 推送到 GitHub
# 自动部署开始...
```

---

## ✅ 部署检查清单

- [ ] 代码已提交到 GitHub
- [ ] 选择了部署方案
- [ ] 配置了必要的环境变量
- [ ] 测试了部署流程
- [ ] 应用正常运行
- [ ] 配置了自定义域名 (可选)

---

## 🆘 常见问题

### Q: 部署后页面空白?
```bash
# 检查构建输出
ls -la dist/
cat dist/index.html
```

### Q: 如何查看部署日志?
```bash
# Netlify/Vercel: 在仪表板查看
# 自己的服务器:
pm2 logs dashboard
```

### Q: 如何更新已部署的应用?
```bash
# 只需推送到 GitHub
git push origin main
# 自动部署会自动进行
```

### Q: 如何回滚到上一个版本?
```bash
# GitHub
git revert <commit-hash>
git push origin main

# 自己的服务器
git checkout <commit-hash>
npm run build
pm2 restart dashboard
```

---

## 📞 获取帮助

- 查看详细文档: `DEPLOYMENT.md`
- GitHub Issues: 提交问题
- 服务器日志: `pm2 logs dashboard`

---

**提示**: 推荐新手使用 Netlify 或 Vercel，5分钟即可完成部署！
