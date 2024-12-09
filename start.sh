#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Configurar backend
echo "📦 Configurando backend..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ ! -f database/database.sqlite ]; then
    mkdir -p database
    touch database/database.sqlite
fi

# Configurar frontend
echo "📦 Configurando frontend..."
cd ../frontend
if [ ! -f .env.local ]; then
    cp .env.example .env.local
fi

# Construir e iniciar containers
echo "🐳 Construindo containers..."
cd ..
docker compose build

echo "🚀 Iniciando containers..."
docker compose up -d

# Aguardar backend estar pronto
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Configurar backend
echo "🔧 Configurando banco de dados..."
docker exec backend php artisan key:generate
docker exec backend php artisan migrate:fresh
docker exec backend php artisan db:seed

echo "✅ Ambiente iniciado com sucesso!"
echo "📝 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:8000"
# echo "📨 Fila de emails rodando em background" 