#!/bin/bash

# 部署脚本
# 用于自动化部署流程

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 命令未找到，请先安装 $1"
        exit 1
    fi
}

# 检查环境变量
check_env() {
    if [ -z "$NODE_ENV" ]; then
        export NODE_ENV=production
        log_warning "NODE_ENV 未设置，默认为 production"
    fi

    if [ -z "$PORT" ]; then
        export PORT=3000
        log_warning "PORT 未设置，默认为 3000"
    fi
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."
    
    if [ -f "pnpm-lock.yaml" ]; then
        log_info "使用 pnpm 安装依赖"
        corepack enable pnpm
        pnpm install --frozen-lockfile
    elif [ -f "yarn.lock" ]; then
        log_info "使用 yarn 安装依赖"
        yarn install --frozen-lockfile
    else
        log_info "使用 npm 安装依赖"
        npm ci
    fi
    
    log_success "依赖安装完成"
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm test --coverage --watchAll=false
        elif [ -f "yarn.lock" ]; then
            yarn test --coverage --watchAll=false
        else
            npm test -- --coverage --watchAll=false
        fi
        log_success "测试通过"
    else
        log_warning "未找到测试脚本，跳过测试"
    fi
}

# 代码质量检查
run_lint() {
    log_info "运行代码质量检查..."
    
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm lint
        elif [ -f "yarn.lock" ]; then
            yarn lint
        else
            npm run lint
        fi
        log_success "代码质量检查通过"
    else
        log_warning "未找到 lint 脚本，跳过代码质量检查"
    fi
}

# 构建应用
build_app() {
    log_info "构建应用..."
    
    if [ -f "pnpm-lock.yaml" ]; then
        pnpm build
    elif [ -f "yarn.lock" ]; then
        yarn build
    else
        npm run build
    fi
    
    log_success "应用构建完成"
}

# 构建 Docker 镜像
build_docker() {
    if [ "$1" = "docker" ]; then
        log_info "构建 Docker 镜像..."
        
        check_command "docker"
        
        # 构建镜像
        docker build -t tinycompressor:latest .
        
        log_success "Docker 镜像构建完成"
    fi
}

# 部署到服务器
deploy_server() {
    if [ "$1" = "server" ]; then
        log_info "部署到服务器..."
        
        # 检查必要的环境变量
        if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
            log_error "请设置 DEPLOY_HOST 和 DEPLOY_USER 环境变量"
            exit 1
        fi
        
        # 创建部署目录
        ssh $DEPLOY_USER@$DEPLOY_HOST "mkdir -p /var/www/tinycompressor"
        
        # 同步文件
        rsync -avz --delete \
            --exclude node_modules \
            --exclude .next \
            --exclude .git \
            --exclude .env.local \
            ./ $DEPLOY_USER@$DEPLOY_HOST:/var/www/tinycompressor/
        
        # 在服务器上安装依赖和构建
        ssh $DEPLOY_USER@$DEPLOY_HOST "cd /var/www/tinycompressor && ./scripts/deploy.sh local"
        
        # 重启服务
        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo systemctl restart tinycompressor"
        
        log_success "服务器部署完成"
    fi
}

# 本地部署
deploy_local() {
    log_info "本地部署..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
        log_warning "端口 $PORT 已被占用，尝试停止现有进程"
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    fi
    
    # 启动应用
    if [ -f "pnpm-lock.yaml" ]; then
        pnpm start
    elif [ -f "yarn.lock" ]; then
        yarn start
    else
        npm start
    fi
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
            log_success "健康检查通过"
            return 0
        fi
        
        log_info "健康检查失败，重试 $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "健康检查失败，应用可能未正常启动"
    return 1
}

# 清理函数
cleanup() {
    log_info "清理临时文件..."
    rm -rf .next/cache
    log_success "清理完成"
}

# 主函数
main() {
    log_info "开始部署流程..."
    
    # 检查必要的命令
    check_command "node"
    check_command "npm"
    
    # 检查环境
    check_env
    
    # 根据参数执行不同的部署步骤
    case "$1" in
        "local")
            install_dependencies
            run_tests
            run_lint
            build_app
            deploy_local
            ;;
        "docker")
            install_dependencies
            run_tests
            run_lint
            build_app
            build_docker
            ;;
        "server")
            install_dependencies
            run_tests
            run_lint
            build_app
            deploy_server
            health_check
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "build")
            install_dependencies
            build_app
            ;;
        "health")
            health_check
            ;;
        *)
            echo "用法: $0 {local|docker|server|test|lint|build|health}"
            echo ""
            echo "  local   - 本地部署"
            echo "  docker  - 构建 Docker 镜像"
            echo "  server  - 部署到服务器"
            echo "  test    - 运行测试"
            echo "  lint    - 代码质量检查"
            echo "  build   - 构建应用"
            echo "  health  - 健康检查"
            exit 1
            ;;
    esac
    
    # 清理
    cleanup
    
    log_success "部署流程完成"
}

# 设置错误处理
trap cleanup EXIT

# 执行主函数
main "$@"

