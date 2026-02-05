/**
 * Парсер текста для извлечения городов и дат доставки
 */

/**
 * Парсит текст и извлекает информацию о городах и датах доставки
 * @param {string} text - Текст для парсинга
 * @returns {Array} Массив объектов {city, date, restrictions}
 */
function parseDeliveryDates(text) {
    if (!text || typeof text !== 'string') {
        console.error('❌ parseDeliveryDates: text is not a string:', typeof text);
        return [];
    }

    // Нормализуем текст: убираем лишние пробелы, заменяем неразрывные пробелы
    const normalizedText = text
        .replace(/\u00A0/g, ' ') // Заменяем неразрывные пробелы на обычные
        .replace(/\u2009/g, ' ') // Заменяем тонкие пробелы
        .replace(/\u202F/g, ' ') // Заменяем узкие неразрывные пробелы
        .replace(/\r\n/g, '\n') // Нормализуем переносы строк
        .replace(/\r/g, '\n');
    
    const lines = normalizedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    console.log(`🔍 Парсинг: обработано ${lines.length} строк`);
    
    const results = [];

    // Регулярное выражение для поиска:
    // 1. "Город с ДД.ММ" - простая дата
    // 2. "Город с ДД.ММ, кроме ДД.ММ, ДД.ММ" - с запятой перед "кроме"
    // 3. "Город с ДД.ММ (кроме ДД.ММ, ДД.ММ)" - со скобками
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let city, date, restrictions = null;
        
        // Сначала пробуем формат с запятой: "Город с ДД.ММ, кроме ..."
        // ВАЖНО: Проверяем этот формат ПЕРВЫМ, так как он более специфичный
        // Улучшенное регулярное выражение: более гибкое к пробелам
        const patternWithComma = /^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})\s*,\s*кроме\s+(.+)$/i;
        let match = line.match(patternWithComma);
        
        if (match) {
            city = match[1].trim();
            date = match[2].trim();
            const restrictionsText = match[3].trim();
            
            console.log(`  ✅ Строка ${i + 1}: найдено с ограничениями (запятая) - ${city}, ${date}, кроме ${restrictionsText}`);
            
            // Обрабатываем ограничения
            if (restrictionsText.toLowerCase().includes('дату доставки нет') || 
                restrictionsText.toLowerCase().includes('доставки нет')) {
                restrictions = restrictionsText;
            } else {
                // Это список дат через запятую
                restrictions = restrictionsText.split(',').map(r => r.trim()).join(', ');
            }
        } else {
            // Пробуем формат со скобками: "Город с ДД.ММ (кроме ...)"
            const patternWithBrackets = /^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})\s*\(кроме\s+([^)]+)\)$/i;
            match = line.match(patternWithBrackets);
            
            if (match) {
                city = match[1].trim();
                date = match[2].trim();
                const restrictionsText = match[3].trim();
                
                console.log(`  ✅ Строка ${i + 1}: найдено с ограничениями (скобки) - ${city}, ${date}, кроме ${restrictionsText}`);
                
                // Обрабатываем ограничения
                if (restrictionsText.toLowerCase().includes('дату доставки нет') || 
                    restrictionsText.toLowerCase().includes('доставки нет')) {
                    restrictions = restrictionsText;
                } else {
                    // Это список дат через запятую
                    restrictions = restrictionsText.split(',').map(r => r.trim()).join(', ');
                }
            } else {
                // Простой формат без ограничений: "Город с ДД.ММ"
                // ВАЖНО: Проверяем, что после даты нет запятой и "кроме"
                const patternSimple = /^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})(?:\s|$)/i;
                match = line.match(patternSimple);
                
                // Дополнительная проверка: если после даты есть запятая и "кроме", это не простой формат
                if (match && line.includes(',') && line.includes('кроме')) {
                    console.log(`  ⚠️ Строка ${i + 1}: пропущена (есть запятая и "кроме", но не распознана): "${line}"`);
                    match = null;
                }
                
                if (match) {
                    city = match[1].trim();
                    date = match[2].trim();
                    console.log(`  ✅ Строка ${i + 1}: найдено без ограничений - ${city}, ${date}`);
                } else {
                    console.log(`  ❌ Строка ${i + 1}: не распознана - "${line}"`);
                }
            }
        }
        
        // Если нашли город и дату, добавляем в результаты
        if (city && date) {
            // Нормализация названий городов
            const normalizedCity = normalizeCityName(city);

            results.push({
                city: normalizedCity,
                originalCity: city,
                date: date,
                restrictions: restrictions
            });
        } else {
            // Если не нашли - логируем для отладки
            console.log(`  ❌ Строка ${i + 1}: не удалось распарсить - "${line}"`);
            // Пробуем понять, почему не распозналось
            if (line.includes('с ') && line.includes('.')) {
                console.log(`     ⚠️ Строка содержит "с " и точку, но не распознана. Возможно, проблема с форматом.`);
            }
        }
    }

    return results;
}

/**
 * Нормализует название города (приводит к стандартному виду)
 */
function normalizeCityName(city) {
    const cityMap = {
        'питер': 'Санкт-Петербург',
        'петербург': 'Санкт-Петербург',
        'спб': 'Санкт-Петербург',
        'нн': 'Нижний Новгород',
        'нижний': 'Нижний Новгород',
        'челны': 'Набережные Челны',
        'набережные челны': 'Набережные Челны',
        'йошкар-ола': 'Йошкар-Ола',
        'орёл': 'Орёл',
        'орёл': 'Орёл'
    };

    const lowerCity = city.toLowerCase().trim();
    
    // Проверяем точное совпадение
    if (cityMap[lowerCity]) {
        return cityMap[lowerCity];
    }

    // Проверяем частичное совпадение
    for (const [key, value] of Object.entries(cityMap)) {
        if (lowerCity.includes(key) || key.includes(lowerCity)) {
            return value;
        }
    }

    // Если не найдено, возвращаем с заглавной буквы
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}

/**
 * Форматирует результаты парсинга для отображения пользователю
 */
function formatParsedResults(results) {
    if (results.length === 0) {
        return '❌ Не найдено ни одной записи в формате "Город с ДД.ММ"';
    }

    let message = `✅ Найдено записей: ${results.length}\n\n`;
    
    results.forEach((item, index) => {
        message += `${index + 1}. ${item.city} - ${item.date}`;
        if (item.restrictions) {
            message += ` (кроме ${item.restrictions})`;
        }
        message += '\n';
    });

    return message;
}

module.exports = {
    parseDeliveryDates,
    normalizeCityName,
    formatParsedResults
};
