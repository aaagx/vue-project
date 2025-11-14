#!/bin/bash

# Nginx 一键部署脚本
# 用法: ./deploy-nginx.sh <server_address> <target_path>
# 示例: ./deploy-nginx.sh user@192.168.1.100 /home/user/dashboard

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
SERVER_ADDRESS="${1:-}"
TARGET_PATH="${2:-/home/user/dashboard}"
NGINX_CONFIG="/etc/nginx/sites-available/default"

# 显示欢迎信息
show_banner() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Nginx 一键部署工具                  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

# 显示帮助
show_help() {
    echo -e "${YELLOW}用法:${NC}"
    echo "  ./deploy-nginx.sh <server_address> [target_path]"
    echo ""
    echo -e "${YELLOW}参数:${NC}"
    echo "  server_address  - SSH 服务器地址 (user@host)"
    echo "  target_path     - 目标路径 (默认: /home/user/dashboard)"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  ./deploy-nginx.sh user@192.168.1.100"
    echo "  ./deploy-nginx.sh user@example.com /var/www/dashboard"
    echo ""
}

# 检查参数
check_arguments() {
    if [ -z "$SERVER_ADDRESS" ]; then
        echo -e "${RED}❌ 错误: 未指定服务器地址${NC}"
        show_help
        exit 1
    fi
}

# 检查本地环境
check_local_env() {
    echo -e "${YELLOW}📋 检查本地环境...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        echo -e "${RED}❌ scp 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 本地环境检查通过${NC}"
}

# 构建项目
build_project() {
    echo -e "${YELLOW}🔨 构建项目...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json 不存在${NC}"
        exit 1
    fi
    
    npm install
    npm run build
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ 构建失败: dist 文件夹不存在${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 项目构建完成${NC}"
    echo "   文件数: $(find dist -type f | wc -l)"
    echo "   总大小: $(du -sh dist | cut -f1)"
}

# 上传文件
upload_files() {
    echo -e "${YELLOW}📤 上传文件到服务器...${NC}"
    echo "   服务器: $SERVER_ADDRESS"
    echo "   目标路径: $TARGET_PATH"
    
    # 创建目标目录
    ssh "$SERVER_ADDRESS" "mkdir -p $TARGET_PATH"
    
    # 上传文件
    scp -r dist/* "$SERVER_ADDRESS:$TARGET_PATH/"
    
    echo -e "${GREEN}✅ 文件上传完成${NC}"
}

# 配置 Nginx
configure_nginx() {
    echo -e "${YELLOW}⚙️  配置 Nginx...${NC}"
    
    # 生成 Nginx 配置
    local nginx_config=$(cat <<EOF
server {
    listen 80;
    server_name _;

    root $TARGET_PATH;
    index index.html;

    # Vue Router 支持
    location / {
        try_files \$uri \$uri/ /index.html;
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

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 日志
    access_log /var/log/nginx/dashboard_access.log;
    error_log /var/log/nginx/dashboard_error.log;
}
EOF
)
    
    # 上传配置文件
    echo "$nginx_config" | ssh "$SERVER_ADDRESS" "sudo tee $NGINX_CONFIG > /dev/null"
    
    echo -e "${GREEN}✅ Nginx 配置完成${NC}"
}

# 验证 Nginx 配置
verify_nginx() {
    echo -e "${YELLOW}🔍 验证 Nginx 配置...${NC}"
    
    ssh "$SERVER_ADDRESS" "sudo nginx -t"
    
    echo -e "${GREEN}✅ Nginx 配置验证通过${NC}"
}

# 重启 Nginx
restart_nginx() {
    echo -e "${YELLOW}🔄 重启 Nginx...${NC}"
    
    ssh "$SERVER_ADDRESS" "sudo systemctl restart nginx"
    
    echo -e "${GREEN}✅ Nginx 已重启${NC}"
}

# 检查部署
check_deployment() {
    echo -e "${YELLOW}✔️  检查部署...${NC}"
    
    # 检查文件
    echo "   检查文件..."
    ssh "$SERVER_ADDRESS" "ls -la $TARGET_PATH/index.html" > /dev/null
    
    # 检查权限
    echo "   检查权限..."
    ssh "$SERVER_ADDRESS" "sudo chown -R www-data:www-data $TARGET_PATH"
    ssh "$SERVER_ADDRESS" "sudo chmod -R 755 $TARGET_PATH"
    
    # 检查 Nginx 状态
    echo "   检查 Nginx 状态..."
    ssh "$SERVER_ADDRESS" "sudo systemctl status nginx" > /dev/null
    
    echo -e "${GREEN}✅ 部署检查完成${NC}"
}

# 显示部署信息
show_deployment_info() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ 部署完成!                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}部署信息:${NC}"
    echo "   服务器: $SERVER_ADDRESS"
    echo "   路径: $TARGET_PATH"
    echo "   Nginx 配置: $NGINX_CONFIG"
    echo ""
    echo -e "${YELLOW}访问应用:${NC}"
    echo "   http://<server-ip>"
    echo ""
    echo -e "${YELLOW}查看日志:${NC}"
    echo "   ssh $SERVER_ADDRESS"
    echo "   sudo tail -f /var/log/nginx/dashboard_access.log"
    echo "   sudo tail -f /var/log/nginx/dashboard_error.log"
    echo ""
    echo -e "${YELLOW}更新应用:${NC}"
    echo "   npm run build"
    echo "   scp -r dist/* $SERVER_ADDRESS:$TARGET_PATH/"
    echo "   ssh $SERVER_ADDRESS 'sudo systemctl restart nginx'"
    echo ""
}

# 主程序
main() {
    show_banner
    check_arguments
    check_local_env
    build_project
    upload_files
    configure_nginx
    verify_nginx
    restart_nginx
    check_deployment
    show_deployment_info
}

# 错误处理
trap 'echo -e "${RED}❌ 部署失败${NC}"; exit 1' ERR

# 运行主程序
main
