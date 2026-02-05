/**
 * Тестовый скрипт для проверки парсера
 */

const { parseDeliveryDates } = require('./parser');

// Тестовые данные
const testText = `Москва с 12.02, кроме 13.02, 14.02
Тула с 12.02, кроме 13.02, 14.02
Калуга с 12.02, кроме 13.02, 14.02
Рязань с 12.02, кроме 13.02, 14.02
Тверь с 12.02, кроме 13.02, 14.02
Питер с 9.02
Великий Новгород с 9.02
Воронеж с 15.02`;

console.log('🧪 ТЕСТИРОВАНИЕ ПАРСЕРА\n');
console.log('Входной текст:');
console.log(testText);
console.log('\n' + '='.repeat(50) + '\n');

const results = parseDeliveryDates(testText);

console.log('\n📊 РЕЗУЛЬТАТЫ:');
console.log(`Всего найдено: ${results.length}`);
console.log(`С ограничениями: ${results.filter(r => r.restrictions).length}`);
console.log(`Без ограничений: ${results.filter(r => !r.restrictions).length}`);

console.log('\n📋 ДЕТАЛИ:');
results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.city} - ${item.date}${item.restrictions ? ' (кроме ' + item.restrictions + ')' : ''}`);
});

console.log('\n' + '='.repeat(50));
console.log('\n✅ ТЕСТ ЗАВЕРШЕН');
