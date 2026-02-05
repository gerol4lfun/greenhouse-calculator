-- ============================================
-- СОЗДАНИЕ ТАБЛИЦЫ ДЛЯ ГРЯДОК
-- ============================================
-- 
-- ИНСТРУКЦИЯ:
-- 1. Откройте ваш Supabase проект: https://supabase.com/dashboard
-- 2. Перейдите в раздел "SQL Editor" (слева в меню)
-- 3. Скопируйте весь этот файл и вставьте в SQL Editor
-- 4. Нажмите кнопку "Run" (или F5)
-- 
-- ============================================

-- Создаем таблицу для хранения грядок
CREATE TABLE IF NOT EXISTS beds (
    id TEXT PRIMARY KEY,                    -- Уникальный ID (например, "low-0.5-4")
    height INTEGER NOT NULL,                -- Высота: 19 (низкие) или 38 (высокие)
    width NUMERIC(3,2) NOT NULL,            -- Ширина: 0.5, 0.65, 0.75, 1.0
    length INTEGER NOT NULL,                -- Длина: 4, 6, 8, 10, 12
    price INTEGER NOT NULL,                 -- Цена в рублях
    name TEXT NOT NULL,                     -- Название для отображения
    product_url TEXT,                       -- URL товара на сайте
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_beds_height ON beds(height);
CREATE INDEX IF NOT EXISTS idx_beds_width ON beds(width);
CREATE INDEX IF NOT EXISTS idx_beds_length ON beds(length);
CREATE INDEX IF NOT EXISTS idx_beds_height_width ON beds(height, width);

-- Включаем Row Level Security (RLS) для безопасности
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Создаем политику: все могут читать (anon)
CREATE POLICY "Allow public read access" ON beds
    FOR SELECT
    USING (true);

-- Комментарии к таблице
COMMENT ON TABLE beds IS 'Грядки для теплиц: цены и характеристики';
COMMENT ON COLUMN beds.height IS 'Высота грядки: 19 (низкие) или 38 (высокие) см';
COMMENT ON COLUMN beds.width IS 'Ширина грядки в метрах: 0.5, 0.65, 0.75, 1.0';
COMMENT ON COLUMN beds.length IS 'Длина грядки в метрах: 4, 6, 8, 10, 12';
