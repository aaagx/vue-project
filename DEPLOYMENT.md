# 自动化部署指南

## 🚀 快速部署方案

### 方案对比

| 方案 | 难度 | 成本 | 速度 | 推荐 |
|------|------|------|------|------|
| GitHub Pages | ⭐ | 免费 | 快 | ✅ 静态站点 |
| Netlify | ⭐ | 免费 | 快 | ✅ 推荐 |
| Vercel | ⭐ | 免费 | 快 | ✅ 推荐 |
| 自己服务器 | ⭐⭐⭐ | 付费 | 中 | ✅ 完全控制 |
| Docker | ⭐⭐ | 付费 | 中 | ✅ 容器化 |

---

## 📦 方案1: Netlify (推荐 - 最简单)

### 步骤1: 连接GitHub

1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 GitHub，授权连接
4. 选择你的仓库

### 步骤2: 配置构建设置

```
Build command: npm run build
Publish directory: dist
```

### 步骤3: 自动部署

- 每次推送到 `main` 分支时自动构建和部署
- 预览链接自动生成

### 步骤4: 自定义域名

1. 在 Netlify 设置中添加自定义域名
2. 更新 DNS 记录

**优点**:
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ CDN加速
- ✅ 自动部署

---

## 📦 方案2: Vercel (推荐)

### 步骤1: 连接GitHub

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库

### 步骤2: 自动配置

Vercel 会自动检测 Vue 项目并配置

### 步骤3: 部署

点击 "Deploy" 即可自动部署

**优点**:
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 性能优化

---

## 🖥️ 方案3: 自己的服务器 (完全控制)

### 前置条件

- Linux 服务器 (Ubuntu 20.04+)
- SSH 访问权限
- Node.js 16+ 已安装

### 步骤1: 服务器准备

```bash
# SSH 连接到服务器
ssh user@your-server-ip

# 安装 Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 (进程管理)
sudo npm install -g pm2

# 安装 Nginx (反向代理)
sudo apt-get install -y nginx
```

### 步骤2: 克隆项目

```bash
# 进入项目目录
cd /home/user/projects

# 克隆仓库
git clone https://github.com/your-username/vue-project.git
cd vue-project

# 安装依赖
npm install

# 构建项目
npm run build
```

### 步骤3: 配置 PM2

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'dashboard',
    script: './dist/index.html',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

启动应用:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 步骤4: 配置 Nginx

编辑 `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书 (使用 Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 静态文件
    location / {
        root /home/user/projects/vue-project/dist;
        try_files $uri $uri/ /index.html;
    }

    # 缓存配置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

重启 Nginx:

```bash
sudo systemctl restart nginx
```

### 步骤5: 配置 SSL 证书

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --nginx -d your-domain.com

# 自动续期
sudo systemctl enable certbot.timer
```

---

## 🔄 方案4: GitHub Actions (自动化部署)

### 步骤1: 创建工作流文件

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm install

    - name: Build project
      run: npm run build

    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        source: "dist/*"
        target: "/home/user/projects/vue-project"

    - name: Restart application
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /home/user/projects/vue-project
          pm2 restart dashboard
```

### 步骤2: 配置 GitHub Secrets

在 GitHub 仓库设置中添加:

1. `SERVER_HOST` - 服务器IP地址
2. `SERVER_USER` - SSH 用户名
3. `SERVER_SSH_KEY` - SSH 私钥

### 步骤3: 自动部署

每次推送到 `main` 分支时自动:
1. 安装依赖
2. 构建项目
3. 上传到服务器
4. 重启应用

---

## 🐳 方案5: Docker 部署

### 步骤1: 创建 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### 步骤2: 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

### 步骤3: 构建和运行

```bash
# 构建镜像
docker-compose build

# 运行容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 📋 快速部署清单

### Netlify/Vercel (推荐)
- [ ] 创建 GitHub 账户和仓库
- [ ] 连接 Netlify/Vercel
- [ ] 配置构建命令
- [ ] 推送代码
- [ ] 自动部署完成

### 自己的服务器
- [ ] 购买服务器
- [ ] 安装 Node.js 和 Nginx
- [ ] 克隆项目
- [ ] 配置 Nginx
- [ ] 配置 SSL 证书
- [ ] 启动应用
- [ ] 配置 GitHub Actions (可选)

---

## 🔍 部署后检查

### 功能测试

```bash
# 检查应用是否运行
curl http://localhost:3000

# 检查构建文件
ls -la dist/

# 检查进程状态
pm2 status

# 查看日志
pm2 logs dashboard
```

### 性能检查

- [ ] 页面加载时间 < 2s
- [ ] 图表渲染时间 < 500ms
- [ ] 没有 JavaScript 错误
- [ ] 响应式设计正常

---

## 🚨 常见问题

### Q: 部署后页面空白?
A: 检查构建输出，确保 `dist` 文件夹存在且包含 `index.html`

### Q: 图表不显示?
A: 检查 ECharts 是否正确安装，查看浏览器控制台错误

### Q: 如何更新已部署的应用?
A: 
- Netlify/Vercel: 推送到 GitHub 即可自动更新
- 自己的服务器: 运行 `git pull && npm run build && pm2 restart dashboard`

### Q: 如何查看部署日志?
A:
- Netlify/Vercel: 在仪表板查看构建日志
- 自己的服务器: 运行 `pm2 logs dashboard`

### Q: SSL 证书过期怎么办?
A: Certbot 会自动续期，无需手动操作

---

## 📊 推荐方案总结

### 最简单 (推荐新手)
**Netlify 或 Vercel**
- 完全免费
- 自动部署
- 无需服务器知识

### 最灵活 (推荐生产环境)
**自己的服务器 + GitHub Actions**
- 完全控制
- 可扩展性强
- 需要一些服务器知识

### 最现代 (推荐容器化)
**Docker + 云平台**
- 容器化部署
- 易于扩展
- 需要 Docker 知识

---

## 🎯 下一步

1. **选择部署方案** - 根据需求选择
2. **准备部署环境** - 按照步骤配置
3. **测试部署流程** - 确保一切正常
4. **监控应用状态** - 定期检查

---

**推荐**: 新手使用 Netlify/Vercel，生产环境使用自己的服务器 + GitHub Actions
