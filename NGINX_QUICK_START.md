# ⚡ Nginx 快速部署 (5分钟)

## 🎯 最快的方式

### 步骤1: 本地构建 (1分钟)

```bash
npm run build
```

### 步骤2: 上传到服务器 (1分钟)

```bash
# 使用 SCP 上传
scp -r dist/* user@your-server-ip:/home/user/dashboard/
```

### 步骤3: 配置 Nginx (2分钟)

```bash
# SSH 连接到服务器
ssh user@your-server-ip

# 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/default
```

**粘贴以下配置**:

```nginx
server {
    listen 80;
    server_name _;

    root /home/user/dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### 步骤4: 重启 Nginx (1分钟)

```bash
# 验证配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 检查状态
sudo systemctl status nginx
```

**完成！** 访问 `http://your-server-ip` 🎉

---

## 🚀 使用自动化脚本 (更简单)

### Linux/Mac

```bash
# 给脚本添加执行权限
chmod +x deploy-nginx.sh

# 运行脚本
./deploy-nginx.sh user@your-server-ip /home/user/dashboard
```

### Windows

```bash
# 运行批处理脚本
deploy-nginx.bat user@your-server-ip /home/user/dashboard
```

**脚本会自动完成所有步骤！**

---

## 📋 完整命令速查

### 本地操作

```bash
# 构建
npm run build

# 上传
scp -r dist/* user@192.168.1.100:/home/user/dashboard/
```

### 服务器操作

```bash
# SSH 连接
ssh user@192.168.1.100

# 编辑配置
sudo nano /etc/nginx/sites-available/default

# 验证配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔄 更新应用

### 快速更新 (3步)

```bash
# 1. 本地构建
npm run build

# 2. 上传
scp -r dist/* user@192.168.1.100:/home/user/dashboard/

# 3. 重启 Nginx
ssh user@192.168.1.100 "sudo systemctl restart nginx"
```

### 使用脚本更新

创建 `update.sh`:

```bash
#!/bin/bash
npm run build
scp -r dist/* user@192.168.1.100:/home/user/dashboard/
ssh user@192.168.1.100 "sudo systemctl restart nginx"
echo "✅ 更新完成"
```

运行:
```bash
chmod +x update.sh
./update.sh
```

---

## 🧪 测试部署

### 检查应用是否运行

```bash
# 在本地测试
curl http://your-server-ip

# 或在浏览器访问
# http://your-server-ip
```

### 检查文件权限

```bash
ssh user@your-server-ip "ls -la /home/user/dashboard/"
```

### 查看错误日志

```bash
ssh user@your-server-ip "sudo tail -f /var/log/nginx/error.log"
```

---

## 🐛 快速排查

### 问题: 页面显示 404

```bash
# 检查文件是否存在
ssh user@your-server-ip "ls -la /home/user/dashboard/index.html"

# 检查权限
ssh user@your-server-ip "sudo chown -R www-data:www-data /home/user/dashboard/"
```

### 问题: 页面刷新后 404

**确保 Nginx 配置中有**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 问题: 静态资源加载失败

```bash
# 检查日志
ssh user@your-server-ip "sudo tail -f /var/log/nginx/error.log"

# 检查文件
ssh user@your-server-ip "ls -la /home/user/dashboard/assets/"
```

---

## 📊 文件结构

```
本地:
dist/
├── index.html
├── assets/
│   ├── js/
│   ├── css/
│   └── ...
└── ...

服务器:
/home/user/dashboard/
├── index.html
├── assets/
│   ├── js/
│   ├── css/
│   └── ...
└── ...
```

---

## ✅ 部署检查清单

- [ ] 本地构建成功
- [ ] `dist` 文件夹存在
- [ ] 文件已上传到服务器
- [ ] Nginx 配置已更新
- [ ] `sudo nginx -t` 通过
- [ ] Nginx 已重启
- [ ] 可以访问应用
- [ ] 页面刷新正常
- [ ] 静态资源加载正常

---

## 🎯 常用命令

| 任务 | 命令 |
|------|------|
| 构建 | `npm run build` |
| 上传 | `scp -r dist/* user@host:/path/` |
| 验证配置 | `sudo nginx -t` |
| 重启 Nginx | `sudo systemctl restart nginx` |
| 查看状态 | `sudo systemctl status nginx` |
| 查看日志 | `sudo tail -f /var/log/nginx/error.log` |
| 设置权限 | `sudo chown -R www-data:www-data /path/` |

---

## 💡 提示

- 使用 `deploy-nginx.sh` 脚本可以一键完成所有步骤
- 每次更新只需重复"构建 → 上传 → 重启"三步
- 查看 `NGINX_DEPLOYMENT.md` 获取详细文档
- 遇到问题查看 Nginx 错误日志

---

**推荐**: 使用自动化脚本，最快5分钟完成部署！
