#!/bin/bash

# Скрипт для копирования фотографий теплиц в проект
# Версия: v204
# Дата: 2026-02-08

set -e

SOURCE_DIR="теплицы фото"
TARGET_DIR="image/greenhouses"

echo "=== КОПИРОВАНИЕ ФОТОГРАФИЙ ТЕПЛИЦ ==="
echo ""

# Проверяем наличие исходной папки
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Ошибка: Папка '$SOURCE_DIR' не найдена!"
    exit 1
fi

# Создаем целевую папку
mkdir -p "$TARGET_DIR"

echo "📁 Копирую структуру папок..."

# Копируем всю структуру с сохранением прав
cp -R "$SOURCE_DIR"/* "$TARGET_DIR/"

# Исправляем ориентацию всех изображений
echo ""
echo "🔄 Исправляю ориентацию изображений..."

find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read file; do
    if command -v sips >/dev/null 2>&1; then
        sips -O "$file" >/dev/null 2>&1 || true
    fi
done

# Подсчитываем результат
TOTAL_FILES=$(find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | wc -l | tr -d ' ')

echo ""
echo "✅ Готово!"
echo "   Скопировано фотографий: $TOTAL_FILES"
echo "   Целевая папка: $TARGET_DIR"
echo ""
echo "📋 Структура:"
for dir in "$TARGET_DIR"/*/; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        count=$(find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" \) 2>/dev/null | wc -l | tr -d ' ')
        echo "   - $dirname ($count фото)"
    fi
done
