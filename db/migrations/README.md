# Миграции базы данных

## Структура

- `20260203_create_knowledge_base.sql` - Основная миграция для создания таблицы knowledge_base
- `dev_drop_knowledge_base.sql` - DEV-ONLY скрипт для удаления таблицы (только для разработки!)

## Использование

### Production миграция

Выполните в Supabase SQL Editor:

```sql
-- Файл: db/migrations/20260203_create_knowledge_base.sql
```

Эта миграция безопасна для выполнения на production БД:
- Использует `CREATE TABLE IF NOT EXISTS`
- Использует `CREATE INDEX IF NOT EXISTS`
- Проверяет существование политик перед созданием
- Не удаляет существующие данные

### DEV миграция (только для разработки!)

⚠️ **ВНИМАНИЕ:** Этот скрипт удаляет таблицу и все данные!

```sql
-- Файл: db/migrations/dev_drop_knowledge_base.sql
```

Используйте ТОЛЬКО в development окружении!

## Порядок выполнения

1. Для новой БД:
   - Выполните `20260203_create_knowledge_base.sql`

2. Для пересоздания таблицы в dev:
   - Выполните `dev_drop_knowledge_base.sql`
   - Затем выполните `20260203_create_knowledge_base.sql`

3. После создания таблицы:
   - Запустите импорт: `npm run kb:import`
