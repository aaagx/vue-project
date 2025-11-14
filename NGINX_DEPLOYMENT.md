# Nginx 服务器部署指南

## 🎯 快速部署 (仅需 Nginx)

### 前置条件
- Nginx 已安装
- SSH 访问权限
- 域名 (可选)

---

## 📦 步骤1: 本地打包

### 在本地机器上执行

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 验证构建输出
ls -la dist/
# 应该看到:
# - index.html
# - assets/ 文件夹
# - 其他静态文件
```

**构建完成后，`dist` 文件夹包含所有静态文件**

---

## 🚀 步骤2: 上传到服务器

### 方式1: 使用 SCP 上传 (推荐)

```bash
# 从本地上传到服务器
scp -r dist/* user@your-server-ip:/home/user/dashboard/

# 或者上传整个 dist 文件夹
scp -r dist user@your-server-ip:/home/user/
```

### 方式2: 使用 Git 克隆

```bash
# SSH 连接到服务器
ssh user@your-server-ip

# 克隆项目
git clone https://github.com/your-username/vue-project.git
cd vue-project

# 构建项目
npm install
npm run build

# dist 文件夹已生成
```

### 方式3: 使用 FTP/SFTP

```bash
# 使用 FileZilla 或其他 FTP 工具
# 连接到服务器
# 上传 dist 文件夹到 /home/user/dashboard/
```

---

## ⚙️ 步骤3: 配置 Nginx

### SSH 连接到服务器

```bash
ssh user@your-server-ip
```

### 编辑 Nginx 配置文件

```bash
# 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/default
```

### 配置内容

#### 基础配置 (HTTP)

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改为你的域名或IP

    # 根目录指向 dist 文件夹
    root /home/user/dashboard;
    index index.html;

    # 所有请求都指向 index.html (Vue Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁用缓存 HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### 完整配置 (HTTPS + 重定向)

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书路径
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 根目录指向 dist 文件夹
    root /home/user/dashboard;
    index index.html;

    # 所有请求都指向 index.html (Vue Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁用缓存 HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 验证配置

```bash
# 检查 Nginx 配置语法
sudo nginx -t

# 输出应该是:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 重启 Nginx

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 或者
sudo service nginx restart

# 检查状态
sudo systemctl status nginx
```

---

## 🔒 步骤4: 配置 SSL 证书 (可选但推荐)

### 使用 Let's Encrypt (免费)

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --nginx -d your-domain.com

# 自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 验证续期
sudo certbot renew --dry-run
```

---

## 📋 完整部署流程

### 本地操作

```bash
# 1. 构建项目
npm run build

# 2. 验证构建
ls dist/index.html

# 3. 上传到服务器
scp -r dist/* user@your-server-ip:/home/user/dashboard/
```

### 服务器操作

```bash
# 1. SSH 连接
ssh user@your-server-ip

# 2. 检查文件
ls -la /home/user/dashboard/

# 3. 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/default

# 4. 验证配置
sudo nginx -t

# 5. 重启 Nginx
sudo systemctl restart nginx

# 6. 检查状态
sudo systemctl status nginx
```

---

## 🔄 更新部署

### 快速更新脚本

创建 `update.sh`:

```bash
#!/bin/bash

echo "📦 构建项目..."
npm run build

echo "📤 上传到服务器..."
scp -r dist/* user@your-server-ip:/home/user/dashboard/

echo "🔄 重启 Nginx..."
ssh user@your-server-ip "sudo systemctl restart nginx"

echo "✅ 更新完成!"
```

### 使用脚本

```bash
chmod +x update.sh
./update.sh
```

---

## 🧪 测试部署

### 检查文件权限

```bash
# SSH 连接到服务器
ssh user@your-server-ip

# 检查文件权限
ls -la /home/user/dashboard/

# 确保 Nginx 用户可以读取文件
sudo chown -R www-data:www-data /home/user/dashboard/
sudo chmod -R 755 /home/user/dashboard/
```

### 测试访问

```bash
# 本地测试
curl http://your-server-ip

# 或者在浏览器中访问
# http://your-domain.com
# https://your-domain.com
```

### 检查 Nginx 日志

```bash
# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 常见问题

### Q: 页面显示 404 Not Found?

**原因**: Nginx 找不到文件

**解决**:
```bash
# 检查文件是否存在
ls -la /home/user/dashboard/index.html

# 检查文件权限
sudo chown -R www-data:www-data /home/user/dashboard/

# 检查 Nginx 配置中的 root 路径
sudo nano /etc/nginx/sites-available/default
```

### Q: 页面刷新后显示 404?

**原因**: Vue Router 路由问题

**解决**: 确保 Nginx 配置中有以下内容:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Q: 静态资源加载失败?

**原因**: 资源路径错误

**解决**:
```bash
# 检查 dist 文件夹结构
ls -la /home/user/dashboard/assets/

# 检查 Nginx 日志
sudo tail -f /var/log/nginx/error.log
```

### Q: HTTPS 证书错误?

**原因**: SSL 证书配置错误

**解决**:
```bash
# 检查证书文件
ls -la /etc/letsencrypt/live/your-domain.com/

# 重新生成证书
sudo certbot certonly --nginx -d your-domain.com --force-renewal
```

### Q: 如何查看 Nginx 状态?

```bash
# 查看进程
ps aux | grep nginx

# 查看监听端口
sudo netstat -tlnp | grep nginx

# 查看配置
sudo nginx -T
```

---

## 📊 Nginx 配置最佳实践

### 1. 启用 Gzip 压缩

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json application/javascript;
gzip_min_length 1000;
```

### 2. 添加安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 3. 性能优化

```nginx
# 增加连接数
worker_connections 2048;

# 启用 HTTP/2
listen 443 ssl http2;

# 启用 keepalive
keepalive_timeout 65;
```

---

## 🚀 完整的生产级配置

```nginx
# HTTP 重定向
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 根目录
    root /home/user/dashboard;
    index index.html;

    # 日志
    access_log /var/log/nginx/dashboard_access.log;
    error_log /var/log/nginx/dashboard_error.log;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Vue Router 支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

---

## ✅ 部署检查清单

- [ ] 本地构建成功 (`npm run build`)
- [ ] `dist` 文件夹包含 `index.html`
- [ ] 文件已上传到服务器
- [ ] Nginx 配置已更新
- [ ] Nginx 配置验证通过 (`sudo nginx -t`)
- [ ] Nginx 已重启 (`sudo systemctl restart nginx`)
- [ ] 文件权限正确 (`sudo chown -R www-data:www-data /home/user/dashboard/`)
- [ ] 可以访问应用
- [ ] 页面刷新正常工作
- [ ] 静态资源加载正常
- [ ] HTTPS 配置完成 (可选)

---

## 🎯 总结

### 最简单的部署方式

```bash
# 1. 本地构建
npm run build

# 2. 上传到服务器
scp -r dist/* user@your-server-ip:/home/user/dashboard/

# 3. 配置 Nginx (一次性)
# 编辑 /etc/nginx/sites-available/default
# 添加上面的配置

# 4. 重启 Nginx
ssh user@your-server-ip "sudo systemctl restart nginx"

# 完成！
```

### 更新应用

```bash
# 只需重复步骤 1-2，然后重启 Nginx
npm run build
scp -r dist/* user@your-server-ip:/home/user/dashboard/
ssh user@your-server-ip "sudo systemctl restart nginx"
```

---

**提示**: 使用上面的 `update.sh` 脚本可以一键完成所有步骤！
