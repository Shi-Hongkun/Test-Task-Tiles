#!/bin/bash
set -e

echo "🔄 重启Task Tiles服务..."

# 尝试停止所有可能的服务
echo "🛑 停止现有服务..."
pkill -f "tsx.*backend" 2>/dev/null || echo "后端服务已停止"
pkill -f "vite" 2>/dev/null || echo "前端服务已停止"
pkill -f "node.*frontend" 2>/dev/null || echo "前端Node进程已停止"

# 等待端口释放
echo "⏳ 等待端口释放..."
sleep 3

# 检查端口状态
echo "📊 检查端口状态..."
curl -s http://localhost:5173/ >/dev/null 2>&1 && echo "⚠️  端口5173仍被占用" || echo "✅ 端口5173已释放"
curl -s http://localhost:5174/ >/dev/null 2>&1 && echo "⚠️  端口5174仍被占用" || echo "✅ 端口5174已释放"
curl -s http://localhost:5175/ >/dev/null 2>&1 && echo "⚠️  端口5175仍被占用" || echo "✅ 端口5175已释放"

# 重启服务
echo "🚀 重启服务..."
echo "🎯 启动后端服务 (端口3001)..."
PORT=3001 pnpm --filter backend dev &
BACKEND_PID=$!

echo "🎨 启动前端服务 (端口5173)..."
pnpm --filter frontend dev &
FRONTEND_PID=$!

echo "🎉 服务重启完成！"
echo "📊 后端API: http://localhost:3001"
echo "🌐 前端App: http://localhost:5173 (如果5173被占用会自动选择其他端口)"
echo "🔧 健康检查: http://localhost:3001/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户停止服务
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# 等待后台进程
wait 