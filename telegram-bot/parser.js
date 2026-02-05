/**
 * Парсер текста для извлечения городов и дат доставки
 */

/**
 * Парсит текст и извлекает информацию о городах и датах доставки
 * @param {string} text - Текст для парсинга
 * @returns {Array} Массив объектов {city, date, restrictions}
 */
function parseDeliveryDates(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const results = [];

    // Регулярное выражение для поиска: "Город с ДД.ММ" или "Город с ДД.ММ (кроме ДД, ДД)" или "Город с ДД.ММ (кроме и в этот дату доставки нет)"
    const pattern = /^(.+?)\s+с\s+(\d{1,2}\.\d{1,2})(?:\s*\(кроме\s+([^)]+)\))?$/i;

    for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
            const city = match[1].trim();
            const date = match[2].trim();
            let restrictions = null;
            
            // Обрабатываем ограничения
            if (match[3]) {
                const restrictionsText = match[3].trim();
                // Если это "и в этот дату доставки нет" или подобное, сохраняем как есть
                if (restrictionsText.toLowerCase().includes('дату доставки нет') || 
                    restrictionsText.toLowerCase().includes('доставки нет')) {
                    restrictions = restrictionsText;
                } else {
                    // Иначе это список дат через запятую
                    restrictions = restrictionsText.split(',').map(r => r.trim()).join(', ');
                }
            }

            // Нормализация названий городов
            const normalizedCity = normalizeCityName(city);

            results.push({
                city: normalizedCity,
                originalCity: city,
                date: date,
                restrictions: restrictions
            });
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
