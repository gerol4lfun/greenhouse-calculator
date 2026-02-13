# Telegram-бот: даты доставки

Бот получает список дат в ТГ → парсит → обновляет Supabase. Railway деплоит из репо **gerol4lfun/delivery-bot-telegram**.

## Деплой

Код редактируется здесь (`greenhouse-calculator/telegram-bot/`), деплой — из отдельного репо:

```bash
cd ~/Downloads/delivery-bot-telegram
cp /путь/к/greenhouse-calculator/telegram-bot/{cities.js,parser.js,supabase.js,index.js} .
git add . && git commit -m "update" && git push origin main
```

## Чеклист перед первым запуском

1. **Supabase** — выполнить `sql/FIX_DELIVERY_DATES_CLEANUP.sql`
2. **Railway** — задеплоить `cities.js`, `parser.js`, `supabase.js`, `index.js`
3. **Калькулятор** — обновить `js/scripts.js` на хостинге (убран fallback на «Город доставки»)

## Формат сообщений

```
Москва с 12.05
Питер с 06.05
Воронеж с 14.05, кроме 15.05, 16.05
Казань доставки с 07.05, сборки с 08.05 (кроме 09.05, 10.05)
```

Каждый город — с новой строки. Парсер приводит к каноническим названиям (см. `cities.js`).
