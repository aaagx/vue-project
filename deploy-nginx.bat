@echo off
REM Nginx 一键部署脚本 (Windows 版本)
REM 用法: deploy-nginx.bat <server_address> <target_path>
REM 示例: deploy-nginx.bat user@192.168.1.100 /home/user/dashboard

setlocal enabledelayedexpansion

REM 配置
set SERVER_ADDRESS=%1
set TARGET_PATH=%2
if "%TARGET_PATH%"=="" set TARGET_PATH=/home/user/dashboard

REM 颜色定义 (Windows 10+)
for /F %%A in ('echo prompt $H ^| cmd') do set "BS=%%A"

cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   Nginx 一键部署工具 (Windows)         ║
echo ╚════════════════════════════════════════╝
echo.

REM 检查参数
if "%SERVER_ADDRESS%"=="" (
    echo 错误: 未指定服务器地址
    echo.
    echo 用法:
    echo   deploy-nginx.bat ^<server_address^> [target_path]
    echo.
    echo 参数:
    echo   server_address  - SSH 服务器地址 (user@host)
    echo   target_path     - 目标路径 (默认: /home/user/dashboard)
    echo.
    echo 示例:
    echo   deploy-nginx.bat user@192.168.1.100
    echo   deploy-nginx.bat user@example.com /var/www/dashboard
    echo.
    exit /b 1
)

REM 检查本地环境
echo 📋 检查本地环境...
where node >nul 2>nul
if errorlevel 1 (
    echo 错误: Node.js 未安装
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo 错误: npm 未安装
    exit /b 1
)

echo ✅ 本地环境检查通过
echo.

REM 构建项目
echo 🔨 构建项目...
if not exist "package.json" (
    echo 错误: package.json 不存在
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo 错误: npm install 失败
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo 错误: npm run build 失败
    exit /b 1
)

if not exist "dist" (
    echo 错误: dist 文件夹不存在
    exit /b 1
)

echo ✅ 项目构建完成
echo.

REM 上传文件
echo 📤 上传文件到服务器...
echo    服务器: %SERVER_ADDRESS%
echo    目标路径: %TARGET_PATH%

REM 使用 scp 上传 (需要安装 Git Bash 或 PuTTY)
scp -r dist\* %SERVER_ADDRESS%:%TARGET_PATH%/
if errorlevel 1 (
    echo 错误: 文件上传失败
    echo 请确保:
    echo   1. SSH 密钥已配置
    echo   2. scp 命令可用
    echo   3. 服务器地址正确
    exit /b 1
)

echo ✅ 文件上传完成
echo.

REM 配置 Nginx
echo ⚙️  配置 Nginx...

REM 创建临时配置文件
(
    echo server {
    echo     listen 80;
    echo     server_name _;
    echo.
    echo     root %TARGET_PATH%;
    echo     index index.html;
    echo.
    echo     # Vue Router 支持
    echo     location / {
    echo         try_files $uri $uri/ /index.html;
    echo     }
    echo.
    echo     # 静态资源缓存
    echo     location ~* \.(js^|css^|png^|jpg^|jpeg^|gif^|ico^|svg^|woff^|woff2^|ttf^|eot)$ {
    echo         expires 1y;
    echo         add_header Cache-Control "public, immutable";
    echo     }
    echo.
    echo     # HTML 不缓存
    echo     location ~* \.html$ {
    echo         expires -1;
    echo         add_header Cache-Control "no-cache, no-store, must-revalidate";
    echo     }
    echo.
    echo     # 安全头
    echo     add_header X-Frame-Options "SAMEORIGIN" always;
    echo     add_header X-Content-Type-Options "nosniff" always;
    echo     add_header X-XSS-Protection "1; mode=block" always;
    echo.
    echo     # 日志
    echo     access_log /var/log/nginx/dashboard_access.log;
    echo     error_log /var/log/nginx/dashboard_error.log;
    echo }
) > nginx.conf.tmp

REM 上传配置文件
scp nginx.conf.tmp %SERVER_ADDRESS%:/tmp/nginx.conf
if errorlevel 1 (
    echo 错误: Nginx 配置上传失败
    del nginx.conf.tmp
    exit /b 1
)

REM 在服务器上应用配置
ssh %SERVER_ADDRESS% "sudo cp /tmp/nginx.conf /etc/nginx/sites-available/default && sudo nginx -t && sudo systemctl restart nginx"
if errorlevel 1 (
    echo 错误: Nginx 配置或重启失败
    del nginx.conf.tmp
    exit /b 1
)

del nginx.conf.tmp
echo ✅ Nginx 配置完成
echo.

REM 检查部署
echo ✔️  检查部署...
ssh %SERVER_ADDRESS% "sudo chown -R www-data:www-data %TARGET_PATH% && sudo chmod -R 755 %TARGET_PATH%"
echo ✅ 部署检查完成
echo.

REM 显示部署信息
echo.
echo ╔════════════════════════════════════════╗
echo ║   ✅ 部署完成!                        ║
echo ╚════════════════════════════════════════╝
echo.
echo 部署信息:
echo    服务器: %SERVER_ADDRESS%
echo    路径: %TARGET_PATH%
echo.
echo 访问应用:
echo    http://^<server-ip^>
echo.
echo 查看日志:
echo    ssh %SERVER_ADDRESS%
echo    sudo tail -f /var/log/nginx/dashboard_access.log
echo.
echo 更新应用:
echo    npm run build
echo    scp -r dist\* %SERVER_ADDRESS%:%TARGET_PATH%/
echo    ssh %SERVER_ADDRESS% "sudo systemctl restart nginx"
echo.

endlocal
