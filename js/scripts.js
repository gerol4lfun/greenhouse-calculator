
// Константа для контроля отладки
const DEBUG = false; // Отключено для продакшена
const APP_VERSION = "v210"; // v210: Админ-панель — RPC update_user_password, выкид при смене пароля (visibilitychange + 30 сек), кнопка только у admin // v209: Тарифы 45/50, даты, КП // v208: Даты, парсер, подарки, КП // v204: Интеграция галереи фотографий теплиц и инструкций по сборке - добавлена внутренняя галерея фотографий теплиц с навигацией по типам/вариантам, добавлен раздел инструкций по сборке с поиском и фильтрацией, улучшен дизайн модальных окон, оптимизирована мобильная верстка, исправлены проблемы с копированием изображений в буфер обмена на macOS, обновлен favicon - добавлена профессиональная иконка калькулятора // v203: Добавлен favicon.ico для устранения ошибки 404, настроено кеширование статических ресурсов (изображения, видео, CSS, JS) через meta-теги и .htaccess, добавлено предупреждение в раздел "Автомат для форточки" о том, что он устанавливается только на дополнительную форточку, сделаны кнопки "скачать" менее заметными (только иконка, меньший размер, приглушенный цвет), добавлена полная надпись "Скачать" в полноэкранном режиме просмотра фото, добавлены мобильные стили для product-info-modal и polycarbonate-info-modal, улучшена адаптивность всех элементов // v202: Сделана вся область названия товара кликабельной (не только иконка), кнопка информации для поликарбоната переделана в стиле product-info-link (прозрачный фон, синий цвет, интегрирована в label), улучшена интерактивность с hover-эффектами

// ==================== СИСТЕМА УВЕДОМЛЕНИЙ (TOAST) ====================

/**
 * Показывает стильное уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип уведомления: 'success', 'error', 'warning', 'info'
 * @param {string} title - Заголовок (опционально)
 * @param {number} duration - Длительность показа в мс (по умолчанию 4000)
 */
function showToast(message, type = 'info', title = null, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Если контейнер не найден, используем fallback на alert
        alert(message);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Иконки для разных типов
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    // Заголовки по умолчанию
    const defaultTitles = {
        success: 'Успешно',
        error: 'Ошибка',
        warning: 'Внимание',
        info: 'Информация'
    };
    
    const toastTitle = title || defaultTitles[type] || 'Уведомление';
    const icon = icons[type] || icons.info;
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${toastTitle}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Автоматическое удаление через duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    }
    
    return toast;
}

// Удобные функции для разных типов уведомлений
function showSuccess(message, title = null, duration = 4000) {
    return showToast(message, 'success', title, duration);
}

function showError(message, title = null, duration = 5000) {
    return showToast(message, 'error', title, duration);
}

function showWarning(message, title = null, duration = 4000) {
    return showToast(message, 'warning', title, duration);
}

function showInfo(message, title = null, duration = 4000) {
    return showToast(message, 'info', title, duration);
}

// Данные о грядках с ценами (универсальные для всех городов)
// Цены одинаковые для всех городов, поэтому хранятся в коде
// Структура: { id, name, price, length, width, height }
const BEDS_DATA = [
    // Низкие грядки (В 19 см)
    // Низкие 0.5 м (Ш 0.5, В 19 см) - шаг +1200
    { id: 'low-0.5-4', name: 'Низкие 0.5 м (Ш 0.5, В 19 см) - 4м', price: 2990, length: 4, width: 0.5, height: 19 },
    { id: 'low-0.5-6', name: 'Низкие 0.5 м (Ш 0.5, В 19 см) - 6м', price: 4190, length: 6, width: 0.5, height: 19 },
    { id: 'low-0.5-8', name: 'Низкие 0.5 м (Ш 0.5, В 19 см) - 8м', price: 5390, length: 8, width: 0.5, height: 19 },
    { id: 'low-0.5-10', name: 'Низкие 0.5 м (Ш 0.5, В 19 см) - 10м', price: 6590, length: 10, width: 0.5, height: 19 },
    { id: 'low-0.5-12', name: 'Низкие 0.5 м (Ш 0.5, В 19 см) - 12м', price: 7790, length: 12, width: 0.5, height: 19 },
    
    // Низкие 0.65 м (Ш 0.65, В 19 см) - шаг +1300
    { id: 'low-0.65-4', name: 'Низкие 0.65 м (Ш 0.65, В 19 см) - 4м', price: 3290, length: 4, width: 0.65, height: 19 },
    { id: 'low-0.65-6', name: 'Низкие 0.65 м (Ш 0.65, В 19 см) - 6м', price: 4590, length: 6, width: 0.65, height: 19 },
    { id: 'low-0.65-8', name: 'Низкие 0.65 м (Ш 0.65, В 19 см) - 8м', price: 5890, length: 8, width: 0.65, height: 19 },
    { id: 'low-0.65-10', name: 'Низкие 0.65 м (Ш 0.65, В 19 см) - 10м', price: 7190, length: 10, width: 0.65, height: 19 },
    { id: 'low-0.65-12', name: 'Низкие 0.65 м (Ш 0.65, В 19 см) - 12м', price: 8490, length: 12, width: 0.65, height: 19 },
    
    // Низкие 0.8 м (Ш 0.8, В 19 см) - шаг +1400 (в каталоге может быть "0.75 м")
    { id: 'low-0.8-4', name: 'Низкие 0.8 м (Ш 0.8, В 19 см) - 4м', price: 3590, length: 4, width: 0.8, height: 19 },
    { id: 'low-0.8-6', name: 'Низкие 0.8 м (Ш 0.8, В 19 см) - 6м', price: 4990, length: 6, width: 0.8, height: 19 },
    { id: 'low-0.8-8', name: 'Низкие 0.8 м (Ш 0.8, В 19 см) - 8м', price: 6390, length: 8, width: 0.8, height: 19 },
    { id: 'low-0.8-10', name: 'Низкие 0.8 м (Ш 0.8, В 19 см) - 10м', price: 7790, length: 10, width: 0.8, height: 19 },
    { id: 'low-0.8-12', name: 'Низкие 0.8 м (Ш 0.8, В 19 см) - 12м', price: 9190, length: 12, width: 0.8, height: 19 },
    
    // Низкие 1 м (Ш 1, В 19 см) - шаг +1500
    { id: 'low-1-4', name: 'Низкие 1 м (Ш 1, В 19 см) - 4м', price: 3890, length: 4, width: 1, height: 19 },
    { id: 'low-1-6', name: 'Низкие 1 м (Ш 1, В 19 см) - 6м', price: 5390, length: 6, width: 1, height: 19 },
    { id: 'low-1-8', name: 'Низкие 1 м (Ш 1, В 19 см) - 8м', price: 6890, length: 8, width: 1, height: 19 },
    { id: 'low-1-10', name: 'Низкие 1 м (Ш 1, В 19 см) - 10м', price: 8390, length: 10, width: 1, height: 19 },
    { id: 'low-1-12', name: 'Низкие 1 м (Ш 1, В 19 см) - 12м', price: 9890, length: 12, width: 1, height: 19 },
    
    // Высокие грядки (В 38 см)
    // Высокие 0.5 м (Ш 0.5, В 38 см) - шаг +2000
    { id: 'high-0.5-4', name: 'Высокие 0.5 м (Ш 0.5, В 38 см) - 4м', price: 4990, length: 4, width: 0.5, height: 38 },
    { id: 'high-0.5-6', name: 'Высокие 0.5 м (Ш 0.5, В 38 см) - 6м', price: 6990, length: 6, width: 0.5, height: 38 },
    { id: 'high-0.5-8', name: 'Высокие 0.5 м (Ш 0.5, В 38 см) - 8м', price: 8990, length: 8, width: 0.5, height: 38 },
    { id: 'high-0.5-10', name: 'Высокие 0.5 м (Ш 0.5, В 38 см) - 10м', price: 10990, length: 10, width: 0.5, height: 38 },
    { id: 'high-0.5-12', name: 'Высокие 0.5 м (Ш 0.5, В 38 см) - 12м', price: 12990, length: 12, width: 0.5, height: 38 },
    
    // Высокие 0.65 м (Ш 0.65, В 38 см) - шаг +2200
    { id: 'high-0.65-4', name: 'Высокие 0.65 м (Ш 0.65, В 38 см) - 4м', price: 5490, length: 4, width: 0.65, height: 38 },
    { id: 'high-0.65-6', name: 'Высокие 0.65 м (Ш 0.65, В 38 см) - 6м', price: 7690, length: 6, width: 0.65, height: 38 },
    { id: 'high-0.65-8', name: 'Высокие 0.65 м (Ш 0.65, В 38 см) - 8м', price: 9890, length: 8, width: 0.65, height: 38 },
    { id: 'high-0.65-10', name: 'Высокие 0.65 м (Ш 0.65, В 38 см) - 10м', price: 12090, length: 10, width: 0.65, height: 38 },
    { id: 'high-0.65-12', name: 'Высокие 0.65 м (Ш 0.65, В 38 см) - 12м', price: 14290, length: 12, width: 0.65, height: 38 },
    
    // Высокие 0.8 м (Ш 0.8, В 38 см) - шаг +2400
    { id: 'high-0.8-4', name: 'Высокие 0.8 м (Ш 0.8, В 38 см) - 4м', price: 5990, length: 4, width: 0.8, height: 38 },
    { id: 'high-0.8-6', name: 'Высокие 0.8 м (Ш 0.8, В 38 см) - 6м', price: 8390, length: 6, width: 0.8, height: 38 },
    { id: 'high-0.8-8', name: 'Высокие 0.8 м (Ш 0.8, В 38 см) - 8м', price: 10790, length: 8, width: 0.8, height: 38 },
    { id: 'high-0.8-10', name: 'Высокие 0.8 м (Ш 0.8, В 38 см) - 10м', price: 13190, length: 10, width: 0.8, height: 38 },
    { id: 'high-0.8-12', name: 'Высокие 0.8 м (Ш 0.8, В 38 см) - 12м', price: 15590, length: 12, width: 0.8, height: 38 },
    
    // Высокие 1 м (Ш 1, В 38 см) - шаг +2600
    { id: 'high-1-4', name: 'Высокие 1 м (Ш 1, В 38 см) - 4м', price: 6490, length: 4, width: 1, height: 38 },
    { id: 'high-1-6', name: 'Высокие 1 м (Ш 1, В 38 см) - 6м', price: 9090, length: 6, width: 1, height: 38 },
    { id: 'high-1-8', name: 'Высокие 1 м (Ш 1, В 38 см) - 8м', price: 11690, length: 8, width: 1, height: 38 },
    { id: 'high-1-10', name: 'Высокие 1 м (Ш 1, В 38 см) - 10м', price: 14290, length: 10, width: 1, height: 38 },
    { id: 'high-1-12', name: 'Высокие 1 м (Ш 1, В 38 см) - 12м', price: 16890, length: 12, width: 1, height: 38 }
];

// Функция загрузки данных грядок из Supabase (ОТКЛЮЧЕНА - цены в коде)
// Цены на грядки одинаковые для всех городов, поэтому хранятся в константе BEDS_DATA выше
async function loadBedsFromSupabase() {
    // Цены зашиты в код, так как они одинаковые для всех городов
    // Если в будущем понадобится загружать из Supabase, раскомментируйте код ниже
    // Используются цены на грядки из кода
    return true;
    
    /* Раскомментировать, если нужно загружать из Supabase:
    try {
        const { data, error } = await supabaseClient
            .from('beds')
            .select('*')
            .order('height')
            .order('width')
            .order('length');
        
        if (error) {
            return false;
        }
        
        if (!data || data.length === 0) {
            return false;
        }
        
        // Преобразуем данные из Supabase в формат, используемый в коде
        BEDS_DATA = data.map(bed => ({
            id: bed.id,
            name: bed.name,
            price: bed.price,
            length: bed.length,
            width: parseFloat(bed.width),
            height: bed.height
        }));
        
        return true;
        
    } catch (err) {
        return false;
    }
    */
}

// Лёгкий wrapper для отладочных логов (в проде не пишет в консоль и не тратит время)
function debugLog(...args) {
    if (DEBUG) console.log(...args);
}
function debugWarn(...args) {
    if (DEBUG) console.warn(...args);
}

// Временная заглушка для showFAQModal (на случай, если скрипт еще не загрузился)
if (typeof window.showFAQModal === 'undefined') {
    window.showFAQModal = function() {
        debugWarn("⚠️ showFAQModal еще не загружена, ждем загрузки скрипта...");
        setTimeout(() => {
            if (typeof showFAQModal === 'function') {
                showFAQModal();
            } else {
                console.error("❌ Функция showFAQModal не найдена после загрузки!");
                showError("Функция showFAQModal не найдена. Обновите страницу.", 'Ошибка');
            }
        }, 100);
    };
}

// Временная заглушка для showBedsModal (на случай, если скрипт еще не загрузился)
if (typeof window.showBedsModal === 'undefined') {
    window.showBedsModal = function() {
        setTimeout(() => {
            if (typeof showBedsModal === 'function') {
                showBedsModal();
            } else {
                console.error("❌ Функция showBedsModal не найдена после загрузки!");
                showError("Функция showBedsModal не найдена. Обновите страницу.", 'Ошибка');
            }
        }, 100);
    };
}

// Флаг для включения/выключения вывода даты доставки в коммерческое предложение
const SHOW_DELIVERY_DATE_IN_OFFER = false; // Установите true, чтобы включить вывод даты доставки в КП

/**
 * Функция форматирования чисел с точками
 * @param {number} num - Число для форматирования
 * @returns {string} - Отформатированное число
 */
function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Функция нормализации строк (убирает пробелы и приводит к нижнему регистру)
function normalizeString(str) {
    if (!str) return "";
    // Заменяем обычные и неразрывные пробелы на пустую строку
    return str.trim().toLowerCase().replace(/[\s\u00A0]+/g, "");
}

/**
 * Очищает название города от суффиксов "доставки" и "сборки" (первое слово = город)
 * "Ставрополь доставки" → "Ставрополь", "Краснодар доставки" → "Краснодар"
 */
function cleanDeliveryCityName(cityName) {
    if (!cityName) return cityName || '';
    return cityName
        .replace(/\s+доставки\s*$/i, '')
        .replace(/\s+сборки\s*$/i, '')
        .trim() || cityName;
}

// Функция нормализации названий городов (заменяет Ё на Е для сравнения)
function normalizeCityName(cityName) {
    if (!cityName) return "";
    
    const normalized = cityName.trim().toLowerCase().replace(/ё/g, "е").replace(/Ё/g, "Е");
    
    // Маппинг альтернативных названий на стандартные
    const cityMap = {
        'питер': 'санкт-петербург',
        'петербург': 'санкт-петербург',
        'спб': 'санкт-петербург',
        'нн': 'нижний новгород',
        'нижний': 'нижний новгород',
        'челны': 'набережные челны',
        'набережные челны': 'набережные челны'
    };
    
    // Проверяем точное совпадение
    if (cityMap[normalized]) {
        return cityMap[normalized];
    }
    
    // Проверяем частичное совпадение
    for (const [key, value] of Object.entries(cityMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value;
        }
    }
    
    return normalized;
}

// Функция поиска города в выпадающем списке по нормализованному названию
function findCityInDropdown(cityName) {
    if (!cityName) return null;
    const cityDropdown = document.getElementById('city');
    if (!cityDropdown || !cityDropdown.options) return null;
    
    const normalizedTarget = normalizeCityName(cityName);
    
    // Ищем точное совпадение по нормализованному названию
    for (let i = 0; i < cityDropdown.options.length; i++) {
        const option = cityDropdown.options[i];
        if (option.value && normalizeCityName(option.value) === normalizedTarget) {
            return option.value; // Возвращаем оригинальное название из списка
        }
    }
    
    // Если точного совпадения нет, ищем частичное (для "Набережные Челны" vs "Челны")
    for (let i = 0; i < cityDropdown.options.length; i++) {
        const option = cityDropdown.options[i];
        if (option.value) {
            const normalizedOption = normalizeCityName(option.value);
            if (normalizedTarget.includes(normalizedOption) || normalizedOption.includes(normalizedTarget)) {
                return option.value;
            }
        }
    }
    
    return null;
}

// Пользователи: все пароли хранятся в Supabase в таблице users

// Ключ для админа в localStorage (для доступа к админ-панели)
const ADMIN_KEY = 'admin_access_granted';

// Приоритеты форм (чем меньше число, тем выше в списке)
const formPriority = {
    "Арочная": 1,
    "Каплевидная": 2,
    "Прямостенная": 3,
    "Домиком": 4,
    "Пристенная": 5,
    "Миттлайдер арочная": 6,
    "Миттлайдер прямостенная": 7,
    "Промышленная прямостенная": 8,
    "Промышленная домиком": 9,
    "Навес": 10,
    "Прочие": 11
};

// Массив регионов доставки с ключевыми словами
const deliveryRegions = [
    { keywords: ["москва", "msk", "московская область"] },
    { keywords: ["санкт-петербург", "spb", "питер", "ленинградская область"] },
    { keywords: ["белгород", "belgorod", "белгородская область"] },
    { keywords: ["великий новгород", "новгород", "новгородская область"] },
    { keywords: ["владимир", "vladimir", "владимирская область"] },
    { keywords: ["вологда", "vologda", "вологодская область"] },
    { keywords: ["воронеж", "voronezh", "воронежская область"] },
    { keywords: ["екатеринбург", "ekaterinburg", "свердловская область"] },
    { keywords: ["иваново", "ivanovo", "ивановская область"] },
    { keywords: ["йошкар-ола", "yoshkar-ola", "марий эл", "республика марий эл"] },
    { keywords: ["казань", "kazan", "татарстан", "республика татарстан"] },
    { keywords: ["калуга", "kaluga", "калужская область"] },
    { keywords: ["кемерово", "kemerovo", "кемеровская область", "кузбасс"] },
    { keywords: ["кострома", "kostroma", "костромская область"] },
    { keywords: ["краснодар", "krasnodar", "краснодарский край", "кубань"] },
    { keywords: ["курск", "kursk", "курская область"] },
    { keywords: ["липецк", "lipetsk", "липецкая область"] },
    { keywords: ["майкоп", "maykop", "адыгея", "республика адыгея"] },
    { keywords: ["набережные челны", "nab-chelny", "челны", "республика татарстан"] },
    { keywords: ["нижний новгород", "nizh-novgorod", "нн", "нижегородская область"] },
    { keywords: ["новосибирск", "novosibirsk", "новосибирская область"] },
    { keywords: ["орел", "orel", "орловская область"] },
    { keywords: ["рязань", "ryazan", "рязанская область"] },
    { keywords: ["ставрополь", "stavropol", "ставропольский край"] },
    { keywords: ["тамбов", "tambov", "тамбовская область"] },
    { keywords: ["тверь", "tver", "тверская область"] },
    { keywords: ["тула", "tula", "тульская область"] },
    { keywords: ["ульяновск", "ulyanovsk", "ульяновская область"] },
    { keywords: ["чебоксары", "cheboksary", "чувашия", "республика чувашия"] },
    { keywords: ["челябинск", "chelyabinsk", "челябинская область"] },
    { keywords: ["черкесск", "cherkessk", "карачай-черкесия", "карачаево-черкесская республика"] },
    { keywords: ["ярославль", "yaroslavl", "ярославская область"] }
];

// Города для карты. pricePerKm — тариф руб/км от склада (зависит от города).
const citiesForMap = [
    { name: "Москва", coords: [55.751244, 37.618423], boundaryDistance: 20, pricePerKm: 45 },
    { name: "Санкт-Петербург", coords: [59.934280, 30.335099], boundaryDistance: 20, pricePerKm: 45 },
    { name: "Белгород", coords: [50.597735, 36.585823], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Великий Новгород", coords: [58.521400, 31.275505], boundaryDistance: 10, pricePerKm: 45 },
    { name: "Владимир", coords: [56.129057, 40.407031], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Вологда", coords: [59.220492, 39.891568], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Воронеж", coords: [51.661535, 39.200287], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Екатеринбург", coords: [56.838926, 60.605703], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Иваново", coords: [57.000348, 40.973921], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Йошкар-Ола", coords: [56.634431, 47.899888], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Казань", coords: [55.796391, 49.108891], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Калуга", coords: [54.506043, 36.251593], boundaryDistance: 12, pricePerKm: 45 },
    { name: "Кемерово", coords: [55.354968, 86.087314], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Кострома", coords: [57.767961, 40.926858], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Краснодар", coords: [45.035470, 38.975313], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Курск", coords: [51.730361, 36.192647], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Липецк", coords: [52.610150, 39.594180], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Майкоп", coords: [44.607782, 40.105690], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Набережные Челны", coords: [55.727110, 52.404913], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Нижний Новгород", coords: [56.296504, 43.936059], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Новосибирск", coords: [55.008352, 82.935733], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Орёл", coords: [52.967257, 36.069647], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Рязань", coords: [54.629704, 39.741146], boundaryDistance: 12, pricePerKm: 45 },
    { name: "Ставрополь", coords: [45.044838, 41.969230], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Тамбов", coords: [52.721219, 41.452274], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Тверь", coords: [56.858539, 35.917596], boundaryDistance: 12, pricePerKm: 45 },
    { name: "Тула", coords: [54.193122, 37.617348], boundaryDistance: 12, pricePerKm: 45 },
    { name: "Ульяновск", coords: [54.316685, 48.403123], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Чебоксары", coords: [56.146223, 47.251931], boundaryDistance: 12, pricePerKm: 50 },
    { name: "Челябинск", coords: [55.164442, 61.436843], boundaryDistance: 15, pricePerKm: 50 },
    { name: "Черкесск", coords: [44.226863, 42.046782], boundaryDistance: 10, pricePerKm: 50 },
    { name: "Ярославль", coords: [57.626559, 39.893813], boundaryDistance: 10, pricePerKm: 50 }
];

// Дополнительные услуги данные
const additionalServicesData = {
    "Брус": {
        price_by_length: {
            4: 5490,
            6: 6990,
            8: 8490,
            10: 9990,
            12: 11490,
            14: 12990,
            16: 14490
        }
    },
    "Штыри": {
        price_per_unit: 249,
        quantity_by_length: {
            "without_bracing": { "4": 10, "6": 14, "8": 18, "10": 22, "12": 26, "14": 30, "16": 34 },
            "with_bracing": { "4": 6, "6": 10, "8": 14, "10": 18, "12": 22, "14": 26, "16": 30 }
        }
    }
    // Сборка теперь обрабатывается через assemblyPrices
};

// Структура данных для сборки теплиц
const assemblyPrices = {
    "Арочная": {
        "2.5М": { 4: 4990, 6: 6490, 8: 7990, 10: 9490, 12: 11990 },
        "3М": { 4: 4990, 6: 6490, 8: 7990, 10: 9490, 12: 11990 },
        "3.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "4М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    },
    "Каплевидная": {
        "2.5М": { 4: 4990, 6: 6490, 8: 7990, 10: 9490, 12: 11990 },
        "3М": { 4: 4990, 6: 6490, 8: 7990, 10: 9490, 12: 11990 },
        "3.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 }
    },
    "Прямостенная": {
        "2.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "4М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    },
    "Домиком": {
        "2.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "4М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    },
    "Пристенная": {
        "2.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 }
    },
    "Миттлайдер арочная": {
        "3М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 },
        "3.5М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    },
    "Миттлайдер прямостенная": {
        "3М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 },
        "3.5М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    },
    "Промышленная прямостенная": {
        "5М": { 4: 9990, 6: 14990, 8: 19990, 10: 24990, 12: 29990, 14: 34990, 16: 39990 },
        "6М": { 4: 9990, 6: 14990, 8: 19990, 10: 24990, 12: 29990, 14: 34990, 16: 39990 }
    },
    "Промышленная домиком": {
        "7М": { 4: 9990, 6: 14990, 8: 19990, 10: 24990, 12: 29990, 14: 34990, 16: 39990 },
        "8М": { 4: 9990, 6: 14990, 8: 19990, 10: 24990, 12: 29990, 14: 34990, 16: 39990 }
    },
    "Навес": {
        "3М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "3.5М": { 4: 5990, 6: 7990, 8: 9990, 10: 11990, 12: 13990 },
        "4М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 },
        "5М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 },
        "6М": { 4: 7990, 6: 11490, 8: 14990, 10: 18490, 12: 22490 }
    }
};

// Определение доступных форм теплиц и их названий
const availableForms = {
    "Арочная": [
        { name: "ТЕПЛИЦА БОЯРСКАЯ 2.5М", frame: "20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ 3М", frame: "20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ЛЮКС 2.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ЛЮКС 3.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ДЕЛЮКС 2.5М", frame: "20х20+20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ДЕЛЮКС 3М", frame: "20х20+20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ПРЕМИУМ 2.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ПРЕМИУМ 3М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ПРЕМИУМ 3.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА БОЯРСКАЯ ПРЕМИУМ 4М", frame: "40х20+20х20" }
    ],
    "Каплевидная": [
        { name: "ТЕПЛИЦА СТРЕЛЕЦКАЯ ЛЮКС 2.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА СТРЕЛЕЦКАЯ ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА СТРЕЛЕЦКАЯ ЛЮКС 3.5М", frame: "40х20" }
    ],
    "Прямостенная": [
        { name: "ТЕПЛИЦА ЦАРСКАЯ ЛЮКС 2.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ЛЮКС 3.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ПРЕМИУМ 2.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ПРЕМИУМ 3М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ПРЕМИУМ 3.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ЦАРСКАЯ ПРЕМИУМ 4М", frame: "40х20+20х20" }
    ],
    "Домиком": [
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ЛЮКС 2.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ЛЮКС 3.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ПРЕМИУМ 2.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ПРЕМИУМ 3М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ПРЕМИУМ 3.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ДВОРЦОВАЯ ПРЕМИУМ 4М", frame: "40х20+20х20" }
    ],
    "Пристенная": [
        { name: "ТЕПЛИЦА ПРИСТЕННАЯ ЛЮКС 2.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА ПРИСТЕННАЯ ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА ПРИСТЕННАЯ ПРЕМИУМ 2.5М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА ПРИСТЕННАЯ ПРЕМИУМ 3М", frame: "40х20+20х20" }
    ],
    "Миттлайдер арочная": [
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ЛЮКС 3М", frame: "40х20" },
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ЛЮКС 3.5М", frame: "40х20" },
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ПРЕМИУМ 3М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ПРЕМИУМ 3.5М", frame: "40х20+20х20" }
    ],
    "Миттлайдер прямостенная": [
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ЭЛИТ 3М", frame: "40х20+20х20" },
        { name: "ТЕПЛИЦА МИТТЛАЙДЕР ЭЛИТ 3.5М", frame: "40х20+20х20" }
    ],
    "Промышленная прямостенная": [
        { name: "ТЕПЛИЦА ПРЕМЬЕР ПРЕМИУМ 5М", frame: "40х20+40х20" },
        { name: "ТЕПЛИЦА ПРЕМЬЕР ПРЕМИУМ 6М", frame: "40х20+40х20" }
    ],
    "Промышленная домиком": [
        { name: "ТЕПЛИЦА МОНАРХ ПРЕМИУМ 7М", frame: "40х20+40х20" },
        { name: "ТЕПЛИЦА МОНАРХ ПРЕМИУМ 8М", frame: "40х20+40х20" }
    ],
    "Навес": [
        { name: "НАВЕС ЛЮКС 3.5М", frame: "40х20+20х20" },
        { name: "НАВЕС ЛЮКС 4М", frame: "40х20+20х20" },
        { name: "НАВЕС ПРЕМИУМ 5М", frame: "40х20+40х20" },
        { name: "НАВЕС ПРЕМИУМ 6М", frame: "40х20+40х20" }
    ]
};

// Создание обратной карты: form_name -> category
const formNameToCategory = {};

Object.keys(availableForms).forEach(category => {
    availableForms[category].forEach(form => {
        formNameToCategory[normalizeString(form.name)] = category;
    });
});

// Функция определения категории на основе имени формы
function getFormCategory(formName) {
    if (!formName || typeof formName !== "string") return "Прочие";
    const normalizedFormName = normalizeString(formName);
    const category = formNameToCategory[normalizedFormName];
    if (category) {
        return category;
    } else {
        return "Прочие";
    }
}

let currentCityData = []; // Данные для текущего города
let deliveryCost = 0; // Стоимость доставки
let currentDeliveryDate = null; // Текущая дата доставки для выбранного города
let currentDeliveryAssemblyDate = null; // Дата сборки (null = совпадает с доставкой)
let currentDeliveryRestrictions = null; // Общие ограничения по датам (доставка и сборка)
let activeOfferTab = 'short'; // Активная вкладка КП: 'short' или 'long'

// Кеширование для оптимизации производительности
let citiesCache = null; // Кеш списка городов
let cityDataCache = {}; // Кеш данных по городам {cityName: data}

// Инициализация Supabase
const SUPABASE_URL = 'https://dyoibmfdohpvjltfaygr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5b2libWZkb2hwdmpsdGZheWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5ODAxMzcsImV4cCI6MjA0OTU1NjEzN30.ZHj1JJsmSN45-0cv83uJDpaqtv3R6_U7CZmbkK-H24s'; // Ваш Anon Public Key

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let mapInstance;
let currentRoute;

ymaps.ready(() => {
    mapInstance = new ymaps.Map("map", {
        center: [55.751244, 37.618423],
        zoom: 7
    });

    // Инициализация SuggestView для автодополнения адреса
    // const suggestView = new ymaps.SuggestView('address'); // Удалено, т.к. мы используем собственные подсказки
});

// Функция аутентификации через Supabase
async function authenticate() {
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const authError = document.getElementById("auth-error");

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login || !password) {
        if (authError) {
            authError.textContent = "Пожалуйста, введите логин и пароль!";
        authError.style.display = "block";
        }
        return;
    }

    try {
        // Сначала проверяем без фильтра is_active, чтобы увидеть, существует ли пользователь
        
        // Проверяем, что Supabase клиент инициализирован
        if (!supabaseClient) {
            console.error("Supabase клиент не инициализирован!");
            if (authError) {
                authError.textContent = "Ошибка подключения к базе данных. Проверьте настройки.";
                authError.style.display = "block";
            }
            return;
        }
        
        const { data, error } = await supabaseClient
            .from('users')
            .select('id, login, password, password_version, is_active')
            .eq('login', login)
            .single();


        if (error) {
            // Проверяем тип ошибки
            const errorMessage = error.message || '';
            const errorCode = error.code || '';
            
            // Если это сетевая ошибка (TypeError: Load failed)
            if (errorMessage.includes('Load failed') || errorMessage.includes('TypeError') || (errorCode === '' && errorMessage)) {
                console.error("Ошибка сети при подключении к Supabase:", error);
                if (authError) {
                    authError.textContent = "Ошибка подключения к серверу. Проверьте интернет-соединение и попробуйте снова.";
                    authError.style.display = "block";
                }
                return;
            }
            
            // Если пользователь не найден (PGRST116 - это код "No rows returned")
            if (error.code === 'PGRST116' || errorMessage.includes('No rows') || errorMessage.includes('not found')) {
            console.error("Пользователь не найден в Supabase:", error);
                if (authError) {
                    authError.textContent = "Неверный логин или пароль!";
            authError.style.display = "block";
                }
                return;
            }
            
            // Другие ошибки
            console.error("Ошибка при запросе к Supabase:", error);
            if (authError) {
                authError.textContent = `Ошибка: ${errorMessage || 'Неизвестная ошибка'}`;
                authError.style.display = "block";
            }
            return;
        }
        
        if (!data) {
            console.error("Пользователь не найден: данные пусты");
            if (authError) {
                authError.textContent = "Неверный логин или пароль!";
                authError.style.display = "block";
            }
            return;
        }
        
        
        // Проверяем, активен ли пользователь
        if (!data.is_active) {
            console.error("Пользователь неактивен:", login);
            if (authError) {
                authError.textContent = "Ваш аккаунт деактивирован. Обратитесь к администратору.";
                authError.style.display = "block";
            }
            return;
        }

        // Проверяем пароль (убираем лишние пробелы и приводим к строке)
        const cleanPassword = String(password).trim();
        const cleanDbPassword = String(data.password).trim();
        
        if (cleanDbPassword !== cleanPassword) {
            if (authError) {
                authError.textContent = "Неверный логин или пароль!";
            authError.style.display = "block";
            }
            return;
        }
        

        // Если всё верно, сохраняем данные в localStorage
        authError.style.display = "none";
        localStorage.setItem('savedLogin', login);
        localStorage.setItem('appVersion', APP_VERSION);
        localStorage.setItem('passwordVersion', data.password_version.toString());
        localStorage.setItem('userId', data.id.toString());

        // Проверяем, не админ ли это (для доступа к админ-панели)
        // Важно: проверяем точно как 'admin' (без toLowerCase, так как в базе может быть другой регистр)
        // СТРОГАЯ проверка: только пользователь с логином точно "admin"
        if (login && login.trim().toLowerCase() === 'admin') {
            localStorage.setItem(ADMIN_KEY, 'true');
        } else {
            localStorage.removeItem(ADMIN_KEY);
        }

        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("calculator-container").classList.remove("hidden");
        await initializeCalculator();
    } catch (err) {
        console.error("Ошибка при авторизации:", err);
        const errorMessage = err.message || '';
        
        // Проверяем тип ошибки
        if (errorMessage.includes('Load failed') || errorMessage.includes('TypeError') || errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            if (authError) {
                authError.textContent = "Ошибка подключения к серверу. Проверьте интернет-соединение и попробуйте снова.";
        authError.style.display = "block";
            }
        } else {
            if (authError) {
                authError.textContent = `Ошибка подключения: ${errorMessage || 'Неизвестная ошибка'}`;
                authError.style.display = "block";
            }
        }
    }
}


// Функция выхода
function logout() {
    try {
        const savedLogin = localStorage.getItem('savedLogin');
        
        localStorage.removeItem('savedLogin');
        localStorage.removeItem('passwordVersion');
        localStorage.removeItem('userId');
        localStorage.removeItem(ADMIN_KEY);
        
        const authContainer = document.getElementById("auth-container");
        const calcContainer = document.getElementById("calculator-container");
        
        if (authContainer) {
            authContainer.classList.remove("hidden");
        } else {
            console.error("auth-container не найден!");
        }
        
        if (calcContainer) {
            calcContainer.classList.add("hidden");
        } else {
            console.error("calculator-container не найден!");
        }
        
        // Скрываем админ-панель, если открыта
        const adminPanel = document.getElementById("admin-panel");
        if (adminPanel) {
            adminPanel.classList.add("hidden");
        }
        
        // Сброс калькулятора при выходе
        resetDropdown('form', 'Сначала выберите город');
        resetDropdown('width', 'Сначала выберите форму');
        resetDropdown('length', 'Сначала выберите ширину');
        resetDropdown('frame', 'Сначала выберите длину');
        resetDropdown('polycarbonate', 'Сначала выберите город');
        resetDropdown('arcStep', 'Выберите шаг');
        resetAdditionalOptions();
        
        const offerField = document.getElementById("commercial-offer");
        if (offerField) {
            offerField.value = "Здесь будет ваше коммерческое предложение.";
        }
        
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerText = "";
        }
        
        if (mapInstance && currentRoute) {
            mapInstance.geoObjects.remove(currentRoute);
        }
        
    } catch (error) {
        console.error("❌ Ошибка при выходе:", error);
        // Принудительная очистка localStorage и перезагрузка
        localStorage.clear();
        location.reload();
    }
}

// Функция проверки актуальности пароля пользователя
async function checkPasswordVersion() {
    const savedLogin = localStorage.getItem('savedLogin');
    const savedPasswordVersion = localStorage.getItem('passwordVersion');

    if (!savedLogin || !savedPasswordVersion) {
        return false; // Нет сохраненных данных
    }

    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('password_version, is_active')
            .eq('login', savedLogin)
            .single();

        if (error || !data) {
            // Если это сетевая ошибка - НЕ разлогиниваем, продолжаем работу
            if (isNetworkError(error)) {
                console.error("Ошибка сети при проверке версии пароля (возможно блокировка Supabase). Продолжаем работу.");
                return true; // Продолжаем работу при сетевых ошибках
            }
            // Другие ошибки (пользователь не найден) - разлогиниваем
            console.error("Пользователь не найден в Supabase при проверке версии:", error);
            logout();
            return false;
        }

        // Если пользователь деактивирован или версия пароля не совпадает - выход
        if (!data.is_active || data.password_version.toString() !== savedPasswordVersion) {
            logout();
            // Показываем alert только если версия пароля реально изменилась (пароль был изменён)
            if (data.password_version.toString() !== savedPasswordVersion) {
                showWarning("Сессия истекла. Пожалуйста, войдите снова.", 'Сессия');
            }
            return false;
        }

        return true;
    } catch (err) {
        // Если ошибка сети - продолжаем работу, не разлогиниваем
        if (isNetworkError(err)) {
            console.error("Ошибка сети при проверке версии пароля. Продолжаем работу.");
            return true; // Продолжаем работу при сетевых ошибках
        }
        console.error("Ошибка при проверке версии пароля:", err);
        return true; // Даже при других ошибках продолжаем работу (менее агрессивно)
    }
}

// Функция проверки сетевых ошибок
function isNetworkError(error) {
    if (!error) return false;
    const errorStr = JSON.stringify(error).toLowerCase();
    return errorStr.includes('load failed') || 
           errorStr.includes('network') || 
           errorStr.includes('timeout') ||
           errorStr.includes('err_network_changed') ||
           errorStr.includes('err_name_not_resolved') ||
           errorStr.includes('failed to fetch') ||
           errorStr.includes('networkerror') ||
           (error.message && error.message.toLowerCase().includes('failed to fetch'));
}

/**
 * Формирует текст даты доставки/сборки для КП с учётом типа заказа
 * @param {boolean} withAssembly - Выбрана ли доставка со сборкой
 * @returns {string} Текст для вставки в КП (только дата, напр. "15.02.2026")
 */
/** Для КП: только актуальная дата — без служебной инфы. Со сборкой = дата сборки, без = дата доставки. */
function getDeliveryDateTextForKP(withAssembly) {
    if (!currentDeliveryDate) return null;
    const y = new Date().getFullYear();
    if (!withAssembly) return `${currentDeliveryDate}.${y}`;
    const a = currentDeliveryAssemblyDate || currentDeliveryDate;
    return `${a}.${y}`;
}

/** Текст для блока результата доставки (менеджер озвучивает). Ограничения общие для доставки и сборки. */
function getDeliveryDateTextForBlock(withAssembly) {
    if (!currentDeliveryDate) return null;
    const y = new Date().getFullYear();
    const d = `${currentDeliveryDate}.${y}`;
    const restr = currentDeliveryRestrictions ? currentDeliveryRestrictions.split(',').map(r => r.trim()).filter(r => r) : [];
    const r = restr.length > 0 ? ` (кроме ${restr.join(', ')})` : '';

    if (!withAssembly) return `Доставка: с ${d}${r}`;

    const assemblyDate = currentDeliveryAssemblyDate || currentDeliveryDate;
    const a = `${assemblyDate}.${y}`;
    return `Доставка: с ${d}, сборки с ${a}${r}`;
}

// Функция загрузки даты доставки для города
async function loadDeliveryDate(cityName) {
    if (!cityName) {
        currentDeliveryDate = null;
        currentDeliveryAssemblyDate = null;
        currentDeliveryRestrictions = null;
        updateDeliveryDateDisplay();
        return null;
    }

    try {
        let { data, error } = await supabaseClient
            .from('delivery_dates')
            .select('delivery_date, assembly_date, restrictions')
            .eq('city_name', cityName)
            .single();

        if (error && error.code === '42703') {
            const { data: fallback } = await supabaseClient
                .from('delivery_dates')
                .select('delivery_date, restrictions')
                .eq('city_name', cityName)
                .single();
            if (fallback) {
                data = { ...fallback, assembly_date: null };
                error = null;
            }
        }

        if (error || !data) {
            if (DEBUG) console.log(`Точное совпадение не найдено для "${cityName}", ищем альтернативы...`, error);
            
            const normalizedCity = normalizeCityName(cityName);
            const { data: altData, error: altError } = await supabaseClient
                .from('delivery_dates')
                .select('city_name, delivery_date, assembly_date, restrictions')
                .limit(100);

            if (altError) {
                console.error("Ошибка при загрузке альтернативных дат:", altError);
                currentDeliveryDate = null;
                currentDeliveryAssemblyDate = null;
                currentDeliveryRestrictions = null;
                updateDeliveryDateDisplay();
                return null;
            }

            if (altData && altData.length > 0) {
                const found = altData.find(item => {
                    const cleanedItem = cleanDeliveryCityName(item.city_name);
                    const normalizedItem = normalizeCityName(cleanedItem);
                    return normalizedItem === normalizedCity || 
                           normalizedCity.includes(normalizedItem) || 
                           normalizedItem.includes(normalizedCity);
                });
                if (found) {
                    if (DEBUG) console.log(`Найдена дата для "${cityName}" через "${found.city_name}": ${found.delivery_date}`);
                    currentDeliveryDate = found.delivery_date;
                    currentDeliveryAssemblyDate = found.assembly_date || null;
                    currentDeliveryRestrictions = found.restrictions || null;
                    updateDeliveryDateDisplay();
                    return found.delivery_date;
                }
            }
            
            currentDeliveryDate = null;
            currentDeliveryAssemblyDate = null;
            currentDeliveryRestrictions = null;
            updateDeliveryDateDisplay();
            return null;
        }

        // НЕ используем "Город доставки" — источник истины только канонические города
        currentDeliveryDate = data.delivery_date;
        currentDeliveryAssemblyDate = data.assembly_date || null;
        currentDeliveryRestrictions = data.restrictions || null;
        updateDeliveryDateDisplay();
        return data.delivery_date;
    } catch (err) {
        console.error("Ошибка при загрузке даты доставки:", err);
        currentDeliveryDate = null;
        currentDeliveryAssemblyDate = null;
        currentDeliveryRestrictions = null;
        updateDeliveryDateDisplay();
        return null;
    }
}

// Функция обновления отображения даты доставки в интерфейсе
// УДАЛЕНО: больше не показываем дату под выпадающим списком города
function updateDeliveryDateDisplay() {
    // Функция оставлена для совместимости, но ничего не делает
    // Дата теперь показывается только в модальном окне
}

/**
 * Обновляет дату в блоке результата доставки при смене "Без сборки" / "Со сборкой".
 * Показывает всю релевантную инфу для озвучивания менеджером.
 */
function updateDeliveryResultDate() {
    const resultDiv = document.getElementById('result');
    if (!resultDiv || !resultDiv.innerText.trim() || !currentDeliveryDate) return;
    const withAssembly = document.querySelector('input[name="deliveryType"]:checked')?.value === 'withAssembly';
    const dateBlock = getDeliveryDateTextForBlock(withAssembly);
    if (!dateBlock) return;
    const dateLines = dateBlock.split('\n').map(l => '📅 ' + l.trim()).filter(Boolean);
    const lines = resultDiv.innerText.split('\n');
    const costLine = lines[0];
    resultDiv.innerText = [costLine, ...dateLines].join('\n');
}

// Функция для загрузки городов из Supabase с учётом пагинации
async function loadCities() {
    // Проверяем кеш
    if (citiesCache) {
        const cityDropdown = document.getElementById('city');
        if (cityDropdown && cityDropdown.options.length > 1) {
            return; // Уже загружено
        }
    }
    
    const pageSize = 1000; // Максимальное количество строк за один запрос
    let allCities = [];
    let page = 0;

    while (true) {
        try {
        // Запрос данных с пагинацией
        let { data, error } = await supabaseClient
            .from('prices')
            .select('city_name') // Запрашиваем города
            .range(page * pageSize, (page + 1) * pageSize - 1); // Пагинация

        if (error) {
            console.error("Ошибка при загрузке городов из Supabase:", error);
                // Показываем пользователю понятное сообщение
                const cityDropdown = document.getElementById('city');
                if (cityDropdown) {
                    cityDropdown.innerHTML = '<option value="" disabled selected>Ошибка загрузки данных</option>';
                }
                // Не показываем alert для сетевых ошибок
            return;
        }

        // Если данных на странице меньше, чем pageSize, значит, это последняя страница
        if (data.length === 0) break;

        // Добавляем города в общий массив
        allCities = allCities.concat(data.map(item => item.city_name));
        page++;
        } catch (err) {
            console.error("Критическая ошибка при загрузке городов:", err);
            const cityDropdown = document.getElementById('city');
            if (cityDropdown) {
                cityDropdown.innerHTML = '<option value="" disabled selected>Ошибка загрузки данных</option>';
            }
            // Не показываем alert для сетевых ошибок
            return;
        }
    }

    // Убираем дубликаты городов
    let uniqueCities = [...new Set(allCities)];

    // Приоритетные города
    const priorityCities = ["Москва", "Санкт-Петербург"];

    // Удаляем приоритетные города из основного списка
    uniqueCities = uniqueCities.filter(city => !priorityCities.includes(city));

    // Сортируем оставшиеся города по алфавиту
    uniqueCities.sort((a, b) => a.localeCompare(b, 'ru'));

    // Объединяем приоритетные города и отсортированные города
    const finalCities = [...priorityCities, ...uniqueCities];

    // Обновляем выпадающий список
    const cityDropdown = document.getElementById('city');
    cityDropdown.innerHTML = '<option value="" disabled selected>Выберите город</option>';

    finalCities.forEach(city => {
        cityDropdown.innerHTML += `<option value="${city}">${city}</option>`;
    });
    
    // Сохраняем в кеш
    citiesCache = finalCities;
}

// Функция обработки изменения города
async function onCityChange() {
    const city = document.getElementById('city').value;

    // Если город не выбран – сбрасываем все поля
    if (!city) {
        resetDropdown('form', 'Сначала выберите город');
        resetDropdown('width', 'Сначала выберите форму');
        resetDropdown('length', 'Сначала выберите ширину');
        resetDropdown('frame', 'Сначала выберите длину');
        resetDropdown('arcStep', 'Выберите шаг');
        resetDropdown('polycarbonate', 'Сначала выберите город');
        resetAdditionalOptions();
        currentDeliveryDate = null;
        currentDeliveryAssemblyDate = null;
        currentDeliveryRestrictions = null;
        updateDeliveryDateDisplay();
        return;
    }

    // Проверяем кеш
    if (cityDataCache[city]) {
        currentCityData = cityDataCache[city];
    } else {
    let { data, error } = await supabaseClient
        .from('prices')
        .select('form_name, polycarbonate_type, width, length, frame_description, price, snow_load, height, horizontal_ties, equipment') // Добавлены новые поля
        .eq('city_name', city)
        .limit(30000);

    if (error) {
        console.error('Ошибка при получении данных по городу:', error);
            // Показываем понятное сообщение пользователю
            showError("Не удалось загрузить данные для выбранного города. Проверьте подключение к интернету и попробуйте снова.", 'Ошибка загрузки');
        return;
    }

    if (!data || data.length === 0) {
        showWarning("Данные для выбранного города не найдены. Попробуйте другой город.", 'Данные не найдены');
        return; // Остановить выполнение функции
    }

        // Сохраняем в кеш
        cityDataCache[city] = data;
    currentCityData = data;
    }

    // 1. Обновляем выпадающий список поликарбоната
    const polycarbonateDropdown = document.getElementById('polycarbonate');
    polycarbonateDropdown.innerHTML = '<option value="" disabled selected>Выберите поликарбонат</option>';

    // Упорядочиваем поликарбонат в порядке: Стандарт 4 мм / Люкс 4 мм / Премиум 6 мм / Без поликарбоната
    const rawPolys = currentCityData.map(g => g.polycarbonate_type).filter(Boolean);
    const uniquePoly = [...new Set(rawPolys)];
    const preferredOrder = ["Стандарт 4 мм", "Люкс 4 мм", "Премиум 6 мм", "Без поликарбоната"];

    // Сначала добавляем по порядку, если есть
    const orderedPolys = preferredOrder.filter(poly => uniquePoly.includes(poly));

    // Добавляем остальные в конец (если есть непредусмотренные значения)
    const extraPolys = uniquePoly.filter(poly => !preferredOrder.includes(poly));
    orderedPolys.push(...extraPolys);

    // Добавляем упорядоченные варианты
    orderedPolys.forEach(poly => {
        const option = document.createElement('option');
        option.value = poly;
        option.textContent = poly;
        polycarbonateDropdown.appendChild(option);
    });

    // Устанавливаем "Стандарт 4 мм" по умолчанию, если доступно
    if (uniquePoly.includes("Стандарт 4 мм")) {
        polycarbonateDropdown.value = "Стандарт 4 мм";
    } else if (uniquePoly.length > 0) {
        polycarbonateDropdown.value = orderedPolys[0]; // Выбираем первый доступный вариант
    }

    // 2. Фильтруем формы на основе availableForms
    const formCategories = Object.keys(availableForms);
    const formsAvailable = formCategories.filter(formType =>
        currentCityData.some(item => availableForms[formType].some(form => normalizeString(item.form_name) === normalizeString(form.name)))
    );

    // Сортируем формы по приоритету
    formsAvailable.sort((a, b) => (formPriority[a] || 100) - (formPriority[b] || 100)); // Прочие формы получат низкий приоритет

    // 3. Обновляем выпадающий список форм теплиц
    const formDropdown = document.getElementById('form');
    formDropdown.innerHTML = '<option value="" disabled selected>Выберите форму</option>';

    formsAvailable.forEach(form => {
        if (form && form !== "Прочие") {
            const option = document.createElement('option');
            option.value = form;
            option.textContent = form;
            formDropdown.appendChild(option);
        }
    });

    // 4. Сбрасываем размеры и каркасы
    resetDropdown('width', 'Сначала выберите форму');
    resetDropdown('length', 'Сначала выберите ширину');
    resetDropdown('frame', 'Сначала выберите длину');
    resetDropdown('arcStep', 'Выберите шаг');

    // Сброс дополнительных опций
    resetAdditionalOptions();

    // Загружаем дату доставки для выбранного города
    await loadDeliveryDate(city);
}

// Функция обработки изменения формы
function onFormChange() {
    const form = document.getElementById("form").value;

    const widthSelect = document.getElementById("width");
    widthSelect.innerHTML = '<option value="" disabled selected>Выберите ширину</option>';

    if (!form) {
        return;
    }

    // Фильтруем данные по выбранной форме на основе availableForms
    const filteredData = currentCityData.filter(item => {
        const category = getFormCategory(item.form_name);
        return category === form;
    });

    // Проверка на пустые данные
    if (filteredData.length === 0) {
        showWarning("Теплица с указанными параметрами не найдена. Попробуйте выбрать другие параметры.", 'Теплица не найдена');
        return;
    }

    // Получаем уникальные значения ширины
    const uniqueWidths = [...new Set(filteredData.map(item => item.width))].sort((a, b) => a - b);

    // Заполняем выпадающий список ширины
    uniqueWidths.forEach(width => {
        widthSelect.innerHTML += `<option value="${width}">${formatPrice(width)} м</option>`;
    });

    // Сброс длины и каркасов
    resetDropdown('length', 'Сначала выберите ширину');
    resetDropdown('frame', 'Сначала выберите длину');
    resetDropdown('arcStep', 'Выберите шаг');

    // Сброс дополнительных опций
    resetAdditionalOptions();
}

// Функция обработки изменения ширины
function onWidthChange() {
    const form = document.getElementById("form").value;
    const width = parseFloat(document.getElementById("width").value);

    const lengthSelect = document.getElementById("length");
    lengthSelect.innerHTML = '<option value="" disabled selected>Выберите длину</option>';

    if (isNaN(width)) {
        return;
    }

    // Фильтруем данные по форме и ширине
    const filteredData = currentCityData.filter(item => {
        const category = getFormCategory(item.form_name);
        return category === form && parseFloat(item.width) === width;
    });

    // Проверка на пустые данные
    if (filteredData.length === 0) {
        showWarning("Теплица с указанными параметрами не найдена. Попробуйте выбрать другие параметры.", 'Теплица не найдена');
        return;
    }

    // Получаем уникальные значения длины
    const uniqueLengths = [...new Set(filteredData.map(item => item.length))].sort((a, b) => a - b);

    // Заполняем выпадающий список длины
    uniqueLengths.forEach(length => {
        lengthSelect.innerHTML += `<option value="${length}">${formatPrice(length)} м</option>`;
    });

    // Сброс каркаса и шага дуг
    resetDropdown('frame', 'Сначала выберите длину');
    resetDropdown('arcStep', 'Выберите шаг');

    // Сброс дополнительных опций
    resetAdditionalOptions();
}

// Функция обработки изменения длины
function onLengthChange() {
    const form = document.getElementById("form").value;
    const width = parseFloat(document.getElementById("width").value);
    const length = parseFloat(document.getElementById("length").value);

    const frameSelect = document.getElementById("frame");
    frameSelect.innerHTML = '<option value="" disabled selected>Выберите каркас</option>';

    if (isNaN(length)) {
        return;
    }

    // Фильтруем данные по форме, ширине и длине
    const filteredData = currentCityData.filter(item => {
        const category = getFormCategory(item.form_name);
        return category === form && parseFloat(item.width) === width && parseFloat(item.length) === length;
    });

    // Проверка на пустые данные
    if (filteredData.length === 0) {
        showWarning("Теплица с указанными параметрами не найдена. Попробуйте выбрать другие параметры.", 'Теплица не найдена');
        return;
    }

    // Задаём порядок сортировки каркасов
    const frameOrder = ["20х20", "40х20", "20х20+20х20", "40х20+20х20", "40х20+40х20"];

    // Получаем уникальные значения каркаса
    let uniqueFrames = [...new Set(filteredData.map(item => {
        // Отладочное логирование: вывод названия и исходного описания

        // Нормализуем описание:
        // 1. Удаляем слово "двойная" (с любыми пробелами после него)
        // 2. Удаляем "оцинкованная труба" (без учета регистра)
        // 3. Удаляем символы "мм"
        let cleanDescription = item.frame_description
            .replace(/двойная\s*/gi, "")  // добавлено удаление слова "двойная"
            .replace(/оцинкованная труба/gi, "")
            .replace(/мм/gi, "")
            .trim();

        // Убираем лишние пробелы вокруг знака "+"
        cleanDescription = cleanDescription.replace(/\s*\+\s*/g, "+");

        // Если строка содержит "+", значит, это составной каркас – возвращаем её целиком
        if (cleanDescription.includes('+')) {
            return cleanDescription;
        }

        // Если нет знака "+", ищем простое совпадение для "20х20" или "40х20"
        const matches = cleanDescription.match(/(20х20|40х20)/gi);
        if (matches) {
        }

        return matches ? matches.join(",") : cleanDescription;
    }))];

    uniqueFrames = [...new Set(uniqueFrames.flatMap(f => f.split(",")))];

    uniqueFrames.sort((a, b) => {
        const iA = frameOrder.indexOf(a.trim());
        const iB = frameOrder.indexOf(b.trim());
        if (iA === -1 && iB === -1) {
            return a.localeCompare(b);
        } else if (iA === -1) {
            return 1;
        } else if (iB === -1) {
            return -1;
        }
        return iA - iB;
    });

    uniqueFrames.forEach(frame => {
        frameSelect.innerHTML += `<option value="${frame.trim()}">${frame.trim()}</option>`;
    });

    // Сброс шага дуг
    resetDropdown('arcStep', 'Выберите шаг');

    // Сброс дополнительных опций
    resetAdditionalOptions();
    
    // Предварительное обновление блока подарков (если все параметры выбраны)
    updateGiftsBlockPreview();
}

// Функция обработки изменения каркаса
function onFrameChange() {
    // Здесь вы можете добавить дополнительную логику, если требуется
    // Например, обновление шага дуг на основе выбранного каркаса
    resetDropdown('arcStep', 'Выберите шаг');
    resetAdditionalOptions();
    
    // Предварительное обновление блока подарков (если все параметры выбраны)
    updateGiftsBlockPreview();
}

// Функция сброса выпадающих списков
function resetDropdown(elementId, placeholderText) {
    const dropdown = document.getElementById(elementId);
    if (dropdown) {
        if (elementId === 'arcStep') {
            dropdown.value = "1"; // Устанавливаем значение по умолчанию
        } else if (elementId === 'polycarbonate') {
            // Для поликарбоната устанавливаем "Стандарт 4 мм", если доступно
            const options = dropdown.options;
            let standardFound = false;
            for (let i = 0; i < options.length; i++) {
                if (normalizeString(options[i].text) === normalizeString("Стандарт 4 мм")) {
                    dropdown.selectedIndex = i;
                    standardFound = true;
                    break;
                }
            }
            if (!standardFound && options.length > 1) {
                dropdown.selectedIndex = 1; // Выбираем первый доступный вариант, если "Стандарт 4 мм" не найден
            }
        } else if (elementId === 'city') {
            // ВАЖНО: Для города НЕ очищаем список, только сбрасываем выбор
            // Если список пустой, восстанавливаем из кеша
            if (dropdown.options.length <= 1 && citiesCache && citiesCache.length > 0) {
                // Восстанавливаем список из кеша
                dropdown.innerHTML = '<option value="" disabled selected>Выберите город</option>';
                citiesCache.forEach(city => {
                    dropdown.innerHTML += `<option value="${city}">${city}</option>`;
                });
            } else {
                // Просто сбрасываем выбор на placeholder
                dropdown.value = "";
                // Убеждаемся, что есть placeholder
                if (dropdown.options.length === 0 || dropdown.options[0].value !== "") {
                    dropdown.innerHTML = `<option value="" disabled selected>${placeholderText}</option>`;
                } else {
                    dropdown.selectedIndex = 0;
                }
            }
        } else {
            dropdown.innerHTML = `<option value="" disabled selected>${placeholderText}</option>`;
        }
    }
}

// Функция сброса дополнительных опций
function resetAdditionalOptions() {
    // Сбрасываем чекбоксы дополнительных услуг
    const additionalServices = document.querySelectorAll('.additional-services input[type="checkbox"]');
    additionalServices.forEach(checkbox => {
        if (checkbox) {
            checkbox.checked = false;
        }
    });

    // Сбрасываем select'ы для дополнительных товаров (количество = 0)
    const additionalProductSelects = document.querySelectorAll('.additional-products select');
    additionalProductSelects.forEach(select => {
        if (select) {
            select.value = "0";
        }
    });

    // Сбрасываем чекбокс сборки теплицы
    const assemblyCheckbox = document.getElementById('assembly');
    if (assemblyCheckbox) {
        assemblyCheckbox.checked = false;
    }
}

// Функция получения категории сборки на основе формы и ширины
function getAssemblyCategory(form, width) {
    return `${width}М`;
}

// Функция расчёта стоимости сборки
function calculateAssemblyCost(form, assemblyCategory, length) {
    if (!form || !assemblyPrices[form] || !assemblyPrices[form][assemblyCategory] || !assemblyPrices[form][assemblyCategory][length]) {
        return 0;
    }
    const price = assemblyPrices[form][assemblyCategory][length];
    return price;
}

// Функция расчёта стоимости теплицы
// Переменная для debounce calculateGreenhouseCost
let calculateDebounceTimer = null;

// Переменная для debounce calculateDelivery (защита от массовых запросов к Яндекс API)
let calculateDeliveryDebounceTimer = null;
let isCalculatingDelivery = false; // Флаг для предотвращения параллельных запросов

async function calculateGreenhouseCost(event = null) {
    const city = document.getElementById("city").value.trim();
    const form = document.getElementById("form").value.trim();
    const width = parseFloat(document.getElementById("width").value);
    const length = parseFloat(document.getElementById("length").value);
    const frame = document.getElementById("frame").value.trim();
    const polycarbonate = document.getElementById("polycarbonate").value.trim();
    const arcStep = parseFloat(document.getElementById("arcStep").value);

    // Проверка на заполнение всех обязательных полей
    const isFormComplete =
        city && form && !isNaN(width) && !isNaN(length) && frame && polycarbonate && !isNaN(arcStep);

    // Если поля не заполнены, проверяем изменение поликарбоната
    const isPolycarbonateChange =
        event && event.target && event.target.id === "polycarbonate";

    if (!isFormComplete) {
        if (isPolycarbonateChange) {
            return; // Не показываем alert при изменении поликарбоната
        }
        // Не показываем alert при каждом изменении - только если это явный вызов (кнопка)
        if (event && event.type === 'click') {
        showWarning("Пожалуйста, заполните все обязательные поля.", 'Заполните поля');
        }
        return;
    }
    
    // Debounce для оптимизации - не пересчитываем при каждом изменении
    if (calculateDebounceTimer) {
        clearTimeout(calculateDebounceTimer);
    }
    
    // Если это клик по кнопке - выполняем сразу, иначе с задержкой 300ms
    const delay = (event && event.type === 'click') ? 0 : 300;
    
    calculateDebounceTimer = setTimeout(async () => {
        await performCalculation(city, form, width, length, frame, polycarbonate, arcStep);
    }, delay);
}

// Вынесена логика расчета в отдельную функцию для переиспользования
async function performCalculation(city, form, width, length, frame, polycarbonate, arcStep) {

    // Фильтрация вручную для выбранной комбинации
    const selectedEntry = currentCityData.find(item => {
        return (
            getFormCategory(item.form_name) === form &&
            parseFloat(item.width) === width &&
            parseFloat(item.length) === length &&
            normalizeString(item.frame_description.replace(/двойная\s*/gi, "")).includes(normalizeString(frame)) &&
            normalizeString(item.polycarbonate_type) === normalizeString(polycarbonate)
        );
    });

    if (!selectedEntry) {
        showWarning("Теплица с заданными параметрами не найдена.", 'Теплица не найдена');
        return;
    }

    let basePrice = 0; // Стоимость теплицы
    let assemblyCost = 0; // Стоимость сборки
    let foundationCost = 0; // Стоимость основания (брус)
    let additionalProductsCost = 0; // Стоимость дополнительных товаров
    let finalTotalPrice = 0; // Итоговая стоимость

    let basePriceText = "";
    let assemblyText = "";
    let foundationText = "";
    let additionalProductsText = "";
    let deliveryText = "";

    // Берём базовую цену
    basePrice = selectedEntry.price;
    basePriceText = `Стоимость с учетом скидки - ${formatPrice(basePrice)} рублей`;

    // 1) Вытаскиваем из базы текст, например "284 кг/м2"
    let originalSnowLoadText = selectedEntry.snow_load || "0 кг/м2";

    // 2) Извлекаем только число (например "284") для расчётов
    let rawSnowLoad = originalSnowLoadText.match(/\d+(\.\d+)?/); // Находим число
    let snowLoadNum = rawSnowLoad ? parseFloat(rawSnowLoad[0]) : 0; // Преобразуем в число

    if (isNaN(snowLoadNum)) {
        snowLoadNum = 0;
    }

    // 3) Шаг дуг 0.65 м => +25% к нагрузке, + добавка к basePrice
    if (arcStep === 0.65) {
        // Находим базовую цену для "Стандарт 4мм" с учётом возможных вариантов написания
        const baseEntry = currentCityData.find(item => {
            return (
                getFormCategory(item.form_name) === form &&
                parseFloat(item.width) === width &&
                parseFloat(item.length) === length &&
                normalizeString(item.frame_description).includes(normalizeString(frame)) &&
                (normalizeString(item.polycarbonate_type) === normalizeString("стандарт4мм") ||
                    normalizeString(item.polycarbonate_type) === normalizeString("стандарт 4мм"))
            );
        });

        if (!baseEntry) {
            alert('Не найдена базовая цена для покрытия "Стандарт 4 мм".');
            return;
        }

        const basePriceStandard = baseEntry.price;
        const additionalCost = 0.25 * basePriceStandard;

        // Прибавляем к базовой цене
        basePrice += additionalCost;
        // Округляем до ближайшего 10
        basePrice = Math.ceil(basePrice / 10) * 10;
        basePriceText = `Стоимость с учетом скидки - ${formatPrice(basePrice)} рублей`;

        // Увеличиваем снеговую нагрузку на 25%
        snowLoadNum = Math.round(snowLoadNum * 1.25);
    }

    // 4) При поликарбонате Люкс => +10% к нагрузке, Премиум => +20%
    const polyStr = normalizeString(polycarbonate);
    if (polyStr === "люкс4мм" || polyStr === "люкс4 мм") {
        snowLoadNum = Math.round(snowLoadNum * 1.1);
    }
    if (polyStr === "премиум6мм" || polyStr === "премиум6 мм") {
        snowLoadNum = Math.round(snowLoadNum * 1.2);
    }

    // 5) Формируем строку для КП, например "355 кг/м2"
    let snowLoadFinalText = `${snowLoadNum} кг/м2`;

    // Дополнительные услуги
    const bracingCheckbox = document.getElementById('bracing');
    const groundHooksCheckbox = document.getElementById('ground-hooks');
    const assemblyCheckbox = document.getElementById('assembly');
    const onWoodCheckbox = document.getElementById('on-wood');
    const onConcreteCheckbox = document.getElementById('on-concrete');

    const bracingChecked = bracingCheckbox ? bracingCheckbox.checked : false;
    const groundHooksChecked = groundHooksCheckbox ? groundHooksCheckbox.checked : false;
    const assemblyChecked = assemblyCheckbox ? assemblyCheckbox.checked : false;
    const onWoodChecked = onWoodCheckbox ? onWoodCheckbox.checked : false;
    const onConcreteChecked = onConcreteCheckbox ? onConcreteCheckbox.checked : false;

    // Расчёт стоимости бруса
    if (bracingChecked) {
        const bracingPrice = additionalServicesData["Брус"].price_by_length[length];
        if (bracingPrice) {
            foundationCost += bracingPrice;
            foundationText += `\nОснование из бруса - ${formatPrice(bracingPrice)} рублей`;
        } else {
            alert(`Не найдена стоимость бруса для длины ${length} м.`);
            return;
        }
    }

    // Расчёт стоимости штырей
    if (groundHooksChecked) {
        // Если выбраны с брусом, используем соответствующие данные, иначе – другие
        const quantityData = bracingChecked
            ? additionalServicesData["Штыри"].quantity_by_length["with_bracing"]
            : additionalServicesData["Штыри"].quantity_by_length["without_bracing"];
        const stakesQuantity = quantityData[length];
        if (stakesQuantity) {
            const stakesCost = stakesQuantity * additionalServicesData["Штыри"].price_per_unit;
            foundationCost += stakesCost;
            foundationText += `\nГрунтозацепы ${stakesQuantity} шт - ${formatPrice(stakesCost)} рублей`;
        } else {
            alert(`Не найдена информация о количестве штырей для длины ${length} м.`);
            return;
        }
    }

    // Расчёт стоимости сборки (если выбрана)
    // Сборка недоступна для теплиц без поликарбоната
    const polycarbonateValue = document.getElementById("polycarbonate").value.trim();
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    const isWithoutPolycarbonate = polyNormalized === "безполикарбоната";
    
    if (assemblyChecked && !isWithoutPolycarbonate) {
        const assemblyCategory = getAssemblyCategory(form, width); // Получаем категорию сборки
        if (assemblyCategory) {
            const assemblyCostCalculated = calculateAssemblyCost(form, assemblyCategory, length);
            if (assemblyCostCalculated > 0) {
                assemblyCost += assemblyCostCalculated;
                assemblyText += `\nСборка и установка - ${formatPrice(assemblyCostCalculated)} рублей`;
            } else {
                alert(`Не найдена стоимость сборки для формы "${form}", ширины "${width}М" и длины "${length} м".`);
                return;
            }
        } else {
            alert(`Категория сборки для формы "${form}" и ширины "${width}М" не определена.`);
            return;
        }
    }

    // Расчёт стоимости монтажа на фундамент клиента (если выбрана опция "на брус")
    if (onWoodChecked) {
        const woodPrice = onWoodCheckbox ? parseFloat(onWoodCheckbox.getAttribute('data-price')) : 0;
        if (woodPrice) {
            foundationCost += woodPrice;
            foundationText += `\nМонтаж на брус клиента - ${formatPrice(woodPrice)} рублей`;
        } else {
            alert(`Не найдена стоимость монтажа на брус.`);
            return;
        }
    }

    // Расчёт стоимости монтажа на фундамент клиента (если выбрана опция "на бетон")
    if (onConcreteChecked) {
        const concretePrice = onConcreteCheckbox ? parseFloat(onConcreteCheckbox.getAttribute('data-price')) : 0;
        if (concretePrice) {
            foundationCost += concretePrice;
            foundationText += `\nМонтаж на бетон клиента - ${formatPrice(concretePrice)} рублей`;
        } else {
            alert(`Не найдена стоимость монтажа на бетон.`);
            return;
        }
    }

    // Дополнительные товары (новая логика с выбором количества через select)
const additionalProducts = [];
const productSelects = document.querySelectorAll('.additional-products .product-item select');
productSelects.forEach(select => {
    const quantity = parseInt(select.value, 10);
    if (quantity > 0) {
        // Получаем название товара
        const productNameElement = select.parentElement.querySelector('.product-name');
        const productName = productNameElement ? productNameElement.textContent.trim() : "";
        // Если нужно исключить товары типа "перегородка", можно добавить проверку:
        if (productName.toLowerCase().includes("перегородка")) {
            return;
        }
        const productPrice = parseFloat(select.getAttribute('data-price'));
        if (!isNaN(productPrice) && productPrice > 0) {
            additionalProducts.push({ 
                name: productName, 
                cost: productPrice * quantity,
                quantity: quantity 
            });
            additionalProductsCost += productPrice * quantity;
        }
    }
});

    // Грядки (из localStorage или начальное состояние)
    let bedsCost = 0;
    let bedsText = "";
    let bedsAssemblyCost = 0;
    const selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
    const bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';
    
    if (Object.keys(selectedBeds).length > 0) {
        // Собираем информацию о грядках для красивого отображения
        const bedsByType = {};
        Object.keys(selectedBeds).forEach(bedId => {
            const bed = BEDS_DATA.find(b => b.id === bedId);
            // Учитываем только грядки с ценой больше 0 и количеством больше 0
            if (bed && selectedBeds[bedId] > 0 && bed.price > 0) {
                const bedTotalCost = bed.price * selectedBeds[bedId];
                bedsCost += bedTotalCost;
                
                // Группируем по типу для красивого отображения
                const typeKey = `${bed.height === 19 ? 'Низкие' : 'Высокие'} ${bed.width} м`;
                if (!bedsByType[typeKey]) {
                    bedsByType[typeKey] = [];
                }
                bedsByType[typeKey].push({
                    length: bed.length,
                    quantity: selectedBeds[bedId],
                    cost: bedTotalCost
                });
            }
        });
        
        // Формируем красивый текст для грядок
        if (Object.keys(selectedBeds).length > 0) {
            bedsText = "Грядки оцинкованные:\n";
            Object.keys(selectedBeds).forEach(bedId => {
                const bed = BEDS_DATA.find(b => b.id === bedId);
                if (bed && selectedBeds[bedId] > 0 && bed.price > 0) {
                    const quantity = selectedBeds[bedId];
                    const totalCost = bed.price * quantity;
                    const heightText = bed.height === 19 ? 'низкие' : 'высокие';
                    // Правильное склонение слова "грядка"
                    let bedWord = 'грядка';
                    if (quantity === 1) {
                        bedWord = 'грядка';
                    } else if (quantity >= 2 && quantity <= 4) {
                        bedWord = 'грядки';
                    } else {
                        bedWord = 'грядок';
                    }
                    bedsText += `${quantity} ${bedWord} ${heightText} ${bed.length} м: ширина ${bed.width} м, высота ${bed.height} см - ${formatPrice(totalCost)} рублей\n`;
                }
            });
            bedsText = bedsText.trim();
        }
        
        // Расчет стоимости сборки грядок (если включена)
        // Считаем для каждой грядки отдельно по её длине
        if (bedsAssemblyEnabled) {
            bedsAssemblyCost = calculateBedsAssemblyCost(selectedBeds);
        }
        
        additionalProductsCost += bedsCost;
        if (bedsText) {
            additionalProductsText += (additionalProductsText ? '\n\n' : '') + bedsText;
        }
        
        // Добавляем сборку грядок отдельной строкой
        if (bedsAssemblyCost > 0) {
            additionalProductsCost += bedsAssemblyCost;
            additionalProductsText += `\nСборка грядок - ${formatPrice(bedsAssemblyCost)} рублей`;
        }
    }

    // Формируем текст дополнительных товаров с указанием количества, если больше 1
    // ВАЖНО: не перезаписываем additionalProductsText, а добавляем к существующему тексту
if (additionalProducts.length > 0) {
        const productsText = additionalProducts.map(product => {
        if (product.quantity > 1) {
            return `${product.name} x ${product.quantity} - ${formatPrice(product.cost)} рублей`;
        } else {
            return `${product.name} - ${formatPrice(product.cost)} рублей`;
        }
    }).join('\n');
        // Добавляем к существующему тексту (который может содержать грядки)
        additionalProductsText = (additionalProductsText ? additionalProductsText + '\n\n' : '') + productsText;
    }

    // Получаем стоимость доставки из блока доставки
    const deliveryPrice = deliveryCost;

    // Итоговая стоимость (включая доставку)
    finalTotalPrice = basePrice + assemblyCost + foundationCost + additionalProductsCost + deliveryPrice;

    // Округление вверх до ближайшего десятка (после добавления доставки)
    finalTotalPrice = Math.ceil(finalTotalPrice / 10) * 10;

    // Формирование итогового резюме (которое теперь будет лишь в КП)
    let summaryText = `Итоговая стоимость теплицы: ${formatPrice(finalTotalPrice)} рублей\n`;
    summaryText += `${basePriceText}\n`;
    if (assemblyText) {
        summaryText += `${assemblyText}\n`;
    }
    if (foundationText) {
        summaryText += `${foundationText}\n`;
    }
    if (additionalProductsText) {
        summaryText += `\n${additionalProductsText}\n`;
    }
    if (deliveryPrice > 0) {
        summaryText += `\nДоставка - ${formatPrice(deliveryPrice)} рублей\n`;
    }
    summaryText += `\nИтоговая стоимость - ${formatPrice(finalTotalPrice)} рублей`;

    // Сохраняем последнюю рассчитанную цену для использования в onGiftChange()
    lastCalculatedPrice = finalTotalPrice;

    // Генерация коммерческого предложения (длинное КП)
    await generateCommercialOffer(basePrice, assemblyCost, foundationCost, additionalProducts, additionalProductsCost, deliveryPrice, finalTotalPrice, selectedEntry, basePriceText, assemblyText, foundationText, additionalProductsText, snowLoadFinalText);
    
    // Генерация короткого КП
    await generateShortOffer(finalTotalPrice, selectedEntry);
    
    // Обновление блока подарков на основе итоговой суммы
    updateGiftsBlock(finalTotalPrice);
    
    // ВАЖНО: Авто-обновление КП с подарками сразу после первого расчёта
    // (если подарки уже были выбраны ранее и лежат в localStorage)
    const savedGifts = JSON.parse(localStorage.getItem('selectedGifts') || '{}');
    if (Object.keys(savedGifts).length > 0) {
        updateCommercialOffersWithGifts(savedGifts);
    }
    
    // Устанавливаем активной вкладку "Короткое КП" после расчёта
    setOfferTab('short');
}

async function calculateDelivery() {
    // Защита от параллельных запросов
    if (isCalculatingDelivery) {
        return; // Уже идет расчет, пропускаем
    }

    const addressInput = document.getElementById("address");
    const address = addressInput.value.trim().toLowerCase();
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;

    if (!address) {
        document.getElementById('result').innerText = "Введите адрес!";
        return;
    }

    // Устанавливаем флаг, что идет расчет
    isCalculatingDelivery = true;

    try {
        const res = await ymaps.geocode(address, { results: 1 });
        const geoObject = res.geoObjects.get(0);

        if (!geoObject) {
            document.getElementById('result').innerText = "Адрес не найден!";
            return;
        }

        // Извлекаем населённые пункты и административные области,
        // приводим их к нижнему регистру для упрощённого сравнения.
        let localities = geoObject.getLocalities().map(loc => loc.toLowerCase());
        let administrativeAreas = geoObject.getAdministrativeAreas().map(area => area.toLowerCase());


        // Проверяем, содержит ли хотя бы одно ключевое слово из массива deliveryRegions
        // любое слово из localities или administrativeAreas
        const isInDeliveryRegion = deliveryRegions.some(regionEntry => {
            return regionEntry.keywords.some(keyword =>
                localities.some(loc => loc.includes(keyword)) ||
                administrativeAreas.some(area => area.includes(keyword))
            );
        });

        if (!isInDeliveryRegion) {
            document.getElementById('result').innerText = "Доставка в этот регион не осуществляется.";
            return;
        }

        const coords = geoObject.geometry.getCoordinates();
        const destinationLat = coords[0];
        const destinationLon = coords[1];

        let cityDistances = [];

// Шаг 1: Вычисляем прямые расстояния до всех городов
citiesForMap.forEach(city => {
    const geoDistance = ymaps.coordSystem.geo.getDistance(city.coords, [destinationLat, destinationLon]) / 1000; // расстояние в км
    cityDistances.push({ city: city, geoDistance: geoDistance });
});

// Сортируем города по прямому расстоянию и берём топ-5 ближайших
cityDistances.sort((a, b) => a.geoDistance - b.geoDistance);
const topCities = cityDistances.slice(0, 5); // Берём 5 ближайших городов

// Шаг 2: Теперь строим маршруты для этих 5 городов ПАРАЛЛЕЛЬНО и выбираем наименьший
let nearestCity = null;
let minRouteDistance = Infinity;

// Делаем запросы параллельно вместо последовательно для ускорения
const routePromises = topCities.map(async (entry) => {
    try {
        const route = await ymaps.route([entry.city.coords, [destinationLat, destinationLon]]);
        const routeDistance = route.getLength() / 1000; // расстояние по дорогам в км
        return { city: entry.city, distance: routeDistance, route: route };
    } catch (error) {
        // Маршрут для части складов может не строиться (ограничения API) — используем успешные
        if (DEBUG) console.warn("Маршрут для", entry.city.name, "не построен, берём другие склады:", error?.message || error);
        return null;
    }
});

// Ждем все запросы параллельно
const routeResults = await Promise.all(routePromises);

// Находим ближайший город
for (const result of routeResults) {
    if (result && result.distance < minRouteDistance) {
        minRouteDistance = result.distance;
        nearestCity = result.city;
    }
}

// Проверяем, нашёлся ли ближайший город
if (!nearestCity) {
    document.getElementById('result').innerText = "Ошибка: ближайший город не найден.";
    return;
}

        mapInstance.setCenter(nearestCity.coords, 7);

        // Автоматически установить найденный город в выпадающем списке "Город"
        // Используем нормализованное сравнение для поиска правильного названия
        const cityDropdown = document.getElementById('city');
        const foundCityName = findCityInDropdown(nearestCity.name);
        
        if (foundCityName) {
            cityDropdown.value = foundCityName;
            await onCityChange(); // Ждем загрузки данных города, включая дату доставки
        } else {
            // Если не найдено, пытаемся установить напрямую
            cityDropdown.value = nearestCity.name;
            // Загружаем дату доставки для найденного города (даже если он не в списке)
            await loadDeliveryDate(nearestCity.name);
            // Пробуем снова через небольшую задержку (на случай, если список ещё загружается)
            setTimeout(async () => {
                const foundAfterDelay = findCityInDropdown(nearestCity.name);
                if (foundAfterDelay) {
                    cityDropdown.value = foundAfterDelay;
                    await onCityChange();
                }
            }, 300);
        }

        if (currentRoute) {
            mapInstance.geoObjects.remove(currentRoute);
        }

        try {
            const route = await ymaps.route([nearestCity.coords, [destinationLat, destinationLon]]);
            currentRoute = route;
            mapInstance.geoObjects.add(route);

            const distanceInKm = route.getLength() / 1000;
            const distanceFromBoundary = Math.max(distanceInKm - nearestCity.boundaryDistance, 0);
            const rate = nearestCity.pricePerKm ?? 50; // тариф руб/км от склада

            let cost;
            if (deliveryType === "withoutAssembly") {
                cost = Math.max(1000, 500 + rate * distanceFromBoundary);
            } else {
                cost = Math.max(1000, rate * distanceFromBoundary);
            }

            const roundedCost = Math.ceil(cost / 50) * 50;

            deliveryCost = roundedCost; // сохраняем стоимость доставки в глобальной переменной

            const deliveryDate = await loadDeliveryDate(nearestCity.name);
            
            let resultText = `Стоимость доставки: ${formatPrice(roundedCost)} рублей (${nearestCity.name})`;
            const dateBlock = getDeliveryDateTextForBlock(deliveryType === 'withAssembly');
            if (dateBlock) {
                const dateLines = dateBlock.split('\n').map(l => '📅 ' + l.trim()).filter(Boolean);
                resultText += '\n' + dateLines.join('\n');
            }
            document.getElementById('result').innerText = resultText;
        } catch (routeError) {
            document.getElementById('result').innerText = "Ошибка при расчёте маршрута.";
        }

    } catch (geocodeError) {
        document.getElementById('result').innerText = "Ошибка при расчёте. Попробуйте снова.";
    } finally {
        // Снимаем флаг после завершения (успешного или с ошибкой)
        isCalculatingDelivery = false;
    }
}

// Функция-обертка с debounce для calculateDelivery
function calculateDeliveryDebounced() {
    // Очищаем предыдущий таймер
    if (calculateDeliveryDebounceTimer) {
        clearTimeout(calculateDeliveryDebounceTimer);
    }
    
    // Устанавливаем новый таймер (500мс задержка)
    calculateDeliveryDebounceTimer = setTimeout(() => {
        calculateDelivery();
    }, 500);
}

// Функция формирования коммерческого предложения
async function generateCommercialOffer(basePrice, assemblyCost, foundationCost, additionalProducts, additionalProductsCost, deliveryPrice, finalTotalPrice, selectedEntry, basePriceText, assemblyText, foundationText, additionalProductsText, snowLoadFinalText) {
    // Извлечение дополнительных характеристик
    const height = selectedEntry.height ? selectedEntry.height : "Не указано";
    const horizontalTies = selectedEntry.horizontal_ties ? selectedEntry.horizontal_ties : "Не указано";
    const equipment = selectedEntry.equipment || "Не указано";

    // Получаем название теплицы из базы данных и приводим к верхнему регистру
    const baseName = selectedEntry.form_name.toUpperCase(); // например, "ДОМИК ЛЮКС 3М"

    // Выбранная форма (например, "ДОМИКОМ" или "АРОЧНАЯ")
    const selectedForm = document.getElementById("form").value.toUpperCase();

    // Массив ключевых слов, по которым определяется форма
    const formSynonyms = [
        "ДОМИК",
        "АРОЧНАЯ",
        "КАПЛЕВИДНАЯ",
        "ПРИСТЕННАЯ",
        "ПРЯМОСТЕННАЯ",
        "МИТТЛАЙДЕР",
        "ПРОМЫШЛЕННАЯ",
        "НАВЕС"
    ];

    // Функция, которая проверяет, содержится ли выбранная форма (или её синоним)
    // в baseName. Если хотя бы одно ключевое слово из selectedForm совпадает с частью baseName, то дописывать не нужно.
    function shouldAppendForm(baseName, selectedForm) {
        // Пройдемся по ключевым словам
        for (let i = 0; i < formSynonyms.length; i++) {
            const key = formSynonyms[i];
            // Если и baseName содержит это ключевое слово, и выбранная форма тоже содержит его, значит не нужно дописывать
            if (baseName.includes(key) && selectedForm.includes(key)) {
                return false;
            }
        }
        return true;
    }

    // Формируем итоговое название теплицы
    let cleanName = baseName;
    if (shouldAppendForm(baseName, selectedForm)) {
        cleanName += ` ${selectedForm}`;
    }

    const frameValue = document.getElementById("frame").value.trim();
    const widthValue = document.getElementById("width").value.trim();
    const lengthValue = document.getElementById("length").value.trim();
    const arcStepValue = document.getElementById("arcStep").value.trim();
    const polycarbonateValue = document.getElementById("polycarbonate").value.trim();
    
    // Нормализуем значение поликарбоната для проверок
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    
    // Добавляем "без поликарбоната" если выбран вариант без поликарбоната
    if (polyNormalized === "безполикарбоната") {
        cleanName += ` без поликарбоната`;
    }

    // Формирование строки для каркаса с добавлением суффикса ", краб система"
    let frameLine = `Каркас: ${frameValue}`;
    if (frameValue) {
        frameLine += `, краб система`;
    }

    // Формирование строки для поликарбоната с добавлением веса (если выбран вариант, отличный от "Без поликарбоната")
    let polycarbonateLine = `Поликарбонат с УФ защитой: ${polycarbonateValue}`;
    if (polyNormalized !== "безполикарбоната") {
        if (polyNormalized === "стандарт4мм") {
            polycarbonateLine += `, 0.47 кг/м2`;
        } else if (polyNormalized === "люкс4мм" || polyNormalized === "люкс4 мм") {
            polycarbonateLine += `, 0.52 кг/м2`;
        } else if (polyNormalized === "премиум6мм" || polyNormalized === "премиум6 мм") {
            polycarbonateLine += `, 0.8 кг/м2`;
        }
    }

    // Формирование итогового коммерческого предложения
    let commercialOffer = `${cleanName}\n\n` +
        `${frameLine}\n` +
        `Ширина: ${widthValue} м\n` +
        `Длина: ${lengthValue} м\n` +
        `Высота: ${height}\n` +
        `Шаг дуги: ${arcStepValue} м\n` +
        `${polycarbonateLine}\n` +
        `Снеговая нагрузка: ${snowLoadFinalText}\n` +
        `Горизонтальные стяжки: ${horizontalTies}\n` +
        `Комплектация: ${equipment}\n` +
        `${basePriceText}\n`;

    if (assemblyText) {
        commercialOffer += `${assemblyText}\n`;
    }
    if (foundationText) {
        commercialOffer += `${foundationText}\n`;
    }
    if (additionalProductsText) {
        commercialOffer += `\n${additionalProductsText}\n`;
    }
    
    if (deliveryPrice > 0) {
        commercialOffer += `\nДоставка - ${formatPrice(deliveryPrice)} рублей\n`;
    }
    
    const deliveryTypeForOffer = document.querySelector('input[name="deliveryType"]:checked')?.value;
    const withAssemblyForOffer = deliveryTypeForOffer === 'withAssembly';
    if (SHOW_DELIVERY_DATE_IN_OFFER) {
        if (!currentDeliveryDate) {
            const selectedCity = document.getElementById("city").value;
            if (selectedCity) {
                await loadDeliveryDate(selectedCity);
            }
        }
        const dateText = getDeliveryDateTextForKP(withAssemblyForOffer);
        if (dateText) {
            commercialOffer += `📅 ${dateText.includes('Доставка:') ? dateText : 'Доставка: с ' + dateText}\n`;
        }
    }
    const dateTextForOffer = getDeliveryDateTextForKP(withAssemblyForOffer);
    const deliveryDateText = dateTextForOffer ? `📅 Ближайшая дата доставки: ${dateTextForOffer}.` : '';
    
    // Подарки НЕ добавляются здесь - они добавляются через updateCommercialOffersWithGifts()
    // Это предотвращает дублирование подарков в КП
    
    // Если сумма больше 35000 рублей - используем расширенный формат
    if (finalTotalPrice > 35000) {
        commercialOffer += `\nИтого: ${formatPrice(finalTotalPrice)} рублей\n\n`;
        commercialOffer += `💳 Без предоплаты — оплата по факту.\n` +
            `🌱 Бесплатное хранение до весны с сохранением цены.\n`;
        if (deliveryDateText) {
            commercialOffer += `${deliveryDateText}\n`;
        }
    } else {
        // Если сумма 35000 и меньше - стандартный формат
        commercialOffer += `\nИтоговая стоимость - ${formatPrice(finalTotalPrice)} рублей\n`;
        commercialOffer += `💳 Без предоплаты — оплата по факту\n` +
            `🌱 Бесплатное хранение до весны с сохранением цены.\n`;
        if (deliveryDateText) {
            commercialOffer += `${deliveryDateText}\n`;
        }
    }

    // ========== ВАРИАНТ 2: С запасом по нагрузке ==========
    const reserveVariant = pickReserveVariant();
    if (reserveVariant) {
        const finalTotalPrice2 = computeFinalTotalPriceForVariant({
            frame: reserveVariant.altFrame,
            arcStep: reserveVariant.altArcStep,
            polycarbonate: reserveVariant.altPolycarbonate,
            deliveryPrice: deliveryPrice // Передаем актуальную стоимость доставки
        });
        
        if (finalTotalPrice2 !== null) {
            // Генерируем полное описание второго варианта
            const variant2Description = await generateVariant2Description(
                reserveVariant.altFrame,
                reserveVariant.altArcStep,
                reserveVariant.altPolycarbonate,
                reserveVariant.reasonText,
                finalTotalPrice2,
                selectedEntry,
                deliveryPrice // Передаем актуальную стоимость доставки
            );
            
            if (variant2Description) {
                commercialOffer += `\n\n${variant2Description}`;
            }
        }
    }

    // Выводим сформированное КП в textarea
    document.getElementById("commercial-offer").value = commercialOffer;
    
    // Обновляем счетчик символов и кнопки
    updateCharCounter('commercial-offer');
}

// Функция генерации полного описания второго варианта для длинного КП
async function generateVariant2Description(altFrame, altArcStep, altPolycarbonate, reasonText, finalTotalPrice2, baseSelectedEntry, deliveryPrice = null) {
    try {
        const form = document.getElementById("form").value.trim();
        const width = parseFloat(document.getElementById("width").value);
        const length = parseFloat(document.getElementById("length").value);
        
        // Находим entry для альтернативного варианта
        const altEntry = currentCityData.find(item => {
            return (
                getFormCategory(item.form_name) === form &&
                parseFloat(item.width) === width &&
                parseFloat(item.length) === length &&
                normalizeString(item.frame_description.replace(/двойная\s*/gi, "")).includes(normalizeString(altFrame)) &&
                normalizeString(item.polycarbonate_type) === normalizeString(altPolycarbonate)
            );
        });
        
        if (!altEntry) {
            return null; // Вариант не найден
        }
        
        // Извлечение дополнительных характеристик
        const height = altEntry.height ? altEntry.height : "Не указано";
        const horizontalTies = altEntry.horizontal_ties ? altEntry.horizontal_ties : "Не указано";
        const equipment = altEntry.equipment || "Не указано";
        
        // Получаем название теплицы
        const baseName = altEntry.form_name.toUpperCase();
        const selectedForm = document.getElementById("form").value.toUpperCase();
        
        const formSynonyms = [
            "ДОМИК", "АРОЧНАЯ", "КАПЛЕВИДНАЯ", "ПРИСТЕННАЯ",
            "ПРЯМОСТЕННАЯ", "МИТТЛАЙДЕР", "ПРОМЫШЛЕННАЯ", "НАВЕС"
        ];
        
        function shouldAppendForm(baseName, selectedForm) {
            for (let i = 0; i < formSynonyms.length; i++) {
                const key = formSynonyms[i];
                if (baseName.includes(key) && selectedForm.includes(key)) {
                    return false;
                }
            }
            return true;
        }
        
        let cleanName = baseName;
        if (shouldAppendForm(baseName, selectedForm)) {
            cleanName += ` ${selectedForm}`;
        }
        
        // Формирование строки для каркаса
        let frameLine = `Каркас: ${altFrame}`;
        if (altFrame) {
            frameLine += `, краб система`;
        }
        
        // Формирование строки для поликарбоната
        let polycarbonateLine = `Поликарбонат с УФ защитой: ${altPolycarbonate}`;
        const polyNormalized = altPolycarbonate.replace(/\s+/g, "").toLowerCase();
        if (polyNormalized !== "безполикарбоната") {
            if (polyNormalized === "стандарт4мм") {
                polycarbonateLine += `, 0.47 кг/м2`;
            } else if (polyNormalized === "люкс4мм" || polyNormalized === "люкс4 мм") {
                polycarbonateLine += `, 0.52 кг/м2`;
            } else if (polyNormalized === "премиум6мм" || polyNormalized === "премиум6 мм") {
                polycarbonateLine += `, 0.8 кг/м2`;
            }
        }
        
        // Расчёт снеговой нагрузки (как в calculateGreenhouseCost)
        let originalSnowLoadText = altEntry.snow_load || "0 кг/м2";
        let rawSnowLoad = originalSnowLoadText.match(/\d+(\.\d+)?/);
        let snowLoadNum = rawSnowLoad ? parseFloat(rawSnowLoad[0]) : 0;
        if (isNaN(snowLoadNum)) {
            snowLoadNum = 0;
        }
        
        // Надбавка за arcStep 0.65
        if (altArcStep === 0.65) {
            snowLoadNum = Math.round(snowLoadNum * 1.25);
        }
        
        // Надбавка за поликарбонат
        if (polyNormalized === "люкс4мм" || polyNormalized === "люкс4 мм") {
            snowLoadNum = Math.round(snowLoadNum * 1.1);
        }
        if (polyNormalized === "премиум6мм" || polyNormalized === "премиум6 мм") {
            snowLoadNum = Math.round(snowLoadNum * 1.2);
        }
        
        let snowLoadFinalText = `${snowLoadNum} кг/м2`;
        
        // Получаем те же дополнительные услуги и товары (они не меняются)
        const bracingCheckbox = document.getElementById('bracing');
        const groundHooksCheckbox = document.getElementById('ground-hooks');
        const assemblyCheckbox = document.getElementById('assembly');
        const onWoodCheckbox = document.getElementById('on-wood');
        const onConcreteCheckbox = document.getElementById('on-concrete');
        
        const bracingChecked = bracingCheckbox ? bracingCheckbox.checked : false;
        const groundHooksChecked = groundHooksCheckbox ? groundHooksCheckbox.checked : false;
        const assemblyChecked = assemblyCheckbox ? assemblyCheckbox.checked : false;
        const onWoodChecked = onWoodCheckbox ? onWoodCheckbox.checked : false;
        const onConcreteChecked = onConcreteCheckbox ? onConcreteCheckbox.checked : false;
        
        // Расчёт basePrice для альтернативного варианта
        let basePrice = altEntry.price;
        if (altArcStep === 0.65) {
            const baseEntry = currentCityData.find(item => {
                return (
                    getFormCategory(item.form_name) === form &&
                    parseFloat(item.width) === width &&
                    parseFloat(item.length) === length &&
                    normalizeString(item.frame_description).includes(normalizeString(altFrame)) &&
                    (normalizeString(item.polycarbonate_type) === normalizeString("стандарт4мм") ||
                        normalizeString(item.polycarbonate_type) === normalizeString("стандарт 4мм"))
                );
            });
            if (baseEntry) {
                const basePriceStandard = baseEntry.price;
                const additionalCost = 0.25 * basePriceStandard;
                basePrice += additionalCost;
                basePrice = Math.ceil(basePrice / 10) * 10;
            }
        }
        
        // Формируем тексты для дополнительных услуг (те же, что в основном варианте)
        let assemblyText = "";
        let foundationText = "";
        let additionalProductsText = "";
        
        if (assemblyChecked) {
            const assemblyCategory = getAssemblyCategory(form, width);
            if (assemblyCategory) {
                const assemblyCostCalculated = calculateAssemblyCost(form, assemblyCategory, length);
                if (assemblyCostCalculated > 0) {
                    assemblyText = `\nСборка и установка - ${formatPrice(assemblyCostCalculated)} рублей`;
                }
            }
        }
        
        if (bracingChecked) {
            const bracingPrice = additionalServicesData["Брус"].price_by_length[length];
            if (bracingPrice) {
                foundationText += `\nОснование из бруса - ${formatPrice(bracingPrice)} рублей`;
            }
        }
        
        if (groundHooksChecked) {
            const quantityData = bracingChecked
                ? additionalServicesData["Штыри"].quantity_by_length["with_bracing"]
                : additionalServicesData["Штыри"].quantity_by_length["without_bracing"];
            const stakesQuantity = quantityData[length];
            if (stakesQuantity) {
                const stakesCost = stakesQuantity * additionalServicesData["Штыри"].price_per_unit;
                foundationText += `\nГрунтозацепы ${stakesQuantity} шт - ${formatPrice(stakesCost)} рублей`;
            }
        }
        
        if (onWoodChecked) {
            const woodPrice = onWoodCheckbox ? parseFloat(onWoodCheckbox.getAttribute('data-price')) : 0;
            if (woodPrice) {
                foundationText += `\nМонтаж на брус клиента - ${formatPrice(woodPrice)} рублей`;
            }
        }
        
        if (onConcreteChecked) {
            const concretePrice = onConcreteCheckbox ? parseFloat(onConcreteCheckbox.getAttribute('data-price')) : 0;
            if (concretePrice) {
                foundationText += `\nМонтаж на бетон клиента - ${formatPrice(concretePrice)} рублей`;
            }
        }
        
        // Дополнительные товары (те же)
        const productSelects = document.querySelectorAll('.additional-products .product-item select');
        const additionalProducts = [];
        productSelects.forEach(select => {
            const quantity = parseInt(select.value, 10);
            if (quantity > 0) {
                const productNameElement = select.parentElement.querySelector('.product-name');
                const productName = productNameElement ? productNameElement.textContent.trim() : "";
                if (!productName.toLowerCase().includes("перегородка")) {
                    const productPrice = parseFloat(select.getAttribute('data-price'));
                    if (!isNaN(productPrice) && productPrice > 0) {
                        additionalProducts.push({
                            name: productName,
                            cost: productPrice * quantity,
                            quantity: quantity
                        });
                    }
                }
            }
        });
        
        if (additionalProducts.length > 0) {
            additionalProductsText = additionalProducts.map(product => {
                if (product.quantity > 1) {
                    return `${product.name} x ${product.quantity} - ${formatPrice(product.cost)} рублей`;
                } else {
                    return `${product.name} - ${formatPrice(product.cost)} рублей`;
                }
            }).join('\n');
        }
        
        // Получаем стоимость доставки (переданную как параметр или из глобальной переменной)
        const deliveryPriceValue = deliveryPrice !== null ? deliveryPrice : deliveryCost;
        
        // Формируем описание второго варианта
        let variant2Text = `\n${'='.repeat(50)}\n`;
        variant2Text += `ВАРИАНТ 2: С запасом по нагрузке (${reasonText})\n`;
        variant2Text += `${'='.repeat(50)}\n\n`;
        variant2Text += `${cleanName}\n\n`;
        variant2Text += `${frameLine}\n`;
        variant2Text += `Ширина: ${width} м\n`;
        variant2Text += `Длина: ${length} м\n`;
        variant2Text += `Высота: ${height}\n`;
        variant2Text += `Шаг дуги: ${altArcStep} м\n`;
        variant2Text += `${polycarbonateLine}\n`;
        variant2Text += `Снеговая нагрузка: ${snowLoadFinalText}\n`;
        variant2Text += `Горизонтальные стяжки: ${horizontalTies}\n`;
        variant2Text += `Комплектация: ${equipment}\n`;
        variant2Text += `Стоимость с учетом скидки - ${formatPrice(basePrice)} рублей\n`;
        
        if (assemblyText) {
            variant2Text += `${assemblyText}\n`;
        }
        if (foundationText) {
            variant2Text += `${foundationText}\n`;
        }
        if (additionalProductsText) {
            variant2Text += `\n${additionalProductsText}\n`;
        }
        
        // Добавляем грядки во второй вариант (если выбраны)
        const selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
        const bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';
        let bedsText = '';
        
        if (Object.keys(selectedBeds).length > 0) {
            bedsText += '\nГрядки оцинкованные:\n';
            Object.keys(selectedBeds).forEach(bedId => {
                const bed = BEDS_DATA.find(b => b.id === bedId);
                if (bed && selectedBeds[bedId] > 0 && bed.price > 0) {
                    const quantity = selectedBeds[bedId];
                    const totalCost = bed.price * quantity;
                    const heightText = bed.height === 19 ? 'низкие' : 'высокие';
                    // Правильное склонение слова "грядка"
                    let bedWord = 'грядка';
                    if (quantity === 1) {
                        bedWord = 'грядка';
                    } else if (quantity >= 2 && quantity <= 4) {
                        bedWord = 'грядки';
                    } else {
                        bedWord = 'грядок';
                    }
                    bedsText += `${quantity} ${bedWord} ${heightText} ${bed.length} м: ширина ${bed.width} м, высота ${bed.height} см - ${formatPrice(totalCost)} рублей\n`;
                }
            });
            
            // Добавляем сборку грядок, если включена (считаем для каждой грядки отдельно по её длине)
            if (bedsAssemblyEnabled) {
                const bedsAssemblyCost = calculateBedsAssemblyCost(selectedBeds);
                if (bedsAssemblyCost > 0) {
                    bedsText += `Сборка грядок - ${formatPrice(bedsAssemblyCost)} рублей\n`;
                }
            }
        }
        
        if (bedsText) {
            variant2Text += bedsText;
        }
        
        if (deliveryPriceValue > 0) {
            variant2Text += `\nДоставка - ${formatPrice(deliveryPriceValue)} рублей\n`;
        }
        
        const deliveryTypeV2 = document.querySelector('input[name="deliveryType"]:checked')?.value;
        const dateTextV2 = getDeliveryDateTextForKP(deliveryTypeV2 === 'withAssembly');
        const deliveryDateText = dateTextV2 ? `📅 Ближайшая дата доставки: ${dateTextV2}.` : '';
        
        // Добавляем итоговую сумму
        if (finalTotalPrice2 > 35000) {
            variant2Text += `\nИтого: ${formatPrice(finalTotalPrice2)} рублей\n\n`;
        } else {
            variant2Text += `\nИтоговая стоимость - ${formatPrice(finalTotalPrice2)} рублей\n`;
        }
        
        // Подарки НЕ добавляются здесь - они добавляются через rebuildLongOfferWithGifts()
        // Это предотвращает дублирование подарков в КП
        
        // Добавляем условия оплаты (те же, что в основном КП)
        if (finalTotalPrice2 > 35000) {
            variant2Text += `💳 Без предоплаты — оплата по факту.\n` +
                `🌱 Бесплатное хранение до весны с сохранением цены.\n`;
            if (deliveryDateText) {
                variant2Text += `${deliveryDateText}\n`;
            }
        } else {
            variant2Text += `💳 Без предоплаты — оплата по факту\n` +
                `🌱 Бесплатное хранение до весны с сохранением цены.\n`;
            if (deliveryDateText) {
                variant2Text += `${deliveryDateText}\n`;
            }
        }
        
        return variant2Text;
    } catch (err) {
        console.error("Ошибка при генерации описания второго варианта:", err);
        return null;
    }
}

// ==================== КОРОТКОЕ КП ====================

// Функция выбора альтернативного варианта (для ИТОГО_2)
// Новая логика: шаг дуг → каркас → поликарбонат
function pickReserveVariant() {
    const currentFrame = document.getElementById("frame").value.trim();
    const currentArcStep = parseFloat(document.getElementById("arcStep").value);
    const currentPolycarbonate = document.getElementById("polycarbonate").value.trim();
    const frameSelect = document.getElementById("frame");
    const polycarbonateSelect = document.getElementById("polycarbonate");
    
    const normalizedCurrentFrame = normalizeString(currentFrame);
    const normalizedCurrentPoly = normalizeString(currentPolycarbonate);
    
    // ========== ШАГ 1: Улучшаем шаг дуг до 0.65 (если не 0.65) ==========
    if (currentArcStep !== 0.65) {
        return {
            altFrame: currentFrame,
            altArcStep: 0.65,
            altPolycarbonate: currentPolycarbonate,
            reasonText: "усиленный шаг дуг 0.65 м"
        };
    }
    
    // ========== ШАГ 2: Улучшаем каркас (если уже 0.65) ==========
    // Проверяем, одинарный ли каркас (без "+")
    const isDoubleFrame = normalizedCurrentFrame.includes("+");
    
    if (!isDoubleFrame) {
        // ОДИНАРНЫЙ КАРКАС: 20×20 → 40×20
        if (normalizedCurrentFrame.includes("20х20") && !normalizedCurrentFrame.includes("40х20")) {
            // Ищем "40×20" (одинарный) в доступных опциях
            for (let i = 0; i < frameSelect.options.length; i++) {
                const optionValue = frameSelect.options[i].value.trim();
                const normalizedOption = normalizeString(optionValue);
                // Ищем одинарный 40×20 (без "+")
                if (normalizedOption.includes("40х20") && !normalizedOption.includes("+")) {
                    return {
                        altFrame: optionValue,
                        altArcStep: currentArcStep,
                        altPolycarbonate: currentPolycarbonate,
                        reasonText: "усиленный каркас 40×20"
                    };
                }
            }
        }
        // Если уже 40×20 (одинарный), НЕ предлагаем двойную дугу - переходим к поликарбонату
    } else {
        // ДВОЙНАЯ ДУГА: 20×20+20×20 → 40×20+20×20
        if (normalizedCurrentFrame.includes("20х20+20х20")) {
            // Ищем "40×20+20×20" в доступных опциях
            for (let i = 0; i < frameSelect.options.length; i++) {
                const optionValue = frameSelect.options[i].value.trim();
                const normalizedOption = normalizeString(optionValue);
                if (normalizedOption.includes("40х20+20х20")) {
                    return {
                        altFrame: optionValue,
                        altArcStep: currentArcStep,
                        altPolycarbonate: currentPolycarbonate,
                        reasonText: "усиленный каркас 40×20+20×20"
                    };
                }
            }
        }
        // Если уже 40×20+20×20, переходим к поликарбонату
    }
    
    // ========== ШАГ 3: Улучшаем поликарбонат (если каркас уже максимальный) ==========
    // Стандарт 4мм → Люкс 4мм (писать "усиленный")
    if (normalizedCurrentPoly.includes("стандарт") && normalizedCurrentPoly.includes("4")) {
        // Ищем "Люкс 4 мм" в доступных опциях
        for (let i = 0; i < polycarbonateSelect.options.length; i++) {
            const optionValue = polycarbonateSelect.options[i].value.trim();
            const normalizedOption = normalizeString(optionValue);
            if (normalizedOption.includes("люкс") && normalizedOption.includes("4")) {
                    return {
                        altFrame: currentFrame,
                        altArcStep: currentArcStep,
                        altPolycarbonate: optionValue,
                        reasonText: "усиленный поликарбонат"
                    };
            }
        }
    }
    
    // Люкс 4мм → Премиум 6мм (писать "Премиум усиленный")
    if (normalizedCurrentPoly.includes("люкс") && normalizedCurrentPoly.includes("4")) {
        // Ищем "Премиум 6 мм" в доступных опциях
        for (let i = 0; i < polycarbonateSelect.options.length; i++) {
            const optionValue = polycarbonateSelect.options[i].value.trim();
            const normalizedOption = normalizeString(optionValue);
            if (normalizedOption.includes("премиум") && normalizedOption.includes("6")) {
                    return {
                        altFrame: currentFrame,
                        altArcStep: currentArcStep,
                        altPolycarbonate: optionValue,
                        reasonText: "премиум поликарбонат усиленный"
                    };
            }
        }
    }
    
    // Если ничего не найдено - все уже максимально улучшено
    return null;
}

// Функция расчёта итоговой стоимости для альтернативного варианта
function computeFinalTotalPriceForVariant(overrideParams) {
    try {
        // Получаем актуальную стоимость доставки из параметров или глобальной переменной
        const deliveryPriceValue = overrideParams.deliveryPrice !== undefined ? overrideParams.deliveryPrice : deliveryCost;
        // Получаем текущие параметры из DOM
        const city = document.getElementById("city").value.trim();
        const form = document.getElementById("form").value.trim();
        const width = parseFloat(document.getElementById("width").value);
        const length = parseFloat(document.getElementById("length").value);
        
        // Применяем overrideParams
        const frame = overrideParams.frame || document.getElementById("frame").value.trim();
        const arcStep = overrideParams.arcStep !== undefined ? overrideParams.arcStep : parseFloat(document.getElementById("arcStep").value);
        const polycarbonate = overrideParams.polycarbonate || document.getElementById("polycarbonate").value.trim();
        
        // Получаем состояние чекбоксов и доп. товаров
        const bracingCheckbox = document.getElementById('bracing');
        const groundHooksCheckbox = document.getElementById('ground-hooks');
        const assemblyCheckbox = document.getElementById('assembly');
        const onWoodCheckbox = document.getElementById('on-wood');
        const onConcreteCheckbox = document.getElementById('on-concrete');
        
        const bracingChecked = bracingCheckbox ? bracingCheckbox.checked : false;
        const groundHooksChecked = groundHooksCheckbox ? groundHooksCheckbox.checked : false;
        const assemblyChecked = assemblyCheckbox ? assemblyCheckbox.checked : false;
        const onWoodChecked = onWoodCheckbox ? onWoodCheckbox.checked : false;
        const onConcreteChecked = onConcreteCheckbox ? onConcreteCheckbox.checked : false;
        
        // Получаем дополнительные товары
        const additionalProducts = [];
        const productSelects = document.querySelectorAll('.additional-products .product-item select');
        productSelects.forEach(select => {
            const quantity = parseInt(select.value, 10);
            if (quantity > 0) {
                const productPrice = parseFloat(select.getAttribute('data-price'));
                if (!isNaN(productPrice) && productPrice > 0) {
                    additionalProducts.push({ 
                        cost: productPrice * quantity
                    });
                }
            }
        });
        
        // Находим selectedEntry в currentCityData
        const selectedEntry = currentCityData.find(item => {
            return (
                getFormCategory(item.form_name) === form &&
                parseFloat(item.width) === width &&
                parseFloat(item.length) === length &&
                normalizeString(item.frame_description.replace(/двойная\s*/gi, "")).includes(normalizeString(frame)) &&
                normalizeString(item.polycarbonate_type) === normalizeString(polycarbonate)
            );
        });
        
        if (!selectedEntry) {
            return null; // Вариант не найден
        }
        
        // Расчёт basePrice (как в calculateGreenhouseCost)
        let basePrice = selectedEntry.price;
        
        // Надбавка за arcStep 0.65
        if (arcStep === 0.65) {
            const baseEntry = currentCityData.find(item => {
                return (
                    getFormCategory(item.form_name) === form &&
                    parseFloat(item.width) === width &&
                    parseFloat(item.length) === length &&
                    normalizeString(item.frame_description).includes(normalizeString(frame)) &&
                    (normalizeString(item.polycarbonate_type) === normalizeString("стандарт4мм") ||
                        normalizeString(item.polycarbonate_type) === normalizeString("стандарт 4мм"))
                );
            });
            
            if (baseEntry) {
                const basePriceStandard = baseEntry.price;
                const additionalCost = 0.25 * basePriceStandard;
                basePrice += additionalCost;
                basePrice = Math.ceil(basePrice / 10) * 10;
            }
        }
        
        // Расчёт сборки
        let assemblyCost = 0;
        if (assemblyChecked) {
            const assemblyCategory = getAssemblyCategory(form, width);
            if (assemblyCategory) {
                const assemblyCostCalculated = calculateAssemblyCost(form, assemblyCategory, length);
                if (assemblyCostCalculated > 0) {
                    assemblyCost = assemblyCostCalculated;
                }
            }
        }
        
        // Расчёт основания
        let foundationCost = 0;
        if (bracingChecked) {
            const bracingPrice = additionalServicesData["Брус"].price_by_length[length];
            if (bracingPrice) {
                foundationCost += bracingPrice;
            }
        }
        
        if (groundHooksChecked) {
            const quantityData = bracingChecked
                ? additionalServicesData["Штыри"].quantity_by_length["with_bracing"]
                : additionalServicesData["Штыри"].quantity_by_length["without_bracing"];
            const stakesQuantity = quantityData[length];
            if (stakesQuantity) {
                const stakesCost = stakesQuantity * additionalServicesData["Штыри"].price_per_unit;
                foundationCost += stakesCost;
            }
        }
        
        if (onWoodChecked) {
            const woodPrice = onWoodCheckbox ? parseFloat(onWoodCheckbox.getAttribute('data-price')) : 0;
            if (woodPrice) {
                foundationCost += woodPrice;
            }
        }
        
        if (onConcreteChecked) {
            const concretePrice = onConcreteCheckbox ? parseFloat(onConcreteCheckbox.getAttribute('data-price')) : 0;
            if (concretePrice) {
                foundationCost += concretePrice;
            }
        }
        
        // Расчёт дополнительных товаров
        let additionalProductsCost = 0;
        additionalProducts.forEach(product => {
            additionalProductsCost += product.cost;
        });
        
        // Расчёт грядок (если выбраны)
        const selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
        const bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';
        let bedsCost = 0;
        let bedsAssemblyCost = 0;
        
        if (Object.keys(selectedBeds).length > 0) {
            Object.keys(selectedBeds).forEach(bedId => {
                const bed = BEDS_DATA.find(b => b.id === bedId);
                if (bed && selectedBeds[bedId] > 0 && bed.price > 0) {
                    bedsCost += bed.price * selectedBeds[bedId];
                }
            });
            
            // Стоимость сборки грядок (считаем для каждой грядки отдельно по её длине)
            if (bedsAssemblyEnabled) {
                bedsAssemblyCost = calculateBedsAssemblyCost(selectedBeds);
            }
        }
        
        // Итоговая стоимость (включая грядки и доставку)
        let finalTotalPriceAlt = basePrice + assemblyCost + foundationCost + additionalProductsCost + bedsCost + bedsAssemblyCost + deliveryPriceValue;
        // Округление вверх до ближайшего десятка (после добавления доставки)
        finalTotalPriceAlt = Math.ceil(finalTotalPriceAlt / 10) * 10;
        
        return finalTotalPriceAlt;
    } catch (err) {
        console.error("Ошибка при расчёте альтернативного варианта:", err);
        return null;
    }
}

// Функция генерации короткого КП
async function generateShortOffer(finalTotalPrice1, selectedEntry) {
    const form = document.getElementById("form").value.trim();
    const width = document.getElementById("width").value.trim();
    const length = document.getElementById("length").value.trim();
    
    // Получаем адрес доставки и формируем заголовок
    const addressInput = document.getElementById("address");
    const deliveryAddress = addressInput ? addressInput.value.trim() : "";
    
    // Проверяем выбранные опции
    const assemblyCheckbox = document.getElementById('assembly');
    const bracingCheckbox = document.getElementById('bracing');
    const groundHooksCheckbox = document.getElementById('ground-hooks');
    
    const assemblyChecked = assemblyCheckbox ? assemblyCheckbox.checked : false;
    const bracingChecked = bracingCheckbox ? bracingCheckbox.checked : false;
    const groundHooksChecked = groundHooksCheckbox ? groundHooksCheckbox.checked : false;
    
    // Получаем информацию о грядках (для короткого КП - цена с учетом сборки)
    const selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
    const bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';
    let bedsTotalCost = 0;
    if (Object.keys(selectedBeds).length > 0) {
        Object.keys(selectedBeds).forEach(bedId => {
            const bed = BEDS_DATA.find(b => b.id === bedId);
            if (bed && selectedBeds[bedId] > 0 && bed.price > 0) {
                bedsTotalCost += bed.price * selectedBeds[bedId];
            }
        });
        // Добавляем стоимость сборки, если включена (считаем для каждой грядки отдельно по её длине)
        if (bedsAssemblyEnabled) {
            const bedsAssemblyCost = calculateBedsAssemblyCost(selectedBeds);
            bedsTotalCost += bedsAssemblyCost;
        }
    }
    
    // Функция склонения типа населенного пункта в родительный падеж
    function declineSettlementType(type) {
        if (!type) return type;
        
        const lowerType = type.toLowerCase().trim();
        
        // Словарь склонений типов населенных пунктов
        const typeDeclensions = {
            'посёлок': 'посёлка',
            'поселок': 'посёлка',
            'пгт': 'пгт',
            'посёлок городского типа': 'посёлка городского типа',
            'поселок городского типа': 'посёлка городского типа',
            'село': 'села',
            'деревня': 'деревни',
            'город': 'города',
            'городок': 'городка',
            'станица': 'станицы',
            'хутор': 'хутора',
            'аул': 'аула',
            'кишлак': 'кишлака',
            'снт': 'СНТ',
            'днт': 'ДНТ',
            'тсн': 'ТСН',
            'садоводство': 'садоводства',
            'дачный посёлок': 'дачного посёлка',
            'дачный поселок': 'дачного посёлка',
            'рабочий посёлок': 'рабочего посёлка',
            'рабочий поселок': 'рабочего посёлка',
            'курортный посёлок': 'курортного посёлка',
            'курортный поселок': 'курортного посёлка'
        };
        
        // Проверяем точное совпадение
        if (typeDeclensions[lowerType]) {
            // Сохраняем регистр первой буквы
            const firstChar = type[0];
            const declined = typeDeclensions[lowerType];
            return firstChar === firstChar.toUpperCase() 
                ? declined.charAt(0).toUpperCase() + declined.slice(1)
                : declined;
        }
        
        // Проверяем составные типы (например, "посёлок городского типа")
        for (const [key, value] of Object.entries(typeDeclensions)) {
            if (lowerType.includes(key) && key.length > 5) { // Для составных типов
                // Заменяем только тип, сохраняя остальное
                const regex = new RegExp(key, 'i');
                return type.replace(regex, value);
            }
        }
        
        // Если не найдено, возвращаем как есть
        return type;
    }
    
    // Функция склонения названия населенного пункта (без типа) в родительный падеж
    function declineCityName(cityName) {
        if (!cityName) return cityName;
        
        const city = cityName.trim();
        const lowerCity = city.toLowerCase();
        
        // Специальные случаи
        const specialCases = {
            'москва': 'Москвы',
            'санкт-петербург': 'Санкт-Петербурга',
            'питер': 'Санкт-Петербурга',
            'спб': 'Санкт-Петербурга',
            'казань': 'Казани',
            'нижний новгород': 'Нижнего Новгорода',
            'екатеринбург': 'Екатеринбурга',
            'новосибирск': 'Новосибирска',
            'краснодар': 'Краснодара',
            'воронеж': 'Воронежа',
            'челябинск': 'Челябинска',
            'уфа': 'Уфы',
            'ростов-на-дону': 'Ростова-на-Дону',
            'набережные челны': 'Набережных Челнов',
            'истра': 'Истры',
            'подольск': 'Подольска',
            'химки': 'Химок',
            'балашиха': 'Балашихи',
            'мытищи': 'Мытищ',
            'королёв': 'Королёва',
            'люберцы': 'Люберец',
            'красногорск': 'Красногорска',
            'электросталь': 'Электростали',
            'коломна': 'Коломны',
            'одинцово': 'Одинцово',
            'серпухов': 'Серпухова',
            'щелково': 'Щёлкова',
            'орехово-зуево': 'Орехово-Зуево',
            'дмитров': 'Дмитрова',
            'долгопрудный': 'Долгопрудного',
            'жуковский': 'Жуковского',
            'реутов': 'Реутова',
            'домодедово': 'Домодедова',
            'раменское': 'Раменского',
            'пушкино': 'Пушкино',
            'волоколамск': 'Волоколамска',
            'звенигород': 'Звенигорода',
            'клин': 'Клина',
            'солнечногорск': 'Солнечногорска',
            'тверь': 'Твери',
            'тула': 'Тулы',
            'калуга': 'Калуги',
            'брянск': 'Брянска',
            'смоленск': 'Смоленска',
            'рязань': 'Рязани',
            'ярославль': 'Ярославля',
            'кострома': 'Костромы',
            'иваново': 'Иваново',
            'владимир': 'Владимира',
            'вологда': 'Вологды',
            'белгород': 'Белгорода',
            'курск': 'Курска',
            'орёл': 'Орла',
            'липецк': 'Липецка',
            'тамбов': 'Тамбова',
            'пенза': 'Пензы',
            'саратов': 'Саратова',
            'самара': 'Самары',
            'ульяновск': 'Ульяновска',
            'чебоксары': 'Чебоксар',
            'йошкар-ола': 'Йошкар-Олы',
            'киров': 'Кирова',
            'пермь': 'Перми',
            'екатеринбург': 'Екатеринбурга',
            'тюмень': 'Тюмени',
            'омск': 'Омска',
            'барнаул': 'Барнаула',
            'кемерово': 'Кемерово',
            'новокузнецк': 'Новокузнецка',
            'красноярск': 'Красноярска',
            'иркутск': 'Иркутска',
            'хабаровск': 'Хабаровска',
            'владивосток': 'Владивостока',
            'ставрополь': 'Ставрополя',
            'майкоп': 'Майкопа',
            'черкесск': 'Черкесска',
            'великий новгород': 'Великого Новгорода',
            'вольгинский': 'Вольгинского',
            'мрясово': 'Мрясово',
            'малино': 'Малино'
        };
        
        // Проверяем специальные случаи
        if (specialCases[lowerCity]) {
            return specialCases[lowerCity];
        }
        
        // Общие правила склонения
        // Если заканчивается на -а (кроме -ка, -га, -ха, -ино, -ово, -ево), меняем на -ы
        if (city.endsWith('а') && !city.endsWith('ка') && !city.endsWith('га') && !city.endsWith('ха') && 
            !city.endsWith('ино') && !city.endsWith('ово') && !city.endsWith('ево')) {
            return city.slice(0, -1) + 'ы';
        }
        // Если заканчивается на -я, меняем на -и
        if (city.endsWith('я')) {
            return city.slice(0, -1) + 'и';
        }
        // Если заканчивается на -ь, меняем на -и
        if (city.endsWith('ь')) {
            return city.slice(0, -1) + 'и';
        }
        // Если заканчивается на -ск, -цк, -нк, добавляем -а
        if (city.endsWith('ск') || city.endsWith('цк') || city.endsWith('нк')) {
            return city + 'а';
        }
        // Если заканчивается на -ов, -ев, -ин, -ын, добавляем -а
        if (city.endsWith('ов') || city.endsWith('ев') || city.endsWith('ин') || city.endsWith('ын')) {
            return city + 'а';
        }
        // Если заканчивается на -град, меняем на -града
        if (city.endsWith('град')) {
            return city + 'а';
        }
        // Если заканчивается на -бург, меняем на -бурга
        if (city.endsWith('бург')) {
            return city + 'а';
        }
        // Если заканчивается на -ский, -цкий, меняем на -ского, -цкого
        if (city.endsWith('ский')) {
            return city.slice(0, -4) + 'ого';
        }
        if (city.endsWith('цкий')) {
            return city.slice(0, -4) + 'ого';
        }
        // Если заканчивается на -ино, -ово, -ево - обычно не склоняется, но может склоняться
        // Для большинства случаев оставляем как есть, но для некоторых склоняем
        if (city.endsWith('ино') || city.endsWith('ово') || city.endsWith('ево')) {
            // Большинство таких названий не склоняется, но есть исключения
            // Для простоты оставляем как есть
            return city;
        }
        
        // Если не подошло ни одно правило, возвращаем как есть
        return city;
    }
    
    // Улучшенная функция склонения населенного пункта с учетом типа
    function declineSettlementName(settlementName) {
        if (!settlementName) return settlementName;
        
        const name = settlementName.trim();
        const lowerName = name.toLowerCase();
        
        // Типы населенных пунктов для поиска
        const settlementTypes = [
            'посёлок городского типа',
            'поселок городского типа',
            'дачный посёлок',
            'дачный поселок',
            'рабочий посёлок',
            'рабочий поселок',
            'курортный посёлок',
            'курортный поселок',
            'посёлок',
            'поселок',
            'пгт',
            'село',
            'деревня',
            'город',
            'городок',
            'станица',
            'хутор',
            'аул',
            'кишлак',
            'снт',
            'днт',
            'тсн',
            'садоводство'
        ];
        
        // Ищем тип населенного пункта
        let foundType = null;
        let typeIndex = -1;
        let typeLength = 0;
        
        // Сначала ищем составные типы (длинные)
        for (const type of settlementTypes) {
            const index = lowerName.indexOf(type);
            if (index === 0 || (index > 0 && lowerName[index - 1] === ' ')) {
                if (type.length > typeLength) {
                    foundType = name.substring(index, index + type.length);
                    typeIndex = index;
                    typeLength = type.length;
                }
            }
        }
        
        // Если нашли тип
        if (foundType) {
            const declinedType = declineSettlementType(foundType);
            const namePart = name.substring(typeIndex + typeLength).trim();
            
            // Если есть название после типа
            if (namePart) {
                const declinedName = declineCityName(namePart);
                return `${declinedType} ${declinedName}`;
            } else {
                // Если только тип без названия
                return declinedType;
            }
        }
        
        // Если тип не найден, склоняем как обычное название города
        return declineCityName(name);
    }
    
    // Получаем значение поликарбоната
    const polycarbonateValue = document.getElementById("polycarbonate").value.trim();
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    const isWithoutPolycarbonate = polyNormalized === "безполикарбоната";
    
    // Формируем заголовок
    let title = `${form} теплица ${width}×${length}`;
    
    // Добавляем "без поликарбоната" если выбран вариант без поликарбоната
    if (isWithoutPolycarbonate) {
        title += ` без поликарбоната`;
    }
    
    // Добавляем информацию о доставке, если адрес указан
    if (deliveryAddress) {
        // Извлекаем последнюю часть адреса (последний элемент после запятой)
        // Например: "Республика Татарстан (Татарстан), Пестречинский район, Шигалеевское сельское поселение, СНТ Городок" -> "СНТ Городок"
        const addressParts = deliveryAddress.split(',').map(part => part.trim());
        const lastPart = addressParts[addressParts.length - 1];
        
        if (lastPart) {
            // Склоняем название населенного пункта в родительный падеж (с учетом типа)
            const declinedCity = declineSettlementName(lastPart);
            title += ` с доставкой до ${declinedCity}`;
        }
    }
    
    // Добавляем информацию о сборке и комплектации
    // Логика: если сборка выбрана - пишем "со сборкой на...", если нет - "с ... в комплекте"
    // Сборка недоступна для теплиц без поликарбоната
    
    if (assemblyChecked && !isWithoutPolycarbonate) {
        // Со сборкой - можно писать "на брусе", так как сборка подразумевает установку
        if (bracingChecked && groundHooksChecked) {
            title += " со сборкой на брус с грунтозацепами";
        } else if (bracingChecked) {
            title += " со сборкой на брусе";
        } else if (groundHooksChecked) {
            title += " со сборкой с грунтозацепами";
        } else {
            title += " со сборкой";
        }
    } else {
        // Без сборки - пишем "в комплекте", чтобы не вводить в заблуждение
        if (bracingChecked && groundHooksChecked) {
            title += " с брусом и грунтозацепами в комплекте";
        } else if (bracingChecked) {
            title += " с брусом в комплекте";
        } else if (groundHooksChecked) {
            title += " с грунтозацепами в комплекте";
        }
    }
    
    // СТРОКА 1: Заголовок с полной информацией
    let shortOffer = `${title}\n\n`;
    
    // ИТОГО_1 (стандарт)
    shortOffer += `1) Стандарт: ${formatPrice(finalTotalPrice1)} рублей\n`;
    
    // ИТОГО_2 (с запасом по нагрузке)
    const reserveVariant = pickReserveVariant();
    let finalTotalPrice2 = null;
    let reasonText = null;
    
    if (reserveVariant) {
        finalTotalPrice2 = computeFinalTotalPriceForVariant({
            frame: reserveVariant.altFrame,
            arcStep: reserveVariant.altArcStep,
            polycarbonate: reserveVariant.altPolycarbonate
        });
        reasonText = reserveVariant.reasonText;
        
        // Если не посчиталось, пробуем fallback с arcStep 0.65 (только если не был уже 0.65)
        if (finalTotalPrice2 === null && reserveVariant.altArcStep !== 0.65) {
            const currentArcStep = parseFloat(document.getElementById("arcStep").value);
            if (currentArcStep !== 0.65) {
                const fallbackVariant = {
                    altFrame: reserveVariant.altFrame || document.getElementById("frame").value.trim(),
                    altArcStep: 0.65,
                    altPolycarbonate: reserveVariant.altPolycarbonate || document.getElementById("polycarbonate").value.trim(),
                    reasonText: "усиленный шаг дуг 0.65 м"
                };
                finalTotalPrice2 = computeFinalTotalPriceForVariant({
                    frame: fallbackVariant.altFrame,
                    arcStep: fallbackVariant.altArcStep,
                    polycarbonate: fallbackVariant.altPolycarbonate
                });
                if (finalTotalPrice2 !== null) {
                    reasonText = fallbackVariant.reasonText;
                }
            }
        }
    }
    
    // Добавляем строку 2, если альтернатива посчиталась
    if (finalTotalPrice2 !== null && reasonText) {
        shortOffer += `2) С запасом по нагрузке: ${formatPrice(finalTotalPrice2)} рублей (${reasonText})\n`;
    }
    
    // Добавляем информацию о грядках, если они выбраны (в коротком КП - цена с учетом сборки)
    if (bedsTotalCost > 0) {
        const bedsCount = Object.values(selectedBeds).reduce((sum, qty) => sum + qty, 0);
        const assemblyText = bedsAssemblyEnabled ? ' (со сборкой)' : '';
        shortOffer += `\nДополнительно:\nГрядки: ${formatPrice(bedsTotalCost)} рублей${assemblyText}\n`;
    }
    
    // Условия оплаты - лаконично, без лишних эмодзи
    shortOffer += `\nБез предоплаты. Гарантия 15 лет. Бесплатная заморозка стоимости.\n`;
    
    // Подарки НЕ добавляются здесь - они добавляются через updateCommercialOffersWithGifts()
    // Это предотвращает дублирование подарков в КП
    
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
    const withAssembly = deliveryType === 'withAssembly';
    const dateText = getDeliveryDateTextForKP(withAssembly);
    shortOffer += `\nБлижайшая дата доставки — ${dateText || '17 февраля'}.`;
    
    // Записываем в textarea
    const shortOfferTextarea = document.getElementById("commercial-offer-short");
    if (shortOfferTextarea) {
        shortOfferTextarea.value = shortOffer;
        // Обновляем счетчик символов
        updateCharCounter('commercial-offer-short');
    }
}

// Функция переключения вкладок КП
function setOfferTab(tab) {
    
    if (tab !== 'short' && tab !== 'long') {
        console.error("Неверный параметр tab:", tab);
        return;
    }
    
    activeOfferTab = tab;
    
    // Обновляем визуальное состояние вкладок
    const tabs = document.querySelectorAll('.kp-tab');
    
    if (tabs.length < 2) {
        return;
    }
    
    // Убираем активный класс со всех вкладок
    tabs.forEach(t => {
        t.classList.remove('active');
        t.style.display = 'block'; // Принудительно показываем
    });
    
    // Скрываем все панели
    const panels = document.querySelectorAll('.kp-panel');
    panels.forEach(p => {
        if (p) {
            p.classList.add('hidden');
            p.style.display = 'none';
        }
    });
    
    if (tab === 'short') {
        const firstTab = tabs[0];
        const shortPanel = document.getElementById('kp-panel-short');
        if (firstTab) {
            firstTab.classList.add('active');
            firstTab.style.display = 'block';
        }
        if (shortPanel) {
            shortPanel.classList.remove('hidden');
            shortPanel.style.display = 'block';
        }
    } else {
        const lastTab = tabs[1];
        const longPanel = document.getElementById('kp-panel-long');
        if (lastTab) {
            lastTab.classList.add('active');
            lastTab.style.display = 'block';
        }
        if (longPanel) {
            longPanel.classList.remove('hidden');
            longPanel.style.display = 'block';
        }
    }
    
    // Обновляем счетчик символов для активной вкладки
    const activeTextareaId = tab === 'short' ? 'commercial-offer-short' : 'commercial-offer';
    updateCharCounter(activeTextareaId);
    
    // Обновляем видимость кнопок КП 1 и КП 2
    if (tab === 'long') {
        const offerText = document.getElementById('commercial-offer');
        if (offerText) {
            updateCharCounter('commercial-offer');
        }
    } else {
        // Для короткого КП показываем основную кнопку, скрываем КП 1 и КП 2
        const copyKP1Btn = document.getElementById('copy-kp1-btn');
        const copyKP2Btn = document.getElementById('copy-kp2-btn');
        const copyFullKPBtn = document.getElementById('copy-full-kp-btn');
        if (copyKP1Btn) copyKP1Btn.style.display = 'none';
        if (copyKP2Btn) copyKP2Btn.style.display = 'none';
        if (copyFullKPBtn) copyFullKPBtn.style.display = '';
    }
}

// Функция копирования КП (копирует активную вкладку)
/**
 * Обновляет счетчик символов для указанного textarea
 */
function updateCharCounter(textareaId) {
    const textarea = document.getElementById(textareaId);
    const counterId = textareaId === 'commercial-offer-short' ? 'char-counter-short' : 'char-counter-long';
    const counter = document.getElementById(counterId);
    
    if (!textarea || !counter) {
        return;
    }
    
    const text = textarea.value;
    const charCount = text.length;
    const AVITO_LIMIT = 800;
    
    // Обновляем текст счетчика
    counter.textContent = `Символов: ${charCount} / ${AVITO_LIMIT} (для Авито)`;
    
    // Добавляем/убираем класс для красной подсветки
    if (charCount > AVITO_LIMIT) {
        counter.classList.add('over-limit');
    } else {
        counter.classList.remove('over-limit');
    }
    
    // Показываем/скрываем визуальное предупреждение
    const warningId = textareaId === 'commercial-offer-short' ? 'avito-warning-short' : 'avito-warning-long';
    const warning = document.getElementById(warningId);
    if (warning) {
        if (charCount > AVITO_LIMIT) {
            warning.style.display = 'block';
            // Обновляем текст предупреждения с количеством частей
            const partsCount = Math.ceil(charCount / AVITO_LIMIT);
            const warningText = warning.querySelector('p');
            if (warningText) {
                // Проверяем, есть ли ВАРИАНТ 2
                const hasVariant2 = text.includes('==================================================') && 
                                   text.includes('ВАРИАНТ 2:');
                if (hasVariant2) {
                    warningText.textContent = `Лимит Авито: ${AVITO_LIMIT} символов. Если превысить лимит, сообщение не отправится и клиент его не увидит. Ваш текст (${charCount} символов) нужно разделить на ${partsCount} ${partsCount === 2 ? 'части' : partsCount === 3 ? 'части' : 'частей'}. Используйте кнопки "Скопировать КП 1" и "Скопировать КП 2" ниже.`;
                } else {
                    warningText.textContent = `Лимит Авито: ${AVITO_LIMIT} символов. Если превысить лимит, сообщение не отправится и клиент его не увидит. Ваш текст (${charCount} символов) нужно разделить на ${partsCount} ${partsCount === 2 ? 'части' : partsCount === 3 ? 'части' : 'частей'}.`;
                }
            }
        } else {
            warning.style.display = 'none';
        }
    }
    
    // Показываем/скрываем кнопки "Скопировать КП 1" и "Скопировать КП 2" только для длинного КП с ВАРИАНТОМ 2
    const copyKP1Btn = document.getElementById('copy-kp1-btn');
    const copyKP2Btn = document.getElementById('copy-kp2-btn');
    const copyFullKPBtn = document.getElementById('copy-full-kp-btn');
    
    if (textareaId === 'commercial-offer' && activeOfferTab === 'long') {
        // Проверяем, есть ли ВАРИАНТ 2 в тексте
        const hasVariant2 = text.includes('==================================================') && 
                           text.includes('ВАРИАНТ 2:');
        
        if (hasVariant2) {
            // Показываем кнопки КП 1 и КП 2, скрываем основную кнопку
            if (copyKP1Btn) copyKP1Btn.style.display = '';
            if (copyKP2Btn) copyKP2Btn.style.display = '';
            if (copyFullKPBtn) copyFullKPBtn.style.display = 'none';
        } else {
            // Если ВАРИАНТ 2 нет, показываем основную кнопку, скрываем КП 1 и КП 2
            if (copyKP1Btn) copyKP1Btn.style.display = 'none';
            if (copyKP2Btn) copyKP2Btn.style.display = 'none';
            if (copyFullKPBtn) copyFullKPBtn.style.display = '';
        }
    } else {
        // Для короткого КП или неактивной вкладки показываем основную кнопку, скрываем КП 1 и КП 2
        if (copyKP1Btn) copyKP1Btn.style.display = 'none';
        if (copyKP2Btn) copyKP2Btn.style.display = 'none';
        if (copyFullKPBtn) copyFullKPBtn.style.display = '';
    }
}

/**
 * Копирует КП 1 (первый вариант) из длинного КП
 */
function copyKP1() {
    const offerText = document.getElementById('commercial-offer');
    if (!offerText) {
        showError("Ошибка: текстовое поле не найдено!");
        return;
    }
    
    const fullText = offerText.value;
    if (!fullText || fullText === "Здесь будет ваше коммерческое предложение.") {
        showWarning("Сначала рассчитайте стоимость теплицы, чтобы сформировать коммерческое предложение.");
        return;
    }
    
    // Ищем разделитель ВАРИАНТ 2
    const variant2Index = fullText.indexOf('==================================================');
    if (variant2Index === -1) {
        // Если ВАРИАНТ 2 нет, копируем весь текст
        copyTextToClipboard(fullText, "КП скопировано!");
        return;
    }
    
    // Берем текст до ВАРИАНТ 2
    const kp1Text = fullText.substring(0, variant2Index).trim();
    
    if (kp1Text) {
        copyTextToClipboard(kp1Text, "КП 1 скопировано!");
    } else {
        showError("Не удалось выделить КП 1.");
    }
}

/**
 * Копирует КП 2 (второй вариант) из длинного КП
 */
function copyKP2() {
    const offerText = document.getElementById('commercial-offer');
    if (!offerText) {
        showError("Ошибка: текстовое поле не найдено!");
        return;
    }
    
    const fullText = offerText.value;
    if (!fullText || fullText === "Здесь будет ваше коммерческое предложение.") {
        showWarning("Сначала рассчитайте стоимость теплицы, чтобы сформировать коммерческое предложение.");
        return;
    }
    
    // Ищем разделитель ВАРИАНТ 2
    const variant2Index = fullText.indexOf('==================================================');
    if (variant2Index === -1) {
        showWarning("Второй вариант КП не найден. Используйте обычную кнопку 'Скопировать КП'.");
        return;
    }
    
    // Берем текст после разделителя
    const kp2Text = fullText.substring(variant2Index).trim();
    
    if (kp2Text) {
        copyTextToClipboard(kp2Text, "КП 2 скопировано!");
    } else {
        showError("Не удалось выделить КП 2.");
    }
}

/**
 * Вспомогательная функция для копирования текста в буфер обмена
 */
function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showSuccess(successMessage);
        }).catch(() => {
            // Fallback на старый метод
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showSuccess(successMessage);
            } catch (err) {
                showError("Не удалось скопировать. Попробуйте выделить текст вручную.");
            }
            document.body.removeChild(textarea);
        });
    } else {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showSuccess(successMessage);
        } catch (err) {
            showError("Не удалось скопировать. Попробуйте выделить текст вручную.");
        }
        document.body.removeChild(textarea);
    }
}

/**
 * Разделяет текст на части для Авито (максимум 800 символов на часть)
 * Копирует части по очереди при каждом нажатии
 * @deprecated Используйте copyKP1() и copyKP2() вместо этой функции
 */
function splitForAvito() {
    const textareaId = activeOfferTab === 'short' ? 'commercial-offer-short' : 'commercial-offer';
    const offerText = document.getElementById(textareaId);
    
    if (!offerText) {
        showError("Ошибка: текстовое поле не найдено!");
        return;
    }
    
    const text = offerText.value.trim();
    if (!text || 
        text === "Здесь будет ваше короткое КП." || 
        text === "Здесь будет ваше коммерческое предложение.") {
        showWarning("Сначала рассчитайте стоимость теплицы, чтобы сформировать коммерческое предложение.");
        return;
    }
    
    const AVITO_LIMIT = 800;
    
    if (text.length <= AVITO_LIMIT) {
        showInfo("Текст уже помещается в одно сообщение Авито (до 800 символов).");
        return;
    }
    
    // Проверяем, есть ли уже сохраненные части
    const storageKey = `avito-parts-${textareaId}`;
    const currentIndexKey = `avito-current-index-${textareaId}`;
    const originalTextKey = `avito-original-text-${textareaId}`;
    
    const savedOriginalText = sessionStorage.getItem(originalTextKey);
    const savedParts = sessionStorage.getItem(storageKey);
    
    // Если текст изменился или частей нет - разделяем заново
    let parts = null;
    let currentIndex = 0;
    
    if (savedOriginalText === text && savedParts) {
        // Текст не изменился, используем сохраненные части
        parts = JSON.parse(savedParts);
        currentIndex = parseInt(sessionStorage.getItem(currentIndexKey) || '0', 10);
    }
    
    // Если частей нет или текст изменился - разделяем заново
    if (!parts || parts.length === 0) {
        parts = [];
        let currentPart = '';
        
        // Разделяем по строкам (переносы строк - естественные точки разрыва)
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineWithNewline = i < lines.length - 1 ? line + '\n' : line;
            const testPart = currentPart + lineWithNewline;
            
            if (testPart.length <= AVITO_LIMIT) {
                currentPart = testPart;
            } else {
                // Если текущая часть не пустая, сохраняем её
                if (currentPart.trim()) {
                    parts.push(currentPart.trim());
                }
                
                // Если одна строка больше лимита, режем по словам
                if (line.length > AVITO_LIMIT) {
                    const words = line.split(/(\s+)/);
                    let wordPart = '';
                    for (const word of words) {
                        const testWordPart = wordPart + word;
                        if (testWordPart.length <= AVITO_LIMIT) {
                            wordPart = testWordPart;
                        } else {
                            if (wordPart.trim()) {
                                parts.push(wordPart.trim());
                            }
                            wordPart = word;
                        }
                    }
                    currentPart = wordPart + (i < lines.length - 1 ? '\n' : '');
                } else {
                    currentPart = lineWithNewline;
                }
            }
        }
        
        if (currentPart.trim()) {
            parts.push(currentPart.trim());
        }
        
        // Сохраняем части и оригинальный текст в sessionStorage
        sessionStorage.setItem(storageKey, JSON.stringify(parts));
        sessionStorage.setItem(originalTextKey, text);
        currentIndex = 0;
    }
    
    // Копируем текущую часть
    if (currentIndex < parts.length) {
        const partToCopy = parts[currentIndex];
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(partToCopy).then(() => {
                const totalParts = parts.length;
                const partNumber = currentIndex + 1;
                
                if (partNumber < totalParts) {
                    showSuccess(`📋 Часть ${partNumber} из ${totalParts} скопирована! Нажмите кнопку еще раз для части ${partNumber + 1}.`, null, 4000);
                } else {
                    showSuccess(`📋 Часть ${partNumber} из ${totalParts} скопирована! Все части скопированы.`, null, 4000);
                    // Очищаем сохраненные части после копирования всех
                    sessionStorage.removeItem(storageKey);
                    sessionStorage.removeItem(currentIndexKey);
                    sessionStorage.removeItem(originalTextKey);
                }
                
                // Увеличиваем индекс для следующего копирования
                currentIndex++;
                sessionStorage.setItem(currentIndexKey, currentIndex.toString());
            }).catch(() => {
                showError("Не удалось скопировать. Попробуйте еще раз.");
            });
        } else {
            // Fallback для старых браузеров
            offerText.value = partToCopy;
            offerText.select();
            showInfo(`Часть ${currentIndex + 1} из ${parts.length} выделена. Скопируйте вручную (Ctrl+C).`);
            currentIndex++;
            sessionStorage.setItem(currentIndexKey, currentIndex.toString());
        }
    } else {
        // Все части скопированы, начинаем заново
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(currentIndexKey);
        sessionStorage.removeItem(originalTextKey);
        showInfo("Все части скопированы. Нажмите кнопку еще раз для повторного разделения.");
    }
}

function copyCommercialOffer() {
    const textareaId = activeOfferTab === 'short' ? 'commercial-offer-short' : 'commercial-offer';
    const offerText = document.getElementById(textareaId);
    
    if (!offerText) {
        showError("Ошибка: текстовое поле не найдено!");
        return;
    }
    
    // Проверяем, что текст не пустой и не содержит placeholder
    const textValue = offerText.value.trim();
    if (!textValue || 
        textValue === "Здесь будет ваше короткое КП." || 
        textValue === "Здесь будет ваше коммерческое предложение.") {
        showWarning("Сначала рассчитайте стоимость теплицы, чтобы сформировать коммерческое предложение.");
        return;
    }
    
    const AVITO_LIMIT = 800;
    const charCount = textValue.length;
    
    // Проверяем лимит Авито и показываем предупреждение (один раз за сессию)
    if (charCount > AVITO_LIMIT) {
        const warningKey = `avito-warning-shown-${textareaId}`;
        if (!sessionStorage.getItem(warningKey)) {
            const partsCount = Math.ceil(charCount / AVITO_LIMIT);
            showWarning(
                `⚠️ ВНИМАНИЕ! Это длинное КП (${charCount} символов) не отправится в Авито!\n\n` +
                `Лимит Авито: ${AVITO_LIMIT} символов на сообщение.\n` +
                `Если превысить лимит, сообщение не отправится и клиент его не увидит.\n` +
                `Ваш текст нужно разделить на ${partsCount} ${partsCount === 2 ? 'части' : partsCount === 3 ? 'части' : 'частей'}.\n\n` +
                `Используйте кнопки "Скопировать КП 1" и "Скопировать КП 2" ниже.`,
                'Длинное КП не отправится в Авито!',
                6000
            );
            sessionStorage.setItem(warningKey, 'true');
        }
    }
    
    offerText.select();
    offerText.setSelectionRange(0, 99999); // Для мобильных устройств

    try {
        // Используем современный API, если доступен
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textValue).then(() => {
                showSuccess("Коммерческое предложение скопировано!");
            }).catch(() => {
                // Fallback на старый метод
    document.execCommand("copy");
                showSuccess("Коммерческое предложение скопировано!");
            });
        } else {
            // Fallback для старых браузеров
            document.execCommand("copy");
            showSuccess("Коммерческое предложение скопировано!");
        }
    } catch (err) {
        console.error("Ошибка при копировании:", err);
        showError("Не удалось скопировать. Попробуйте выделить текст вручную.");
    }
}

// Функция сброса всех фильтров
async function resetAllFilters() {
    // ВАЖНО: Сначала сбрасываем город, но сохраняем список городов
    resetDropdown('city', 'Выберите город');
    
    // Если список городов пустой, загружаем его заново
    const cityDropdown = document.getElementById('city');
    if (cityDropdown && (cityDropdown.options.length <= 1 || !citiesCache)) {
        await loadCities();
    } else if (cityDropdown && citiesCache && cityDropdown.options.length <= 1) {
        // Восстанавливаем список из кеша
        cityDropdown.innerHTML = '<option value="" disabled selected>Выберите город</option>';
        citiesCache.forEach(city => {
            cityDropdown.innerHTML += `<option value="${city}">${city}</option>`;
        });
    }
    
    // Сбрасываем остальные выпадающие списки
    resetDropdown('form', 'Сначала выберите город');
    resetDropdown('width', 'Сначала выберите форму');
    resetDropdown('length', 'Сначала выберите ширину');
    resetDropdown('frame', 'Сначала выберите длину');
    resetDropdown('arcStep', 'Выберите шаг');
    resetDropdown('polycarbonate', 'Сначала выберите город');

    // Сбрасываем все дополнительные опции (чекбоксы и select'ы)
    resetAdditionalOptions();
    
    // Сбрасываем грядки
    selectedBeds = {};
    localStorage.setItem('selectedBeds', JSON.stringify(selectedBeds));
    
    // Сбрасываем сборку грядок
    bedsAssemblyEnabled = false;
    localStorage.setItem('bedsAssemblyEnabled', 'false');
    const bedsAssemblyCheckbox = document.getElementById('beds-assembly-checkbox');
    if (bedsAssemblyCheckbox) {
        bedsAssemblyCheckbox.checked = false;
    }
    updateBedsCounter();

    // Сбрасываем доставку
    const addressInput = document.getElementById("address");
    if (addressInput) {
        addressInput.value = "";
    }
    
    // Сбрасываем радиокнопки доставки (без сборки)
    const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
    if (deliveryTypeRadios.length > 0) {
        deliveryTypeRadios[0].checked = true; // Первая радиокнопка (без сборки)
    }
    
    // Очищаем результат доставки
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerText = "";
    }

    // Очищаем карту
    if (mapInstance && currentRoute) {
        mapInstance.geoObjects.remove(currentRoute);
        currentRoute = null;
    }

    // Сброс глобальной переменной стоимости доставки
    deliveryCost = 0;
    currentDeliveryDate = null;
    currentDeliveryAssemblyDate = null;
    currentDeliveryRestrictions = null;
    updateDeliveryDateDisplay();

    // Сбрасываем текст КП и результатов
    const shortOfferTextarea = document.getElementById("commercial-offer-short");
    const longOfferTextarea = document.getElementById("commercial-offer");
    
    if (shortOfferTextarea) {
        shortOfferTextarea.value = "Здесь будет ваше короткое КП.";
    }
    if (longOfferTextarea) {
        longOfferTextarea.value = "Здесь будет ваше коммерческое предложение.";
    }
    
    // Возвращаем активной вкладку "Короткое КП"
    setOfferTab('short');
    
    // Очищаем подсказки адреса
    const suggestionsDiv = document.getElementById("suggestions");
    if (suggestionsDiv) {
        suggestionsDiv.innerHTML = "";
    }
}

// Функция сброса доставки
function resetDelivery() {
    document.getElementById("address").value = "";
    document.getElementById("result").innerText = "";

    // Удаляем маршрут с карты, если есть
    if (mapInstance && currentRoute) {
        mapInstance.geoObjects.remove(currentRoute);
    }

    // Сброс глобальной переменной стоимости доставки
    deliveryCost = 0;
    // Не сбрасываем currentDeliveryDate, т.к. она привязана к выбранному городу
}

// Инициализация при загрузке страницы
window.onload = async function () {
    if (localStorage.getItem('appVersion') !== APP_VERSION) {
        localStorage.clear();
    }
    
    // Загружаем данные грядок из Supabase
    await loadBedsFromSupabase();
    
    const savedLogin = localStorage.getItem('savedLogin');
    
    if (savedLogin) {
        // Убеждаемся, что admin флаг установлен, если это admin (ДО проверки пароля)
        if (savedLogin === 'admin' || savedLogin.toLowerCase() === 'admin') {
            localStorage.setItem(ADMIN_KEY, 'true');
        }
        
        // Проверяем актуальность версии пароля
        const isPasswordValid = await checkPasswordVersion();
        if (isPasswordValid) {
            document.getElementById("login").value = savedLogin;
            document.getElementById("password").focus();
            document.getElementById("auth-container").classList.add("hidden");
            document.getElementById("calculator-container").classList.remove("hidden");
            
            await initializeCalculator();
        } else {
            // Версия пароля не совпадает - разлогиниваем
            localStorage.clear();
            document.getElementById("login").value = savedLogin;
        }
    } else {
    }
    
    // Проверка версии пароля при возврате во вкладку (мгновенный выкид при смене пароля)
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            const savedLogin = localStorage.getItem('savedLogin');
            if (savedLogin && document.getElementById("calculator-container") && !document.getElementById("calculator-container").classList.contains("hidden")) {
                await checkPasswordVersion();
            }
        }
    });

    // Периодическая проверка версии пароля каждые 30 секунд
    setInterval(async () => {
        const savedLogin = localStorage.getItem('savedLogin');
        if (savedLogin && document.getElementById("calculator-container") && !document.getElementById("calculator-container").classList.contains("hidden")) {
            await checkPasswordVersion();
        }
    }, 30000);
    
    // Принудительная проверка кнопки админа через 1 секунду (на случай задержки)
    setTimeout(() => {
        const savedLogin = localStorage.getItem('savedLogin');
        const adminBtn = document.getElementById('admin-button');
        if (!adminBtn) return;
        const isAdmin = savedLogin && savedLogin.trim().toLowerCase() === 'admin';
        if (isAdmin) {
            adminBtn.classList.remove('hidden');
            adminBtn.style.display = 'block';
            adminBtn.style.visibility = 'visible';
        } else {
            adminBtn.classList.add('hidden');
            adminBtn.style.display = 'none';
            adminBtn.style.visibility = 'hidden';
        }
    }, 1000);
}

// Функция загрузки городов при инициализации калькулятора
async function initializeCalculator() {
    await loadCities();
    // addAdditionalProductsEventListeners() - не нужна, т.к. в HTML уже есть onchange
    
    // Убираем дублирование - в HTML уже есть onchange для polycarbonate и arcStep
    // document.getElementById("polycarbonate").addEventListener("change", calculateGreenhouseCost);
    // document.getElementById("arcStep").addEventListener("change", calculateGreenhouseCost);
    
    // Устанавливаем активной вкладку "Короткое КП" по умолчанию
    setOfferTab('short');
    
    // Проверяем права админа и показываем/скрываем кнопку админ-панели
    const savedLogin = localStorage.getItem('savedLogin');
    
    // СТРОГАЯ проверка: только пользователь с логином точно "admin" (без пробелов, без регистра)
    const isAdmin = savedLogin && savedLogin.trim().toLowerCase() === 'admin';
    
    // Если это админ, но флаг не установлен - устанавливаем
    if (isAdmin && localStorage.getItem(ADMIN_KEY) !== 'true') {
        localStorage.setItem(ADMIN_KEY, 'true');
    }
    
    // Если это НЕ админ, обязательно удаляем флаг
    if (!isAdmin) {
        localStorage.removeItem(ADMIN_KEY);
    }
    
    // Даём немного времени на рендеринг DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const adminButton = document.getElementById("admin-button");
    const logoutButton = document.querySelector(".logout");
    const topButtonsContainer = document.querySelector(".top-buttons-container");
    
    // Убеждаемся, что контейнер и кнопка "Выйти" всегда видимы
    if (topButtonsContainer) {
        topButtonsContainer.style.display = "flex";
        topButtonsContainer.style.visibility = "visible";
        topButtonsContainer.style.opacity = "1";
    }
    if (logoutButton) {
        logoutButton.style.display = "block";
        logoutButton.style.visibility = "visible";
        logoutButton.style.opacity = "1";
    }
    
    if (adminButton) {
        if (isAdmin) {
            adminButton.classList.remove("hidden");
            adminButton.style.display = "block";
            adminButton.style.visibility = "visible";
            adminButton.style.opacity = "1";
            await loadUsersForAdmin(); // Загружаем список пользователей для админ-панели
        } else {
            adminButton.classList.add("hidden");
            adminButton.style.display = "none";
            adminButton.style.visibility = "hidden";
        }
    }
    
    // Инициализация счетчиков символов для КП
    initCharCounters();
}

/**
 * Инициализирует счетчики символов для textarea КП
 */
function initCharCounters() {
    const shortTextarea = document.getElementById('commercial-offer-short');
    const longTextarea = document.getElementById('commercial-offer');
    
    // Инициализируем счетчики для обоих textarea
    if (shortTextarea) {
        updateCharCounter('commercial-offer-short');
        // Добавляем обработчик для обновления счетчика при изменении текста
        shortTextarea.addEventListener('input', () => {
            updateCharCounter('commercial-offer-short');
        });
    }
    
    if (longTextarea) {
        updateCharCounter('commercial-offer');
        // Добавляем обработчик для обновления счетчика при изменении текста
        longTextarea.addEventListener('input', () => {
            updateCharCounter('commercial-offer');
        });
    }
}

// Функция добавления обработчиков событий для дополнительных опций
// ЗАМЕЧАНИЕ: Эта функция больше не используется, т.к. все обработчики уже есть в HTML через onchange
// Оставлена для совместимости, но не вызывается
function addAdditionalProductsEventListeners() {
    // Все обработчики уже в HTML через onchange="calculateGreenhouseCost()"
    // Дублирование убрано для оптимизации
}

// Код Яндекс.Карт для подсказок (с debounce для защиты от массовых запросов)
ymaps.ready(() => {
    const input = document.getElementById('address'); // Поле ввода адреса
    const resultsContainer = document.getElementById('suggestions'); // Используем существующий блок
    let geocodeDebounceTimer = null; // Таймер для debounce подсказок

    input.addEventListener('input', () => {
        const query = input.value.trim();

        // Очищаем предыдущий таймер
        if (geocodeDebounceTimer) {
            clearTimeout(geocodeDebounceTimer);
        }

        // Если запрос слишком короткий, скрываем подсказки
        if (query.length <= 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }

        // Устанавливаем новый таймер (300мс задержка для подсказок)
        geocodeDebounceTimer = setTimeout(() => {
            ymaps.geocode(query, { results: 5 }).then(res => {
                const items = res.geoObjects.toArray();
                resultsContainer.innerHTML = ''; // Очищаем старые подсказки

                if (items.length === 0) {
                    resultsContainer.style.display = 'none'; // Скрываем контейнер, если нет результатов
                    return;
                } else {
                    resultsContainer.style.display = 'block'; // Показываем контейнер
                }

                items.forEach(item => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion');

                    // Выделяем совпадения жирным
                    const regex = new RegExp(`(${query})`, 'gi');
                    const address = item.getAddressLine();
                    const highlightedAddress = address.replace(regex, '<span class="highlight">$1</span>');
                    suggestion.innerHTML = highlightedAddress;

                    suggestion.addEventListener('click', () => {
                        input.value = address;
                        resultsContainer.innerHTML = ''; // Убираем подсказки
                        resultsContainer.style.display = 'none'; // Скрываем контейнер
                        // Используем debounced версию для защиты от массовых запросов
                        calculateDeliveryDebounced(); // Автоматически рассчитываем доставку при выборе адреса
                    });

                    resultsContainer.appendChild(suggestion);
                });
            }).catch(err => {
                // Ошибка при запросе подсказок - просто скрываем контейнер
                console.error('Ошибка при получении геокодинга:', err);
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
            });
        }, 300); // 300мс задержка для подсказок
    });

    // Закрытие подсказок при клике вне области
    document.addEventListener('click', (event) => {
        if (!document.querySelector('.address-container').contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});

// ==================== АДМИН-ПАНЕЛЬ ====================

// Загрузка списка пользователей для админ-панели
async function loadUsersForAdmin() {
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('id, login, is_active')
            .order('login');

        if (error) {
            console.error("Ошибка при загрузке пользователей:", error);
            return;
        }

        const userSelect = document.getElementById('admin-user-select');
        if (!userSelect) return;

        userSelect.innerHTML = '<option value="" disabled selected>Выберите пользователя</option>';
        
        if (data && data.length > 0) {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.login}${!user.is_active ? ' (неактивен)' : ''}`;
                userSelect.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
    }
}

// Переключение видимости админ-панели
function toggleAdminPanel() {
    const adminPanel = document.getElementById("admin-panel");
    if (!adminPanel) return;

    const isHidden = adminPanel.classList.contains("hidden");
    const adminButton = document.getElementById("admin-button");
    const logoutButton = document.querySelector(".logout");
    const topButtonsContainer = document.querySelector(".top-buttons-container");
    
    // Убеждаемся, что контейнер и кнопка "Выйти" всегда видимы
    if (topButtonsContainer) {
        topButtonsContainer.style.display = "flex";
        topButtonsContainer.style.visibility = "visible";
        topButtonsContainer.style.opacity = "1";
    }
    if (logoutButton) {
        logoutButton.style.display = "block";
        logoutButton.style.visibility = "visible";
        logoutButton.style.opacity = "1";
    }
    
    if (isHidden) {
        // Проверяем права админа: только логин "admin"
        const savedLogin = localStorage.getItem('savedLogin');
        const isAdmin = savedLogin && savedLogin.trim().toLowerCase() === 'admin';
        if (!isAdmin) {
            showError("У вас нет прав доступа к админ-панели.");
            return;
        }
        adminPanel.classList.remove("hidden");
        loadUsersForAdmin();
        // Очищаем поля при открытии
        document.getElementById("admin-new-password").value = "";
        document.getElementById("admin-confirm-password").value = "";
        document.getElementById("admin-message").innerText = "";
    } else {
        adminPanel.classList.add("hidden");
    }
}

// Изменение пароля пользователя
async function changeUserPassword() {
    const userId = document.getElementById("admin-user-select").value;
    const newPassword = document.getElementById("admin-new-password").value.trim();
    const confirmPassword = document.getElementById("admin-confirm-password").value.trim();
    const messageDiv = document.getElementById("admin-message");

    // Валидация
    if (!userId) {
        messageDiv.innerText = "Выберите пользователя!";
        messageDiv.style.color = "red";
        return;
    }

    if (!newPassword) {
        messageDiv.innerText = "Введите новый пароль!";
        messageDiv.style.color = "red";
        return;
    }

    if (newPassword.length < 6) {
        messageDiv.innerText = "Пароль должен содержать минимум 6 символов!";
        messageDiv.style.color = "red";
        return;
    }

    if (newPassword !== confirmPassword) {
        messageDiv.innerText = "Пароли не совпадают!";
        messageDiv.style.color = "red";
        return;
    }

    // Проверяем права админа: только логин "admin"
    const savedLoginAdmin = localStorage.getItem('savedLogin');
    const isAdminUser = savedLoginAdmin && savedLoginAdmin.trim().toLowerCase() === 'admin';
    if (!isAdminUser) {
        messageDiv.innerText = "У вас нет прав для изменения паролей!";
        messageDiv.style.color = "red";
        return;
    }

    try {
        // Получаем логин пользователя
        const userSelect = document.getElementById("admin-user-select");
        const userLogin = userSelect.selectedOptions[0].textContent.split(' (')[0]; // Убираем "(неактивен)" если есть
        
        // Пробуем вызвать RPC функцию
        const { data: rpcData, error: rpcError } = await supabaseClient.rpc('update_user_password', {
            p_login: userLogin,
            p_new_password: newPassword
        });

        if (rpcError) {
            // Если RPC не работает, пытаемся обновить напрямую (может не работать из-за RLS политик)
            // Получаем текущую версию пароля
            const { data: currentUser, error: fetchError } = await supabaseClient
                .from('users')
                .select('password_version')
                .eq('id', userId)
                .single();

            if (fetchError) {
                throw new Error(`Не удалось получить данные пользователя: ${fetchError.message}`);
            }

            // Пробуем обновить напрямую
            const { error: updateError } = await supabaseClient
                .from('users')
                .update({
                    password: newPassword,
                    password_version: (currentUser.password_version || 1) + 1,
                    last_password_change: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateError) {
                // Если обновление не работает через anon роль (что вероятно из-за RLS)
                // Показываем инструкцию для использования SQL Editor
                const sqlQuery = `UPDATE users 
SET password = '${newPassword}', 
    password_version = password_version + 1, 
    last_password_change = NOW(),
    updated_at = NOW()
WHERE id = ${userId};`;
                
                messageDiv.innerHTML = `
                    <strong style="color: orange;">⚠️ Не удалось изменить пароль через интерфейс.</strong><br><br>
                    <strong>Используйте SQL Editor в Supabase:</strong><br>
                    <textarea style="width: 100%; height: 80px; margin-top: 10px; font-family: monospace;" readonly>${sqlQuery}</textarea>
                    <p style="margin-top: 10px;">Скопируйте SQL запрос выше и выполните его в SQL Editor вашего Supabase проекта.</p>
                    <p><strong>Или</strong> обновите политику RLS для таблицы users, разрешив админам обновлять пароли.</p>
                `;
                messageDiv.style.color = "orange";
                console.error("Ошибка обновления пароля:", updateError);
                return;
            }
        }

        // Если всё успешно
        messageDiv.innerText = `✅ Пароль успешно изменён! Пользователь "${userLogin}" будет разлогинен при возврате во вкладку или в течение 30 секунд.`;
        messageDiv.style.color = "green";

        // Очищаем поля
        document.getElementById("admin-new-password").value = "";
        document.getElementById("admin-confirm-password").value = "";
        document.getElementById("admin-user-select").value = "";

        // Перезагружаем список пользователей
        await loadUsersForAdmin();

    } catch (err) {
        console.error("Ошибка при изменении пароля:", err);
        messageDiv.innerText = `❌ Ошибка: ${err.message}`;
        messageDiv.style.color = "red";
    }
}

// ==================== МОДАЛЬНОЕ ОКНО С ДАТАМИ ДОСТАВКИ ====================

// Функция открытия модального окна с датами доставки
async function showDeliveryDatesModal() {
    
    const modal = document.getElementById('delivery-dates-modal');
    const loadingDiv = document.getElementById('delivery-dates-loading');
    const contentDiv = document.getElementById('delivery-dates-content');
    
    if (!modal) {
        console.error("❌ Модальное окно не найдено!");
        alert("Ошибка: модальное окно не найдено. Обновите страницу.");
        return;
    }
    
    try {
        // Убираем класс hidden и принудительно показываем модальное окно
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Показываем загрузку
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
            loadingDiv.innerHTML = 'Загрузка данных...';
        }
        
        // Скрываем контент
        if (contentDiv) {
            contentDiv.style.display = 'none';
        }
        
        // Загружаем все даты доставки (принудительно обновляем при каждом открытии)
        // Всегда загружаем свежие данные из базы
        await loadAllDeliveryDates(true);
        
        // Скрываем загрузку и показываем контент
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        if (contentDiv) {
            contentDiv.style.display = 'block';
        }
    } catch (err) {
        console.error("❌ Ошибка при открытии модального окна:", err);
        if (loadingDiv) {
            loadingDiv.innerHTML = '<div class="no-data" style="color: red; padding: 20px;">Ошибка загрузки данных. Проверьте подключение к интернету.<br><br>' + err.message + '</div>';
        }
    }
}

// Функция обновления дат доставки
async function refreshDeliveryDates() {
    const loadingDiv = document.getElementById('delivery-dates-loading');
    const contentDiv = document.getElementById('delivery-dates-content');
    const container = document.getElementById('delivery-dates-table-container');
    
    if (loadingDiv) {
        loadingDiv.style.display = 'block';
        loadingDiv.innerHTML = '🔄 Обновление данных...';
    }
    
    if (contentDiv) {
        contentDiv.style.display = 'none';
    }
    
    try {
        // Принудительно обновляем данные
        await loadAllDeliveryDates(true);
        
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        if (contentDiv) {
            contentDiv.style.display = 'block';
        }
        
        showSuccess('Данные успешно обновлены', 'Обновление завершено');
    } catch (err) {
        console.error("❌ Ошибка при обновлении данных:", err);
        if (loadingDiv) {
            loadingDiv.innerHTML = '<div class="no-data" style="color: red; padding: 20px;">Ошибка обновления данных.<br><br>' + err.message + '</div>';
        }
        showError('Не удалось обновить данные', 'Ошибка обновления');
    }
}

// Убеждаемся, что функция доступна глобально
window.showDeliveryDatesModal = showDeliveryDatesModal;
window.closeDeliveryDatesModal = closeDeliveryDatesModal;
window.refreshDeliveryDates = refreshDeliveryDates;
window.updateDeliveryResultDate = updateDeliveryResultDate;

// Функция закрытия модального окна
function closeDeliveryDatesModal() {
    const modal = document.getElementById('delivery-dates-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

// Функция загрузки всех дат доставки из Supabase
async function loadAllDeliveryDates(forceRefresh = false) {
    const container = document.getElementById('delivery-dates-table-container');
    if (!container) {
        console.error("Контейнер для таблицы не найден!");
        return;
    }

    try {
        // Принудительно обновляем данные
        // Загружаем поля включая restrictions для отображения ограничений
        // Если колонка restrictions не существует, загружаем без неё
        // Supabase всегда возвращает актуальные данные из базы при каждом запросе
        if (DEBUG) console.log('🔄 Загрузка дат доставки из Supabase (forceRefresh:', forceRefresh, ')');
        
        let query = supabaseClient
            .from('delivery_dates')
            .select('city_name, delivery_date, assembly_date, restrictions')
            .order('city_name');
        
        // Выполняем запрос - Supabase всегда возвращает актуальные данные из базы
        let { data, error } = await query;
        
        if (DEBUG) console.log('📊 Получено записей:', data ? data.length : 0, 'Ошибка:', error);
        
        if (error && error.code === '42703') {
            console.warn('⚠️ Колонка assembly_date или restrictions не найдена. Выполните миграцию: db/migrations/20260213_add_assembly_date_to_delivery_dates.sql');
            const { data: fallbackData, error: fallbackError } = await supabaseClient
                .from('delivery_dates')
                .select('city_name, delivery_date')
                .order('city_name');
            if (!fallbackError && fallbackData) {
                data = fallbackData.map(item => ({ ...item, assembly_date: null, restrictions: null }));
                error = null;
            }
        }

        // Добавляем пустое поле restrictions для совместимости с кодом отрисовки
        let dataWithRestrictions = null;
        if (data && !error) {
            // Нормализуем названия городов и убираем дубликаты
            const normalizedMap = new Map();
            
            // Маппинг для стандартизации названий (приводим к правильному регистру)
            const standardCityNames = {
                'санкт-петербург': 'Санкт-Петербург',
                'москва': 'Москва',
                'нижний новгород': 'Нижний Новгород',
                'набережные челны': 'Набережные Челны',
                'великий новгород': 'Великий Новгород',
                'йошкар-ола': 'Йошкар-Ола',
                'орёл': 'Орёл'
            };
            
            // Фильтруем дубликаты "Город доставки" — показываем только каноническую запись
            const canonicalData = data.filter(item => !/ доставки$/i.test(item.city_name));
            
            canonicalData.forEach(item => {
                const cleanedCity = cleanDeliveryCityName(item.city_name);
                const normalizedKey = normalizeCityName(cleanedCity);
                
                const standardName = standardCityNames[normalizedKey] || 
                                    (cleanedCity.charAt(0).toUpperCase() + cleanedCity.slice(1).toLowerCase());
                
                let restrictionsValue = null;
                if (item.restrictions !== null && item.restrictions !== undefined) {
                    const trimmed = String(item.restrictions).trim();
                    if (trimmed !== '') restrictionsValue = trimmed;
                }
                
                normalizedMap.set(normalizedKey, {
                    ...item,
                    city_name: standardName,
                    restrictions: restrictionsValue,
                    assembly_date: (item.assembly_date && String(item.assembly_date).trim()) || null
                });
            });
            
            dataWithRestrictions = Array.from(normalizedMap.values());
            
            // Сортируем: Москва первая, Санкт-Петербург второй, остальные по алфавиту
            dataWithRestrictions.sort((a, b) => {
                const cityA = (a.city_name || '').toLowerCase().trim();
                const cityB = (b.city_name || '').toLowerCase().trim();
                
                // Москва всегда первая
                if (cityA === 'москва') return -1;
                if (cityB === 'москва') return 1;
                
                // Санкт-Петербург всегда второй
                if (cityA === 'санкт-петербург') return -1;
                if (cityB === 'санкт-петербург') return 1;
                
                // Остальные по алфавиту
                return cityA.localeCompare(cityB, 'ru');
            });
        }

        if (error) {
            console.error("❌ Ошибка при загрузке дат доставки:", error);
            console.error("Детали ошибки:", JSON.stringify(error, null, 2));
            container.innerHTML = 
                '<div class="no-data" style="color: red; padding: 20px;">Ошибка загрузки данных из базы. Проверьте подключение к Supabase.<br><br>Детали: ' + (error.message || 'Неизвестная ошибка') + '<br>Код ошибки: ' + (error.code || 'N/A') + '</div>';
            return;
        }

        if (!dataWithRestrictions || dataWithRestrictions.length === 0) {
            console.warn("⚠️ Данные о датах доставки отсутствуют или пусты. Загружено записей:", data ? data.length : 0);
            container.innerHTML = 
                '<div class="no-data">Данные о датах доставки отсутствуют в базе данных.</div>';
            return;
        }
        
        console.log("✅ Успешно загружено дат доставки:", dataWithRestrictions.length);

        // Формируем таблицу
        renderDeliveryDatesTable(dataWithRestrictions);
        
        // Добавляем обработчик поиска
        setupDeliveryDatesSearch(dataWithRestrictions);
        
    } catch (err) {
        console.error("Ошибка при загрузке дат доставки:", err);
        if (container) {
            container.innerHTML = 
                '<div class="no-data" style="color: red; padding: 20px;">Критическая ошибка: ' + (err.message || 'Неизвестная ошибка') + '</div>';
        }
    }
}

// Функция отрисовки таблицы с датами доставки
function renderDeliveryDatesTable(data) {
    const container = document.getElementById('delivery-dates-table-container');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="no-data">Нет данных для отображения.</div>';
        return;
    }

    const currentYear = new Date().getFullYear();
    let html = '<table class="delivery-dates-table">';
    html += '<thead><tr>';
    html += '<th style="width: 35%;">Город</th>';
    html += '<th style="width: 35%;">Даты</th>';
    html += '<th style="width: 30%;">Ограничения</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    const fmtDate = (dm) => {
        if (!dm) return '';
        const s = String(dm).trim();
        if (/\d{4}$/.test(s)) return s;
        return `${s}.${currentYear}`;
    };
    
    data.forEach(item => {
        let datesText = 'Не указано';
        if (item.delivery_date) {
            const d = String(item.delivery_date).trim();
            const a = (item.assembly_date && String(item.assembly_date).trim()) || d;
            const hasDifferentAssembly = a && d && a !== d;
            if (hasDifferentAssembly) {
                datesText = `доставки с ${fmtDate(d)}, сборки с ${fmtDate(a)}`;
            } else {
                datesText = fmtDate(d);
            }
        }
        
        let restrictionsText = '';
        if (item.restrictions && item.restrictions.trim()) {
            const restrictions = item.restrictions
                .replace(/[()]+/g, '')
                .split(',')
                .map(r => r.trim().replace(/[()]/g, '')).filter(r => r);
            if (restrictions.length > 0) {
                restrictionsText = `кроме ${restrictions.join(', ')}`;
            }
        }
        
        html += '<tr>';
        html += `<td class="city-name">${item.city_name}</td>`;
        html += `<td class="delivery-date">${datesText}</td>`;
        html += `<td class="delivery-restrictions">${restrictionsText || '—'}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Функция настройки поиска по городам
function setupDeliveryDatesSearch(allData) {
    const searchInput = document.getElementById('delivery-dates-search');
    if (!searchInput) return;
    
    // Очищаем предыдущий обработчик
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);
    
    newSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        if (!searchTerm) {
            renderDeliveryDatesTable(allData);
            return;
        }
        
        const filtered = allData.filter(item => {
            const cityName = normalizeCityName(item.city_name);
            const searchNormalized = normalizeCityName(searchTerm);
            return cityName.includes(searchNormalized) || searchNormalized.includes(cityName);
        });
        
        renderDeliveryDatesTable(filtered);
    });
}

// Убеждаемся, что функции доступны глобально для onclick
window.showDeliveryDatesModal = showDeliveryDatesModal;
window.closeDeliveryDatesModal = closeDeliveryDatesModal;
window.setOfferTab = setOfferTab;

// Закрытие модального окна при клике вне его (инициализация при загрузке)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeliveryDatesModal);
} else {
    initDeliveryDatesModal();
}

function initDeliveryDatesModal() {
    document.addEventListener('click', (event) => {
        const modal = document.getElementById('delivery-dates-modal');
        if (modal && !modal.classList.contains('hidden')) {
            const modalContent = modal.querySelector('.delivery-dates-modal-content');
            if (modalContent && !modalContent.contains(event.target) && event.target === modal) {
                closeDeliveryDatesModal();
            }
        }
    });

    // Закрытие модального окна по клавише Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDeliveryDatesModal();
            closeFAQModal();
            closeBedsModal();
        }
    });
}

// Инициализация модального окна грядок
function initBedsModal() {
    // Закрытие модального окна при клике на фон (не на содержимое)
    document.addEventListener('click', (event) => {
        const modal = document.getElementById('beds-modal');
        if (modal && !modal.classList.contains('hidden')) {
            // Проверяем, что клик был именно на фон модального окна, а не на его содержимое
            if (event.target === modal) {
                closeBedsModal();
            }
        }
    });
    
    // Инициализация счетчика грядок при загрузке
    updateBedsCounter();
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Сбрасываем выбор грядок при загрузке страницы
        selectedBeds = {};
        bedsAssemblyEnabled = false;
        localStorage.removeItem('selectedBeds');
        localStorage.removeItem('bedsAssemblyEnabled');
        
        initBedsModal();
    });
} else {
    // Сбрасываем выбор грядок при загрузке страницы
    selectedBeds = {};
    bedsAssemblyEnabled = false;
    localStorage.removeItem('selectedBeds');
    localStorage.removeItem('bedsAssemblyEnabled');
    
    initBedsModal();
}

// Инициализация FAQ модального окна
function initFAQModal() {
    // Закрытие модального окна при клике вне его
    document.addEventListener('click', (event) => {
        const modal = document.getElementById('faq-modal');
        if (modal && !modal.classList.contains('hidden')) {
            const modalContent = modal.querySelector('.faq-modal-content');
            if (modalContent && !modalContent.contains(event.target) && event.target === modal) {
                closeFAQModal();
            }
        }
    });
}

// Инициализируем FAQ модальное окно при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQModal);
} else {
    initFAQModal();
}

// Инициализация модального окна с информацией о подарках
function initGiftsInfoModal() {
    const modal = document.getElementById('gifts-info-modal');
    if (!modal) return;
    
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeGiftsInfoModal();
        }
    });
}

// Инициализируем модальное окно с информацией о подарках при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGiftsInfoModal);
} else {
    initGiftsInfoModal();
}

// ==================== FAQ (Часто задаваемые вопросы) ====================
// ВАЖНО: FAQ для внутренних нужд (не отправлять клиентам!)

// Данные FAQ с категориями (из Telegram постов и внутренних документов)
const faqData = {
    categories: [
        {
            id: "top",
            name: "🔥 ТОП-ВОПРОСЫ",
            icon: "🔥"
        },
        {
            id: "work",
            name: "Работа с клиентами",
            icon: "💬"
        },
        {
            id: "materials",
            name: "Товары и материалы",
            icon: "🏗️"
        },
        {
            id: "delivery",
            name: "Доставка и сборка",
            icon: "🚚"
        },
        {
            id: "payment",
            name: "Оплата и подарки",
            icon: "💳"
        },
        {
            id: "process",
            name: "Процессы и CRM",
            icon: "📋"
        }
    ],
    items: [
        // ==================== ТОП-ВОПРОСЫ (приоритет 1 - всегда наверху) ====================
        {
            category: "top",
            question: "Как работать с возражением \"Дорого\"?",
            answer: "Алгоритм работы с возражением \"Дорого\":\n\n1. Спокойно принять, не спорить\n2. Уточнить, с чем сравнивает и какие характеристики важны\n3. Если вариант \"дешевле\" — подсветить типичные места экономии:\n   - Тонкий металл (0.6 мм вместо 1 мм)\n   - Слабый каркас (20×20 вместо 40×20)\n   - ПК без УФ-защиты\n4. Показать ценность и последствия \"экономии\"\n5. Дать выбор вариантов, без давления\n\nПримеры фраз:\n- \"Давайте разберёмся, с чем сравниваете? Если у кого-то дешевле, важно смотреть, что внутри.\"\n- \"У нас оцинкованный каркас, качественный поликарбонат, гарантия 15 лет. Часто более дешёвые варианты экономят на этих деталях.\"\n- \"Если поделить стоимость на 10 лет гарантии — это всего по 2000 рублей в год.\""
        },
        {
            category: "top",
            question: "Как правильно заполнить таблицу заказов?",
            answer: "Правила заполнения таблицы заказов:\n\n✅ Номер телефона\n- ВСЕ номера клиента должны совпадать с номером в AMO CRM\n- Если номер отличается, заказ не учтётся при расчёте зарплаты!\n- ВАЖНО: всегда используем номера в формате 79999999999 (без +7, без 8 и дополнительных знаков)\n\n✅ Город доставки\n- Это склад, откуда везём теплицу (обычно указан в калькуляторе в скобках)\n\n✅ Комментарии\n- Особые условия адреса (куда заезжать, препятствия)\n- Если теплица без поликарбоната — \"каркас\"\n- Если теплица на брусе, но не закрепляется — \"сборка на брус клиента, закрепит сам\"\n- Если поликарбонат не стандартный — обязательно \"4 мм люкс\" или \"6 мм премиум\" и прочие важные детали по заказу\n\n✅ Адрес\n- Записываем максимально подробно: область, район, населённый пункт, улица, дом - удобно скопировать из калькулятора\n- Если нет номера дома — узнаём координаты!\n- Если водитель не дозвонится и приедет не туда, он просто уедет\n\n✅ Товар\n- Полное название теплицы, Ширина, длина, каркас (по таблице должно быть понятно, что за теплица)\n- Шаг дуги (0.65 м или 1 м)\n- Сечение каркаса\n\n✅ Дополнительно\n- ВСЕ допы пишем: брус, штыри, оцинкованная лента, форточки и т.д.\n- Подарок — если не укажете, подарок не привезут!\n\n✅ Сборка\n- Указываем ВСЕ работы: сборка теплицы, закрепление к брусу, сборка грядок\n\n✅ Итоговая сумма\n- Проверяем, чтобы сумма билась с теми позициями, что в таблице\n\n✅ Статус заказа\n- Если стоит \"Перенос\", значит склад подтвердил заказ\n- Если клиент вносит изменения — сначала правим в таблице, потом ставим задачу в CRM\n\nВАЖНО:\n- Сначала оформляем заказ в таблице, а потом в CRM!\n- Если заказ неверный — логисты не смогут его отгрузить"
        },
        {
            category: "top",
            question: "Система касаний (5 касаний)",
            answer: "Система 5 касаний для работы с отложенными клиентами:\n\n1 КАСАНИЕ — на следующий день после общения (либо ближайший рабочий)\nТип задачи: \"1 касание\"\nШаблон: \"1 касание\"\nТекст: \"Здравствуйте! Как вам расчет?\n\nПредлагаю сейчас зафиксировать эту стоимость до весны без предоплаты. Если передумаете — просто отменим бронь, это бесплатно.\n\nОформляем?\"\n\n2 КАСАНИЕ — через 2-3 дня после 1-го\nТип задачи: \"2 касание\"\nШаблон: \"2 касание\"\nТекст: \"Напоминаю: чем ближе весна, тем выше цены. Предлагаю зафиксировать зимнюю стоимость сейчас.\nПредоплата не нужна. Если передумаете — просто отмените бронь, это бесплатно и без штрафов.\n\nОформляем?\"\n\n3 КАСАНИЕ — через 7 дней после 2-го\nТип задачи: \"3 касание\"\nШаблон: \"3 касание\"\nТекст: \"Коротко о ситуации: к сезону металл всегда дорожает. Я могу бесплатно заморозить для вас текущую цену.\nРисков нет: вы ничем не обязаны, а оплата только по факту доставки весной.\n\nСтавим в работу?\"\n\n4 КАСАНИЕ — через 30 дней после 3-го\nТип задачи: \"4 касание\"\nШаблон: \"4 касание\"\nТекст: \"Добрый день! Сейчас формируем маршрут доставки в ваш район. Если вопрос с теплицей актуален — лучше занять место в машине заранее, чтобы привезли в удобный день.\n\nВас иметь в виду?\"\n\n5 КАСАНИЕ — в апреле (весенний)\nТип задачи: \"5 касание\"\nШаблон: \"5 касание\"\nТекст: \"Здравствуйте! Весенний сезон стартовал — теплицы уже активно бронируют. Работаем без выходных, без предоплаты.\n\nПодскажите, для вас актуально на какие размеры смотреть — 3×4, 3×6 или 3×8?\"\n\nВАЖНО:\n- Сделки не закрываем просто так — только сопровождаем\n- Каждое касание = шанс на продажу\n- В примечаниях обязательно оставляем комментарии"
        },
        {
            category: "top",
            question: "Как работать с возражением \"Я подумаю\"?",
            answer: "Алгоритм:\n1. Не отпускать в никуда\n2. Предложить зафиксировать цену бесплатно\n3. Объяснить выгоду бронирования\n4. Поставить задачу на напоминание\n\nПримеры фраз:\n- \"Конечно, думать важно! Но чтобы не потерять цену, давайте оформим бронь — это бесплатно и без предоплаты.\"\n- \"Цена фиксируется только при бронировании — если отложить покупку, она может измениться.\"\n- \"Могу зафиксировать цену на пару дней, пока вы думаете.\""
        },
        {
            category: "top",
            question: "Какую теплицу посоветовать клиенту?",
            answer: "🎯 Быстрый выбор теплицы по потребностям клиента:\n\n❄️ СНЕЖНЫЕ РЕГИОНЫ / СУРОВЫЙ КЛИМАТ:\n→ Каплевидная (Стрелка) — максимальная защита от снега, снег не скапливается\n→ Теплица домиком (Дворцовая) — максимальная прочность, для сильных снегопадов\n\n💰 БЮДЖЕТНЫЙ ВАРИАНТ / УМЕРЕННЫЙ КЛИМАТ:\n→ Арочная (Боярская) — доступная цена, простая сборка, снег скатывается\n\n🌱 ВЫСОКИЕ РАСТЕНИЯ / СТЕЛЛАЖИ / КРУГЛОГОДИЧНОЕ ИСПОЛЬЗОВАНИЕ:\n→ Прямостенная (Царская) — максимум полезного пространства, удобно ставить стеллажи\n→ Теплица домиком (Дворцовая) — высокий потолок, эстетичный вид\n\n🏠 МАЛЕНЬКИЙ УЧАСТОК / ОГРАНИЧЕННОЕ ПРОСТРАНСТВО:\n→ Пристенная — экономия места, держит тепло за счет стены\n\n🌞 ЖАРКИЕ РЕГИОНЫ / ПРОФЕССИОНАЛЬНОЕ ВЫРАЩИВАНИЕ:\n→ Теплица по Митлайдеру — естественная вентиляция, нет перегрева, максимум света\n\n📋 АЛГОРИТМ ВЫБОРА:\n1. Уточните регион и климатические условия\n2. Спросите о целях использования (высокие растения, стеллажи, круглогодично?)\n3. Уточните размер участка и бюджет\n4. Предложите 1-2 варианта с обоснованием\n\n💡 ВАЖНО: Всегда объясняйте, почему именно этот тип подходит клиенту!"
        },
        {
            category: "top",
            question: "Как работать с претензиями?",
            answer: "Алгоритм работы с претензиями:\n\n1. Сохраняем спокойствие\n- Не спорим\n- Клиенты часто раздражены, им нужно выговориться\n- Мы — не враги, мы помогаем\n\n2. Узнаём, что не устроило\n- Что именно не понравилось?\n- Что произошло?\n- Попросите прислать фото или видео\n\n3. Отправляем на почту\nЕсли речь про:\n- качество сборки\n- якобы не тот полик\n- не хватает комплектующих\n- \"мне просто не нравится\"\n\n→ Оформляем претензию через шаблон \"претензия\"\n\nПочта: info@teplitsa-rus.ru\nТребования:\n- Фото\n- Номер телефона\n- Описание проблемы (в одном сообщении)\n\n4. Если клиент взрывается\n- Собираем всю информацию\n- Передаём Павлу в телеграмм (только если ситуация реально выходит из-под контроля)\n\n5. Напоминаем клиенту\n- Мы работаем без предоплаты\n- Клиенты обязаны всё проверять до оплаты\n- Если есть недочёты, говорят об этом сразу — это ускоряет решение\n\nВАЖНО:\n- Никогда не игнорим претензии\n- Даже если не знаем ответа — пишем: \"Информацию приняли, ищем решение, вернусь с обратной связью\""
        },
        {
            category: "top",
            question: "Какие контакты использовать для работы?",
            answer: "📞 Прямая линия (для звонков): +7 (495) 085-59-90\n\n💬 Telegram / MAX (только сообщения!): +7 (993) 957-57-90\n\n⚠️ ВАЖНО:\n• Если клиент пытается позвонить на номер Telegram / MAX, в AmoCRM появляется уведомление вида «Клиент +7 (906)… пытался дозвониться на Telegram / MAX». Нужно перезвонить ему через софтфон на обычный номер.\n• Личные номера в работе не используем!\n\n📌 Трудности с Telegram и MAX:\n\nПри работе через Telegram и MAX возникают следующие ограничения:\n• Запреты на первичное обращение к новым клиентам\n• Блокировки аккаунтов\n• Ограничения на поиск контактов по номеру телефона\n\n💡 Решение:\n\nПоэтому при оформлении заказов просим клиентов добавить нас в контакты, и только после этого отправляем заказ в мессенджер.\n\n📋 Алгоритм работы:\n\n1. Для запроса в контакты используем шаблон \"Запрос в контакты\"\n\n2. Текст шаблона для клиента:\n\"Чтобы мы не потерялись и сообщения точно доходили: добавьте наш номер +7 993 957-57-90 в контакты.\n\nПосле добавления мы вышлем вам информацию по заказу — куда удобнее: в Telegram или MAX?\n\nНапишите 'Добавил(а)' и выбранный мессенджер — и сразу отправим.\"\n\n3. После того как клиент добавил контакт и написал \"Добавил(а)\" — отправляем заказ в выбранный мессенджер\n\n⚠️ ВАЖНО для менеджеров:\n\nСоблюдение этого алгоритма критически важно. При регулярном использовании данной схемы аккаунт постепенно \"разогревается\" системой мессенджера, что снижает риск блокировок и ограничений в будущем. Не пренебрегайте этим шагом при работе с каждым клиентом."
        },
        
        // Материалы
        {
            category: "materials",
            question: "Грунтозацепы vs. Брус - в чем разница?",
            answer: "Грунтозацепы:\n• Металлические штыри, вбиваемые в землю для фиксации теплицы.\n• Защищают конструкцию от сноса ветром.\n• Бюджетное и практичное решение, особенно для ветреных регионов.\n\nБрус (деревянное основание):\n• Поднимает теплицу примерно на 10 см → лучшее сохранение тепла и защита от грызунов.\n• Равномерно распределяет нагрузку от снега.\n• Придает дополнительную стабильность конструкции.\n\n✅ Оптимально сочетать брус + грунтозацепы для максимальной надежности.",
            images: ["image/4.png", "image/16.png"]
        },
        {
            category: "materials",
            question: "Какие виды поликарбоната используются?",
            answer: "Используем только прозрачный поликарбонат с защитой UV-400.\n\n1️⃣ Стандарт (4 мм) - Плотность: 0.47 кг/м², Гарантия: 10 лет\n2️⃣ Люкс (4 мм) - Плотность: 0.52 кг/м², Гарантия: 15 лет - двойная защита от ультрафиолета\n3️⃣ Премиум (6 мм) - Плотность: 0.8 кг/м², Гарантия: 15 лет"
        },
        {
            category: "materials",
            question: "Количество листов поликарбоната для теплиц",
            answer: "📐 Размер листа: 2.1 × 6 м\n\nВ таблице указано количество листов поликарбоната для различных моделей теплиц. Данные сгруппированы по типу теплицы, длине и ширине конструкции. Если требуется дополнительное оформление (отдельные листы нужной длины), они также указаны.\n\n1. БОЯРСКАЯ (Арочная)\nРазмеры (ширина): 2,5 м, 3 м, 3,5 м, 4 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 2,5 м – 3 листа; 3 м – 3 листа; 3,5 м – 3 листа; 4 м – 4 листа + 1 лист 3 м + 1 лист 4 м\n• 6 м: 2,5 м – 4 листа; 3 м – 4 листа; 3,5 м – 4 листа; 4 м – 6 листов + 1 лист 3 м\n• 8 м: 2,5 м – 5 листов; 3 м – 5 листов; 3,5 м – 5 листов; 4 м – 7 листов + 1 лист 3 м + 1 лист 2 м\n• 10 м: 2,5 м – 6 листов; 3 м – 6 листов; 3,5 м – 6 листов; 4 м – 8 листов + 1 лист 3 м + 1 лист 4 м\n• 12 м: 2,5 м – 7 листов; 3 м – 7 листов; 3,5 м – 7 листов; 4 м – 10 листов + 1 лист 3 м\n\n2. ЦАРСКАЯ (Прямостенная)\nРазмеры (ширина): 2,5 м, 3 м, 3,5 м, 4 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 2,5 м – 3 листа; 3 м – 3 листа + 2 листа по 2 м; 3,5 м – 4 листа + 1 лист 2 м; 4 м – 5 листов + 1 лист 3 м + 1 лист 2 м\n• 6 м: 2,5 м – 4 листа; 3 м – 5 листов; 3,5 м – 5 листов + 2 листа по 2 м; 4 м – 7 листов + 1 лист 3 м\n• 8 м: 2,5 м – 5 листов; 3 м – 6 листов + 1 лист 2 м; 3,5 м – 7 листов; 4 м – 8 листов + 1 лист 3 м + 1 лист 4 м\n• 10 м: 2,5 м – 6 листов; 3 м – 7 листов + 2 листа по 2 м; 3,5 м – 8 листов + 1 лист 2 м; 4 м – 10 листов + 1 лист 3 м + 1 лист 2 м\n• 12 м: 2,5 м – 7 листов; 3 м – 9 листов; 3,5 м – 9 листов + 2 листа по 2 м; 4 м – 12 листов + 1 лист 3 м\n\n3. СТРЕЛКА (Каплевидная)\nРазмеры (ширина): 2,5 м, 3 м, 3,5 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 2,5 м – 3 листа; 3 м – 3 листа; 3,5 м – 4 листа\n• 6 м: 2,5 м – 4 листа; 3 м – 4 листа; 3,5 м – 5 листов + 1 лист 2 м\n• 8 м: 2,5 м – 5 листов; 3 м – 5 листов; 3,5 м – 6 листов + 1 лист 4 м\n• 10 м: 2,5 м – 6 листов; 3 м – 6 листов; 3,5 м – 8 листов\n• 12 м: 2,5 м – 7 листов; 3 м – 7 листов; 3,5 м – 9 листов + 1 лист 2 м\n\n4. ДОМИК\nРазмеры (ширина): 2,5 м, 3 м, 3,5 м, 4 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 2,5 м – 3 листа; 3 м – 3 листа + 1 лист 4 м; 3,5 м – 4 листа + 1 лист 3 м; 4 м – 2 рулона по 6 м + 1 лист 3 м + 2 рулона по 10 м\n• 6 м: 2,5 м – 4 листа; 3 м – 5 листов; 3,5 м – 5 листов + 1 лист 3 м + 1 лист 2 м; 4 м – 2 рулона по 6 м + 1 лист 3 м + 3 рулона по 10 м\n• 8 м: 2,5 м – 5 листов; 3 м – 6 листов + 1 лист 2 м; 3,5 м – 6 листов + 1 лист 4 м + 1 лист 3 м; 4 м – 2 рулона по 6 м + 1 лист 3 м + 4 рулона по 10 м\n• 10 м: 2,5 м – 6 листов; 3 м – 7 листов + 1 лист 4 м; 3,5 м – 8 листов + 1 лист 3 м; 4 м – 2 рулона по 6 м + 1 лист 3 м + 5 рулонов по 10 м\n• 12 м: 2,5 м – 7 листов; 3 м – 9 листов; 3,5 м – 9 листов + 1 лист 3 м + 1 лист 2 м; 4 м – 2 рулона по 6 м + 1 лист 3 м + 6 рулонов по 10 м\n\n5. МИТЛАЙДЕР АРОЧНЫЙ\nРазмеры (ширина): 3 м, 3,5 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 3 м – 3 листа + 1 лист 3 м; 3,5 м – 4 листа\n• 6 м: 3 м – 4 листа + 1 лист 3 м; 3,5 м – 4 листа + 1 лист 4 м + 1 лист 3 м\n• 8 м: 3 м – 6 листов; 3,5 м – 5 листов + 2 листа по 4 м\n• 10 м: 3 м – 6 листов + 1 лист 3 м + 1 лист 4 м; 3,5 м – 5 листов + 3 листа по 4 м + 1 лист 3 м\n• 12 м: 3 м – 6 листов + 3 листа по 4 м; 3,5 м – 6 листов + 4 листа по 4 м\n\n6. МИТЛАЙДЕР ПРЯМОСТЕННЫЙ\nРазмеры (ширина): 3 м, 3,5 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 3 м – 3 листа + 1 лист 4 м; 3,5 м – 4 листа + 1 лист 2 м\n• 6 м: 3 м – 5 листов; 3,5 м – 5 листов + 1 лист 4 м\n• 8 м: 3 м – 6 листов + 1 лист 2 м; 3,5 м – 7 листов\n• 10 м: 3 м – 7 листов + 1 лист 4 м; 3,5 м – 8 листов + 1 лист 2 м\n• 12 м: 3 м – 9 листов; 3,5 м – 9 листов + 1 лист 4 м\n\n7. ПРИСТЕННАЯ\nРазмеры (ширина): 2,5 м, 3 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 2,5 м – 3 листа; 3 м – 3 листа + 1 лист 4 м\n• 6 м: 2,5 м – 4 листа; 3 м – 5 листов\n• 8 м: 2,5 м – 5 листов; 3 м – 6 листов + 1 лист 2 м\n• 10 м: 2,5 м – 6 листов; 3 м – 7 листов + 1 лист 4 м\n• 12 м: 2,5 м – 7 листов; 3 м – 9 листов\n\n8. ПРЕМЬЕР\nРазмеры (ширина): 5 м, 6 м\nДлина: 4 м, 6 м, 8 м, 10 м, 12 м\n• 4 м: 5 м – 6 листов + 1 лист 2 м; 6 м – 6 листов + 1 лист 4 м\n• 6 м: 5 м – 8 листов; 6 м – 8 листов + 1 лист 3 м\n• 8 м: 5 м – 9 листов + 1 лист 4 м; 6 м – 10 листов + 1 лист 2 м\n• 10 м: 5 м – 11 листов + 1 лист 2 м; 6 м – 11 листов + 1 лист 4 м + 1 лист 3 м\n• 12 м: 5 м – 13 листов; 6 м – 14 листов"
        },
        {
            category: "materials",
            question: "Что такое краб-система?",
            answer: "Краб-система — специальные соединители («крабы») для каркаса, крепятся на 4 болтах.\n\nПреимущества:\n• Повышают прочность и устойчивость теплицы к снеговым и ветровым нагрузкам.\n• Равномерно распределяют нагрузку, предотвращают деформации.",
            images: ["image/15.jpg"]
        },
        {
            category: "materials",
            question: "Какие характеристики металла каркаса?",
            answer: "🔩 Сталь горячего цинкования, покрытие 80 мкм (соответствует ГОСТ 9.307-89).\n\nОбеспечивает:\n• Высокую коррозионную стойкость\n• Долгий срок службы"
        },
        {
            category: "materials",
            question: "Где производство?",
            answer: "🏭 Производственные площадки и склады в крупных городах:\nМосква, СПб, Воронеж, Казань, Нижний Новгород, Краснодар, Ярославль, Екатеринбург, Новосибирск.\n\nДоступ туда только у сотрудников, чтобы соблюдать контроль качества. Рабочая схема — через интернет-магазин."
        },
        {
            category: "materials",
            question: "Арочная теплица (Боярская)",
            answer: "📐 Размеры: 2.5м, 3м, 3.5м, 4м (ширина)\n📏 Высота: 2.1м (стандарт), 2.8м (для 4м)\n🔩 Каркас: 20×20, 40×20, двойной\n\n✅ Плюсы:\n• Простая сборка\n• Доступная цена\n• Снег скатывается с дугообразной крыши\n\n❌ Минусы:\n• Меньше полезного пространства по краям\n• Возможны заломы поликарбоната при сильных нагрузках\n\n🎯 Когда выбирать:\nРегионы с умеренными зимами, где снеговая нагрузка не критична",
            images: ["image/7.jpg"]
        },
        {
            category: "materials",
            question: "Каплевидная теплица (Стрелка)",
            answer: "📐 Размеры: 2.5м, 3м, 3.5м\n📏 Высота: 2.4м (стандарт), 2.8м (для 3.5м)\n🔩 Каркас: только 40×20 мм (усиленный)\n\n✅ Плюсы:\n• Снег не скапливается благодаря каплевидной форме\n• Максимальная защита от снега\n• Подходит для сурового климата\n\n❌ Минусы:\n• Дороже арочной\n• Сложнее сборка\n\n🎯 Когда выбирать:\nСнежные регионы, где зимой никого нет и теплица должна выдерживать большие снеговые нагрузки",
            images: ["image/8.jpg"]
        },
        {
            category: "materials",
            question: "Прямостенная теплица (Царская)",
            answer: "📐 Размеры: 2.5м, 3м, 3.5м, 4м\n📏 Высота: 2.1-2.8м\n🔩 Каркас: 40×20 или 40×20+20×20\n\n✅ Плюсы:\n• Максимум полезного пространства\n• Удобно ставить стеллажи\n• Равномерное распределение тепла\n\n❌ Минусы:\n• Снег задерживается на крыше\n• Выше стоимость\n\n🎯 Когда выбирать:\nДля высоких растений, стеллажей, круглогодичного использования",
            images: ["image/9.jpg"]
        },
        {
            category: "materials",
            question: "Теплица домиком (Дворцовая)",
            answer: "📐 Размеры: 2.5м, 3м, 3.5м, 4м\n📏 Высота: 2.2-2.8м (зависит от ширины)\n🔩 Каркас: 40×20 или 40×20+20×20\n\n✅ Плюсы:\n• Максимальная прочность\n• Эстетичный вид\n• Высокий потолок\n\n❌ Минусы:\n• Дороже остальных\n• Сложнее сборка\n\n🎯 Когда выбирать:\nРегионы с сильными снегопадами, круглогодичное использование",
            images: ["image/10.jpg"]
        },
        {
            category: "materials",
            question: "Пристенная теплица",
            answer: "📐 Размеры: 2.5м, 3м\n📏 Высота: 2.5м\n🏗️ Особенности: опирается на здание/забор\n\n✅ Плюсы:\n• Экономия места\n• Держит тепло за счет стены\n\n❌ Минусы:\n• Подходит не для всех участков\n\n🎯 Когда выбирать:\nНебольшие участки, ограниченное пространство, когда нужно максимально эффективно использовать площадь",
            images: ["image/11.jpg"]
        },
        {
            category: "materials",
            question: "Теплица по Митлайдеру",
            answer: "📐 Размеры: 3м, 3.5м\n📏 Высота: 2.4м\n🌬️ Особенности: естественная вентиляция, нет перегрева\n\n✅ Плюсы:\n• Идеально для жарких регионов\n• Максимум света\n• Естественная вентиляция предотвращает перегрев\n\n❌ Минусы:\n• Сложная сборка\n• Дороже арочных\n\n🎯 Когда выбирать:\nЖаркие регионы, профессиональное выращивание, когда важна вентиляция",
            images: ["image/12.jpg"]
        },
        {
            category: "materials",
            question: "Что такое \"усиленная теплица\"?",
            answer: "ВАЖНО: Нет единого определения \"усиленной теплицы\" — у каждого клиента своё понимание.\n\nКто-то считает усиленной:\n- Любую теплицу с трубой 40×20 мм\n- Вариант с шагом дуг 0.65 м\n- Только каркас с двойной дугой 20×20+20×20 или 40×20+20×20\n- а кто-то все вместе\n\nЧто делать, если клиент запрашивает \"усиленную теплицу\"?\n\n1. Не предлагать вариант \"наугад\" — сперва уточнить, что именно клиент имеет в виду:\n   - Вам важно, чтобы был усиленный каркас (например, двойная труба)?\n   - Нужно усиление за счёт частого шага дуг — 0.65 м?\n   - Рассматриваете вариант на трубе 40×20 мм или хотите ещё прочнее?\n\n2. После уточнения сделать расчёт с учётом того, что именно клиент считает усилением\n\n3. Если клиент сам не знает — ориентируем по нагрузке и условиям:\n   - Стандартное усиление: 40×20 мм, шаг 1 м, краб-система\n   - Усиленная конструкция: шаг 0.65 м или двойная дуга\n   - Максимально усиленная: 40×20+20×20, двойная дуга + шаг 0.65 м\n\n💡 Главное — уточнять, а не додумывать за клиента!"
        },
        {
            category: "materials",
            question: "Цельносварной каркас",
            answer: "Что такое цельносварной каркас?\n\nЭто конструкция, где основные элементы теплицы уже сварены на производстве:\n- Дуги идут цельными, без стыков\n- Торцы сразу соединены с дверью и форточкой\n- Вся конструкция собирается на месте только с помощью горизонтальных стяжек, которые фиксируются краб-системой на 4 болта\n\n✅ В чём плюсы цельносварного каркаса?\n\n1. Максимальная прочность — сварные соединения жестче и надёжнее, чем болтовые стыки\n2. Ускоренный монтаж — на сборку уходит меньше времени\n3. Устойчивость к нагрузкам — выдерживает большие снеговые и ветровые нагрузки\n4. Минимум ошибок при сборке — нет сложных соединений\n\n💬 Как объяснять клиенту:\n\"Это уже практически готовая теплица, вам остается просто соединить дуги между собой. Без болтовых стыков каркас прочнее, а установка быстрее.\"",
            images: ["image/13.jpg", "image/14.jpg"]
        },
        {
            category: "materials",
            question: "Краб-система vs болтовое соединение: детальное сравнение",
            answer: "Болтовое соединение / труба в трубу:\n- Самый дешёвый вариант соединения профильной трубы\n- Для крепления используется один болт или саморез\n- Оголяет металл и приводит к быстрому появлению коррозии\n- Со временем болты могут ослабнуть\n- Теплица менее прочная, может шататься и даже разрушиться при сильной нагрузке\n\nКраб-система (4 болта):\n- Самый надёжный вариант соединения каркаса\n- Используется 4 болта, которые прочно фиксируют профиль со всех сторон\n- Металл не повреждается, сохраняется защитный слой оцинковки\n- Каркас становится жестким и устойчивым, сравним по прочности со сварным соединением\n- Каркас не расшатывается со временем\n- Выдерживает высокие снеговые и ветровые нагрузки\n\n📌 Все наши теплицы только на краб-системе!",
            images: ["image/17.png", "image/15.jpg"]
        },
        {
            category: "materials",
            question: "Нечетные размеры теплиц",
            answer: "ВАЖНО: Мы можем делать теплицы НЕЧЁТНОЙ длины!\n\nЕсли клиенту нужна, например, теплица длиной 5 м, 7 м или 9 м.\n\n🚨 Как считать стоимость:\n✅ Стоимость обрезанной теплицы равна цене ближайшей большей длины.\n✅ Теплицу обрежут на производстве и привезут готовой.\n\nПримеры:\n- Клиенту нужна теплица 5 м → считаем цену 6 м\n- Клиенту нужна теплица 7 м → считаем цену 8 м\n- Клиенту нужна теплица 9 м → считаем цену 10 м"
        },
        
        // Доставка и сборка
        {
            category: "delivery",
            question: "В какие города и регионы доставляем?",
            answer: "Работаем только в городах (и их областях/краях), где находятся наши склады:\n\nМосква, Санкт-Петербург, Белгород, Великий Новгород, Владимир, Вологда, Воронеж, Екатеринбург, Иваново, Йошкар-Ола, Казань, Калуга, Кемерово, Кострома, Краснодар, Курск, Липецк, Майкоп, Набережные Челны, Нижний Новгород, Новосибирск, Орел, Рязань, Ставрополь, Тамбов, Тверь, Тула, Ульяновск, Чебоксары, Челябинск, Черкесск, Ярославль.\n\n📌 Правила:\n• Если город есть в списке — доставка по всему региону/области.\n• Если города нет в списке — не доставляем.\n• Самовывоз: не предусмотрен."
        },
        {
            category: "delivery",
            question: "Как рассчитывается стоимость доставки?",
            answer: "💰 Формула стоимости доставки:\n• Тариф зависит от склада: 45 руб/км (Москва, Питер, Тула, Калуга, Рязань, Тверь, Великий Новгород) или 50 руб/км (остальные города). Минимум 1000 руб.\n• Без сборки: 500 руб + тариф × км. Со сборкой: тариф × км."
        },
        {
            category: "delivery",
            question: "Как работает сборка теплиц?",
            answer: "🔧 Правила сборки:\n• Отдельный монтаж (без покупки теплицы у нас) — не осуществляем.\n• Ремонт, заливка фундамента и прочие строительные работы — не оказываем.\n\n🔹 Монтаж на фундамент клиента (закрепят теплицу к фундаменту):\n• Брус (клиентский): +1500 руб\n• Бетон: +2000 руб\n\n📋 Размеры бруса: 100×100 мм, пропитан составом «Неомид» против гниения и вредителей."
        },
        {
            category: "delivery",
            question: "Дополнительно о самовывозе",
            answer: "🚫 Самовывоз не предусмотрен.\n\nЗаказ оформляется онлайн, доставку и сборку (при необходимости) осуществляют наши специалисты."
        },
        {
            category: "delivery",
            question: "Установка на голую землю: почему нельзя",
            answer: "❌ Теплицы на голую землю не устанавливаем!\n\n🚫 Почему нельзя ставить теплицу прямо на грунт?\n\n✔ Неравномерная нагрузка — теплица может проседать или перекоситься и в итоге сломаться\n✔ Риск сдувания ветром — без опоры конструкция нестабильна\n✔ Потеря тепла — без изоляции снизу грунт быстрее промерзает\n\n✅ Как правильно установить теплицу?\n\n📌 На брус — можно купить у нас или подготовить самостоятельно\n📌 На грунтозацепы — металлические штыри для фиксации в земле\n📌 Комбинированный вариант — брус + грунтозацепы для максимальной устойчивости\n📌 На бетонный (ленточный) фундамент — анкерное крепление для долговечности\n\n🔴 Крайний вариант (без гарантии!)\nЕсли клиент не хочет делать нормальное основание, можно поставить теплицу на заранее подготовленные кирпичи или блоки, но мы не несем ответственности за устойчивость конструкции.\n\n📌 Важно перед монтажом:\n✅ Очистить от снега и мусора\n✅ Убедиться, что поверхность ровная\n✅ Выделить место для раскроя поликарбоната\n\n❌ Монтажники не занимаются очисткой участка, укладкой фундамента и строительными работами!"
        },
        {
            category: "delivery",
            question: "Установка vs закрепление: в чём разница?",
            answer: "1️⃣ Почему теплицу нельзя ставить просто на землю?\n\nТеплица должна прочно стоять и не двигаться при ветре или нагрузках. Если просто поставить её на землю:\n❌ Её может снести ветром\n❌ Каркас может со временем деформироваться\n❌ Внутрь могут пролезть грызуны\n❌ Будет теряться тепло\n\nПоэтому любая теплица должна на что-то устанавливаться:\n✔ Наш брус (он продаётся клиенту вместе с теплицей)\n✔ Наши грунтозацепы (они тоже продаются клиенту)\n✔ Фундамент клиента (брус, бетон или что-то другое)\n\n2️⃣ Чем отличается просто установка теплицы от её закрепления?\n\n📌 Установка — это когда сборщики собирают каркас теплицы и просто ставят её на брус или фундамент клиента. Дополнительных креплений нет. Теплица просто стоит на месте.\n\n📌 Закрепление — это когда сборщики жёстко крепят теплицу к основанию, чтобы она не двигалась и не могла сдвинуться ветром.\n\n3️⃣ Что входит в обычную стоимость сборки?\n\n✅ Сборка каркаса теплицы\n✅ Закрепление теплицы к нашему брусу или нашим грунтозацепам (если клиент их заказал)\n\n💰 Эта услуга уже включена в стоимость сборки.\n\n4️⃣ Когда клиент платит дополнительно за закрепление?\n\nЕсли клиент хочет установить теплицу на свой фундамент (не наш), то за закрепление будет доплата:\n💵 +1 500 ₽ — если это его брус\n💵 +2 000 ₽ — если это бетонный фундамент\n\nПочему так?\n🔹 Брус клиента — сборщикам нужно отдельно прикрутить каркас теплицы к его брусу (используют шуруповёрт). Это доп. работа.\n🔹 Бетонный фундамент — сборщики привозят перфоратор, сверлят в бетоне отверстия и закрепляют анкерными болтами. Это сложнее, дольше и требует инструмента.\n\n5️⃣ Можно ли не закреплять теплицу на фундамент клиента?\n\nДа! Если клиент не хочет доплачивать, сборщики просто поставят теплицу на его фундамент, но не будут её крепить."
        },
        {
            category: "delivery",
            question: "Ограничения по доставке в приграничные районы",
            answer: "⛔️ Ограничения по доставке в приграничные районы!\n\n🚛 Доставляем ТОЛЬКО по согласованию, с доплатой и ТОЛЬКО доставку в следующие районы:\n\nБелгородская область: Вейделевка, Вайлуки, Волоконовка, Шебекино, Грайворон, Борисовка.\n\nКурская область: Курчатов, Большое Солдатское и районы близ границы.\n\n⛔ НЕ ВОЗИМ СОВСЕМ в:\n\nБелгородская область: Грайворон, Ровеньки.\n\nКурская область: Суджа, Рыльск (за Льгов).\n\n🔴 Причина: оцепления территорий, высокая вероятность ракетных обстрелов.\n\nБудьте внимательны при оформлении заказов и согласовывайте такие доставки заранее!"
        },
        
        // Оплата и товары
        {
            category: "payment",
            question: "Как происходит оплата?",
            answer: "💳 Способы оплаты: наличные или QR код\n\n📌 Условия:\n• Предоплата: не нужна. Оплата после доставки, а при сборке — после её завершения.\n• Рассрочка: не предоставляется. Но есть опция бесплатного хранения до 1 мая (цена фиксируется сразу)."
        },
        {
            category: "payment",
            question: "Какая гарантия на теплицы?",
            answer: "🛡️ Гарантия: 15 лет\n\nВыдается гарантийный лист с описанием условий."
        },
        {
            category: "payment",
            question: "Что можно купить отдельно от теплицы?",
            answer: "⚠️ Мы НЕ продаем отдельно: дуги, поликарбонат (кроме доп. листов), болты и прочие комплектующие.\n\n✅ Можно купить дополнительные листы поликарбоната дополнительно к текущему заказу (2.1×6 м):\n• Стандарт — 3000 руб\n• Люкс — 3500 руб\n• Премиум — 4000 руб"
        },
        {
            category: "payment",
            question: "Дополнительные товары (цены)",
            answer: "💧 Капельный полив механический: 1690 руб\n💧 Капельный полив автоматический: 4499 руб\n🔩 Оцинкованная лента (30 м): 1990 руб\n🌬️ Паропропускная лента (25 м): 1590 руб\n🪟 Дополнительная форточка: 1490 руб\n🤖 Автомат для форточки: 2590 руб"
        },
        {
            category: "payment",
            question: "Заключаем ли мы договор?",
            answer: "📄 Нет, т.к. не берем предоплату и не видим необходимости в договоре.\n\nПо факту оплаты клиент получает товарный чек."
        },
        {
            category: "payment",
            question: "Можно ли посмотреть теплицу «вживую»?",
            answer: "👀 У нас нет выставочных образцов, работаем только онлайн.\n\nПредлагаем фото. Клиент оплачивает после доставки, может осмотреть теплицу и при желании отказаться без доплат."
        },
        {
            category: "payment",
            question: "Есть ли «каталог»?",
            answer: "📋 Классического каталога нет, подбираем теплицу индивидуально под запросы клиента (размер, тип каркаса, поликарбонат и т.п.).\n\n⚠️ Сайт есть, но давать его не рекомендуется (там общий номер колл-центра, мы не сможем отследить звонок)."
        },
        {
            category: "payment",
            question: "Система подарков (актуальная логика)",
            answer: "📊 Количество подарков по сумме заказа:\n\n• От 35 000 рублей — 1 подарок (по умолчанию: дополнительная форточка)\n• От 55 000 рублей — 2 подарка (по умолчанию: форточка + капельный полив)\n• От 75 000 рублей — 3 подарка (по умолчанию: форточка + капельный полив + автомат для форточки)\n\n🔄 Правила замены подарков:\n\n• Любой подарок можно заменить на 4 грунтозацепа\n• Капельный полив можно заменить на вторую форточку (при условии соблюдения суммы заказа)\n• Максимум 3 подарка — даже если сумма очень большая, больше 3 подарков не будет\n\n⚙️ Особенности:\n\n• \"Автоматическая форточка\" занимает 2 слота подарка — это форточка + автомат в одном подарке. Если вы выбрали её в подарке 1, то подарок 2 автоматически скрывается.\n• Автомат для форточки можно выбрать только если есть дополнительная форточка — либо купленная в разделе \"Дополнительные товары\", либо выбранная в подарках.\n• Если форточка выбрана или куплена, автомат становится доступен во ВСЕХ подарках — можно выбрать автомат в любом доступном подарке.\n\n💡 Примеры:\n\nПример 1: Заказ на 60 000 рублей (2 подарка)\n• Подарок 1: Дополнительная форточка\n• Подарок 2: Капельный полив механический\n\nИли можно заменить:\n• Подарок 1: Автоматическая форточка (форточка + автомат) — подарок 2 скрывается\n• Подарок 2: Недоступен (занят автоматической форточкой)\n\nПример 2: Заказ на 80 000 рублей (3 подарка)\n• Подарок 1: Дополнительная форточка\n• Подарок 2: Капельный полив механический\n• Подарок 3: Автомат для форточки (стал доступен, так как форточка выбрана в подарке 1)\n\nПример 3: Заказ на 80 000 рублей + куплена форточка\n• Куплена дополнительная форточка в разделе \"Дополнительные товары\"\n• Подарок 1: Автомат для форточки (стал доступен во всех подарках)\n• Подарок 2: Капельный полив механический\n• Подарок 3: Автомат для форточки (можно выбрать второй автомат, если нужно)\n\nПример 4: Все подарки заменены на грунтозацепа\n• Подарок 1: 4 грунтозацепа\n• Подарок 2: 4 грунтозацепа\n• Подарок 3: 4 грунтозацепа\n• Итого: 12 грунтозацепов в подарок\n\n⚠️ ВАЖНО: Если не указать подарок в таблице заказов — клиент его не получит!"
        },
        {
            category: "payment",
            question: "Оплата по счету для юрлиц",
            answer: "НОВОЕ: можно оплачивать по счёту (для юрлиц и ИП)\n\nТеперь клиенты могут оплачивать теплицы по счёту — через организацию или ИП. Это удобно для юрлиц, школ, муниципалитетов и других компаний.\n\nУсловия:\n• Минимальный заказ — от 100 000 ₽\n  (т.к. мы выставляем счёт минимум на 100 000 ₽ + 18% сверху)\n• К любой сумме по счёту прибавляется +18%\n  (это включает НДС, сопровождение, расчётные расходы)\n\nПример:\nЕсли заказ на 200 000 ₽, то счёт будет на 236 000 ₽ (200 000 + 18% = 236 000)\n\nВажно:\nЕсли у клиента запрос на оплату по счёту — не оформляйте ничего сами.\nСразу пишите Павлу — он проверит и выставит счёт вручную."
        },
        
        // Работа с клиентами
        {
            category: "work",
            question: "Универсальный скрипт звонка для менеджеров",
            answer: "1. Приветствие\nЗадача: узнать имя и быстро перехватить инициативу\n\n«Здравствуйте! Меня зовут [Имя], компания [Название]. Какую теплицу подбираем – размер, форма?»\n\n2. Выявление потребностей\nЧеткая квалификация клиента и его запроса\n\n«Давайте подберём идеальный вариант. Вы рассматриваете теплицу с поликарбонатом или только каркас? Какие погодные условия? Планируете собирать сами или нужна сборка?»\n\n3. Презентация (ценность перед ценой)\nПоменьше терминов, упор на качество и сравнение, чтобы клиент в голове мысленно купил\n\n«Каркас усиленный – 40×20 мм, горячее цинкование, гарантия 15 лет, не ржавеет.»\n«Поликарбонат Люкс – двойная УФ-защита, плотность 0.72, прослужит дольше.»\n«Шаг дуги 0.65 м – снеговая нагрузка выше, конструкция крепче.»\n\nТолько после объяснения говорим цену.\n\n4. Дополнительные услуги\n\n«Грунтозацепы – фиксируют теплицу в земле, не дадут ветру её унести.»\n«Брус – даёт теплоизоляцию, защищает от грызунов.»\n«Сборка – наши мастера соберут за 3-4 часа, вы не потратите время.»\n\n5. Работа с возражениями\n\n«Дорого» → «Цена зависит от качества – у нас прочный каркас, горячее цинкование и усиленный поликарбонат.»\n\n«У конкурентов дешевле» → «Важно сравнивать не только цену, но и характеристики. У нас поликарбонат плотностью 0.47, а у дешёвых моделей – 0.3.»\n\n«Я подумаю» → «Учтите, что ближе к сезону цены вырастут, а у нас сейчас можно забронировать без предоплаты. И это ключевое – мы без предоплаты работаем. Клиент ничем не рискует.»\n\n6. Закрытие сделки\n\n«Давайте зафиксируем заказ – предоплата не требуется, оплата после доставки. Мы привезём в удобный для вас день.»\n\n7. Финальное подтверждение\n\n«Сейчас отправлю вам все данные в Telegram. Оплата только после доставки. Когда привезут теплицу и установят – проверите, всё ли в порядке, и после этого оплачиваете.»\n\nВАЖНО: ЕСЛИ КЛИЕНТ НЕ КУПИЛ ВО ВРЕМЯ ЗВОНКА - ОТПРАВЛЯЕМ РАСЧЕТ В TELEGRAM!"
        },
        {
            category: "work",
            question: "Возражение \"У конкурентов дешевле\"",
            answer: "Алгоритм:\n1. Не спорить, не оправдываться\n2. Сравнивать характеристики, а не только цену\n3. Показать разницу в материалах\n4. Подчеркнуть долгосрочную выгоду\n\nПримеры фраз:\n- \"Возможно, но важно сравнивать не только цену, но и комплектацию.\"\n- \"Часто в более дешёвых вариантах: поликарбонат тоньше или без УФ-защиты, каркас из менее прочного профиля, соединения не краб-система, а на саморезах.\"\n- \"Мы даём качественный вариант, который простоит долго, а не на один сезон.\""
        },
        {
            category: "work",
            question: "Возражение \"Нужно посоветоваться\"",
            answer: "Алгоритм:\n1. Выявить, с чем связано \"советование\"\n2. Предложить помощь в подготовке аргументов\n3. Зафиксировать цену на время обсуждения\n\nПримеры фраз:\n- \"Обычно в таких ситуациях обсуждают либо цену, либо нюансы установки. Если есть сомнения — можем разобрать, что важно именно вам.\""
        },
        {
            category: "work",
            question: "Возражение \"Доставка/монтаж у конкурентов бесплатные\"",
            answer: "Алгоритм:\n1. Объяснить, что \"бесплатное\" включено в цену\n2. Показать честность нашего расчёта\n3. Подчеркнуть отсутствие скрытых доплат\n\nПримеры фраз:\n- \"Обычно в таких случаях доставка и сборка просто включены в цену. Часто бывает так: теплица стоит дешевле, но в ней тонкий поликарбонат или слабый каркас.\"\n- \"Мы называем цену честно, без скрытых доплат.\""
        },
        {
            category: "work",
            question: "Работа с конфликтными клиентами",
            answer: "Как работать с конфликтными клиентами — без паники\n\nВ пик сезона будет много недовольных. Это нормально. Важно не сломаться, а уметь решать.\n\nВот чёткие принципы:\n\n1. Не спорь. Выслушай.\n- Клиенты часто злятся не на нас, а на ситуацию\n- Не перебивай. Не доказывай\n- Выслушай и уточни, в чём суть\n\n2. Не выноси вердикт сам, если не уверен\n- 90% \"жалоб\" — это обычные недоразумения\n- Разбирайся спокойно. Без обвинений\n\n3. Если реально есть претензия — запускаем шаблон \"Претензия\"\n- Отправляем клиенту инструкцию по оформлению претензии\n- Почта: info@teplitsa-rus.ru\n\n4. Самостоятельность — важное качество хорошего менеджера\n- Если можно решить — реши сам\n- Если чувствуешь, что не справляешься — тогда пиши Павлу с информацией, которую ты уже узнал у клиента\n\n5. Напоминаем клиенту\n- Мы работаем без предоплаты\n- Клиенту важно всё проверить при доставке (или после сборки) и сказать о недочётах до оплаты\n- Так вопрос решится быстрее\n\nГлавное:\n- Недовольные клиенты — это нормально\n- Без них мы не станем лучше\n- Наша задача — не оправдываться, а спокойно решать"
        },
        {
            category: "work",
            question: "Как работать с шаблонами в AMO",
            answer: "⚠️ Важно: Шаблоны — это инструмент, а мы — люди!\n\nПравила работы с шаблонами:\n\n1. Используйте готовые сообщения как базу, дополняйте их конкретикой под запрос клиента\n2. Будьте живыми, но не забывайте логику и структуру\n3. Перед отправкой проверьте, что всё правильно (имя, сумма, дата)\n4. Если нет шаблона на конкретную ситуацию, обратитесь к коллегам или адаптируйте похожий\n\n❌ НЕ делайте:\n- Копировать-вставить бездумно\n- Отправлять шаблон без персонализации\n- Игнорировать контекст диалога\n\n✅ Делайте:\n- Адаптируйте шаблон под конкретного клиента\n- Добавляйте имя клиента, конкретные цифры, даты\n- Проверяйте, что шаблон уместен в данной ситуации"
        },
        
        // Процессы и CRM
        {
            category: "process",
            question: "Как обрабатывать лиды в AmoCRM?",
            answer: "📋 Правила обработки лидов:\n• Действуем по очереди от старых к новым, чтобы никто не остался без ответа.\n• Быстро реагируем, но не теряем в качестве диалога.\n• Не «зависаем» на одном клиенте."
        },
        {
            category: "process",
            question: "Как работать с отзывами?",
            answer: "⭐ Перед тем как запросить отзыв, уточняем, всё ли в порядке и нет ли претензий.\n\nИспользуем шаблон \"Как прошла доставка\". Если клиент отвечает положительно, отправляем шаблон \"Запрос отзыв\" (обязательно вставляем имя клиента) и направляем ссылку на отзыв в том аккаунте, с которого была совершена покупка.\n\n📎 Ссылки на отзывы (Avito):\n\n[REVIEW_LINKS]\n\n⚠️ Если клиент жалуется, лучше не отправлять ссылку на отзыв."
        },
        {
            category: "process",
            question: "Регламент рабочего времени и дисциплины",
            answer: "Регламент рабочего времени и дисциплины менеджеров\n\n1. График работы\n- Работаем по графику 2/2 (время указано московское)\n- Пока у нас в межсезонье с 9 - 18 часов, далее будем работать с 8-20 часов\n\n2. Обязательные действия в начале смены\n- До начала работы менеджер должен написать в общий чат «Доброе утро»\n- Софтфон должен быть активен с начала смены\n- Первый звонок или ответ на сообщение должен быть сделан в первые 10 минут смены\n\n3. Перерывы на обед\n- Обед — по согласованию, чтобы кто-то всегда был на линии\n- Перед уходом на обед пишем в общий чат: «Ухожу на обед»\n- Длительность обеда — до 1 часа\n\n4. Оперативность и связь\n- Отвечать на сообщения в Telegram в течение 10 минут после их отправки\n- Если планируете отойти — предупреждаете в чате\n\n5. Дисциплина и нарушения\n❌ Что считается грубым нарушением:\n- Начало работы позже назначенного времени без предупреждения\n- Необоснованное игнорирование звонков и сообщений\n- Отказ от обработки звонков без веской причины\n- Исчезновение в рабочее время без уведомления"
        }
    ]
};

// Функция открытия модального окна FAQ
function showFAQModal() {
    const modal = document.getElementById('faq-modal');
    if (!modal) {
        console.error("❌ Модальное окно FAQ не найдено!");
        return;
    }
    
    try {
        // Гарантируем, что модальное окно в body
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
        
        // Блокируем прокрутку фона
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Убираем класс hidden
        modal.classList.remove('hidden');
        
        // КРИТИЧНО для Safari: принудительно устанавливаем стили для гарантированного отображения
        const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
        if (isSafari) {
            // Принудительно устанавливаем стили через inline для Safari
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            
            // Принудительный reflow для Safari
            void modal.offsetHeight;
        }
        
        // Предотвращаем прокрутку фона при прокрутке внутри модального окна
        const modalBody = modal.querySelector('.faq-modal-body');
        if (modalBody) {
            modalBody.addEventListener('wheel', preventBackgroundScroll, { passive: false });
            modalBody.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
        }
        
        // Рендерим FAQ
        if (typeof renderFAQ === 'function') {
            renderFAQ();
        }
    } catch (error) {
        console.error('❌ Ошибка при открытии FAQ:', error);
    }
}

// Функция предотвращения прокрутки фона
function preventBackgroundScroll(e) {
    const modalBody = e.currentTarget;
    
    // Для wheel событий
    if (e.type === 'wheel') {
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
        const isAtTop = modalBody.scrollTop <= 0;
        const isAtBottom = modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight - 1;
        
        // Если прокрутка вверх и мы вверху, или прокрутка вниз и мы внизу - блокируем
        if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // Для touchmove событий (мобильные устройства) - просто позволяем прокрутку внутри модального окна
    // overscroll-behavior: contain в CSS должен предотвратить прокрутку фона
}

// Функция закрытия модального окна FAQ
function closeFAQModal() {
    const modal = document.getElementById('faq-modal');
    if (modal) {
        modal.classList.add('hidden');
        
        // Разблокируем прокрутку фона
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Удаляем обработчики событий
        const modalBody = modal.querySelector('.faq-modal-body');
        if (modalBody) {
            modalBody.removeEventListener('wheel', preventBackgroundScroll);
            modalBody.removeEventListener('touchmove', preventBackgroundScroll);
        }
    }
}

// Функция рендеринга FAQ с категориями
function renderFAQ(selectedCategory = null) {
    const contentDiv = document.getElementById('faq-content');
    if (!contentDiv) return;
    
    // Определяем Safari один раз для всей функции
    const isSafari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    
    let html = '';
    
    // Рендерим категории (табы)
    html += '<div class="faq-categories">';
    faqData.categories.forEach(category => {
        const isActive = selectedCategory === category.id || (!selectedCategory && category.id === faqData.categories[0].id);
        html += `
            <button class="faq-category-tab ${isActive ? 'active' : ''}" 
                    onclick="filterFAQByCategory('${category.id}')">
                <span class="faq-category-icon">${category.icon}</span>
                <span class="faq-category-name">${category.name}</span>
            </button>
        `;
    });
    html += '</div>';
    
    // Определяем, какую категорию показывать
    const activeCategory = selectedCategory || faqData.categories[0].id;
    
    // Фильтруем вопросы по категории
    const filteredItems = faqData.items.filter(item => item.category === activeCategory);
    
    // Рендерим вопросы выбранной категории
    html += '<div class="faq-list">';
    
    if (filteredItems.length === 0) {
        html += '<div class="faq-empty">В этой категории пока нет вопросов.</div>';
    } else {
        filteredItems.forEach((item, index) => {
            const faqId = `faq-${activeCategory}-${index}`;
            html += `
                <div class="faq-item">
                    <button class="faq-question" onclick="toggleFAQ('${faqId}')">
                        <span class="faq-icon">❓</span>
                        <span class="faq-question-text">${item.question}</span>
                        <span class="faq-toggle">▼</span>
                    </button>
                    <div class="faq-answer" id="${faqId}" style="display: none;">
                        ${item.images && item.images.length > 0 ? `
                            <div class="faq-images">
                                ${item.images.map((img, imgIndex) => {
                                    // Используем data-атрибут для безопасной передачи пути к изображению
                                    const imgId = `img-${faqId}-${imgIndex}`;
                                    // Экранируем кавычки в пути для безопасного использования в HTML
                                    const escapedImg = img.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                                    return `<img src="${escapedImg}" alt="Иллюстрация" class="faq-image" loading="lazy" data-image-src="${escapedImg}" id="${imgId}">`;
                                }).join('')}
                            </div>
                        ` : ''}
                        <div class="faq-answer-content">${formatFAQAnswerWithReviewLinks(item.answer)}</div>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    // Добавляем обработчики кликов для изображений через делегирование событий
    const faqImages = contentDiv.querySelectorAll('.faq-image');
    faqImages.forEach(img => {
        // Убираем стандартное поведение клика (открытие на фоне)
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Создаем модальное окно для просмотра изображения
            const imageModal = document.createElement('div');
            imageModal.className = 'faq-image-modal';
            imageModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;
            
            const image = document.createElement('img');
            image.src = this.src;
            image.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            `;
            
            imageModal.appendChild(image);
            document.body.appendChild(imageModal);
            
            // Закрытие по клику
            imageModal.addEventListener('click', function() {
                document.body.removeChild(imageModal);
            });
        });
    });
    
    // Принудительный reflow после рендеринга для всех браузеров
    // Это заставляет браузер пересчитать размеры элементов
    void contentDiv.offsetHeight;
    
    // Обновляем активную категорию в табах
    updateActiveCategory(activeCategory);
    
    // ДИАГНОСТИКА (только в DEBUG): оставляем возможность быстро включить, но в проде не шумим и не тормозим.
    if (DEBUG && isSafari) {
        debugLog('SAFARI FAQ diag:', {
            faqItems: contentDiv.querySelectorAll('.faq-item').length,
            faqLists: contentDiv.querySelectorAll('.faq-list').length,
            contentOffsetHeight: contentDiv.offsetHeight,
            contentScrollHeight: contentDiv.scrollHeight
        });
    }
}

// Функция фильтрации FAQ по категории
function filterFAQByCategory(categoryId) {
    renderFAQ(categoryId);
}

// Функция обновления активной категории
function updateActiveCategory(activeCategory) {
    const tabs = document.querySelectorAll('.faq-category-tab');
    tabs.forEach(tab => {
        const onclickAttr = tab.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/'([^']+)'/);
            if (match && match[1] === activeCategory) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        }
    });
}

// Функция форматирования ответа FAQ с обработкой ссылок на отзывы
function formatFAQAnswerWithReviewLinks(text) {
    if (!text) return '';
    
    // Проверяем, есть ли плейсхолдер для ссылок на отзывы
    if (text.includes('[REVIEW_LINKS]')) {
        const reviewLinks = [
            { name: 'Теплицы от производителя', url: 'https://www.avito.ru/user/review?fid=2_LSfXLXy3YaMN4NgHkcL-uujowHx4ZBZ87DElF8B0nlyL6RdaaYzvyPSWRjp4ZyNE' },
            { name: 'Строй мир', url: 'https://www.avito.ru/user/review?fid=2_LSfXLXy3YaMN4NgHkcL-uujowHx4ZBZ87DElF8B0nlyL6RdaaYzvyPSWRjp4ZyNE' },
            { name: 'Конструктивные решения', url: 'https://www.avito.ru/user/review?fid=2_LSfXLXy3YaMN4NgHkcL-uujowHx4ZBZ87DElF8B0nlyL6RdaaYzvyPSWRjp4ZyNE' }
        ];
        
        const reviewLinksHTML = '<div class="faq-review-links">' +
            reviewLinks.map(link => {
                const escapedUrl = link.url.replace(/'/g, "\\'");
                return `<div class="faq-review-link-card">
                    <span class="faq-review-link-name">${link.name}</span>
                    <button class="faq-review-copy-btn" onclick="copyUrlToClipboard('${escapedUrl}', this)" title="Копировать ссылку на отзыв">
                        📋 Копировать ссылку
                    </button>
                </div>`;
            }).join('') +
            '</div>';
        
        // Разбиваем текст на части до и после плейсхолдера
        const parts = text.split('[REVIEW_LINKS]');
        const beforeLinks = parts[0] || '';
        const afterLinks = parts[1] || '';
        
        // Форматируем части текста отдельно
        const formattedBefore = formatFAQAnswer(beforeLinks);
        const formattedAfter = formatFAQAnswer(afterLinks);
        
        // Собираем результат: форматированный текст до + HTML карточек + форматированный текст после
        return formattedBefore + reviewLinksHTML + formattedAfter;
    }
    
    // Если плейсхолдера нет - просто форматируем текст
    return formatFAQAnswer(text);
}

// Функция форматирования текста ответа FAQ - ПОЛНОСТЬЮ ПЕРЕРАБОТАННАЯ ВЕРСИЯ
function formatFAQAnswer(text) {
    try {
        if (!text) return '';
        
        // Вспомогательная функция для форматирования текста (кавычки, URL)
        function formatText(text) {
            if (!text) return '';
            return text
                .replace(/"([^"]+)"/g, '<strong>"$1"</strong>')
                .replace(/(https?:\/\/[^\s]+)/gi, function(match) {
                    const escaped = match.replace(/'/g, "\\'");
                    return '<a href="' + match + '" target="_blank" rel="noopener noreferrer" class="faq-url-link">' + match + '</a>';
                });
        }
        
        // Разбиваем текст на строки
        const lines = text.split('\n');
        const blocks = [];
        let currentParagraph = [];
        let currentList = [];
        let afterSubheading = false; // Флаг: текст после подзаголовка с двоеточием
        
        function flushParagraph() {
            if (currentParagraph.length > 0) {
                const paraText = currentParagraph.join(' ').trim();
                if (paraText) {
                    blocks.push('<p>' + formatText(paraText) + '</p>');
                }
                currentParagraph = [];
            }
            afterSubheading = false;
        }
        
        function flushList() {
            if (currentList.length > 0) {
                blocks.push('<ul>' + currentList.join('') + '</ul>');
                currentList = [];
            }
        }
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            const indent = line.length - trimmed.length;
            
            // Пустая строка
            if (!trimmed) {
                // Если мы после подзаголовка и в параграфе есть текст - продолжаем собирать
                // (пустая строка внутри параграфа после подзаголовка не закрывает его)
                if (afterSubheading && currentParagraph.length > 0) {
                    // Добавляем пробел вместо пустой строки для объединения текста
                    continue;
                }
                flushList();
                flushParagraph();
                continue;
            }
            
            // ВАЖНО/ВНИМАНИЕ - всегда отдельный блок
            const warningMatch = trimmed.match(/^([-•]\s*)?(ВАЖНО|ВНИМАНИЕ)(:)?\s*(.*)$/i);
            if (warningMatch && indent === 0) {
                flushList();
                flushParagraph();
                const warningText = warningMatch[2];
                const hasColon = warningMatch[3];
                const afterText = (warningMatch[4] || '').trim();
                
                if (!afterText) {
                    blocks.push('<p class="faq-warning">' + trimmed + '</p>');
                } else {
                    blocks.push('<p class="faq-warning">' + warningText + (hasColon ? ':' : '') + '</p>');
                    if (afterText) {
                        currentParagraph.push(afterText);
                    }
                }
                continue;
            }
            
            // Заголовки типа "1 КАСАНИЕ", "2 КАСАНИЕ" (число + слово заглавными)
            if (indent === 0 && /^\d+\s+[А-ЯЁA-Z]/.test(trimmed)) {
                flushList();
                flushParagraph();
                blocks.push('<p class="faq-heading">' + trimmed + '</p>');
                continue;
            }
            
            // Вопросы как заголовки (строка заканчивается "?")
            if (indent === 0 && trimmed.endsWith('?') && trimmed.length < 100) {
                flushList();
                flushParagraph();
                blocks.push('<p class="faq-heading">' + trimmed + '</p>');
                continue;
            }
            
            // Заголовки (1., 2., 3.) - только если после них идет заглавная буква или это короткая строка
            // Если после числа идет обычный текст - это элемент нумерованного списка
            if (indent === 0 && /^\d+[\.\)]\s+/.test(trimmed)) {
                const afterNumber = trimmed.replace(/^\d+[\.\)]\s+/, '');
                // Если после числа идет заглавная буква или это очень короткая строка - это заголовок
                if (/^[А-ЯЁA-Z]/.test(afterNumber) || trimmed.length < 30) {
                    flushList();
                    flushParagraph();
                    blocks.push('<p class="faq-heading">' + trimmed + '</p>');
                    continue;
                } else {
                    // Иначе это элемент нумерованного списка
                    flushParagraph();
                    currentList.push('<li>' + formatText(afterNumber) + '</li>');
                    continue;
                }
            }
            
            // Подзаголовки: текст с двоеточием в конце (Тип задачи:, Шаблон:, Текст:)
            if (indent === 0 && trimmed.endsWith(':') && !trimmed.startsWith('-') && !trimmed.startsWith('•') && trimmed.length < 50 && !trimmed.match(/^[А-ЯЁA-Z]{2,}/)) {
                // Проверяем, что это не заголовок типа "ВАЖНО:" или "1 КАСАНИЕ:"
                flushList();
                flushParagraph();
                blocks.push('<p class="faq-subheading">' + trimmed + '</p>');
                afterSubheading = true; // Следующий текст будет после подзаголовка
                continue;
            }
            
            // Подзаголовки с эмодзи (✅, ❌ и т.д.) - только если нет отступа
            if (indent === 0) {
                const hasEmoji = /^[✅❌📌🎯📐📏🔩🏗️🌬️❄️💰🌱🏠🌞💡⚠️🚨🔴📋🔹💬💵🔧📎⭐📞🪟🤖💧1️⃣2️⃣3️⃣4️⃣5️⃣]+\s+/.test(trimmed);
                
                if (hasEmoji) {
                    // Если это строка с эмодзи и ценой (например, "💧 Капельный полив: 1690 руб")
                    // то это элемент списка, а не подзаголовок
                    if (/руб|₽/.test(trimmed)) {
                        flushParagraph();
                        currentList.push('<li>' + formatText(trimmed) + '</li>');
                        continue;
                    } else {
                        // Иначе это подзаголовок
                        flushList();
                        flushParagraph();
                        blocks.push('<p class="faq-subheading">' + trimmed + '</p>');
                        continue;
                    }
                }
            }
            
            // Элементы списка (начинаются с -, •) - могут быть с отступом (вложенные)
            if (/^[-•]\s+/.test(trimmed)) {
                flushParagraph();
                const itemText = trimmed.replace(/^[-•]\s+/, '').trim();
                if (itemText) {
                    currentList.push('<li>' + formatText(itemText) + '</li>');
                }
                continue;
            }
            
            // Строки с отступом после элемента списка - продолжение элемента
            if (indent >= 2 && currentList.length > 0) {
                const lastItemIndex = currentList.length - 1;
                const lastItem = currentList[lastItemIndex];
                const itemContent = lastItem.replace(/^<li>/, '').replace(/<\/li>$/, '');
                currentList[lastItemIndex] = '<li>' + itemContent + ' ' + formatText(trimmed) + '</li>';
                continue;
            }
            
            // URL (отдельная строка)
            if (/^(https?:\/\/[^\s]+)$/i.test(trimmed)) {
                flushList();
                flushParagraph();
                const escaped = trimmed.replace(/'/g, "\\'");
                blocks.push('<p class="faq-url-line"><a href="' + trimmed + '" target="_blank" rel="noopener noreferrer" class="faq-url-link">' + trimmed + '</a><button class="faq-copy-btn" onclick="copyUrlToClipboard(\'' + escaped + '\', this)" title="Копировать ссылку">📋</button></p>');
                continue;
            }
            
            // Обычный текст - добавляем в параграф
            // Если это текст после подзаголовка с двоеточием, закрываем параграф при следующем заголовке
            flushList();
            currentParagraph.push(trimmed);
        }
        
        // Закрываем оставшиеся блоки
        flushList();
        flushParagraph();
        
        return blocks.join('');
    } catch (error) {
        console.error('Ошибка форматирования FAQ ответа:', error);
        return text ? '<p>' + formatText(text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, ' ')) + '</p>' : '';
    }
}

// Функция переключения FAQ (аккордеон с автоматическим сворачиванием)
function toggleFAQ(faqId) {
    const answer = document.getElementById(faqId);
    if (!answer) return;
    
    const item = answer.closest('.faq-item');
    const toggle = item.querySelector('.faq-toggle');
    
    // Если открываем новый ответ - сворачиваем все остальные
    if (answer.style.display === 'none') {
        // Находим все открытые FAQ элементы в текущей категории
        const allItems = document.querySelectorAll('.faq-item.expanded');
        allItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherToggle = otherItem.querySelector('.faq-toggle');
                if (otherAnswer && otherAnswer.style.display !== 'none') {
                    otherAnswer.style.display = 'none';
                    otherToggle.textContent = '+';
                    otherItem.classList.remove('expanded');
                }
            }
        });
        
        // Открываем выбранный элемент
        answer.style.display = 'block';
        toggle.textContent = '−';
        item.classList.add('expanded');
    } else {
        // Закрываем текущий элемент
        answer.style.display = 'none';
        toggle.textContent = '+';
        item.classList.remove('expanded');
    }
}

// Функция для переключения FAQ по индексу (используется в поиске)
function toggleFAQAnswer(itemIndex) {
    const answerId = `faq-answer-${itemIndex}`;
    toggleFAQ(answerId);
}

// Функция копирования URL в буфер обмена
function copyUrlToClipboard(url, button) {
    navigator.clipboard.writeText(url).then(function() {
        // Временно меняем иконку на галочку
        const originalText = button.innerHTML;
        button.innerHTML = '✓';
        button.style.background = '#28a745';
        setTimeout(function() {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1000);
    }).catch(function(err) {
        console.error('Ошибка копирования:', err);
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const originalText = button.innerHTML;
            button.innerHTML = '✓';
            button.style.background = '#28a745';
            setTimeout(function() {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 1000);
        } catch (err) {
            console.error('Ошибка копирования (fallback):', err);
        }
        document.body.removeChild(textArea);
    });
}

// Функция открытия изображения в полном размере (доступна глобально)
function openImageModal(imageSrc) {
    openImageModalWithGallery([imageSrc], 0);
}

function openImageModalWithGallery(imagesArray, currentIndex) {
    if (!imagesArray || imagesArray.length === 0) return;
    
    let currentIdx = currentIndex || 0;
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx >= imagesArray.length) currentIdx = imagesArray.length - 1;
    
    // Создаем модальное окно для просмотра изображения поверх всего
    const imageModal = document.createElement('div');
    imageModal.className = 'faq-image-modal';
    imageModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    `;
    
    const image = document.createElement('img');
    image.src = imagesArray[currentIdx];
    image.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    `;
    
    // Кнопка закрытия
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;
    `;
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    // Стрелки навигации (только если больше одного фото)
    let prevBtn = null;
    let nextBtn = null;
    let counterText = null;
    
    // Кнопка скачивания и копирования (всегда показываем)
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        gap: 8px;
        z-index: 10;
    `;
    
    const downloadBtn = document.createElement('button');
    const currentImagePath = imagesArray[currentIdx];
    const filename = currentImagePath.split('/').pop() || `image_${currentIdx + 1}.jpg`;
    downloadBtn.innerHTML = '📥 Скачать';
    downloadBtn.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    downloadBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 0, 0, 0.7)';
        this.style.transform = 'scale(1.05)';
    });
    downloadBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.transform = 'scale(1)';
    });
    downloadBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        downloadBedImage(currentImagePath, filename);
    });
    
    // Кнопка копирования в буфер обмена
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋 Копировать';
    copyBtn.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    copyBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 0, 0, 0.7)';
        this.style.transform = 'scale(1.05)';
    });
    copyBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.transform = 'scale(1)';
    });
    copyBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        await copyImageToClipboard(currentImagePath, copyBtn);
    });
    
    buttonsContainer.appendChild(downloadBtn);
    buttonsContainer.appendChild(copyBtn);
    
    if (imagesArray.length > 1) {
        // Стрелка влево
        prevBtn = document.createElement('div');
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
            user-select: none;
        `;
        prevBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.4)';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        prevBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'translateY(-50%) scale(1)';
        });
        
        // Стрелка вправо
        nextBtn = document.createElement('div');
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
            user-select: none;
        `;
        nextBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.4)';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        nextBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'translateY(-50%) scale(1)';
        });
        
        // Счетчик фото
        counterText = document.createElement('div');
        counterText.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10;
        `;
        counterText.textContent = `${currentIdx + 1} / ${imagesArray.length}`;
        
        // Функция обновления изображения
        const updateImage = function(newIndex) {
            if (newIndex < 0) newIndex = imagesArray.length - 1;
            if (newIndex >= imagesArray.length) newIndex = 0;
            currentIdx = newIndex;
            image.src = imagesArray[currentIdx];
            counterText.textContent = `${currentIdx + 1} / ${imagesArray.length}`;
            // Обновляем кнопки скачивания и копирования
            const currentImagePath = imagesArray[currentIdx];
            const filename = currentImagePath.split('/').pop() || `image_${currentIdx + 1}.jpg`;
            downloadBtn.onclick = function(e) {
                e.stopPropagation();
                downloadBedImage(currentImagePath, filename);
            };
            copyBtn.onclick = async function(e) {
                e.stopPropagation();
                await copyImageToClipboard(currentImagePath, copyBtn);
            };
        };
        
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            updateImage(currentIdx - 1);
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            updateImage(currentIdx + 1);
        });
        
        // Навигация клавиатурой
        const keyboardHandler = function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                updateImage(currentIdx - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                updateImage(currentIdx + 1);
            }
        };
        document.addEventListener('keydown', keyboardHandler);
        
        // Сохраняем обработчик для удаления при закрытии
        imageModal._keyboardHandler = keyboardHandler;
    }
    
    imageContainer.appendChild(image);
    if (prevBtn) imageContainer.appendChild(prevBtn);
    if (nextBtn) imageContainer.appendChild(nextBtn);
    if (counterText) imageContainer.appendChild(counterText);
    imageContainer.appendChild(buttonsContainer);
    
    imageModal.appendChild(imageContainer);
    imageModal.appendChild(closeBtn);
    document.body.appendChild(imageModal);
    
    // Закрытие по клику на фон или кнопку
    const closeModal = function() {
        if (imageModal._keyboardHandler) {
            document.removeEventListener('keydown', imageModal._keyboardHandler);
        }
        if (imageModal.parentNode) {
            document.body.removeChild(imageModal);
        }
    };
    
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal || e.target === closeBtn) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

window.openImageModal = openImageModal;
window.openImageModalWithGallery = openImageModalWithGallery;

// Старая функция openImageModal (удаляем, если есть)
function openImageModal_OLD(imageSrc) {
    try {
        // Нормализуем путь к изображению (убираем лишние слеши)
        const normalizedSrc = imageSrc.replace(/\/+/g, '/');
        
        // Создаем модальное окно для изображения
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        // Создаем контейнер для изображения и индикатора загрузки
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 90%;
            max-height: 90%;
        `;
        
        // Индикатор загрузки
        const loader = document.createElement('div');
        loader.style.cssText = `
            color: white;
            font-size: 18px;
            padding: 20px;
        `;
        loader.textContent = 'Загрузка изображения...';
        imgContainer.appendChild(loader);
        
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            display: none;
        `;
        
        // Обработка успешной загрузки
        img.onload = function() {
            loader.style.display = 'none';
            img.style.display = 'block';
        };
        
        // Обработка ошибки загрузки
        img.onerror = function() {
            loader.innerHTML = `
                <div style="text-align: center; color: #ff6b6b;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                    <div>Не удалось загрузить изображение</div>
                    <div style="font-size: 12px; margin-top: 10px; opacity: 0.7;">${normalizedSrc}</div>
                </div>
            `;
            console.error('Ошибка загрузки изображения:', normalizedSrc);
        };
        
        img.src = normalizedSrc;
        img.alt = 'Иллюстрация';
        
        imgContainer.appendChild(img);
        modal.appendChild(imgContainer);
        document.body.appendChild(modal);
        
        // Закрытие по клику
        modal.addEventListener('click', function(e) {
            // Закрываем только если клик по фону, не по изображению
            if (e.target === modal || e.target === loader) {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }
        });
        
        // Закрытие по Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Предотвращаем закрытие при клике на само изображение
        img.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
    } catch (error) {
        console.error('Ошибка при открытии изображения:', error);
        alert('Не удалось открыть изображение: ' + imageSrc);
    }
}

// Функция копирования ответа FAQ
function copyFAQAnswer(faqId) {
    const answer = document.getElementById(faqId);
    const answerContent = answer.querySelector('.faq-answer-content');
    // Получаем текст, заменяя <br> на переносы строк и удаляя HTML теги
    let answerText = answerContent.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    // Удаляем все остальные HTML теги
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = answerText;
    answerText = tempDiv.textContent || tempDiv.innerText || '';
    
    navigator.clipboard.writeText(answerText).then(() => {
        const btn = answer.querySelector('.faq-copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Скопировано!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        alert('Не удалось скопировать. Попробуйте выделить текст вручную.');
    });
}

// Функция фильтрации FAQ по поисковому запросу
function filterFAQ() {
    const searchInput = document.getElementById('faq-search-input');
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Если поиск пустой, показываем все вопросы текущей категории
    if (!searchQuery) {
        const activeTab = document.querySelector('.faq-category-tab.active');
        if (activeTab) {
            const onclickAttr = activeTab.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/'([^']+)'/);
                if (match) {
                    renderFAQ(match[1]);
                }
            }
        }
        return;
    }
    
    // Разбиваем запрос на ключевые слова для более гибкого поиска
    const keywords = searchQuery.split(/\s+/).filter(word => word.length > 0);
    
    // Ищем по исходным данным faqData.items, а не по отрендеренным элементам
    const matchingItems = faqData.items.filter(item => {
        const questionText = (item.question || '').toLowerCase();
        const answerText = (item.answer || '').toLowerCase();
        const fullText = questionText + ' ' + answerText;
        
        // Проверяем, содержит ли текст хотя бы одно ключевое слово
        return keywords.some(keyword => fullText.includes(keyword));
    });
    
    // Рендерим найденные результаты
    const contentDiv = document.getElementById('faq-content');
    if (!contentDiv) return;
    
    let html = '';
    
    // Показываем категории (но не делаем их активными при поиске)
    html += '<div class="faq-categories">';
    faqData.categories.forEach(category => {
        html += `
            <button class="faq-category-tab" 
                    onclick="filterFAQByCategory('${category.id}')">
                <span class="faq-category-icon">${category.icon}</span>
                <span class="faq-category-name">${category.name}</span>
            </button>
        `;
    });
    html += '</div>';
    
    // Рендерим найденные вопросы
    html += '<div class="faq-list">';
    
    if (matchingItems.length === 0) {
        html += '<div class="faq-search-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
        } else {
        matchingItems.forEach((item, searchIndex) => {
            // Находим оригинальный индекс в faqData.items для правильной работы toggleFAQAnswer
            const originalIndex = faqData.items.findIndex(originalItem => 
                originalItem.question === item.question && originalItem.answer === item.answer
            );
            const itemIndex = originalIndex >= 0 ? originalIndex : searchIndex + 10000; // Используем большой индекс если не нашли
            
            const answerFormatted = formatFAQAnswer(item.answer || '');
            const hasImages = item.images && item.images.length > 0;
            
            html += `
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQAnswer(${itemIndex})">
                        <span class="faq-question-text">${item.question || 'Вопрос не указан'}</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer" id="faq-answer-${itemIndex}" style="display: none;">
                        <div class="faq-answer-content">${answerFormatted}</div>
                        ${hasImages ? `<div class="faq-images">${item.images.map(img => `<img src="${img}" alt="FAQ image" onclick="openImageModal('${img}')" style="max-width: 100%; cursor: pointer; margin: 10px 0; border-radius: 8px;">`).join('')}</div>` : ''}
                        <button class="faq-copy-btn" onclick="copyFAQAnswer(${itemIndex})">📋 Копировать</button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    
    contentDiv.innerHTML = html;
}

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ГРЯДКАМИ ====================

// Хранилище выбранных грядок (в localStorage)
let selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');

// Флаг сборки грядок (в localStorage)
let bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';

// Цены на сборку грядок в зависимости от длины грядки (за 1 грядку)
const BEDS_ASSEMBLY_PRICES = {
    4: 990,   // За сборку 1 грядки длиной 4 м
    6: 1490,  // За сборку 1 грядки длиной 6 м
    8: 1990,  // За сборку 1 грядки длиной 8 м
    10: 2490, // За сборку 1 грядки длиной 10 м
    12: 2990, // За сборку 1 грядки длиной 12 м
    14: 3490, // За сборку 1 грядки длиной 14 м
    16: 3990  // За сборку 1 грядки длиной 16 м
};

// Функция расчета стоимости сборки для всех выбранных грядок
function calculateBedsAssemblyCost(selectedBeds) {
    let totalAssemblyCost = 0;
    Object.keys(selectedBeds).forEach(bedId => {
        const bed = BEDS_DATA.find(b => b.id === bedId);
        if (bed && selectedBeds[bedId] > 0) {
            const bedLength = bed.length;
            const quantity = selectedBeds[bedId];
            const assemblyPricePerBed = BEDS_ASSEMBLY_PRICES[bedLength] || 0;
            totalAssemblyCost += assemblyPricePerBed * quantity;
        }
    });
    return totalAssemblyCost;
}



// Функция открытия модального окна выбора грядок
function showBedsModal() {
    // Проверяем, что выбраны размеры теплицы
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    
    if (!widthInput || !widthInput.value || !lengthInput || !lengthInput.value) {
        showWarning('Сначала выберите размеры теплицы (ширину и длину)', 'Выбор размеров');
        return;
    }
    
    const modal = document.getElementById('beds-modal');
    if (!modal) {
        showError("Модальное окно грядок не найдено. Обновите страницу.", 'Ошибка');
        return;
    }
    
    // Перемещаем модальное окно в body, если оно не там
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
    
    // Сбрасываем выбор типа при открытии модального окна
    selectedBedType = null;
    
    // Загружаем выбранные грядки из localStorage
    selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
    
    // Загружаем состояние чекбокса сборки
    bedsAssemblyEnabled = localStorage.getItem('bedsAssemblyEnabled') === 'true';
    
    // Рендерим список грядок (начнется с выбора типа)
    renderBedsSelection();
    
    // Устанавливаем состояние чекбокса сборки и обновляем цену
    setTimeout(() => {
        const assemblyCheckbox = document.getElementById('beds-assembly-checkbox');
        if (assemblyCheckbox) {
            assemblyCheckbox.checked = bedsAssemblyEnabled;
            updateBedsAssemblyPrice();
            assemblyCheckbox.addEventListener('change', function() {
                bedsAssemblyEnabled = this.checked;
                updateBedsAssemblyPrice();
            });
        }
        
        // Добавляем обработчик изменения длины теплицы для обновления цены сборки
        const lengthInput = document.getElementById('length');
        if (lengthInput) {
            // Удаляем старый обработчик, если есть
            lengthInput.removeEventListener('change', updateBedsAssemblyPrice);
            lengthInput.removeEventListener('input', updateBedsAssemblyPrice);
            // Добавляем новый
            lengthInput.addEventListener('change', updateBedsAssemblyPrice);
            lengthInput.addEventListener('input', updateBedsAssemblyPrice);
        }
    }, 100);
    
    // Показываем модальное окно
    modal.classList.remove('hidden');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('z-index', '99999', 'important');
    
    // Блокируем прокрутку body и html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Проверяем содержимое модального окна
    const modalContent = modal.querySelector('.beds-modal-content');
    if (modalContent) {
        const contentRect = modalContent.getBoundingClientRect();
        if (contentRect.width === 0 || contentRect.height === 0) {
            modalContent.style.setProperty('width', '600px', 'important');
            modalContent.style.setProperty('min-height', '400px', 'important');
        }
    }
}

// Функция закрытия модального окна грядок
function closeBedsModal() {
    const modal = document.getElementById('beds-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        // Восстанавливаем прокрутку
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

// Переменная для хранения выбранного типа грядок (19 = низкие, 38 = высокие)
let selectedBedType = null;

// Функция рендеринга списка грядок
function renderBedsSelection() {
    const container = document.getElementById('beds-selection');
    if (!container) return;
    
    if (BEDS_DATA.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Данные о грядках загружаются...<br><small>Цены будут добавлены после парсинга с сайта</small></div>';
        return;
    }
    
    // Если тип не выбран, показываем выбор типа
    if (selectedBedType === null) {
        renderBedTypeSelection(container);
        return;
    }
    
    // Если тип выбран, показываем выбор характеристик
    renderBedCharacteristics(container);
}

// Функция рендеринга выбора типа грядок (низкие/высокие)
function renderBedTypeSelection(container) {
    let html = '<div class="bed-type-selection">';
    html += '<h3 class="bed-type-title">Выберите тип грядок:</h3>';
    html += '<div class="bed-type-cards">';
    
    // Низкие грядки (19 см)
    html += `
        <div class="bed-type-card" onclick="selectBedType(19)" style="position: relative;">
            <div class="bed-type-image-container">
                <img src="image/18.png" alt="Низкие грядки" class="bed-type-image">
            </div>
            <div class="bed-type-info">
                <h4 class="bed-type-name">Низкие грядки</h4>
                <p class="bed-type-description">Высота 19 см</p>
            </div>
            <div onclick="event.stopPropagation(); downloadBedImage('image/18.png', 'Низкие_грядки_19см.png');" style="
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            " onmouseover="this.style.background='rgba(255, 255, 255, 1)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.15)'" 
            onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)'">
                <span style="font-size: 14px;">📥</span>
                <span style="font-size: 11px; color: rgba(0, 0, 0, 0.5);">скачать фото</span>
            </div>
        </div>
    `;
    
    // Высокие грядки (38 см)
    html += `
        <div class="bed-type-card" onclick="selectBedType(38)" style="position: relative;">
            <div class="bed-type-image-container">
                <img src="image/19.png" alt="Высокие грядки" class="bed-type-image">
            </div>
            <div class="bed-type-info">
                <h4 class="bed-type-name">Высокие грядки</h4>
                <p class="bed-type-description">Высота 38 см</p>
            </div>
            <div onclick="event.stopPropagation(); downloadBedImage('image/19.png', 'Высокие_грядки_38см.png');" style="
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            " onmouseover="this.style.background='rgba(255, 255, 255, 1)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.15)'" 
            onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)'">
                <span style="font-size: 14px;">📥</span>
                <span style="font-size: 11px; color: rgba(0, 0, 0, 0.5);">скачать фото</span>
            </div>
        </div>
    `;
    
    html += '</div>';
    html += '</div>';
    
    // Добавляем секцию с фото компонентов и видео сборки
    const gryadkiData = getProductData('gryadki');
    if (gryadkiData) {
        html += '<div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e1e8ed;">';
        html += '<h3 style="font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; text-align: center;">📸 Компоненты грядок</h3>';
        
        // Компоненты
        if (gryadkiData.components) {
            // Перемычка
            if (gryadkiData.components.peremychka && gryadkiData.components.peremychka.photos.length > 0) {
                html += `<div style="margin-bottom: 16px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px; color: #2c3e50;">${gryadkiData.components.peremychka.name}</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">`;
                gryadkiData.components.peremychka.photos.forEach((photo, index) => {
                    const filename = `Перемычка_${index + 1}.jpg`;
                    html += `<div style="position: relative; display: inline-block;">
                        <img src="${photo}" alt="${gryadkiData.components.peremychka.name}" 
                            style="width: 110px; height: 110px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #e1e8ed;"
                            onclick="openImageModal('${photo}')"
                            onmouseover="this.style.borderColor='#48bb78'"
                            onmouseout="this.style.borderColor='#e1e8ed'">
                        <button onclick="event.stopPropagation(); downloadBedImage('${photo}', '${filename}');" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(0, 0, 0, 0.3);
                            border: none;
                            border-radius: 4px;
                            padding: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                            transition: all 0.2s;
                            color: white;
                        " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                            <span>📥</span>
                        </button>
                    </div>`;
                });
                html += '</div></div>';
            }
            
            // Уголки
            if (gryadkiData.components.ugolki && gryadkiData.components.ugolki.photos.length > 0) {
                html += `<div style="margin-bottom: 16px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px; color: #2c3e50;">${gryadkiData.components.ugolki.name}</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">`;
                gryadkiData.components.ugolki.photos.forEach((photo, index) => {
                    const filename = `Соединительные_уголки_${index + 1}.jpg`;
                    html += `<div style="position: relative; display: inline-block;">
                        <img src="${photo}" alt="${gryadkiData.components.ugolki.name}" 
                            style="width: 110px; height: 110px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #e1e8ed;"
                            onclick="openImageModal('${photo}')"
                            onmouseover="this.style.borderColor='#48bb78'"
                            onmouseout="this.style.borderColor='#e1e8ed'">
                        <button onclick="event.stopPropagation(); downloadBedImage('${photo}', '${filename}');" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(0, 0, 0, 0.3);
                            border: none;
                            border-radius: 4px;
                            padding: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                            transition: all 0.2s;
                            color: white;
                        " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                            <span>📥</span>
                        </button>
                    </div>`;
                });
                html += '</div></div>';
            }
            
            // Стенка
            if (gryadkiData.components.stenka && gryadkiData.components.stenka.photos.length > 0) {
                html += `<div style="margin-bottom: 16px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px; color: #2c3e50;">${gryadkiData.components.stenka.name}</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">`;
                gryadkiData.components.stenka.photos.forEach((photo, index) => {
                    const filename = `Стенка_грядки_${index + 1}.jpg`;
                    html += `<div style="position: relative; display: inline-block;">
                        <img src="${photo}" alt="${gryadkiData.components.stenka.name}" 
                            style="width: 110px; height: 110px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #e1e8ed;"
                            onclick="openImageModal('${photo}')"
                            onmouseover="this.style.borderColor='#48bb78'"
                            onmouseout="this.style.borderColor='#e1e8ed'">
                        <button onclick="event.stopPropagation(); downloadBedImage('${photo}', '${filename}');" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(0, 0, 0, 0.3);
                            border: none;
                            border-radius: 4px;
                            padding: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                            transition: all 0.2s;
                            color: white;
                        " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                            <span>📥</span>
                        </button>
                    </div>`;
                });
                html += '</div></div>';
            }
        }
        
        // Видео сборки
        if (gryadkiData.video && gryadkiData.video.assembly) {
            html += `<div style="text-align: center; margin-top: 15px; padding: 15px; background: #f7fafc; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="font-size: 16px; font-weight: 600; color: #2c3e50; margin: 0;">🎥 ${gryadkiData.video.assembly.name}</h4>
                    <button onclick="downloadVideo('${gryadkiData.video.assembly.path}', '${gryadkiData.video.assembly.name.replace(/\s+/g, '_')}.mp4');" style="
                        background: rgba(0, 0, 0, 0.3);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                        <span>📥</span>
                    </button>
                </div>
                <video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <source src="${gryadkiData.video.assembly.path}" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>
            </div>`;
        }
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// Функция получения размеров теплицы
function getGreenhouseDimensions() {
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    
    if (!widthInput || !widthInput.value || !lengthInput || !lengthInput.value) {
        return null;
    }
    
    return {
        width: parseFloat(widthInput.value),
        length: parseInt(lengthInput.value)
    };
}

// Функция расчета рекомендуемых грядок
function getRecommendedBeds(height) {
    const dimensions = getGreenhouseDimensions();
    if (!dimensions) return null;
    
    const { width, length } = dimensions;
    
    // Для теплиц шириной 4 м:
    if (width === 4) {
        // Если длина 4 м: только 2 боковые грядки по 1 м шириной, длина 4 м
        if (length === 4) {
            const sideBed = BEDS_DATA.find(b => 
                b.height === height && 
                b.width === 1 && 
                b.length === 4
            );
            
            if (!sideBed) return null;
            
            return {
                center: null, // Нет центральной грядки для 4×4 м
                sides: { bed: sideBed, quantity: 2 }
            };
        }
        
        // Если длина 6 м и больше: 3 грядки по 1 м шириной
        // - 2 боковые: длина = длина теплицы (максимум 12 м)
        // - 1 центральная: длина = длина теплицы - 2 м (минимум 4 м, максимум 12 м)
        const centerBedLength = Math.max(4, length - 2); // Минимум 4 м, иначе длина - 2 м
        const centerBedLengthFinal = Math.min(centerBedLength, 12); // Максимум 12 м
        
        const sideBedLength = Math.min(length, 12); // Максимум 12 м
        
        // Находим центральную грядку (ширина 1 м)
    const centerBed = BEDS_DATA.find(b => 
        b.height === height && 
            b.width === 1 && 
            b.length === centerBedLengthFinal
        );
        
        // Находим боковые грядки (ширина 1 м)
        const sideBed = BEDS_DATA.find(b => 
            b.height === height && 
            b.width === 1 && 
            b.length === sideBedLength
        );
        
        if (!centerBed || !sideBed) return null;
        
        // Проверка проходов: центральная (1 м) + боковые (1 м × 2 = 2 м) = 3 м
        // Остается на проходы: 4 м - 3 м = 1 м
        // Должно быть минимум 0.2 м × 2 = 0.4 м на оба прохода
        const totalBedsWidth = 1 + (1 * 2); // 3 м
        const availableForPassages = width - totalBedsWidth; // 1 м
        const minPassageWidth = 0.2; // 20 см
        const minTotalPassages = minPassageWidth * 2; // 40 см на оба прохода
        
        if (availableForPassages >= minTotalPassages) {
            return {
                center: { bed: centerBed, quantity: 1 },
                sides: { bed: sideBed, quantity: 2 }
            };
        }
        
        // Если не хватает места (не должно быть для 4 м, но на всякий случай)
        return null;
    }
    
    // Для теплиц шириной 3.5 м (длина >= 6 м): 2 боковые по 1 м, центральная 0.8 м
    if (width === 3.5 && length >= 6) {
        const centerBedLength = Math.max(4, length - 2);
        const centerBedLengthFinal = Math.min(centerBedLength, 12);
        const sideBedLength = Math.min(length, 12);
        
        // Находим центральную грядку (ширина 0.8 м)
        const centerBed = BEDS_DATA.find(b => 
            b.height === height && 
            b.width === 0.8 && 
            b.length === centerBedLengthFinal
        );
        
        // Находим боковые грядки (ширина 1 м)
        const sideBed = BEDS_DATA.find(b => 
            b.height === height && 
            b.width === 1 && 
            b.length === sideBedLength
        );
        
        if (!centerBed || !sideBed) return null;
        
        // Проверка проходов: центральная (0.8 м) + боковые (1 м × 2 = 2 м) = 2.8 м
        // Остается на проходы: 3.5 м - 2.8 м = 0.7 м
        // Должно быть минимум 0.2 м × 2 = 0.4 м на оба прохода
        const totalBedsWidth = 0.8 + (1 * 2); // 2.8 м
        const availableForPassages = width - totalBedsWidth; // 0.7 м
        const minPassageWidth = 0.2; // 20 см
        const minTotalPassages = minPassageWidth * 2; // 40 см на оба прохода
        
        if (availableForPassages >= minTotalPassages) {
            return {
                center: { bed: centerBed, quantity: 1 },
                sides: { bed: sideBed, quantity: 2 }
            };
        }
        
        return null;
    }
    
    // Для теплиц шириной 2.5 м: прежняя логика (0.5 м центральная, 0.8 м боковые)
    // Для теплиц шириной 3 м: также прежняя логика
    // Для теплиц длиной 4 м: только 2 боковые грядки по 0.8 м (или 1 м для 4 м ширины)
    if (length === 4 && width !== 4) {
        // Для не-4м теплиц длиной 4 м: 2 боковые по 0.8 м
        const sideBed = BEDS_DATA.find(b => 
            b.height === height && 
            b.width === 0.8 && 
        b.length === 4
    );
    
        if (!sideBed) return null;
        
        return {
            center: null, // Нет центральной грядки для 4 м длины
            sides: { bed: sideBed, quantity: 2 }
        };
    }
    
    // Для теплиц длиной 6 м и больше (ширина 2.5 м, 3 м):
    // - Центральная грядка: длина = длина теплицы - 2 м (чтобы можно было ходить вокруг)
    // - Боковые грядки: длина = длина теплицы (во всю длину)
    // - Ширина центральной: 0.5 м
    // - Ширина боковых: 0.8 м
    // - Проверка: должно оставаться минимум 20 см на проход между грядками
    
    const centerBedLength = Math.max(4, length - 2); // Минимум 4 м, иначе длина - 2 м
    const centerBedLengthFinal = Math.min(centerBedLength, 12); // Максимум 12 м
    
    const sideBedLength = Math.min(length, 12); // Максимум 12 м
    
    // Находим центральную грядку
    const centerBed = BEDS_DATA.find(b => 
        b.height === height && 
        b.width === 0.5 && 
        b.length === centerBedLengthFinal
    );
    
    // Находим боковые грядки
    const sideBed = BEDS_DATA.find(b => 
        b.height === height && 
        b.width === 0.8 && 
        b.length === sideBedLength
    );
    
    if (!centerBed || !sideBed) return null;
    
    // Проверка проходов: центральная (0.5 м) + боковые (0.8 м × 2 = 1.6 м) = 2.1 м
    // Остается на проходы: ширина теплицы - 2.1 м
    // Должно быть минимум 0.2 м × 2 = 0.4 м на оба прохода
    const totalBedsWidth = 0.5 + (0.8 * 2); // 2.1 м
    const availableForPassages = width - totalBedsWidth;
    const minPassageWidth = 0.2; // 20 см
    const minTotalPassages = minPassageWidth * 2; // 40 см на оба прохода
    
    if (availableForPassages < minTotalPassages) {
        // Если не хватает места, пытаемся уменьшить ширину боковых грядок
        // Пробуем 0.65 м вместо 0.8 м
        const sideBedNarrow = BEDS_DATA.find(b => 
            b.height === height && 
            b.width === 0.65 && 
            b.length === sideBedLength
        );
        
        if (sideBedNarrow) {
            const totalBedsWidthNarrow = 0.5 + (0.65 * 2); // 1.8 м
            const availableForPassagesNarrow = width - totalBedsWidthNarrow;
            
            if (availableForPassagesNarrow >= minTotalPassages) {
                return {
                    center: { bed: centerBed, quantity: 1 },
                    sides: { bed: sideBedNarrow, quantity: 2 }
                };
            }
        }
        
        // Если все равно не хватает, возвращаем null (рекомендация не показывается)
        return null;
    }
    
    return {
        center: { bed: centerBed, quantity: 1 },
        sides: { bed: sideBed, quantity: 2 }
    };
}

// Функция выбора типа грядок
function selectBedType(height) {
    selectedBedType = height;
    renderBedsSelection();
}

// Функция возврата к выбору типа
function backToBedTypeSelection() {
    selectedBedType = null;
    renderBedsSelection();
}

// Функция рендеринга выбора характеристик грядок
function renderBedCharacteristics(container) {
    const dimensions = getGreenhouseDimensions();
    if (!dimensions) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Выберите размеры теплицы</div>';
        return;
    }
    
    const { length } = dimensions;
    
    // Фильтруем грядки по выбранному типу и длине (не длиннее теплицы)
    const filteredBeds = BEDS_DATA.filter(bed => 
        bed.height === selectedBedType && 
        bed.length <= length
    );
    
    // Получаем рекомендуемый вариант
    const recommended = getRecommendedBeds(selectedBedType);
    
    let html = '<div class="beds-list">';
    
    // Кнопка "Назад" и корзинка для сброса
    html += `<div class="bed-back-button-container">`;
    html += `<button class="bed-back-button" onclick="backToBedTypeSelection()">← Назад к выбору типа</button>`;
    const totalBedsSelected = Object.values(selectedBeds).reduce((sum, qty) => sum + (qty || 0), 0);
    if (totalBedsSelected > 0) {
        html += `<button class="bed-clear-button" id="bed-clear-button" onclick="clearAllBeds()" title="Сбросить все выбранные грядки">🗑️</button>`;
    }
    html += `</div>`;
    
    // Показываем рекомендуемый вариант
    if (recommended) {
        const sideBed = recommended.sides.bed;
        let centerCost = 0;
        if (recommended.center && recommended.center.bed) {
            centerCost = recommended.center.bed.price * recommended.center.quantity;
        }
        const sideCost = sideBed.price * recommended.sides.quantity;
        const totalBedsCost = centerCost + sideCost;
        
        // Получаем цену сборки для всех грядок (с учетом их длин)
        let assemblyPrice = 0;
        if (recommended.center && recommended.center.bed) {
            const centerAssemblyPrice = BEDS_ASSEMBLY_PRICES[recommended.center.bed.length] || 0;
            assemblyPrice += centerAssemblyPrice * recommended.center.quantity;
        }
        if (recommended.sides && recommended.sides.bed) {
            const sideAssemblyPrice = BEDS_ASSEMBLY_PRICES[recommended.sides.bed.length] || 0;
            assemblyPrice += sideAssemblyPrice * recommended.sides.quantity;
        }
        
        // Итоговая стоимость со сборкой
        const totalWithAssembly = totalBedsCost + assemblyPrice;
        
        // Правильное склонение слова "грядка"
        const getBedWord = (quantity) => {
            if (quantity === 1) return 'грядка';
            if (quantity >= 2 && quantity <= 4) return 'грядки';
            return 'грядок';
        };
        
        html += `<div class="bed-recommended-card">`;
        html += `<div class="bed-recommended-header">`;
        html += `<span class="bed-recommended-icon">⭐</span>`;
        html += `<span class="bed-recommended-title">Рекомендуемый вариант</span>`;
        html += `</div>`;
        html += `<div class="bed-recommended-content">`;
        if (recommended.center && recommended.center.bed) {
            const centerBedWord = getBedWord(recommended.center.quantity);
            const centerBedInfo = `${recommended.center.quantity} ${centerBedWord} по центру ${recommended.center.bed.length} м: ширина ${recommended.center.bed.width} м, высота ${recommended.center.bed.height} см - ${formatPrice(centerCost)} руб.`;
            html += `<div class="bed-recommended-item">${centerBedInfo}</div>`;
        }
        const sideBedWord = getBedWord(recommended.sides.quantity);
        const sideBedInfo = `${recommended.sides.quantity} ${sideBedWord} по бокам ${recommended.sides.bed.length} м: ширина ${recommended.sides.bed.width} м, высота ${recommended.sides.bed.height} см - ${formatPrice(sideCost)} руб.`;
        html += `<div class="bed-recommended-item">${sideBedInfo}</div>`;
        html += `</div>`;
        
        // Предупреждение для спорных размеров (если проходы минимальные)
        const dimensions = getGreenhouseDimensions();
        if (dimensions && recommended.center && recommended.center.bed) {
            const totalBedsWidth = recommended.center.bed.width + (recommended.sides.bed.width * 2);
            const availableForPassages = dimensions.width - totalBedsWidth;
            const passageWidth = availableForPassages / 2;
            if (passageWidth <= 0.25) { // Если проход меньше или равен 25 см
                html += `<div class="bed-recommended-warning">⚠️ Внимание: проходы между грядками будут узкими (${(passageWidth * 100).toFixed(0)} см). Рекомендуем теплицу шире ${(totalBedsWidth + 0.5).toFixed(1)} м для комфортных проходов.</div>`;
            }
        }
        html += `<div class="bed-recommended-actions">`;
        html += `<button class="bed-recommended-btn bed-recommended-btn-secondary" onclick="applyRecommendedBeds(false)">Без сборки: ${formatPrice(totalBedsCost)} руб.</button>`;
        html += `<button class="bed-recommended-btn bed-recommended-btn-primary" onclick="applyRecommendedBeds(true)">Со сборкой: ${formatPrice(totalWithAssembly)} руб.</button>`;
        html += `</div>`;
        html += `</div>`;
    }
    
    // Группируем по ширине
    const groupedBeds = {};
    filteredBeds.forEach(bed => {
        const key = `${bed.width} м`;
        if (!groupedBeds[key]) {
            groupedBeds[key] = [];
        }
        groupedBeds[key].push(bed);
    });
    
    // Сортируем группы по ширине
    const sortedGroups = Object.keys(groupedBeds).sort((a, b) => {
        const aWidth = parseFloat(a);
        const bWidth = parseFloat(b);
        return aWidth - bWidth;
    });
    
    sortedGroups.forEach(groupKey => {
        const beds = groupedBeds[groupKey];
        const width = beds[0].width;
        const height = beds[0].height;
        const groupTitle = `Ширина ${width} м, высота ${height} см`;
        const imagePath = height === 19 ? 'image/18.png' : 'image/19.png';
        
        html += `<div class="bed-group">`;
        html += `<div class="bed-group-header">`;
        html += `<h3 class="bed-group-title">${groupTitle}</h3>`;
        html += `<img src="${imagePath}" alt="${height === 19 ? 'Низкие грядки' : 'Высокие грядки'}" class="bed-group-image">`;
        html += `</div>`;
        
        beds.forEach(bed => {
            const quantity = selectedBeds[bed.id] || 0;
            const priceDisplay = bed.price > 0 ? `${formatPrice(bed.price)} руб.` : 'Цена не указана';
            html += `
                <div class="bed-item">
                    <div class="bed-info">
                        <h4 class="bed-name">${bed.length} м</h4>
                        <div class="bed-price ${bed.price === 0 ? 'bed-price-empty' : ''}">${priceDisplay}</div>
                    </div>
                    <div class="bed-controls">
                        <button class="bed-btn-minus" onclick="changeBedQuantity('${bed.id}', -1)">−</button>
                        <input type="number" class="bed-quantity-input" id="bed-qty-${bed.id}" value="${quantity}" min="0" max="10" readonly>
                        <button class="bed-btn-plus" onclick="changeBedQuantity('${bed.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Обновляем счетчик на кнопке
    updateBedsCounter();
}

// Функция изменения количества грядок
function changeBedQuantity(bedId, delta) {
    const currentQty = selectedBeds[bedId] || 0;
    const newQty = Math.max(0, Math.min(10, currentQty + delta));
    selectedBeds[bedId] = newQty;
    
    // Обновляем отображение
    const input = document.getElementById(`bed-qty-${bedId}`);
    if (input) {
        input.value = newQty;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('selectedBeds', JSON.stringify(selectedBeds));
    
    // Обновляем счетчик
    updateBedsCounter();
    
    // Обновляем корзинку (показываем/скрываем в зависимости от выбранных грядок)
    updateBedsClearButton();
}

// Функция обновления видимости кнопки корзинки
function updateBedsClearButton() {
    const clearButton = document.getElementById('bed-clear-button');
    const container = document.querySelector('.bed-back-button-container');
    
    if (!container) return;
    
    const totalBedsSelected = Object.values(selectedBeds).reduce((sum, qty) => sum + (qty || 0), 0);
    
    if (totalBedsSelected > 0) {
        // Если корзинки нет, добавляем её
        if (!clearButton) {
            const button = document.createElement('button');
            button.className = 'bed-clear-button';
            button.id = 'bed-clear-button';
            button.onclick = clearAllBeds;
            button.title = 'Сбросить все выбранные грядки';
            button.textContent = '🗑️';
            container.appendChild(button);
        }
    } else {
        // Если корзинка есть, но грядок нет - удаляем её
        if (clearButton) {
            clearButton.remove();
        }
    }
}

// Функция обновления счетчика на кнопке
function updateBedsCounter() {
    const badge = document.getElementById('beds-count-badge');
    if (!badge) return;
    
    const totalBeds = Object.values(selectedBeds).reduce((sum, qty) => sum + qty, 0);
    if (totalBeds > 0) {
        badge.textContent = totalBeds;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// Функция обновления цены сборки грядок в модальном окне
function updateBedsAssemblyPrice() {
    const priceElement = document.getElementById('beds-assembly-price');
    if (!priceElement) return;
    
    const lengthInput = document.getElementById('length');
    if (!lengthInput || !lengthInput.value) {
        priceElement.textContent = 'Укажите длину теплицы для расчета стоимости сборки';
        return;
    }
    
    const length = parseInt(lengthInput.value);
    // Подсчитываем стоимость сборки для всех выбранных грядок
    const selectedBeds = JSON.parse(localStorage.getItem('selectedBeds') || '{}');
    const totalAssemblyCost = calculateBedsAssemblyCost(selectedBeds);
    const totalBedsQuantity = Object.values(selectedBeds).reduce((sum, qty) => sum + (qty || 0), 0);
    
    if (totalBedsQuantity === 0) {
        // Если грядки не выбраны, не показываем цену
        priceElement.textContent = 'Выберите грядки для расчета стоимости сборки';
        return;
    } else if (totalBedsQuantity === 1) {
        priceElement.textContent = `Стоимость сборки за 1 грядку: ${formatPrice(totalAssemblyCost)} рублей`;
    } else {
        priceElement.textContent = `Стоимость сборки за все грядки: ${formatPrice(totalAssemblyCost)} рублей`;
    }
}

// Функция применения выбора грядок
// Функция показа вопроса про сборку грядок в стиле toast
function showBedsAssemblyQuestion(assemblyCost, callback) {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Fallback на confirm, если toast контейнер не найден
        const message = assemblyCost > 0 
            ? `Грядки выбраны. Нужна ли сборка грядок за ${formatPrice(assemblyCost)} рублей?`
            : 'Грядки выбраны. Нужна ли сборка грядок?';
        const result = confirm(message);
        if (callback) callback(result);
        return;
    }
    
    // Создаем модальное overlay для вопроса
    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    // Формируем текст вопроса с стоимостью
    const questionText = assemblyCost > 0 
        ? `Нужна ли сборка грядок за ${formatPrice(assemblyCost)} рублей?`
        : 'Нужна ли сборка грядок?';
    
    // Создаем toast-подобное окно с вопросом
    const questionToast = document.createElement('div');
    questionToast.className = 'toast toast-info';
    questionToast.style.cssText = `
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10002;
    `;
    
    questionToast.innerHTML = `
        <div class="toast-icon" style="font-size: 24px; margin-bottom: 12px;">❓</div>
        <div class="toast-content">
            <div class="toast-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Грядки выбраны</div>
            <div class="toast-message" style="font-size: 16px; margin-bottom: 20px;">${questionText}</div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="toast-btn-cancel" style="
                    padding: 10px 20px;
                    border: 2px solid #e1e8ed;
                    border-radius: 8px;
                    background: #f8f9fa;
                    color: #5a6c7d;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Нет</button>
                <button class="toast-btn-ok" style="
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
                    color: #fff;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Да</button>
            </div>
        </div>
    `;
    
    // Обработчики кнопок
    const btnCancel = questionToast.querySelector('.toast-btn-cancel');
    const btnOk = questionToast.querySelector('.toast-btn-ok');
    
    const closeQuestion = (result) => {
        overlay.remove();
        if (callback) callback(result);
    };
    
    btnCancel.addEventListener('click', () => closeQuestion(false));
    btnOk.addEventListener('click', () => closeQuestion(true));
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeQuestion(false);
        }
    });
    
    overlay.appendChild(questionToast);
    document.body.appendChild(overlay);
}

function applyBedsSelection() {
    // Сохраняем выбранные грядки в localStorage
    localStorage.setItem('selectedBeds', JSON.stringify(selectedBeds));
    
    // Сохраняем состояние чекбокса сборки
    const assemblyCheckbox = document.getElementById('beds-assembly-checkbox');
    const hasSelectedBeds = Object.keys(selectedBeds).length > 0 && 
                            Object.values(selectedBeds).some(qty => qty > 0);
    
    // Сначала закрываем модальное окно с грядками
    closeBedsModal();
    
    if (assemblyCheckbox) {
        bedsAssemblyEnabled = assemblyCheckbox.checked;
        localStorage.setItem('bedsAssemblyEnabled', bedsAssemblyEnabled ? 'true' : 'false');
        
        // Если грядки выбраны, но сборка не выбрана - спрашиваем
        if (hasSelectedBeds && !bedsAssemblyEnabled) {
            // Рассчитываем стоимость сборки для показа в вопросе
            const assemblyCost = calculateBedsAssemblyCost(selectedBeds);
            
            // Показываем вопрос после небольшой задержки, чтобы модальное окно успело закрыться
            setTimeout(() => {
                showBedsAssemblyQuestion(assemblyCost, (userWantsAssembly) => {
                    if (userWantsAssembly) {
                        bedsAssemblyEnabled = true;
                        assemblyCheckbox.checked = true;
                        localStorage.setItem('bedsAssemblyEnabled', 'true');
                        showSuccess('Сборка грядок включена');
                    }
                    
                    // Пересчитываем стоимость
                    if (typeof calculateGreenhouseCost === 'function') {
                        calculateGreenhouseCost();
                    }
                });
            }, 300); // Небольшая задержка для плавного закрытия модального окна
            return;
        }
    }
    
    // Пересчитываем стоимость
    if (typeof calculateGreenhouseCost === 'function') {
        calculateGreenhouseCost();
    }
}

// Делаем функции доступными глобально
window.showFAQModal = showFAQModal;
window.closeFAQModal = closeFAQModal;
window.toggleFAQ = toggleFAQ;
window.copyFAQAnswer = copyFAQAnswer;
window.filterFAQ = filterFAQ;
window.filterFAQByCategory = filterFAQByCategory;
window.splitForAvito = splitForAvito;
window.copyCommercialOffer = copyCommercialOffer;
window.copyKP1 = copyKP1;
window.copyKP2 = copyKP2;
window.showBedsModal = showBedsModal;
window.closeBedsModal = closeBedsModal;
window.changeBedQuantity = changeBedQuantity;
// Функция применения рекомендуемого варианта
function applyRecommendedBeds(withAssembly = false) {
    const recommended = getRecommendedBeds(selectedBedType);
    if (!recommended) return;

    // Очищаем предыдущий выбор грядок этого типа
    Object.keys(selectedBeds).forEach(bedId => {
        const bed = BEDS_DATA.find(b => b.id === bedId);
        if (bed && bed.height === selectedBedType) {
            delete selectedBeds[bedId];
        }
    });

    // Устанавливаем рекомендуемые грядки
    // Для теплиц 4м центральная грядка может быть null
    if (recommended.center && recommended.center.bed) {
        selectedBeds[recommended.center.bed.id] = recommended.center.quantity;
    }
    if (recommended.sides && recommended.sides.bed) {
        selectedBeds[recommended.sides.bed.id] = recommended.sides.quantity;
    }

    // Сохраняем выбранные грядки в localStorage
    localStorage.setItem('selectedBeds', JSON.stringify(selectedBeds || {}));

    // Устанавливаем состояние сборки
    bedsAssemblyEnabled = !!withAssembly;
    localStorage.setItem('bedsAssemblyEnabled', bedsAssemblyEnabled ? 'true' : 'false');

    // Обновляем чекбокс сборки в модальном окне (если он есть)
    const bedsAssemblyCheckbox = document.getElementById('beds-assembly-checkbox');
    if (bedsAssemblyCheckbox) {
        bedsAssemblyCheckbox.checked = bedsAssemblyEnabled;
        updateBedsAssemblyPrice();
    }

    // Обновляем счетчик выбранных грядок
    updateBedsCounter();

    // Закрываем модальное окно
    closeBedsModal();

    // Автоматически пересчитываем стоимость теплицы
    if (typeof calculateGreenhouseCost === 'function') {
        calculateGreenhouseCost();
    }

    // Показываем уведомление
    showSuccess(withAssembly ? 'Рекомендуемые грядки добавлены со сборкой' : 'Рекомендуемые грядки добавлены без сборки');
}

// Функция сброса всех выбранных грядок
function clearAllBeds() {
    // Очищаем все выбранные грядки
    selectedBeds = {};
    
    // Сбрасываем состояние сборки
    bedsAssemblyEnabled = false;
    
    // Сохраняем в localStorage
    localStorage.setItem('selectedBeds', JSON.stringify({}));
    localStorage.setItem('bedsAssemblyEnabled', 'false');
    
    // Обновляем счетчик
    updateBedsCounter();
    
    // Обновляем корзинку
    updateBedsClearButton();
    
    // Обновляем чекбокс сборки в модальном окне
    const bedsAssemblyCheckbox = document.getElementById('beds-assembly-checkbox');
    if (bedsAssemblyCheckbox) {
        bedsAssemblyCheckbox.checked = false;
        updateBedsAssemblyPrice();
    }
    
    // Перерисовываем список грядок
    renderBedsSelection();
    
    // Показываем уведомление
    showSuccess('Все грядки удалены из корзины', 'Грядки удалены');
}

// Функция скачивания одной фотографии грядки
function downloadBedImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Фотография скачивается...', 'Скачивание');
}

function downloadVideo(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Видео скачивается...', 'Скачивание');
}

/**
 * Копировать изображение в буфер обмена
 * Поддерживает: Chrome/Edge (Windows, macOS, Android), Safari (macOS, iOS 13.4+), Firefox (Windows, macOS, Android)
 * @param {string} imageUrl - URL изображения
 * @param {HTMLElement} button - Кнопка для обратной связи
 */
async function copyImageToClipboard(imageUrl, button) {
    try {
        // Проверяем базовую поддержку Clipboard API
        if (!navigator.clipboard) {
            showWarning('Ваш браузер не поддерживает копирование изображений. Используйте правый клик → "Копировать изображение"', 'Копирование');
            return;
        }
        
        // Проверяем поддержку ClipboardItem (нужно для изображений)
        if (!window.ClipboardItem) {
            // Fallback для старых браузеров
            showWarning('Ваш браузер не поддерживает копирование изображений. Используйте правый клик → "Копировать изображение"', 'Копирование');
            return;
        }
        
        // Загружаем изображение через fetch для получения Blob
        let response;
        let blobUrl = null; // Для освобождения памяти
        try {
            response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Не удалось загрузить изображение');
            }
        } catch (fetchError) {
            // Если fetch не сработал (CORS), используем прямой URL
            response = null;
        }
        
        // Конвертируем изображение в PNG для максимальной совместимости
        // PNG поддерживается лучше, чем JPEG на разных платформах
        const img = new Image();
        
        // Если fetch сработал, используем blob URL для избежания CORS
        if (response) {
            const blob = await response.blob();
            blobUrl = URL.createObjectURL(blob);
            img.src = blobUrl;
        } else {
            // Если fetch не сработал, используем прямой URL
            img.src = imageUrl;
        }
        
        // Ждем загрузки изображения
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
        });
        
        // Создаем canvas для конвертации
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Canvas не поддерживается');
        }
        
        // Устанавливаем размеры canvas (ограничиваем максимальный размер для производительности)
        const maxDimension = 4096; // Максимальный размер для совместимости
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        
        if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение на canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Освобождаем blob URL, если использовали
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
        
        // Конвертируем в PNG Blob
        const pngBlob = await new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Не удалось конвертировать изображение'));
                }
            }, 'image/png', 0.95); // Качество 0.95 для баланса размера и качества
        });
        
        // Пробуем скопировать PNG (наиболее совместимый формат)
        try {
            const clipboardItem = new ClipboardItem({
                'image/png': pngBlob
            });
            await navigator.clipboard.write([clipboardItem]);
            
            // Успех!
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Скопировано';
            button.style.background = 'rgba(46, 204, 113, 0.8)';
            showSuccess('Изображение скопировано в буфер обмена!', 'Копирование');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'rgba(0, 0, 0, 0.5)';
            }, 2000);
            
            return;
        } catch (pngError) {
            // Если PNG не сработал, пробуем оригинальный формат
            console.log('PNG не сработал, пробуем оригинальный формат:', pngError);
            
            // Получаем оригинальный Blob
            let originalBlob;
            if (response) {
                originalBlob = await response.blob();
            } else {
                // Если использовали Image, конвертируем canvas обратно в оригинальный формат
                // Но лучше использовать PNG, который мы уже создали
                throw pngError; // Если PNG не сработал, оригинальный тоже не сработает
            }
            let mimeType = originalBlob.type || 'image/png';
            
            // Нормализуем MIME-тип
            if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
                mimeType = 'image/jpeg';
            } else if (mimeType !== 'image/png' && mimeType !== 'image/gif' && mimeType !== 'image/webp') {
                mimeType = 'image/png'; // Используем PNG как fallback
            }
            
            try {
                const clipboardItem = new ClipboardItem({
                    [mimeType]: originalBlob
                });
                await navigator.clipboard.write([clipboardItem]);
                
                // Успех!
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Скопировано';
                button.style.background = 'rgba(46, 204, 113, 0.8)';
                showSuccess('Изображение скопировано в буфер обмена!', 'Копирование');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'rgba(0, 0, 0, 0.5)';
                }, 2000);
                
                return;
            } catch (originalError) {
                throw new Error('Не удалось скопировать ни PNG, ни оригинальный формат');
            }
        }
        
    } catch (error) {
        console.error('Ошибка при копировании изображения:', error);
        
        // Определяем тип ошибки для более понятного сообщения
        let errorMessage = 'Не удалось скопировать изображение. ';
        
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
            errorMessage += 'Проблема с доступом к изображению. ';
        } else if (error.message.includes('permission') || error.name === 'NotAllowedError') {
            errorMessage += 'Нет разрешения на доступ к буферу обмена. ';
        }
        
        errorMessage += 'Используйте правый клик → "Копировать изображение" или кнопку "Скачать"';
        
        showWarning(errorMessage, 'Копирование');
        
        // Сбрасываем кнопку
        const originalText = button.innerHTML;
        button.innerHTML = '❌ Ошибка';
        button.style.background = 'rgba(231, 76, 60, 0.8)';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'rgba(0, 0, 0, 0.5)';
        }, 2000);
    }
}

window.applyBedsSelection = applyBedsSelection;
window.selectBedType = selectBedType;
window.backToBedTypeSelection = backToBedTypeSelection;
window.applyRecommendedBeds = applyRecommendedBeds;
window.clearAllBeds = clearAllBeds;
window.updateBedsClearButton = updateBedsClearButton;
window.downloadBedImage = downloadBedImage;
window.downloadVideo = downloadVideo;

// Функция показа информации о товаре из раздела "Дополнительные товары"
function showProductInfo(productId) {
    let productData = null;
    let productName = '';
    let photos = [];
    let description = '';
    let video = null;
    
    // Маппинг ID товаров на данные
    switch(productId) {
        case 'drip-irrigation-mech':
            const dripData = getProductData('drip-irrigation');
            if (dripData && dripData.mechanical) {
                productData = dripData.mechanical;
                productName = dripData.mechanical.name || 'Капельный полив механический';
                photos = dripData.mechanical.photos || [];
                description = dripData.mechanical.description || dripData.description || '';
            }
            break;
            
        case 'drip-irrigation-auto':
            const dripAutoData = getProductData('drip-irrigation');
            if (dripAutoData && dripAutoData.automatic) {
                productData = dripAutoData.automatic;
                productName = dripAutoData.automatic.name || 'Капельный полив автоматический';
                photos = dripAutoData.automatic.photos || [];
                description = dripAutoData.automatic.description || dripAutoData.description || '';
            }
            break;
            
        case 'thermodrive':
            const thermodriveData = getProductData('thermodrive');
            if (thermodriveData) {
                productData = thermodriveData;
                productName = thermodriveData.name || 'Автомат для форточки';
                photos = thermodriveData.photos || [];
                description = thermodriveData.description || '';
                // Добавляем предупреждение о том, что автомат устанавливается только на дополнительную форточку
                description = '<div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 15px; margin-bottom: 15px; border-radius: 6px;"><strong style="color: #856404;">⚠️ Внимание:</strong> Автомат для форточки устанавливается только на <strong>дополнительную форточку</strong>. Убедитесь, что у вас есть дополнительная форточка (купленная или подаренная), прежде чем выбирать автомат.</div>' + description;
            }
            break;
            
        case 'doors-windows-window':
            const doorsData = getProductData('doors-windows');
            if (doorsData && doorsData.windows) {
                productData = doorsData.windows;
                productName = 'Дополнительная форточка';
                photos = (doorsData.windows.side?.photos || []).concat(doorsData.windows.end?.photos || []);
                description = doorsData.windows.side?.description || doorsData.windows.end?.description || doorsData.description || '';
            }
            break;
            
        case 'tapes-galvanized':
            const tapesData = getProductData('tapes');
            if (tapesData && tapesData.galvanized) {
                productData = tapesData.galvanized;
                productName = tapesData.galvanized.name || 'Оцинкованная лента 30 м';
                photos = tapesData.galvanized.photos || [];
                description = tapesData.galvanized.description || tapesData.description || '';
            }
            break;
            
        case 'tapes-vapor-permeable':
            const tapesVaporData = getProductData('tapes');
            if (tapesVaporData && tapesVaporData.vaporPermeable) {
                productData = tapesVaporData.vaporPermeable;
                productName = tapesVaporData.vaporPermeable.name || 'Паропропускная лента 25 м';
                photos = tapesVaporData.vaporPermeable.photos || [];
                description = tapesVaporData.vaporPermeable.description || tapesVaporData.description || '';
                video = tapesVaporData.vaporPermeable.video || null;
            }
            break;
    }
    
    if (!productData) {
        showWarning("Информация о товаре пока недоступна", "Информация");
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'product-info-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 20px;
        position: relative;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
    `;
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #e1e8ed; padding-bottom: 12px;">
            <h2 style="margin: 0; font-size: 20px; color: #2c3e50;">${productName}</h2>
            <button onclick="this.closest('.product-info-modal').remove()" style="
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 22px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>
    `;
    
    if (description) {
        // Если описание содержит HTML (например, предупреждение), вставляем как есть, иначе как параграф
        if (description.includes('<div') || description.includes('<strong')) {
            html += description;
        } else {
            html += `<p style="font-size: 15px; color: #4a5568; margin-bottom: 15px; line-height: 1.5;">${description}</p>`;
        }
    }
    
    // Галерея фото
    if (photos && photos.length > 0) {
        // Сохраняем массив фото в глобальную переменную для доступа из onclick
        const photosArrayId = `product_photos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        window[photosArrayId] = photos;
        
        html += `<div style="margin-top: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 12px;">📸 Фото</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">`;
        
        photos.forEach((photo, index) => {
            const filename = `${productName.replace(/\s+/g, '_')}_${index + 1}.jpg`;
            html += `
                <div style="position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid #e1e8ed; transition: all 0.2s;" 
                     onmouseover="this.style.borderColor='#48bb78'; this.style.transform='scale(1.02)'" 
                     onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='scale(1)'"
                     onclick="openImageModalWithGallery(window['${photosArrayId}'], ${index})">
                    <img src="${photo}" alt="${productName} ${index + 1}" 
                         style="width: 100%; height: 180px; object-fit: cover; display: block;">
                    <button onclick="event.stopPropagation(); downloadBedImage('${photo}', '${filename}');" style="
                        position: absolute;
                        top: 6px;
                        right: 6px;
                        background: rgba(0, 0, 0, 0.3);
                        border: none;
                        border-radius: 4px;
                        padding: 4px 6px;
                        cursor: pointer;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                        transition: all 0.2s;
                        color: white;
                    " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                        <span>📥</span>
                    </button>
                </div>
            `;
        });
        
        html += `</div></div>`;
        
        // Очищаем глобальную переменную при закрытии модального окна
        const cleanupHandler = function(e) {
            if (e.target === modal || e.target.closest('button[onclick*="closest"]')) {
                setTimeout(() => {
                    if (window[photosArrayId]) {
                        delete window[photosArrayId];
                    }
                }, 1000);
            }
        };
        modal.addEventListener('click', cleanupHandler);
    }
    
    // Видео (если есть)
    if (video) {
        html += `<div style="text-align: center; margin-top: 20px; padding: 15px; background: #f7fafc; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #2c3e50; margin: 0;">🎥 Видео</h4>
                <button onclick="downloadVideo('${video}', '${productName.replace(/\s+/g, '_')}.mp4');" style="
                    background: rgba(0, 0, 0, 0.3);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    transition: all 0.2s;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                    <span>📥</span>
                </button>
            </div>
            <video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <source src="${video}" type="video/mp4">
                Ваш браузер не поддерживает видео.
            </video>
        </div>`;
    }
    
    modalContent.innerHTML = html;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Закрытие по Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

window.showProductInfo = showProductInfo;

// ==================== ФУНКЦИИ ДЛЯ ПОДАРКОВ ====================

/**
 * Проверяет, занят ли слот подарка из-за выбора "Автоматической форточки" в предыдущих слотах
 * @param {number} giftNumber - Номер подарка (1, 2, 3)
 * @param {Object} selectedGifts - Объект с уже выбранными подарками
 * @returns {boolean} true, если слот занят
 */
function isGiftSlotOccupied(giftNumber, selectedGifts) {
    // Если выбран window-auto в подарке 1, то подарок 2 занят
    if (giftNumber === 2 && selectedGifts['gift-1'] === 'window-auto') {
        return true;
    }
    // Если выбран window-auto в подарке 2, то подарок 3 занят
    if (giftNumber === 3 && selectedGifts['gift-2'] === 'window-auto') {
        return true;
    }
    return false;
}

/**
 * Получает доступные варианты для подарка на основе уже выбранных подарков
 * @param {number} giftNumber - Номер подарка (1, 2, 3)
 * @param {Object} selectedGifts - Объект с уже выбранными подарками
 * @param {boolean} hasAdditionalWindow - Есть ли дополнительная форточка (купленная или в подарке)
 * @param {number} availableGifts - Количество доступных подарков (1, 2 или 3)
 * @returns {Array} Массив вариантов подарков
 */
function getGiftOptions(giftNumber, selectedGifts, hasAdditionalWindow, availableGifts = 3) {
    const options = [];
    
    // Всегда добавляем опцию "Без подарка"
    options.push({ value: '', text: 'Без подарка' });
    
    // Проверяем, выбрана ли форточка в ДРУГИХ подарках (не в текущем)
    const otherGifts = Object.entries(selectedGifts).filter(([key, value]) => key !== `gift-${giftNumber}`);
    const hasWindowInOtherGifts = otherGifts.some(([key, value]) => 
        value === 'window' || value === 'window-auto');
    
    // Проверяем, есть ли форточка (купленная или в любом подарке)
    const hasWindow = hasAdditionalWindow || hasWindowInOtherGifts || 
                     selectedGifts[`gift-${giftNumber}`] === 'window' ||
                     selectedGifts[`gift-${giftNumber}`] === 'window-auto';
    
    if (giftNumber === 1) {
        // Первый подарок: форточка, автоматическая форточка (если доступно 2+ подарка) или 4 грунтозацепа
        options.push({ value: 'window', text: 'Дополнительная форточка' });
        // Если доступно 2+ подарка, предлагаем автоматическую форточку (занимает 2 слота)
        if (availableGifts >= 2) {
            options.push({ value: 'window-auto', text: 'Автоматическая форточка (форточка + автомат)' });
        }
        options.push({ value: 'stakes-4', text: '4 грунтозацепа' });
    } else if (giftNumber === 2) {
        // Второй подарок: капельный полив механический, вторая форточка, автомат (если есть форточка) или 4 грунтозацепа
        options.push({ value: 'drip-mech', text: 'Капельный полив механический' });
        options.push({ value: 'window', text: 'Дополнительная форточка' });
        
        // ИСПРАВЛЕНО: Проверяем, выбран ли автомат в других подарках
        const hasAutomationInOtherGifts = otherGifts.some(([key, value]) => value === 'window-automation' || value === 'window-auto');
        
        // Если есть форточка (купленная или в любом подарке) И автомат еще НЕ выбран - предлагаем автомат
        if (hasWindow && !hasAutomationInOtherGifts) {
            options.push({ value: 'window-automation', text: 'Автомат для форточки' });
        }
        
        // Если доступно 3 подарка и в первом не выбрана window-auto, предлагаем автоматическую форточку
        if (availableGifts >= 3 && selectedGifts['gift-1'] !== 'window-auto') {
            options.push({ value: 'window-auto', text: 'Автоматическая форточка (форточка + автомат)' });
        }
        options.push({ value: 'stakes-4', text: '4 грунтозацепа' });
    } else if (giftNumber === 3) {
        // Третий подарок: автомат для форточки (если есть доп форточка), капельный полив или 4 грунтозацепа
        // ИСПРАВЛЕНО: Проверяем, выбран ли автомат в других подарках
        const hasAutomationInOtherGifts = otherGifts.some(([key, value]) => value === 'window-automation' || value === 'window-auto');
        
        // Если выбран автомат в другом подарке, предлагаем капельный полив
        if (hasAutomationInOtherGifts) {
            options.push({ value: 'drip-mech', text: 'Капельный полив механический' });
        }
        
        // Если есть форточка (купленная или в любом подарке) И автомат еще НЕ выбран - предлагаем автомат
        if (hasWindow && !hasAutomationInOtherGifts) {
            options.push({ value: 'window-automation', text: 'Автомат для форточки' });
        }
        
        options.push({ value: 'stakes-4', text: '4 грунтозацепа' });
    }
    
    return options;
}

/**
 * Обновляет блок подарков на основе итоговой суммы заказа
 * @param {number} totalPrice - Итоговая сумма заказа
 * @param {Object} overrideSelectedGifts - Опционально: переопределить выбранные подарки (для немедленного обновления)
 */
function updateGiftsBlock(totalPrice, overrideSelectedGifts = null) {
    const giftsBlock = document.getElementById('gifts-block');
    const giftsInfo = document.getElementById('gifts-info');
    const giftsSelection = document.getElementById('gifts-selection');
    
    if (!giftsBlock || !giftsInfo || !giftsSelection) {
        return;
    }
    
    // Определяем количество доступных подарков
    let availableGifts = 0;
    let giftTier = '';
    
    if (totalPrice >= 75000) {
        availableGifts = 3;
        giftTier = 'от 75 000 рублей';
    } else if (totalPrice >= 55000) {
        availableGifts = 2;
        giftTier = 'от 55 000 рублей';
    } else if (totalPrice >= 35000) {
        availableGifts = 1;
        giftTier = 'от 35 000 рублей';
    }
    
    // Если подарков нет, скрываем блок
    if (availableGifts === 0) {
        giftsBlock.style.display = 'none';
        return;
    }
    
    // Показываем блок
    giftsBlock.style.display = 'block';
    
    // Обновляем информацию
    giftsInfo.innerHTML = `
        <strong>Вам доступно ${availableGifts} ${availableGifts === 1 ? 'подарок' : availableGifts === 2 ? 'подарка' : 'подарков'}</strong> (${giftTier})
    `;
    
    // ИСПРАВЛЕНО: Упрощены источники данных - используем ТОЛЬКО DOM как источник истины
    // Если передан overrideSelectedGifts, используем его, иначе читаем из DOM
    let finalSelectedGifts = {};
    
    if (overrideSelectedGifts) {
        // Если передан overrideSelectedGifts, используем его
        finalSelectedGifts = { ...overrideSelectedGifts };
    } else {
        // Иначе читаем ТОЛЬКО из DOM (самый надежный источник)
    const existingSelects = document.querySelectorAll('.gift-select');
    existingSelects.forEach(select => {
        const giftItem = select.closest('.gift-item');
        // Сохраняем только видимые элементы с непустыми значениями
        if (giftItem) {
            const computedStyle = window.getComputedStyle(giftItem);
            if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
                if (select.value && select.value.trim() !== '') {
                        finalSelectedGifts[select.id] = select.value;
                }
            }
        }
    });
    
        // Если в DOM ничего не найдено, пробуем localStorage (только для восстановления между сессиями)
        if (Object.keys(finalSelectedGifts).length === 0) {
            const savedGifts = JSON.parse(localStorage.getItem('selectedGifts') || '{}');
            finalSelectedGifts = { ...savedGifts };
        }
    }
    
    // Очищаем подарки, которые больше не доступны (если количество подарков уменьшилось)
    for (let i = availableGifts + 1; i <= 3; i++) {
        delete finalSelectedGifts[`gift-${i}`];
    }
    
    // Также очищаем пустые значения (если пользователь выбрал "Без подарка")
    Object.keys(finalSelectedGifts).forEach(key => {
        if (!finalSelectedGifts[key] || finalSelectedGifts[key].trim() === '') {
            delete finalSelectedGifts[key];
        }
    });
    
    // Проверяем, есть ли дополнительная форточка (купленная или в подарке)
    const additionalWindowQty = parseInt(document.getElementById('additional-window-qty')?.value || '0', 10);
    // Проверяем, выбрана ли форточка в ЛЮБОМ подарке (включая автоматическую форточку)
    const hasWindowInGifts = Object.values(finalSelectedGifts).includes('window') || 
                             Object.values(finalSelectedGifts).includes('window-auto');
    const hasAdditionalWindow = additionalWindowQty > 0 || hasWindowInGifts;
    
    // ВАЖНО: ВСЕГДА полностью пересоздаем блок, чтобы избежать проблем с остатками старых элементов
    // Это гарантирует, что блок всегда соответствует текущему состоянию
    giftsSelection.innerHTML = '';
    
    // Теперь создаем элементы для каждого доступного подарка
    for (let i = 1; i <= availableGifts; i++) {
        // Проверяем, занят ли этот слот из-за выбора "Автоматической форточки" в предыдущем слоте
        if (isGiftSlotOccupied(i, finalSelectedGifts)) {
            continue; // Слот занят - не создаем
        }
        
        const giftItem = document.createElement('div');
        giftItem.className = 'gift-item';
        
        const giftSelect = document.createElement('select');
        giftSelect.id = `gift-${i}`;
        giftSelect.className = 'gift-select';
        
        // Получаем варианты для этого подарка
        const giftOptions = getGiftOptions(i, finalSelectedGifts, hasAdditionalWindow, availableGifts);
        
        // Заполняем select
        giftOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            giftSelect.appendChild(optionElement);
        });
        
        // Восстанавливаем выбранное значение (из finalSelectedGifts)
        if (finalSelectedGifts[`gift-${i}`]) {
            const selectedValue = finalSelectedGifts[`gift-${i}`];
            if (giftSelect.querySelector(`option[value="${selectedValue}"]`)) {
                giftSelect.value = selectedValue;
            }
        }
        
        // Устанавливаем обработчик ПОСЛЕ заполнения опций и восстановления значения
        giftSelect.onchange = () => {
            onGiftChange();
        };
        
        // Создаем структуру
        const giftLabel = document.createElement('div');
        giftLabel.className = 'gift-label';
        
        const giftName = document.createElement('span');
        giftName.className = 'gift-name';
        giftName.textContent = `Подарок ${i}`;
        
        giftLabel.appendChild(giftSelect);
        giftLabel.appendChild(giftName);
        giftItem.appendChild(giftLabel);
        
        giftsSelection.appendChild(giftItem);
    }
    
    // Сохраняем финальные выбранные подарки в localStorage (для восстановления между сессиями)
        localStorage.setItem('selectedGifts', JSON.stringify(finalSelectedGifts));
}

/**
 * ПЕРЕСОБИРАЕТ короткое КП из частей с правильными подарками
 * НОВЫЙ ПОДХОД: вместо удаления/вставки через regex пересобираем КП заново
 * Это надежнее и предотвращает "галлюцинации" при разных комбинациях подарков
 */
function rebuildShortOfferWithGifts(overrideSelectedGifts = null) {
    const shortOfferTextarea = document.getElementById("commercial-offer-short");
    if (!shortOfferTextarea || !shortOfferTextarea.value || shortOfferTextarea.value.trim() === '' || 
        shortOfferTextarea.value.includes("Здесь будет ваше")) {
        return; // Если КП еще не сгенерировано, ничего не делаем
    }
    
    // Читаем текущее КП и разбираем его на части
    let currentOffer = shortOfferTextarea.value;
    
    // ИСПРАВЛЕНО: Удаляем ВСЕ старые блоки подарков перед пересборкой
    // Это устраняет дублирование и "галлюцинации"
    // Удаляем все возможные варианты блока подарков (с любым склонением)
    currentOffer = currentOffer.replace(/\n🎁 Подарок[аи]?[к]?:[\s\S]*?(?=\n+Ближайшая дата доставки|\n+💳|$)/g, '');
    // Также удаляем одиночные строки с 🎁
    currentOffer = currentOffer.replace(/\n🎁[^\n]*\n/g, '');
    // Удаляем множественные пустые строки
    currentOffer = currentOffer.replace(/\n{3,}/g, '\n\n');
    
    // ИСПРАВЛЕНО: Более надежное извлечение частей КП
    // Ищем "Бесплатная заморозка стоимости." - это всегда есть в коротком КП
    const warrantyMatch = currentOffer.match(/Бесплатная заморозка стоимости\./);
    if (!warrantyMatch) {
        // Если не найдено, пробуем найти через "Гарантия 15 лет"
        const guaranteeMatch = currentOffer.match(/Гарантия 15 лет\./);
        if (!guaranteeMatch) {
            return; // Если структура КП неожиданная, не трогаем
        }
        // Используем гарантию как маркер
        const beforeGifts = currentOffer.substring(0, guaranteeMatch.index + guaranteeMatch[0].length);
        const afterGuarantee = currentOffer.substring(guaranteeMatch.index + guaranteeMatch[0].length);
        
        const deliveryMatch = afterGuarantee.match(/Ближайшая дата доставки[^\n]*/);
        let datePart = '';
        if (deliveryMatch) {
            datePart = '\n' + deliveryMatch[0].trim();
            if (!datePart.endsWith('.')) datePart += '.';
        } else {
            const dt = document.querySelector('input[name="deliveryType"]:checked')?.value;
            const dtShort = getDeliveryDateTextForKP(dt === 'withAssembly');
            datePart = '\nБлижайшая дата доставки — ' + (dtShort || '17 февраля') + '.';
        }
        
        // Получаем текст подарков
    let giftsText = '';
    if (overrideSelectedGifts && Object.keys(overrideSelectedGifts).length > 0) {
        giftsText = getGiftsTextFromObject(overrideSelectedGifts);
    } else {
        giftsText = getGiftsText();
    }
    
        // Пересобираем КП: до условий + условия + отступ + подарки (если есть) + отступ + дата
        let newOffer = beforeGifts;
        if (giftsText && giftsText.trim() !== '') {
            // ИСПРАВЛЕНО: Подарки вставляются с одним отступом (пустая строка перед блоком)
            newOffer += '\n' + giftsText.trimStart() + '\n';
        }
        newOffer += datePart;
        shortOfferTextarea.value = newOffer;
        updateCharCounter('commercial-offer-short');
        return;
    }
    
    // Часть до условий оплаты (включая "Бесплатная заморозка стоимости.")
    const beforeGifts = currentOffer.substring(0, warrantyMatch.index + warrantyMatch[0].length);
    
    // Часть после условий оплаты (ищем дату доставки, пропуская возможные подарки)
    const afterWarranty = currentOffer.substring(warrantyMatch.index + warrantyMatch[0].length);
    
    // Ищем дату доставки, пропуская возможный блок подарков
    let datePart = '';
    const deliveryMatch = afterWarranty.match(/Ближайшая дата доставки[^\n]*/);
    if (deliveryMatch) {
        datePart = '\n' + deliveryMatch[0].trim();
        if (!datePart.endsWith('.')) datePart += '.';
        } else {
        const deliveryTypeShort = document.querySelector('input[name="deliveryType"]:checked')?.value;
        const dateTextShort = getDeliveryDateTextForKP(deliveryTypeShort === 'withAssembly');
        datePart = '\nБлижайшая дата доставки — ' + (dateTextShort || '17 февраля') + '.';
    }
    
    // Получаем текст подарков
    let giftsText = '';
    if (overrideSelectedGifts && Object.keys(overrideSelectedGifts).length > 0) {
        giftsText = getGiftsTextFromObject(overrideSelectedGifts);
    } else {
        giftsText = getGiftsText();
    }
    
    // Пересобираем КП: до условий + условия + отступ + подарки (если есть) + отступ + дата
    let newOffer = beforeGifts;
    if (giftsText && giftsText.trim() !== '') {
        // Подарки вставляются с отступами: пустая строка перед и после блока подарков
        newOffer += '\n\n' + giftsText.trimStart() + '\n';
    }
    newOffer += datePart;
    
    shortOfferTextarea.value = newOffer;
    updateCharCounter('commercial-offer-short');
}

/**
 * ПЕРЕСОБИРАЕТ длинное КП из частей с правильными подарками
 * НОВЫЙ ПОДХОД: вместо удаления/вставки через regex пересобираем КП заново
 */
function rebuildLongOfferWithGifts(overrideSelectedGifts = null) {
    const longOfferTextarea = document.getElementById("commercial-offer");
    if (!longOfferTextarea || !longOfferTextarea.value || 
        longOfferTextarea.value.includes("Здесь будет ваше")) {
        return;
    }
    
    let currentOffer = longOfferTextarea.value;
    
    // Удаление всех старых блоков подарков для предотвращения дублирования
    // Применяем несколько итераций для полной очистки всех вариантов форматирования
    let previousLength = currentOffer.length;
    let iterations = 0;
    const MAX_ITERATIONS = 10; // Защита от бесконечного цикла
    while (iterations < MAX_ITERATIONS) {
        const newOffer = currentOffer.replace(/\n🎁 Подарок[аи]?[к]?:[\s\S]*?(?=\n💳 Без предоплаты|\n🌱 Бесплатное хранение|\n⏳ Предложение|$)/gm, '')
            .replace(/\n🎁[^\n]*\n/g, '')
            .replace(/🎁 Подарок[аи]?[к]?:[\s\S]*?(?=\n💳|\n🌱|\n⏳|$)/gm, '')
            .replace(/🎁[^\n]*/g, '');
        
        if (newOffer.length === previousLength) {
            break; // Больше ничего не удаляется
        }
        currentOffer = newOffer;
        previousLength = newOffer.length;
        iterations++;
    }
    
    // Также удаляем все строки, которые содержат названия подарков в неправильном месте
    // (если они не в блоке подарков, а где-то еще)
    const giftNames = ['Дополнительная форточка', 'Капельный полив механический', 'Автомат для форточки', 
                       'Автоматическая форточка', '4 грунтозацепа', 'грунтозацепа'];
    giftNames.forEach(name => {
        // Удаляем строки с названиями подарков, которые идут перед блоком условий оплаты
        // но не являются частью правильного блока подарков
        const lines = currentOffer.split('\n');
        const cleanedLines = [];
        let foundGiftsBlock = false;
        let foundPaymentBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Если нашли блок условий оплаты, помечаем
            if (line.includes('💳 Без предоплаты')) {
                foundPaymentBlock = true;
            }
            // Если нашли правильный блок подарков (с 🎁), помечаем
            if (line.includes('🎁 Подарок') || line.includes('🎁 Подарки')) {
                foundGiftsBlock = true;
            }
            // Если строка содержит название подарка, но мы еще не дошли до блока условий оплаты
            // и это не правильный блок подарков - пропускаем её
            if (!foundPaymentBlock && !foundGiftsBlock && giftNames.some(giftName => line.includes(giftName))) {
                // Пропускаем эту строку (не добавляем в cleanedLines)
                continue;
            }
            cleanedLines.push(line);
        }
        currentOffer = cleanedLines.join('\n');
    });
    
    // Удаляем множественные пустые строки
    currentOffer = currentOffer.replace(/\n{3,}/g, '\n\n');
    
    // Получаем текст подарков
    let giftsText = '';
    if (overrideSelectedGifts && Object.keys(overrideSelectedGifts).length > 0) {
        giftsText = getGiftsTextFromObject(overrideSelectedGifts);
            } else {
        giftsText = getGiftsText();
    }
    
    // Если подарков нет, просто возвращаем КП как есть
    if (!giftsText || giftsText.trim() === '') {
        longOfferTextarea.value = currentOffer;
        return;
    }
    
    // ИСПРАВЛЕНО: Добавляем подарки перед КАЖДЫМ блоком условий оплаты
    // Находим все блоки условий оплаты
    const paymentMatches = [...currentOffer.matchAll(/\n💳 Без предоплаты/g)];
    if (paymentMatches.length === 0) {
        return; // Если структура неожиданная, не трогаем
    }
    
    // Собираем новое КП, добавляя подарки перед каждым блоком условий оплаты
    let newOffer = '';
    let lastIndex = 0;
    
    paymentMatches.forEach((match, index) => {
        // Добавляем часть до блока условий оплаты
        newOffer += currentOffer.substring(lastIndex, match.index);
        
        // Добавляем подарки перед блоком условий оплаты (с одним отступом)
        newOffer += '\n' + giftsText.trimStart() + '\n';
        
        // Находим конец блока условий оплаты (до следующего блока или до конца)
        const nextMatch = paymentMatches[index + 1];
        const endIndex = nextMatch ? nextMatch.index : currentOffer.length;
        
        // Добавляем блок условий оплаты
        newOffer += currentOffer.substring(match.index, endIndex);
        
        lastIndex = endIndex;
    });
    
    // Добавляем оставшуюся часть (если есть)
    if (lastIndex < currentOffer.length) {
        newOffer += currentOffer.substring(lastIndex);
    }
    
    longOfferTextarea.value = newOffer;
    updateCharCounter('commercial-offer');
}

/**
 * Обновляет коммерческие предложения (короткое и длинное КП) с текущими подарками
 * НОВЫЙ ПОДХОД: пересборка КП из частей вместо regex манипуляций
 * @param {Object} overrideSelectedGifts - Опционально: переопределить выбранные подарки
 */
function updateCommercialOffersWithGifts(overrideSelectedGifts = null) {
    // Используем новый подход - пересборка КП из частей
    rebuildShortOfferWithGifts(overrideSelectedGifts);
    rebuildLongOfferWithGifts(overrideSelectedGifts);
}

/**
 * Обработчик изменения выбора подарка
 */
function onGiftChange() {
    // ВАЖНО: Сначала сохраняем выбранные подарки в localStorage (только непустые значения)
    // Это нужно сделать ДО обновления блока подарков, чтобы getGiftsText() мог прочитать актуальные значения
    const selectedGifts = {};
    const giftSelects = document.querySelectorAll('.gift-select');
    giftSelects.forEach(select => {
        // Проверяем, что элемент видим (родительский .gift-item не скрыт)
        const giftItem = select.closest('.gift-item');
        if (giftItem) {
            const computedStyle = window.getComputedStyle(giftItem);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                return; // Пропускаем скрытые элементы
            }
        }
        
        // Сохраняем только если значение выбрано (не пустое)
        if (select.value && select.value.trim() !== '') {
            selectedGifts[select.id] = select.value;
        } else {
            // Если значение пустое, удаляем из selectedGifts (если было)
            delete selectedGifts[select.id];
        }
    });
    
    // ИСПРАВЛЕНО: Автоматическое объединение форточки + автомат в автоматическую форточку
    // Если выбраны форточка и автомат в разных слотах - объединяем их в автоматическую форточку
    const hasWindow = Object.values(selectedGifts).includes('window');
    const hasAutomation = Object.values(selectedGifts).includes('window-automation');
    
    if (hasWindow && hasAutomation) {
        // Находим слот с форточкой
        const windowSlot = Object.keys(selectedGifts).find(key => selectedGifts[key] === 'window');
        if (windowSlot) {
            // Заменяем форточку на автоматическую форточку
            selectedGifts[windowSlot] = 'window-auto';
            // Удаляем автомат из другого слота
            const automationSlot = Object.keys(selectedGifts).find(key => selectedGifts[key] === 'window-automation');
            if (automationSlot) {
                delete selectedGifts[automationSlot];
                // Очищаем значение в DOM
                const automationSelect = document.getElementById(automationSlot);
                if (automationSelect) {
                    automationSelect.value = '';
                }
            }
            // Обновляем значение в DOM
            const windowSelect = document.getElementById(windowSlot);
            if (windowSelect) {
                windowSelect.value = 'window-auto';
            }
        }
    }
    
    // Сохраняем в localStorage сразу
    localStorage.setItem('selectedGifts', JSON.stringify(selectedGifts));
    
    // ВАЖНО: Сначала скрываем/показываем элементы напрямую через DOM для мгновенной реакции
    const gift2Item = document.querySelector('.gift-item:has(#gift-2)') || 
                     Array.from(document.querySelectorAll('.gift-item')).find(item => item.querySelector('#gift-2'));
    const gift3Item = document.querySelector('.gift-item:has(#gift-3)') || 
                     Array.from(document.querySelectorAll('.gift-item')).find(item => item.querySelector('#gift-3'));
    
    // ИСПРАВЛЕНО: Если выбрана "Автоматическая форточка" в подарке 1, скрываем подарок 2, НО НЕ удаляем его значение
    // Это предотвращает сброс подарка при скрытии слота
    if (selectedGifts['gift-1'] === 'window-auto') {
        // НЕ удаляем gift-2 из selectedGifts - сохраняем его значение
        // Скрываем элемент напрямую через DOM
        if (gift2Item) {
            gift2Item.style.display = 'none';
        }
    } else {
        // Если "Автоматическая форточка" не выбрана в подарке 1, показываем подарок 2 (если он должен быть доступен)
        // ИСПРАВЛЕНО: Используем уже рассчитанную цену из глобальной переменной
        const availableGifts = lastCalculatedPrice >= 75000 ? 3 : (lastCalculatedPrice >= 55000 ? 2 : (lastCalculatedPrice >= 35000 ? 1 : 0));
        // Показываем подарок 2 только если доступно 2+ подарка
        if (availableGifts >= 2 && gift2Item) {
            gift2Item.style.display = '';
        }
    }
    
    // ИСПРАВЛЕНО: Если выбрана "Автоматическая форточка" в подарке 2, скрываем подарок 3, НО НЕ удаляем его значение
    if (selectedGifts['gift-2'] === 'window-auto') {
        // НЕ удаляем gift-3 из selectedGifts - сохраняем его значение
        // Скрываем элемент напрямую через DOM
        if (gift3Item) {
            gift3Item.style.display = 'none';
        }
    } else {
        // Если "Автоматическая форточка" не выбрана в подарке 2, показываем подарок 3 (если он должен быть доступен)
        // ИСПРАВЛЕНО: Используем уже рассчитанную цену из глобальной переменной
        const availableGifts = lastCalculatedPrice >= 75000 ? 3 : (lastCalculatedPrice >= 55000 ? 2 : (lastCalculatedPrice >= 35000 ? 1 : 0));
        // Показываем подарок 3 только если:
        // 1. Доступно 3 подарка
        // 2. Подарок 1 НЕ занял 2 слота (не выбрана window-auto в подарке 1)
        // 3. Подарок 2 НЕ занял 2 слота (не выбрана window-auto в подарке 2)
        if (availableGifts >= 3 && 
            selectedGifts['gift-1'] !== 'window-auto' && 
            selectedGifts['gift-2'] !== 'window-auto' && 
            gift3Item) {
            gift3Item.style.display = '';
        }
    }
    
    // Сохраняем обновленные подарки в localStorage
    localStorage.setItem('selectedGifts', JSON.stringify(selectedGifts));
    
    // Если выбран автомат для форточки, но нет доп форточки - предупреждаем
    const hasWindowAutomation = Object.values(selectedGifts).includes('window-automation');
    const additionalWindowQty = parseInt(document.getElementById('additional-window-qty')?.value || '0', 10);
    const hasWindowInGifts = Object.values(selectedGifts).includes('window') || 
                            Object.values(selectedGifts).includes('window-auto');
    
    if (hasWindowAutomation && additionalWindowQty === 0 && !hasWindowInGifts) {
        showWarning('Автомат для форточки можно установить только на дополнительную форточку. Выберите дополнительную форточку в подарках или купите её.');
    }
    
    // Получаем текущую итоговую сумму для обновления блока подарков
    // ИСПРАВЛЕНО: Используем уже рассчитанную цену из глобальной переменной вместо парсинга из КП
    let totalPrice = lastCalculatedPrice;
    
    // Если цена не найдена, пытаемся получить из предварительного расчета
    if (isNaN(totalPrice) || totalPrice === 0) {
        // Вызываем предварительный расчет для получения суммы
        if (typeof updateGiftsBlockPreview === 'function') {
            updateGiftsBlockPreview();
            return; // updateGiftsBlockPreview сам вызовет calculateGreenhouseCost
        }
    }
    
    // ИСПРАВЛЕНО: Правильная последовательность обновлений
    // 1. Сначала обновляем блок подарков (пересоздаем DOM с правильными опциями)
    if (totalPrice > 0) {
        updateGiftsBlock(totalPrice, selectedGifts);
    }
    
    // 2. Затем обновляем КП с подарками (один раз, в конце)
    // Используем selectedGifts, которые уже сохранены в localStorage
            updateCommercialOffersWithGifts(selectedGifts);
}

/**
 * Обработчик изменения количества дополнительной форточки
 * Обновляет блок подарков, если изменилась возможность выбрать автомат
 */
function onAdditionalWindowChange() {
    // ИСПРАВЛЕНО: Используем уже рассчитанную цену из глобальной переменной
    if (lastCalculatedPrice > 0) {
        updateGiftsBlock(lastCalculatedPrice);
    }
}

/**
 * Получает текст подарков для КП из объекта selectedGifts
 * @param {Object} selectedGifts - Объект с выбранными подарками { 'gift-1': 'window', 'gift-2': 'stakes-4', ... }
 * @returns {string} Текст с информацией о подарках
 */
function getGiftsTextFromObject(selectedGifts) {
    if (!selectedGifts || Object.keys(selectedGifts).length === 0) {
        return '';
    }
    
    // Используем Map для подсчета количества каждого подарка
    const giftCounts = new Map();
    const giftNames = {
        'window': 'дополнительная форточка',
        'drip-mech': 'капельный полив механический',
        'window-automation': 'автомат для форточки',
        'window-auto': 'автоматическая форточка (форточка + автомат)',
        'stakes-4': '4 грунтозацепа'
    };
    
    // Проходим по всем выбранным подаркам и считаем количество каждого
    Object.keys(selectedGifts).forEach(giftId => {
        const giftValue = selectedGifts[giftId];
        
        // Пропускаем пустые значения
        if (!giftValue || giftValue.trim() === '' || !giftNames[giftValue]) {
            return;
        }
        
        // ИСПРАВЛЕНО: Пропускаем подарки, которые скрыты из-за автоматической форточки
        // Если выбран window-auto в подарке 1, пропускаем gift-2 (слот занят)
        if (selectedGifts['gift-1'] === 'window-auto' && giftId === 'gift-2') {
            return;
        }
        // Если выбран window-auto в подарке 2, пропускаем gift-3 (слот занят)
        if (selectedGifts['gift-2'] === 'window-auto' && giftId === 'gift-3') {
            return;
        }
        
        // Увеличиваем счетчик для этого подарка
        const giftName = giftNames[giftValue];
        giftCounts.set(giftName, (giftCounts.get(giftName) || 0) + 1);
    });
    
    if (giftCounts.size === 0) {
        return '';
    }
    
    // ИСПРАВЛЕНО: Формируем список подарков в одну строку через запятую
    // Для всех подарков суммируем количество с правильным склонением
    const giftsList = [];
    giftCounts.forEach((count, giftName) => {
        if (count === 1) {
            // Если выбран один раз - просто название
            giftsList.push(giftName);
        } else {
            // Если выбрано несколько раз - суммируем с правильным склонением
            let pluralForm = '';
            
            if (giftName === '4 грунтозацепа') {
                // Специальная обработка для грунтозацепов - умножаем на 4
                const totalStakes = count * 4;
                let stakesWord = 'грунтозацепов';
                if (totalStakes === 1) {
                    stakesWord = 'грунтозацеп';
                } else if (totalStakes >= 2 && totalStakes <= 4) {
                    stakesWord = 'грунтозацепа';
                }
                pluralForm = `${totalStakes} ${stakesWord}`;
            } else if (giftName === 'дополнительная форточка') {
                // 2-4: дополнительные форточки, 5+: дополнительных форточек
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} дополнительные форточки`;
                } else {
                    pluralForm = `${count} дополнительных форточек`;
                }
            } else if (giftName === 'капельный полив механический') {
                // 2-4: капельных полива механических, 5+: капельных поливов механических
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} капельных полива механических`;
                } else {
                    pluralForm = `${count} капельных поливов механических`;
                }
            } else if (giftName === 'автомат для форточки') {
                // 2-4: автомата для форточки, 5+: автоматов для форточки
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} автомата для форточки`;
                } else {
                    pluralForm = `${count} автоматов для форточки`;
                }
            } else if (giftName === 'автоматическая форточка (форточка + автомат)') {
                // 2-4: автоматические форточки, 5+: автоматических форточек
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} автоматические форточки (форточка + автомат)`;
                } else {
                    pluralForm = `${count} автоматических форточек (форточка + автомат)`;
                }
            } else {
                // Для неизвестных подарков - просто количество
                pluralForm = `${count} ${giftName}`;
            }
            
            giftsList.push(pluralForm);
        }
    });
    
    // ИСПРАВЛЕНО: Упрощенное склонение - всегда "Подарки:" кроме 1 подарка
    const uniqueGiftsCount = giftCounts.size;
    const giftsWord = uniqueGiftsCount === 1 ? 'Подарок' : 'Подарки';
    
    // Форматируем в одну строку через запятую
    return `\n🎁 ${giftsWord}: ${giftsList.join(', ')}`;
}

/**
 * Получает текст подарков для КП из DOM элементов
 * @returns {string} Текст с информацией о подарках
 */
function getGiftsText() {
    // Читаем выбранные подарки из видимых DOM элементов (более надежно, чем localStorage)
    const giftSelects = document.querySelectorAll('.gift-select');
    
    if (giftSelects.length === 0) {
        return '';
    }
    
    // Используем Map для подсчета количества каждого подарка
    const giftCounts = new Map();
    const giftNames = {
        'window': 'дополнительная форточка',
        'drip-mech': 'капельный полив механический',
        'window-automation': 'автомат для форточки',
        'window-auto': 'автоматическая форточка (форточка + автомат)',
        'stakes-4': '4 грунтозацепа'
    };
    
    // Используем ID элемента для правильной нумерации (gift-1, gift-2, gift-3)
    // Проверяем только видимые элементы (не скрытые через display: none) и с непустыми значениями
    giftSelects.forEach(select => {
        // Проверяем, что элемент видим (родительский .gift-item не скрыт)
        const giftItem = select.closest('.gift-item');
        if (!giftItem) {
            return; // Пропускаем элементы без родителя
        }
        
        // Проверяем видимость через computed style
        const computedStyle = window.getComputedStyle(giftItem);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            return; // Пропускаем скрытые элементы
        }
        
        // Проверяем, что значение не пустое и есть в списке подарков
        const giftValue = select.value ? select.value.trim() : '';
        if (!giftValue || !giftNames[giftValue]) {
            return; // Пропускаем пустые значения и неизвестные подарки
        }
        
        // Увеличиваем счетчик для этого подарка
        const giftName = giftNames[giftValue];
        giftCounts.set(giftName, (giftCounts.get(giftName) || 0) + 1);
    });
    
    if (giftCounts.size === 0) {
        return '';
    }
    
    // ИСПРАВЛЕНО: Формируем список подарков в одну строку через запятую
    // Для всех подарков суммируем количество с правильным склонением
    const giftsList = [];
    giftCounts.forEach((count, giftName) => {
        if (count === 1) {
            // Если выбран один раз - просто название
            giftsList.push(giftName);
        } else {
            // Если выбрано несколько раз - суммируем с правильным склонением
            let pluralForm = '';
            
            if (giftName === '4 грунтозацепа') {
                // Специальная обработка для грунтозацепов - умножаем на 4
                const totalStakes = count * 4;
                let stakesWord = 'грунтозацепов';
                if (totalStakes === 1) {
                    stakesWord = 'грунтозацеп';
                } else if (totalStakes >= 2 && totalStakes <= 4) {
                    stakesWord = 'грунтозацепа';
                }
                pluralForm = `${totalStakes} ${stakesWord}`;
            } else if (giftName === 'дополнительная форточка') {
                // 2-4: дополнительные форточки, 5+: дополнительных форточек
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} дополнительные форточки`;
                } else {
                    pluralForm = `${count} дополнительных форточек`;
                }
            } else if (giftName === 'капельный полив механический') {
                // 2-4: капельных полива механических, 5+: капельных поливов механических
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} капельных полива механических`;
                } else {
                    pluralForm = `${count} капельных поливов механических`;
                }
            } else if (giftName === 'автомат для форточки') {
                // 2-4: автомата для форточки, 5+: автоматов для форточки
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} автомата для форточки`;
                } else {
                    pluralForm = `${count} автоматов для форточки`;
                }
            } else if (giftName === 'автоматическая форточка (форточка + автомат)') {
                // 2-4: автоматические форточки, 5+: автоматических форточек
                if (count >= 2 && count <= 4) {
                    pluralForm = `${count} автоматические форточки (форточка + автомат)`;
                } else {
                    pluralForm = `${count} автоматических форточек (форточка + автомат)`;
                }
            } else {
                // Для неизвестных подарков - просто количество
                pluralForm = `${count} ${giftName}`;
            }
            
            giftsList.push(pluralForm);
        }
    });
    
    // ИСПРАВЛЕНО: Упрощенное склонение - всегда "Подарки:" кроме 1 подарка
    const uniqueGiftsCount = giftCounts.size;
    const giftsWord = uniqueGiftsCount === 1 ? 'Подарок' : 'Подарки';
    
    // Форматируем в одну строку через запятую
    return `\n🎁 ${giftsWord}: ${giftsList.join(', ')}`;
}

/**
 * Предварительное обновление блока подарков на основе текущих параметров
 * Вызывается при изменении параметров без полного расчета
 */
function updateGiftsBlockPreview() {
    // ВАЖНО: При изменении параметров очищаем старые подарки, чтобы не оставались следы
    localStorage.removeItem('selectedGifts');
    
    // Проверяем, что все основные параметры выбраны
    const city = document.getElementById("city")?.value;
    const form = document.getElementById("form")?.value;
    const width = parseFloat(document.getElementById("width")?.value);
    const length = parseFloat(document.getElementById("length")?.value);
    const frame = document.getElementById("frame")?.value;
    const polycarbonate = document.getElementById("polycarbonate")?.value;
    const arcStep = parseFloat(document.getElementById("arcStep")?.value);
    
    // Если не все параметры выбраны, скрываем блок подарков
    if (!city || !form || isNaN(width) || isNaN(length) || !frame || !polycarbonate || isNaN(arcStep)) {
        const giftsBlock = document.getElementById('gifts-block');
        if (giftsBlock) {
            giftsBlock.style.display = 'none';
        }
        // Очищаем блок подарков полностью
        const giftsSelection = document.getElementById('gifts-selection');
        if (giftsSelection) {
            giftsSelection.innerHTML = '';
        }
        return;
    }
    
    // Пытаемся найти базовую цену в текущих данных
    const selectedEntry = currentCityData.find(item => {
        return (
            getFormCategory(item.form_name) === form &&
            parseFloat(item.width) === width &&
            parseFloat(item.length) === length &&
            normalizeString(item.frame_description.replace(/двойная\s*/gi, "")).includes(normalizeString(frame)) &&
            normalizeString(item.polycarbonate_type) === normalizeString(polycarbonate)
        );
    });
    
    if (!selectedEntry) {
        return;
    }
    
    // Рассчитываем примерную сумму (базовая цена + минимальные доплаты)
    let estimatedPrice = selectedEntry.price;
    
    // Надбавка за arcStep 0.65
    if (arcStep === 0.65) {
        const baseEntry = currentCityData.find(item => {
            return (
                getFormCategory(item.form_name) === form &&
                parseFloat(item.width) === width &&
                parseFloat(item.length) === length &&
                normalizeString(item.frame_description).includes(normalizeString(frame)) &&
                (normalizeString(item.polycarbonate_type) === normalizeString("стандарт4мм") ||
                    normalizeString(item.polycarbonate_type) === normalizeString("стандарт 4мм"))
            );
        });
        if (baseEntry) {
            const basePriceStandard = baseEntry.price;
            const additionalCost = 0.25 * basePriceStandard;
            estimatedPrice += additionalCost;
            estimatedPrice = Math.ceil(estimatedPrice / 10) * 10;
        }
    }
    
    // Обновляем блок подарков с примерной суммой
    updateGiftsBlock(estimatedPrice);
}

/**
 * Показывает модальное окно с информацией о логике подарков
 */
function showGiftsInfoModal() {
    const modal = document.getElementById('gifts-info-modal');
    const modalBody = document.getElementById('gifts-info-modal-body');
    
    if (!modal || !modalBody) {
        showError('Модальное окно с информацией о подарках не найдено');
        return;
    }
    
    // Если модальное окно уже открыто, закрываем его (toggle)
    if (!modal.classList.contains('hidden')) {
        closeGiftsInfoModal();
        return;
    }
    
    modalBody.innerHTML = `
        <h3>📊 Количество подарков по сумме заказа:</h3>
        <ul>
            <li><strong>От 35 000 рублей</strong> — 1 подарок (по умолчанию: дополнительная форточка)</li>
            <li><strong>От 55 000 рублей</strong> — 2 подарка (по умолчанию: форточка + капельный полив)</li>
            <li><strong>От 75 000 рублей</strong> — 3 подарка (по умолчанию: форточка + капельный полив + автомат для форточки)</li>
        </ul>
        
        <h3>🔄 Правила замены подарков:</h3>
        <ul>
            <li><strong>Любой подарок можно заменить на 4 грунтозацепа</strong></li>
            <li><strong>Капельный полив можно заменить на вторую форточку</strong> (при условии соблюдения суммы заказа)</li>
            <li><strong>Максимум 3 подарка</strong> — даже если сумма очень большая, больше 3 подарков не будет</li>
        </ul>
        
        <h3>⚙️ Особенности:</h3>
        <ul>
            <li><strong>"Автоматическая форточка" занимает 2 слота подарка</strong> — это форточка + автомат в одном подарке. Если вы выбрали её в подарке 1, то подарок 2 автоматически скрывается.</li>
            <li><strong>Автомат для форточки можно выбрать только если есть дополнительная форточка</strong> — либо купленная в разделе "Дополнительные товары", либо выбранная в подарках.</li>
            <li><strong>Если форточка выбрана или куплена, автомат становится доступен во ВСЕХ подарках</strong> — можно выбрать автомат в любом доступном подарке.</li>
        </ul>
        
        <h3>💡 Примеры:</h3>
        
        <div class="example">
            <strong>Пример 1: Заказ на 60 000 рублей (2 подарка)</strong>
            <ul>
                <li>Подарок 1: Дополнительная форточка</li>
                <li>Подарок 2: Капельный полив механический</li>
            </ul>
            <p>Или можно заменить:</p>
            <ul>
                <li>Подарок 1: Автоматическая форточка (форточка + автомат) — <strong>подарок 2 скрывается</strong></li>
                <li>Подарок 2: Недоступен (занят автоматической форточкой)</li>
            </ul>
        </div>
        
        <div class="example">
            <strong>Пример 2: Заказ на 80 000 рублей (3 подарка)</strong>
            <ul>
                <li>Подарок 1: Дополнительная форточка</li>
                <li>Подарок 2: Капельный полив механический</li>
                <li>Подарок 3: Автомат для форточки (стал доступен, так как форточка выбрана в подарке 1)</li>
            </ul>
        </div>
        
        <div class="example">
            <strong>Пример 3: Заказ на 80 000 рублей + куплена форточка</strong>
            <ul>
                <li>Куплена дополнительная форточка в разделе "Дополнительные товары"</li>
                <li>Подарок 1: Автомат для форточки (стал доступен во всех подарках)</li>
                <li>Подарок 2: Капельный полив механический</li>
                <li>Подарок 3: Автомат для форточки (можно выбрать второй автомат, если нужно)</li>
            </ul>
        </div>
        
        <div class="example">
            <strong>Пример 4: Все подарки заменены на грунтозацепа</strong>
            <ul>
                <li>Подарок 1: 4 грунтозацепа</li>
                <li>Подарок 2: 4 грунтозацепа</li>
                <li>Подарок 3: 4 грунтозацепа</li>
            </ul>
            <p>Итого: 12 грунтозацепов в подарок</p>
        </div>
        
        <h3>❓ Частые вопросы:</h3>
        <ul>
            <li><strong>Почему подарок 2 исчез?</strong> — Вы выбрали "Автоматическую форточку" в подарке 1, она занимает 2 слота (форточка + автомат), поэтому подарок 2 скрывается.</li>
            <li><strong>Можно ли выбрать автомат без форточки?</strong> — Нет, автомат можно установить только на дополнительную форточку. Сначала выберите или купите форточку.</li>
            <li><strong>Сколько максимум подарков?</strong> — Максимум 3 подарка, независимо от суммы заказа.</li>
        </ul>
    `;
    
    modal.classList.remove('hidden');
}

/**
 * Закрывает модальное окно с информацией о подарках
 */
function closeGiftsInfoModal() {
    const modal = document.getElementById('gifts-info-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Добавляет подарки в КП (вызывает полный пересчет стоимости)
 */
function addGiftsToOffer() {
    // Вызываем полный пересчет стоимости, который обновит КП с подарками
    if (typeof calculateGreenhouseCost === 'function') {
        calculateGreenhouseCost();
    } else {
        showError('Ошибка: функция расчета стоимости не найдена');
    }
}

/**
 * Удаляет все выбранные подарки
 */
function removeGifts() {
    // Очищаем выбранные подарки из localStorage
    localStorage.removeItem('selectedGifts');
    
    // Очищаем значения в выпадающих списках
    const giftSelects = document.querySelectorAll('.gift-select');
    giftSelects.forEach(select => {
        select.value = '';
    });
    
    // Обновляем КП, удаляя подарки
    updateCommercialOffersWithGifts({});
    
    // Обновляем блок подарков (если есть сумма для расчета)
    const resultElement = document.getElementById('result');
    if (resultElement && resultElement.textContent) {
        const match = resultElement.textContent.match(/Итоговая стоимость[^\d]*(\d[\d\s]*)/);
        if (match) {
            const priceText = match[1].replace(/\s/g, '');
            const totalPrice = parseFloat(priceText);
            if (!isNaN(totalPrice) && totalPrice > 0) {
                updateGiftsBlock(totalPrice, {});
            }
        }
    }
    
    showSuccess('Подарки удалены');
}

// Делаем функции доступными глобально
window.onAdditionalWindowChange = onAdditionalWindowChange;
window.onGiftChange = onGiftChange;
window.updateGiftsBlockPreview = updateGiftsBlockPreview;
window.updateCommercialOffersWithGifts = updateCommercialOffersWithGifts;
window.showGiftsInfoModal = showGiftsInfoModal;
window.closeGiftsInfoModal = closeGiftsInfoModal;
window.addGiftsToOffer = addGiftsToOffer;
window.removeGifts = removeGifts;

// Обработчик изменения поликарбоната - отключает сборку для теплиц без поликарбоната
function handlePolycarbonateChange() {
    const polycarbonateSelect = document.getElementById("polycarbonate");
    const assemblyCheckbox = document.getElementById('assembly');
    
    if (!polycarbonateSelect || !assemblyCheckbox) {
        return;
    }
    
    const polycarbonateValue = polycarbonateSelect.value.trim();
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    const isWithoutPolycarbonate = polyNormalized === "безполикарбоната";
    
    if (isWithoutPolycarbonate) {
        // Проверяем, была ли сборка выбрана до этого
        const wasAssemblyChecked = assemblyCheckbox.checked;
        
        // Отключаем чекбокс сборки и снимаем выбор
        assemblyCheckbox.disabled = true;
        assemblyCheckbox.checked = false;
        
        // Добавляем визуальное указание, что сборка недоступна
        const assemblyLabel = assemblyCheckbox.closest('label') || assemblyCheckbox.parentElement;
        if (assemblyLabel) {
            assemblyLabel.style.opacity = '0.5';
            assemblyLabel.style.cursor = 'not-allowed';
        }
        
        // Показываем уведомление, если сборка была выбрана
        if (wasAssemblyChecked) {
            showWarning('Каркасы теплиц не собираем отдельно, доступна только доставка.', 'Сборка недоступна');
        }
    } else {
        // Включаем чекбокс сборки обратно
        assemblyCheckbox.disabled = false;
        const assemblyLabel = assemblyCheckbox.closest('label') || assemblyCheckbox.parentElement;
        if (assemblyLabel) {
            assemblyLabel.style.opacity = '1';
            assemblyLabel.style.cursor = 'pointer';
        }
    }
}

// Обработчик клика на label сборки - показывает уведомление если сборка недоступна
function handleAssemblyLabelClick(event) {
    const assemblyCheckbox = document.getElementById('assembly');
    const polycarbonateSelect = document.getElementById("polycarbonate");
    
    if (!assemblyCheckbox || !polycarbonateSelect) {
        return;
    }
    
    // Проверяем, выбрано ли "Без поликарбоната"
    const polycarbonateValue = polycarbonateSelect.value.trim();
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    const isWithoutPolycarbonate = polyNormalized === "безполикарбоната";
    
    // Если сборка недоступна (disabled) - показываем уведомление и предотвращаем клик
    if (isWithoutPolycarbonate && assemblyCheckbox.disabled) {
        event.preventDefault();
        event.stopPropagation();
        showWarning('Каркасы теплиц не собираем отдельно, доступна только доставка.', 'Сборка недоступна');
        return false;
    }
}

// Обработчик попытки выбрать сборку для теплицы без поликарбоната
function handleAssemblyChange() {
    const assemblyCheckbox = document.getElementById('assembly');
    const polycarbonateSelect = document.getElementById("polycarbonate");
    
    if (!assemblyCheckbox || !polycarbonateSelect) {
        return;
    }
    
    // Проверяем, выбрано ли "Без поликарбоната"
    const polycarbonateValue = polycarbonateSelect.value.trim();
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    const isWithoutPolycarbonate = polyNormalized === "безполикарбоната";
    
    // Если выбрано "Без поликарбоната" и пытаются выбрать сборку
    if (isWithoutPolycarbonate && assemblyCheckbox.checked) {
        // Отменяем выбор и показываем уведомление
        assemblyCheckbox.checked = false;
        showWarning('Каркасы теплиц не собираем отдельно, доступна только доставка.', 'Сборка недоступна');
        return;
    }
    
    // Если все нормально - вызываем расчет стоимости
    calculateGreenhouseCost();
}

// Функция показа информации о поликарбонате
function showPolycarbonateInfo() {
    const polycarbonateSelect = document.getElementById("polycarbonate");
    if (!polycarbonateSelect || !polycarbonateSelect.value) {
        showWarning("Сначала выберите тип поликарбоната", "Информация о поликарбонате");
        return;
    }
    
    const polycarbonateValue = polycarbonateSelect.value.trim();
    const polyData = getProductData('polycarbonate');
    
    if (!polyData || !polyData.types) {
        showWarning("Информация о поликарбонате пока недоступна", "Информация");
        return;
    }
    
    // Определяем тип поликарбоната
    let selectedType = null;
    const polyNormalized = polycarbonateValue.replace(/\s+/g, "").toLowerCase();
    
    if (polyNormalized.includes("стандарт") && polyNormalized.includes("4")) {
        selectedType = polyData.types.standard_4mm;
    } else if (polyNormalized.includes("люкс") && polyNormalized.includes("4")) {
        selectedType = polyData.types.lux_4mm;
    } else if (polyNormalized.includes("премиум") && polyNormalized.includes("6")) {
        selectedType = polyData.types.premium_6mm;
    }
    
    if (!selectedType || !selectedType.photos || selectedType.photos.length === 0) {
        showWarning("Фото для выбранного типа поликарбоната пока недоступны", "Информация");
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'polycarbonate-info-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 20px;
        position: relative;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
    `;
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #e1e8ed; padding-bottom: 12px;">
            <h2 style="margin: 0; font-size: 20px; color: #2c3e50;">🏠 ${selectedType.name}</h2>
            <button onclick="this.closest('.polycarbonate-info-modal').remove()" style="
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 22px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>
    `;
    
    if (selectedType.description) {
        html += `<p style="font-size: 15px; color: #4a5568; margin-bottom: 12px; line-height: 1.5;">${selectedType.description}</p>`;
    }
    
    if (selectedType.weight) {
        html += `<p style="font-size: 14px; color: #718096; margin-bottom: 15px;"><strong>Вес:</strong> ${selectedType.weight}</p>`;
    }
    
    // Галерея фото
    html += `<div style="margin-top: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 12px;">📸 Фото</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">`;
    
    // Сохраняем массив фото в глобальную переменную для доступа из onclick
    const photosArrayId = `poly_photos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    window[photosArrayId] = selectedType.photos;
    
    selectedType.photos.forEach((photo, index) => {
        const filename = `${selectedType.name.replace(/\s+/g, '_')}_${index + 1}.jpg`;
        html += `
            <div style="position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid #e1e8ed; transition: all 0.2s;" 
                 onmouseover="this.style.borderColor='#48bb78'; this.style.transform='scale(1.02)'" 
                 onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='scale(1)'"
                 onclick="openImageModalWithGallery(window['${photosArrayId}'], ${index})">
                <img src="${photo}" alt="${selectedType.name} ${index + 1}" 
                     style="width: 100%; height: 180px; object-fit: cover; display: block;">
                <button onclick="event.stopPropagation(); downloadBedImage('${photo}', '${filename}');" style="
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    background: rgba(0, 0, 0, 0.3);
                    border: none;
                    border-radius: 4px;
                    padding: 4px 6px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                    color: white;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                    <span>📥</span>
                </button>
            </div>
        `;
    });
    
    // Очищаем глобальную переменную при закрытии модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.closest('button[onclick*="closest"]')) {
            setTimeout(() => {
                if (window[photosArrayId]) {
                    delete window[photosArrayId];
                }
            }, 1000);
        }
    });
    
    html += `</div></div>`;
    
    // Параметры (если есть)
    if (polyData.parametersImage) {
        html += `<div style="margin-top: 20px; text-align: center;">
            <h3 style="font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 12px;">📐 Параметры</h3>
            <div style="position: relative; display: inline-block;">
                <img src="${polyData.parametersImage}" alt="Параметры поликарбоната" 
                     style="max-width: 100%; border-radius: 8px; cursor: pointer; border: 2px solid #e1e8ed;"
                     onclick="openImageModal('${polyData.parametersImage}')"
                     onmouseover="this.style.borderColor='#48bb78'"
                     onmouseout="this.style.borderColor='#e1e8ed'">
                <button onclick="event.stopPropagation(); downloadBedImage('${polyData.parametersImage}', 'Параметры_поликарбоната.png');" style="
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    background: rgba(0, 0, 0, 0.3);
                    border: none;
                    border-radius: 4px;
                    padding: 4px 6px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                    color: white;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.5)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.transform='scale(1)'">
                    <span>📥</span>
                </button>
            </div>
        </div>`;
    }
    
    modalContent.innerHTML = html;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Закрытие по Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

window.handlePolycarbonateChange = handlePolycarbonateChange;
window.handleAssemblyChange = handleAssemblyChange;
window.handleAssemblyLabelClick = handleAssemblyLabelClick;
window.showPolycarbonateInfo = showPolycarbonateInfo;

// Вызываем проверку при загрузке страницы, если поликарбонат уже выбран
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById("polycarbonate") && document.getElementById("polycarbonate").value) {
            handlePolycarbonateChange();
        }
    });
} else {
    // Если страница уже загружена
    if (document.getElementById("polycarbonate") && document.getElementById("polycarbonate").value) {
        handlePolycarbonateChange();
    }
}

/**
 * Показать галерею фотографий теплиц
 * Сначала выбор типа теплицы, затем варианта, затем просмотр фотографий
 */
function showGreenhousesGallery() {
    if (!window.GREENHOUSES_DATA || !window.GREENHOUSES_PHOTOS_LIST) {
        showWarning("Данные о теплицах не загружены", "Ошибка");
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'greenhouses-gallery-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        position: relative;
    `;
    
    // Заголовок
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 20px 25px;
        border-bottom: 2px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
    `;
    
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = '📸 Фотографии теплиц';
    title.style.cssText = `
        margin: 0;
        font-size: 22px;
        color: #2c3e50;
        font-weight: 600;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 32px;
        color: #666;
        cursor: pointer;
        padding: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    `;
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = '#e0e0e0';
        this.style.color = '#333';
    });
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'none';
        this.style.color = '#666';
    });
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Контейнер для содержимого (будет меняться в зависимости от шага)
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        padding: 25px;
    `;
    
    // Функция для показа выбора типа теплицы
    function showTypeSelection() {
        contentContainer.innerHTML = '';
        
        const description = document.createElement('p');
        description.textContent = 'Выберите тип теплицы:';
        description.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #555;
        `;
        contentContainer.appendChild(description);
        
        const typesGrid = document.createElement('div');
        typesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        `;
        
        const allTypes = window.getAllGreenhouseTypes();
        allTypes.forEach(type => {
            // Получаем иконку: сначала проверяем явно указанное фото, иначе первое фото из первого варианта
            let iconPhoto = type.iconPhoto || null;
            if (!iconPhoto) {
                const variantNames = Object.keys(type.variants);
                for (let i = 0; i < variantNames.length; i++) {
                    const photos = window.GREENHOUSES_PHOTOS_LIST[variantNames[i]] || [];
                    if (photos.length > 0) {
                        iconPhoto = photos[0];
                        break;
                    }
                }
            }
            
            const typeCard = document.createElement('div');
            typeCard.style.cssText = `
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                position: relative;
                overflow: hidden;
            `;
            typeCard.addEventListener('mouseenter', function() {
                this.style.borderColor = '#3498db';
                this.style.background = '#e8f4f8';
                this.style.transform = 'translateY(-2px)';
            });
            typeCard.addEventListener('mouseleave', function() {
                this.style.borderColor = '#e0e0e0';
                this.style.background = '#f8f9fa';
                this.style.transform = 'translateY(0)';
            });
            typeCard.addEventListener('click', function() {
                showVariantSelection(type);
            });
            
            // Иконка (фото) если есть
            if (iconPhoto) {
                const iconContainer = document.createElement('div');
                iconContainer.style.cssText = `
                    width: 100%;
                    height: 120px;
                    margin-bottom: 12px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: #e0e0e0;
                `;
                const iconImg = document.createElement('img');
                iconImg.src = iconPhoto;
                iconImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                iconImg.onerror = function() {
                    iconContainer.style.display = 'none';
                };
                iconContainer.appendChild(iconImg);
                typeCard.appendChild(iconContainer);
            }
            
            const typeName = document.createElement('div');
            typeName.textContent = type.name;
            typeName.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
            `;
            
            const typeDesc = document.createElement('div');
            typeDesc.textContent = type.description || '';
            typeDesc.style.cssText = `
                font-size: 13px;
                color: #777;
                line-height: 1.4;
            `;
            
            typeCard.appendChild(typeName);
            typeCard.appendChild(typeDesc);
            typesGrid.appendChild(typeCard);
        });
        
        contentContainer.appendChild(description);
        contentContainer.appendChild(typesGrid);
    }
    
    // Функция для показа выбора варианта теплицы
    function showVariantSelection(type) {
        contentContainer.innerHTML = '';
        
        // Кнопка "Назад"
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '← Назад к типам';
        backBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.2s ease;
        `;
        backBtn.addEventListener('mouseenter', function() {
            this.style.background = '#5a6268';
        });
        backBtn.addEventListener('mouseleave', function() {
            this.style.background = '#6c757d';
        });
        backBtn.addEventListener('click', function() {
            showTypeSelection();
        });
        contentContainer.appendChild(backBtn);
        
        const description = document.createElement('p');
        description.innerHTML = `<strong>${type.name}</strong> — выберите вариант:`;
        description.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #555;
        `;
        contentContainer.appendChild(description);
        
        const variantsList = document.createElement('div');
        variantsList.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 12px;
        `;
        
        const variants = Object.keys(type.variants);
        variants.forEach(variantName => {
            const variant = type.variants[variantName];
            const photos = window.GREENHOUSES_PHOTOS_LIST[variantName] || [];
            
            // Пропускаем варианты без фотографий
            if (photos.length === 0) {
                return;
            }
            
            const variantCard = document.createElement('div');
            variantCard.style.cssText = `
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            variantCard.addEventListener('mouseenter', function() {
                this.style.borderColor = '#3498db';
                this.style.background = '#e8f4f8';
                this.style.transform = 'translateY(-2px)';
            });
            variantCard.addEventListener('mouseleave', function() {
                this.style.borderColor = '#e0e0e0';
                this.style.background = '#f8f9fa';
                this.style.transform = 'translateY(0)';
            });
            variantCard.addEventListener('click', function() {
                showPhotosGallery(variantName, photos);
            });
            
            const variantNameEl = document.createElement('div');
            variantNameEl.textContent = variantName.replace('ТЕПЛИЦА ', '');
            variantNameEl.style.cssText = `
                font-size: 15px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
            `;
            
            const variantFrame = document.createElement('div');
            variantFrame.textContent = `Каркас: ${variant.frame}`;
            variantFrame.style.cssText = `
                font-size: 13px;
                color: #777;
                margin-bottom: 8px;
            `;
            
            const photosCount = document.createElement('div');
            photosCount.textContent = `📸 ${photos.length} фото`;
            photosCount.style.cssText = `
                font-size: 12px;
                color: #27ae60;
                font-weight: 500;
            `;
            
            variantCard.appendChild(variantNameEl);
            variantCard.appendChild(variantFrame);
            variantCard.appendChild(photosCount);
            variantsList.appendChild(variantCard);
        });
        
        contentContainer.appendChild(variantsList);
    }
    
    // Функция для показа галереи фотографий
    function showPhotosGallery(variantName, photos) {
        contentContainer.innerHTML = '';
        
        // Кнопка "Назад"
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '← Назад к вариантам';
        backBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.2s ease;
        `;
        backBtn.addEventListener('mouseenter', function() {
            this.style.background = '#5a6268';
        });
        backBtn.addEventListener('mouseleave', function() {
            this.style.background = '#6c757d';
        });
        backBtn.addEventListener('click', function() {
            // Находим тип теплицы по названию варианта
            const allTypes = window.getAllGreenhouseTypes();
            const type = allTypes.find(t => t.variants[variantName]);
            if (type) {
                showVariantSelection(type);
            } else {
                showTypeSelection();
            }
        });
        contentContainer.appendChild(backBtn);
        
        const description = document.createElement('p');
        description.innerHTML = `<strong>${variantName.replace('ТЕПЛИЦА ', '')}</strong> — ${photos.length} фотографий:`;
        description.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #555;
        `;
        contentContainer.appendChild(description);
        
        // Галерея миниатюр
        const galleryGrid = document.createElement('div');
        galleryGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
        `;
        
        photos.forEach((photoPath, index) => {
            const photoCard = document.createElement('div');
            photoCard.style.cssText = `
                position: relative;
                height: 200px;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                border: 2px solid #e0e0e0;
                transition: all 0.2s ease;
                background: #f0f0f0;
            `;
            photoCard.addEventListener('mouseenter', function() {
                this.style.borderColor = '#3498db';
                this.style.transform = 'scale(1.05)';
            });
            photoCard.addEventListener('mouseleave', function() {
                this.style.borderColor = '#e0e0e0';
                this.style.transform = 'scale(1)';
            });
            photoCard.addEventListener('click', function(e) {
                // Не открываем галерею при клике на кнопку скачать
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    openImageModalWithGallery(photos, index);
                }
            });
            
            const img = document.createElement('img');
            img.src = photoPath;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
            `;
            img.onerror = function() {
                this.style.display = 'none';
                photoCard.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 12px;">Ошибка загрузки</div>';
            };
            
            // Кнопка скачать
            const downloadBtn = document.createElement('button');
            const filename = photoPath.split('/').pop() || `photo_${index + 1}.jpg`;
            downloadBtn.innerHTML = '📥';
            downloadBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                width: 32px;
                height: 32px;
                background: rgba(0, 0, 0, 0.3);
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 5;
            `;
            downloadBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.6)';
                this.style.transform = 'scale(1.1)';
            });
            downloadBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(0, 0, 0, 0.3)';
                this.style.transform = 'scale(1)';
            });
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadBedImage(photoPath, filename);
            });
            
            // Кнопка копирования
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '📋';
            copyBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 48px;
                width: 32px;
                height: 32px;
                background: rgba(0, 0, 0, 0.3);
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 5;
            `;
            copyBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.6)';
                this.style.transform = 'scale(1.1)';
            });
            copyBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(0, 0, 0, 0.3)';
                this.style.transform = 'scale(1)';
            });
            copyBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                await copyImageToClipboard(photoPath, copyBtn);
            });
            
            photoCard.appendChild(img);
            photoCard.appendChild(downloadBtn);
            photoCard.appendChild(copyBtn);
            galleryGrid.appendChild(photoCard);
        });
        
        contentContainer.appendChild(galleryGrid);
    }
    
    // Инициализация - показываем выбор типа
    showTypeSelection();
    
    modalContent.appendChild(header);
    modalContent.appendChild(contentContainer);
    modal.appendChild(modalContent);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
}

// Экспорт функции для использования в HTML
if (typeof window !== 'undefined') {
    window.showGreenhousesGallery = showGreenhousesGallery;
}

/**
 * Показать модальное окно с инструкциями по сборке теплиц
 * Простой интерфейс для быстрого поиска и скачивания инструкций
 */
function showInstructionsModal() {
    // Проверяем наличие данных об инструкциях
    if (typeof INSTRUCTIONS_DATA === 'undefined') {
        showError('Данные об инструкциях не загружены', 'Ошибка');
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'instructions-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'instructions-modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 100%;
        max-width: 650px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        position: relative;
    `;
    
    // Заголовок - компактный
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
        position: sticky;
        top: 0;
        z-index: 10;
    `;
    
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = '📖 Инструкции по сборке теплиц';
    title.style.cssText = `
        margin: 0;
        font-size: 18px;
        color: #2c3e50;
        font-weight: 600;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 32px;
        color: #666;
        cursor: pointer;
        padding: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    `;
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = '#e0e0e0';
        this.style.color = '#333';
    });
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'none';
        this.style.color = '#666';
    });
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Поиск - компактный
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        padding: 10px 12px;
        border-bottom: 1px solid #e0e0e0;
        background: #f8f9fa;
        position: sticky;
        top: 70px;
        z-index: 9;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Поиск по типу теплицы или размеру...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
        box-sizing: border-box;
        transition: all 0.15s ease;
        background: white;
    `;
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#3498db';
    });
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
    });
    
    searchContainer.appendChild(searchInput);
    
    // Контейнер для инструкций - компактный
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        padding: 12px;
    `;
    
    // Функция для отображения всех инструкций
    function renderInstructions(searchTerm = '') {
        contentContainer.innerHTML = '';
        
        const allTypes = window.getAllGreenhouseTypes();
        let hasResults = false;
        let isFirstType = true;
        
        allTypes.forEach(type => {
            const instructions = INSTRUCTIONS_DATA[type.id];
            if (!instructions) return;
            
            // Фильтрация по поисковому запросу
            const searchLower = searchTerm.toLowerCase();
            const typeNameMatch = type.name.toLowerCase().includes(searchLower) || 
                                 type.fullName.toLowerCase().includes(searchLower);
            
            if (searchTerm && !typeNameMatch) {
                // Проверяем, есть ли совпадения в инструкциях
                let hasMatchingInstructions = false;
                for (const size in instructions.instructions) {
                    for (const inst of instructions.instructions[size]) {
                        if (inst.filename.toLowerCase().includes(searchLower) || 
                            size.includes(searchLower)) {
                            hasMatchingInstructions = true;
                            break;
                        }
                    }
                    if (hasMatchingInstructions) break;
                }
                if (!hasMatchingInstructions) return;
            }
            
            hasResults = true;
            
            // Заголовок типа теплицы с фото - более заметный
            const typeHeader = document.createElement('div');
            typeHeader.style.cssText = `
                margin-top: ${isFirstType ? '0' : '20px'};
                margin-bottom: 12px;
                padding: 12px 14px;
                background: linear-gradient(to right, #f0f7ff 0%, #ffffff 100%);
                border-left: 4px solid #3498db;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            `;
            
            // Фотография теплицы
            let iconPhoto = type.iconPhoto || null;
            if (!iconPhoto) {
                const variantNames = Object.keys(type.variants);
                for (let i = 0; i < variantNames.length; i++) {
                    const photos = window.GREENHOUSES_PHOTOS_LIST[variantNames[i]] || [];
                    if (photos.length > 0) {
                        iconPhoto = photos[0];
                        break;
                    }
                }
            }
            
            if (iconPhoto) {
                const photoContainer = document.createElement('div');
                photoContainer.style.cssText = `
                    width: 80px;
                    height: 80px;
                    min-width: 80px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: #e0e0e0;
                    border: 2px solid #e8e8e8;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                `;
                const photoImg = document.createElement('img');
                photoImg.src = iconPhoto;
                photoImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                photoImg.onerror = function() {
                    photoContainer.style.display = 'none';
                };
                photoContainer.appendChild(photoImg);
                typeHeader.appendChild(photoContainer);
            }
            
            const typeInfo = document.createElement('div');
            typeInfo.style.cssText = `
                flex: 1;
            `;
            
            const typeTitle = document.createElement('h3');
            typeTitle.textContent = type.name;
            typeTitle.style.cssText = `
                margin: 0 0 5px 0;
                font-size: 19px;
                color: #2c3e50;
                font-weight: 700;
                letter-spacing: -0.2px;
            `;
            
            const typeDesc = document.createElement('div');
            typeDesc.textContent = type.description || '';
            typeDesc.style.cssText = `
                font-size: 13px;
                color: #5a6c7d;
                line-height: 1.4;
            `;
            
            typeInfo.appendChild(typeTitle);
            typeInfo.appendChild(typeDesc);
            typeHeader.appendChild(typeInfo);
            contentContainer.appendChild(typeHeader);
            
            isFirstType = false;
            
            // Группируем инструкции по размерам
            const sizes = Object.keys(instructions.instructions).sort((a, b) => {
                if (a === 'other') return 1;
                if (b === 'other') return -1;
                return parseFloat(a) - parseFloat(b);
            });
            
            sizes.forEach(size => {
                const sizeInstructions = instructions.instructions[size];
                
                // Заголовок размера - очень компактный, почти незаметный
                const sizeHeader = document.createElement('div');
                sizeHeader.style.cssText = `
                    margin-top: 6px;
                    margin-bottom: 3px;
                    margin-left: 2px;
                    font-size: 10px;
                    font-weight: 500;
                    color: #bdc3c7;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                `;
                sizeHeader.textContent = size === 'other' ? 'Другие размеры' : `${size} м`;
                contentContainer.appendChild(sizeHeader);
                
                // Список инструкций для этого размера - максимально компактный
                sizeInstructions.forEach(inst => {
                    const instCard = document.createElement('div');
                    instCard.style.cssText = `
                        background: white;
                        border: 1px solid #e8e8e8;
                        border-radius: 4px;
                        padding: 7px 10px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                        margin-bottom: 3px;
                        transition: all 0.15s ease;
                        width: 100%;
                        box-sizing: border-box;
                    `;
                    instCard.addEventListener('mouseenter', function() {
                        this.style.borderColor = '#3498db';
                        this.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.15)';
                        this.style.background = '#f8fbff';
                        this.style.transform = 'translateX(2px)';
                    });
                    instCard.addEventListener('mouseleave', function() {
                        this.style.borderColor = '#e5e5e5';
                        this.style.boxShadow = 'none';
                        this.style.background = 'white';
                        this.style.transform = 'translateX(0)';
                    });
                    
                    // Название файла - занимает только необходимое место
                    const fileName = document.createElement('div');
                    fileName.textContent = inst.filename.replace('.pdf', '');
                    fileName.style.cssText = `
                        font-size: 13px;
                        font-weight: 400;
                        color: #34495e;
                        flex: 1 1 auto;
                        min-width: 0;
                        word-break: break-word;
                        line-height: 1.3;
                    `;
                    
                    // Кнопки действий - сразу после текста
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.cssText = `
                        display: flex;
                        gap: 5px;
                        flex-shrink: 0;
                    `;
                    
                    // Кнопка "Открыть"
                    const openBtn = document.createElement('button');
                    openBtn.innerHTML = '👁️ Открыть';
                    openBtn.style.cssText = `
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 5px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        font-weight: 500;
                        white-space: nowrap;
                    `;
                    openBtn.addEventListener('mouseenter', function() {
                        this.style.background = '#2980b9';
                    });
                    openBtn.addEventListener('mouseleave', function() {
                        this.style.background = '#3498db';
                    });
                    openBtn.addEventListener('click', function() {
                        window.open(inst.path, '_blank');
                    });
                    
                    // Кнопка "Скачать"
                    const downloadBtn = document.createElement('button');
                    downloadBtn.innerHTML = '📥 Скачать';
                    downloadBtn.style.cssText = `
                        background: #27ae60;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 5px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        font-weight: 500;
                        white-space: nowrap;
                    `;
                    downloadBtn.addEventListener('mouseenter', function() {
                        this.style.background = '#229954';
                    });
                    downloadBtn.addEventListener('mouseleave', function() {
                        this.style.background = '#27ae60';
                    });
                    downloadBtn.addEventListener('click', function() {
                        const link = document.createElement('a');
                        link.href = inst.path;
                        link.download = inst.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showSuccess('Инструкция скачивается...', 'Скачивание');
                    });
                    
                    buttonsContainer.appendChild(openBtn);
                    buttonsContainer.appendChild(downloadBtn);
                    
                    instCard.appendChild(fileName);
                    instCard.appendChild(buttonsContainer);
                    contentContainer.appendChild(instCard);
                });
            });
        });
        
        if (!hasResults) {
            const noResults = document.createElement('div');
            noResults.style.cssText = `
                text-align: center;
                padding: 40px;
                color: #999;
                font-size: 16px;
            `;
            noResults.textContent = 'Ничего не найдено';
            contentContainer.appendChild(noResults);
        }
    }
    
    // Обработчик поиска
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderInstructions(this.value);
        }, 300);
    });
    
    // Инициализация - показываем все инструкции
    renderInstructions();
    
    modalContent.appendChild(header);
    modalContent.appendChild(searchContainer);
    modalContent.appendChild(contentContainer);
    modal.appendChild(modalContent);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Закрытие по Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    document.body.appendChild(modal);
}

// Экспорт функции для использования в HTML
if (typeof window !== 'undefined') {
    window.showInstructionsModal = showInstructionsModal;
}



