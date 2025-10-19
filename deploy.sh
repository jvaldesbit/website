#!/bin/bash

# Script de deployment para el sitio web personal
# Mueve los archivos del proyecto desde ~/MyWebSite/website a /var/www/html

set -e  # Detener el script si hay algún error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/var/www/html/jcvb.com.co"
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}=== Iniciando deployment ===${NC}"

# 1. Verificar que estamos en el servidor correcto
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}Error: El directorio fuente $SOURCE_DIR no existe${NC}"
    exit 1
fi

# 2. Crear directorio de destino si no existe
if [ ! -d "$DEST_DIR" ]; then
    echo -e "${YELLOW}Creando directorio de destino: $DEST_DIR${NC}"
    sudo mkdir -p "$DEST_DIR"
fi

# 3. Crear backup del sitio actual (si existe)
if [ -d "$DEST_DIR" ] && [ "$(ls -A $DEST_DIR)" ]; then
    echo -e "${YELLOW}Creando backup del sitio actual...${NC}"
    mkdir -p "$BACKUP_DIR"
    sudo tar -czf "$BACKUP_DIR/website_backup_$TIMESTAMP.tar.gz" -C "$DEST_DIR" .
    echo -e "${GREEN}Backup creado en: $BACKUP_DIR/website_backup_$TIMESTAMP.tar.gz${NC}"
fi

# 4. Copiar archivos al destino (excluyendo .git)
echo -e "${YELLOW}Copiando archivos al servidor web...${NC}"
sudo rsync -av --delete \
    --exclude='.git' \
    --exclude='deploy.sh' \
    --exclude='cv.md' \
    "$SOURCE_DIR/" "$DEST_DIR/"

# 5. Establecer permisos correctos
echo -e "${YELLOW}Configurando permisos...${NC}"
sudo chown -R www-data:www-data "$DEST_DIR"
sudo find "$DEST_DIR" -type d -exec chmod 755 {} \;
sudo find "$DEST_DIR" -type f -exec chmod 644 {} \;

# 6. Verificar que los archivos principales existen
if [ ! -f "$DEST_DIR/index.html" ]; then
    echo -e "${RED}Error: index.html no encontrado después del deployment${NC}"
    exit 1
fi

echo -e "${GREEN}=== Deployment completado exitosamente ===${NC}"
echo -e "${GREEN}Sitio desplegado en: $DEST_DIR${NC}"
echo ""
echo -e "${YELLOW}Notas:${NC}"
echo "- Asegúrate de que nginx esté configurado para servir desde $DEST_DIR"
echo "- Los backups se guardan en: $BACKUP_DIR"
echo ""
echo -e "${YELLOW}Para revertir el último deployment, ejecuta:${NC}"
echo "sudo tar -xzf $BACKUP_DIR/website_backup_$TIMESTAMP.tar.gz -C $DEST_DIR"
