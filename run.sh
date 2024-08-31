#!/bin/zsh

# 此脚本用于启动项目的前端或后端服务
# 使用方法: ./run.sh [frontend|backend]
# 如果不提供参数，默认启动前端服务

# 加载 zsh 配置文件
source ~/.zshrc

# 设置默认参数为 frontend
TARGET=${1:-frontend}

# 根据参数执行不同的命令
if [ "$TARGET" = "frontend" ]; then
  # 启动前端服务
  npm start
elif [ "$TARGET" = "backend" ]; then
  # 启动后端服务
  npx wrangler pages dev
else
  # 如果提供了无效参数，显示错误信息
  echo "无效的参数。请使用 'frontend' 或 'backend'。"
  exit 1
fi
