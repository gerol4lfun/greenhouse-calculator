/**
 * Парсер текста для извлечения городов и дат доставки
 */

/**
 * Нормализует дату в формате ДД.ММ (добавляет ведущие нули)
 * @param {string} dm - Дата в формате Д.ММ или ДД.ММ
 * @returns {string} Нормализованная дата ДД.ММ
 */
function normalizeDM(dm) {
    if (!dm) return dm;
    const parts = dm.split('.').map(x => x.trim());
    if (parts.length !== 2) return dm;
    const [d, m] = parts;
    if (!d || !m) return dm;
    return `${d.padStart(2, '0')}.${m.padStart(2, '0')}`; // 9.02 -> 09.02, но оставляем как есть если уже 12.02
}

/**
 * Парсит одну строку: "Город с ДД.ММ[, кроме ДД.ММ, ДД.ММ]"
 * @param {string} line - Строка для парсинга
 * @returns {Object|null} Объект {city_name, delivery_date, restrictions} или null
 */
function parseDeliveryLine(line) {
    // Универсальный паттерн: поддерживает оба формата
    // Москва с 12.02, кроме 13.02, 14.02
    // Москва с 12.02 (кроме 13.02, 14.02)
    // Питер с 9.02
    
    // Сначала пробуем формат с запятой
    let m = line.match(/^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})(?:\s*,\s*кроме\s*(.+))?$/i);
    
    // Если не нашли, пробуем формат со скобками
    if (!m) {
        m = line.match(/^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})(?:\s*\(кроме\s*([^)]+)\))?$/i);
    }
    
    if (!m) {
        console.log(`  ❌ Не распознана: "${line}"`);
        return null;
    }

    const city_name = m[1].trim();
    const delivery_date = normalizeDM(m[2].trim());

    let restrictions = null;
    if (m[3]) {
        // Обрабатываем ограничения
        const restrictionsText = m[3]
            .replace(/^\s*кроме\s+/i, '') // на всякий случай убираем "кроме" если есть
            .trim();
        
        if (restrictionsText.toLowerCase().includes('дату доставки нет') || 
            restrictionsText.toLowerCase().includes('доставки нет')) {
            restrictions = restrictionsText;
        } else {
            // Это список дат через запятую
            restrictions = restrictionsText
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .map(normalizeDM)
                .join(', '); // ✅ "13.02, 14.02"
        }
        
        console.log(`  ✅ Найдено с ограничениями: ${city_name} - ${delivery_date}, кроме ${restrictions}`);
    } else {
        console.log(`  ✅ Найдено без ограничений: ${city_name} - ${delivery_date}`);
    }

    return { 
        city_name, 
        delivery_date, 
        restrictions 
    };
}

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

    // ВАЖНО: Делим ТОЛЬКО по переносам строк, НЕ по запятым!
    const lines = text
        .split(/\r?\n/)          // ✅ только переносы строк
        .map(l => l.trim())
        .filter(Boolean);        // убираем пустые строки
    
    console.log(`🔍 Парсинг: обработано ${lines.length} строк`);
    
    const results = lines
        .map(parseDeliveryLine)
        .filter(Boolean);        // убираем null
    
    // Преобразуем в формат, который ожидает остальной код
    return results.map(item => {
        const normalizedCity = normalizeCityName(item.city_name);
        return {
            city: normalizedCity,
            originalCity: item.city_name,
            date: item.delivery_date,
            restrictions: item.restrictions
        };
    });
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
