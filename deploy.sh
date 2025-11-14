#!/bin/bash

# 自动化部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境
check_environment() {
    echo -e "${YELLOW}📋 检查环境...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 环境检查通过${NC}"
    echo "   Node.js: $(node -v)"
    echo "   npm: $(npm -v)"
}

# 安装依赖
install_dependencies() {
    echo -e "${YELLOW}📦 安装依赖...${NC}"
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 构建项目
build_project() {
    echo -e "${YELLOW}🔨 构建项目...${NC}"
    npm run build
    echo -e "${GREEN}✅ 项目构建完成${NC}"
}

# 检查构建输出
check_build() {
    echo -e "${YELLOW}🔍 检查构建输出...${NC}"
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ dist 文件夹不存在${NC}"
        exit 1
    fi
    
    if [ ! -f "dist/index.html" ]; then
        echo -e "${RED}❌ dist/index.html 不存在${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 构建输出检查通过${NC}"
    echo "   文件数: $(find dist -type f | wc -l)"
    echo "   总大小: $(du -sh dist | cut -f1)"
}

# 本地预览
preview_local() {
    echo -e "${YELLOW}👀 启动本地预览...${NC}"
    echo -e "${GREEN}✅ 预览已启动${NC}"
    echo "   访问: http://localhost:5173"
    echo "   按 Ctrl+C 停止"
    npm run preview
}

# 部署到服务器
deploy_to_server() {
    echo -e "${YELLOW}🌐 部署到服务器...${NC}"
    
    read -p "请输入服务器地址 (user@host): " server_address
    read -p "请输入目标路径 (默认: /home/user/projects/vue-project): " target_path
    target_path=${target_path:-/home/user/projects/vue-project}
    
    echo "   服务器: $server_address"
    echo "   目标路径: $target_path"
    
    # 上传文件
    scp -r dist/* "$server_address:$target_path/dist/"
    
    # 重启应用
    ssh "$server_address" "cd $target_path && pm2 restart dashboard"
    
    echo -e "${GREEN}✅ 部署完成${NC}"
}

# 主菜单
show_menu() {
    echo ""
    echo -e "${YELLOW}请选择部署方式:${NC}"
    echo "1) 检查环境"
    echo "2) 安装依赖"
    echo "3) 构建项目"
    echo "4) 检查构建输出"
    echo "5) 本地预览"
    echo "6) 部署到服务器"
    echo "7) 完整部署 (1-4)"
    echo "8) 完整部署 + 上传 (1-6)"
    echo "0) 退出"
    echo ""
}

# 完整部署流程
full_deploy() {
    check_environment
    install_dependencies
    build_project
    check_build
}

# 完整部署 + 上传
full_deploy_with_upload() {
    full_deploy
    deploy_to_server
}

# 主程序
main() {
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   卷烟机剔除看板 - 自动化部署工具     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ $# -eq 0 ]; then
        # 交互模式
        while true; do
            show_menu
            read -p "请选择 (0-8): " choice
            
            case $choice in
                1) check_environment ;;
                2) install_dependencies ;;
                3) build_project ;;
                4) check_build ;;
                5) preview_local ;;
                6) deploy_to_server ;;
                7) full_deploy ;;
                8) full_deploy_with_upload ;;
                0) echo "👋 再见!"; exit 0 ;;
                *) echo -e "${RED}❌ 无效选择${NC}" ;;
            esac
        done
    else
        # 命令行模式
        case $1 in
            check) check_environment ;;
            install) install_dependencies ;;
            build) build_project ;;
            verify) check_build ;;
            preview) preview_local ;;
            deploy) deploy_to_server ;;
            full) full_deploy ;;
            all) full_deploy_with_upload ;;
            *) echo "用法: $0 [check|install|build|verify|preview|deploy|full|all]" ;;
        esac
    fi
}

# 运行主程序
main "$@"
