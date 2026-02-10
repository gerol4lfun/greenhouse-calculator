/**
 * Данные о товарах с фото и описаниями
 * Структура для интеграции в калькулятор
 * 
 * Версия: v205
 * Дата: 2026-02-08
 */

const PRODUCTS_DATA = {
    // ========== ГРЯДКИ ==========
    gryadki: {
        category: "Грядки",
        icon: "🌱",
        description: "Высокие грядки для теплиц из оцинкованной стали",
        fullDescription: "Высокие грядки позволяют создать удобные условия для выращивания растений. Изготовлены из оцинкованной стали, устойчивы к коррозии и долговечны.",
        components: {
            peremychka: {
                name: "Перемычка",
                description: "Перемычка для усиления конструкции грядки",
                photos: [
                    "image/products/gryadki/peremychka_1.jpg",
                    "image/products/gryadki/peremychka_2.jpg"
                ]
            },
            ugolki: {
                name: "Соединительные уголки",
                description: "Уголки для соединения стенок грядки между собой",
                photos: [
                    "image/products/gryadki/ugolki_1.jpg",
                    "image/products/gryadki/ugolki_2.jpg",
                    "image/products/gryadki/ugolki_3.jpg",
                    "image/products/gryadki/ugolki_4.jpg",
                    "image/products/gryadki/ugolki_5.jpg"
                ]
            },
            stenka: {
                name: "Стенка грядки",
                description: "Стенка грядки из оцинкованной стали",
                photos: [
                    "image/products/gryadki/stenka_1.jpg",
                    "image/products/gryadki/stenka_2.jpg",
                    "image/products/gryadki/stenka_3.jpg"
                ]
            }
        },
        video: {
            assembly: {
                name: "Сборка высоких грядок",
                description: "Видеоинструкция по сборке высоких грядок",
                path: "video/products/gryadki_assembly.mp4"
            }
        }
    },

    // ========== ПОЛИКАРБОНАТ ==========
    polycarbonate: {
        category: "Поликарбонат",
        icon: "🏠",
        description: "Сотовый поликарбонат с УФ-защитой для теплиц",
        fullDescription: "Поликарбонат обеспечивает отличную теплоизоляцию и светопропускание. Все типы имеют защиту от ультрафиолета, что продлевает срок службы материала.",
        parametersImage: "image/products/polycarbonate/parameters.png",
        types: {
            standard_4mm: {
                name: "4 мм Стандарт",
                description: "Стандартный поликарбонат толщиной 4 мм. Оптимальное соотношение цены и качества.",
                weight: "0.47 кг/м²",
                photos: [
                    "image/products/polycarbonate/standard_4mm_1.jpg",
                    "image/products/polycarbonate/standard_4mm_2.jpg",
                    "image/products/polycarbonate/standard_4mm_3.jpg",
                    "image/products/polycarbonate/standard_4mm_4.jpg",
                    "image/products/polycarbonate/standard_4mm_5.jpg",
                    "image/products/polycarbonate/standard_4mm_6.jpg"
                ]
            },
            lux_4mm: {
                name: "4 мм Люкс",
                description: "Улучшенный поликарбонат толщиной 4 мм. Повышенная прочность и долговечность.",
                weight: "0.52 кг/м²",
                photos: [
                    "image/products/polycarbonate/lux_4mm_1.jpg",
                    "image/products/polycarbonate/lux_4mm_2.jpg",
                    "image/products/polycarbonate/lux_4mm_3.jpg",
                    "image/products/polycarbonate/lux_4mm_4.jpg",
                    "image/products/polycarbonate/lux_4mm_5.jpg",
                    "image/products/polycarbonate/lux_4mm_6.jpg",
                    "image/products/polycarbonate/lux_4mm_7.jpg"
                ]
            },
            premium_6mm: {
                name: "6 мм Премиум",
                description: "Премиальный поликарбонат толщиной 6 мм. Максимальная прочность и теплоизоляция.",
                weight: "0.8 кг/м²",
                photos: [
                    "image/products/polycarbonate/premium_6mm_1.jpg",
                    "image/products/polycarbonate/premium_6mm_2.jpg",
                    "image/products/polycarbonate/premium_6mm_3.jpg",
                    "image/products/polycarbonate/premium_6mm_4.jpg",
                    "image/products/polycarbonate/premium_6mm_5.jpg",
                    "image/products/polycarbonate/premium_6mm_6.jpg",
                    "image/products/polycarbonate/premium_6mm_7.jpg"
                ]
            }
        }
    },

    // ========== ДВЕРИ И ФОРТОЧКИ ==========
    doorsWindows: {
        category: "Двери и форточки",
        icon: "🚪",
        description: "Двери и форточки для теплиц. Обеспечивают удобный доступ в теплицу и естественную вентиляцию для создания оптимального микроклимата.",
        doors: {
            description: "Двери для теплиц из оцинкованной стали. Обеспечивают удобный доступ в теплицу. Комплектуются надежной фурнитурой для долговечной эксплуатации.",
            photos: [
                "image/products/doors-windows/door_1.jpg",
                "image/products/doors-windows/door_2.jpg",
                "image/products/doors-windows/door_3.jpg",
                "image/products/doors-windows/door_4.jpg",
                "image/products/doors-windows/door_5.jpg"
            ],
            furniture: [
                "image/products/doors-windows/door_furniture_1.jpg",
                "image/products/doors-windows/door_furniture_2.jpg",
                "image/products/doors-windows/door_furniture_3.jpg",
                "image/products/doors-windows/door_furniture_4.jpg",
                "image/products/doors-windows/door_furniture_5.jpg"
            ],
            parameters: null // Будет заполнено после извлечения из .docx
        },
        windows: {
            side: {
                photos: [
                    "image/products/doors-windows/window_side_1.jpg",
                    "image/products/doors-windows/window_side_2.jpg",
                    "image/products/doors-windows/window_side_3.jpg",
                    "image/products/doors-windows/window_side_4.jpg",
                    "image/products/doors-windows/window_side_5.jpg",
                    "image/products/doors-windows/window_side_6.jpg",
                    "image/products/doors-windows/window_side_7.jpg",
                    "image/products/doors-windows/window_side_8.jpg",
                    "image/products/doors-windows/window_side_9.jpg",
                    "image/products/doors-windows/window_side_10.jpg",
                    "image/products/doors-windows/window_side_11.jpg",
                    "image/products/doors-windows/window_side_12.jpg",
                    "image/products/doors-windows/window_side_13.jpg",
                    "image/products/doors-windows/window_side_14.jpg",
                    "image/products/doors-windows/window_side_15.jpg"
                ],
                description: "Боковые форточки для теплиц. Устанавливаются на боковых стенках теплицы. Обеспечивают эффективную вентиляцию и могут быть оснащены автоматом для форточки."
            },
            end: {
                photos: [
                    "image/products/doors-windows/window_end_1.jpg",
                    "image/products/doors-windows/window_end_2.jpg",
                    "image/products/doors-windows/window_end_3.jpg",
                    "image/products/doors-windows/window_end_4.jpg",
                    "image/products/doors-windows/window_end_5.jpg",
                    "image/products/doors-windows/window_end_6.jpg",
                    "image/products/doors-windows/window_end_7.jpg"
                ],
                description: "Торцевые форточки для теплиц. Устанавливаются в торцах теплицы. Обеспечивают дополнительную вентиляцию и могут быть оснащены автоматом для форточки."
            },
            furniture: {
                photos: [
                    "image/products/doors-windows/window_furniture_1.jpg",
                    "image/products/doors-windows/window_furniture_2.jpg",
                    "image/products/doors-windows/window_furniture_3.jpg",
                    "image/products/doors-windows/window_furniture_4.jpg",
                    "image/products/doors-windows/window_furniture_5.jpg",
                    "image/products/doors-windows/window_furniture_6.jpg",
                    "image/products/doors-windows/window_furniture_7.jpg"
                ],
                description: "Фурнитура для форточек. Надежные петли и механизмы для долговечной эксплуатации форточек."
            },
            sizes: "image/products/doors-windows/window_sizes.png"
        }
    },

    // ========== КАПЕЛЬНЫЙ ПОЛИВ ==========
    dripIrrigation: {
        category: "Капельный полив",
        icon: "💧",
        description: "Системы капельного полива для автоматического и механического полива растений в теплице. Обеспечивают равномерное увлажнение почвы, экономят воду и время.",
        automatic: {
            name: "Автоматический",
            description: "Автоматическая система капельного полива с таймером. Позволяет настроить режим полива и забыть о ручном поливе. Идеально подходит для тех, кто не может регулярно поливать растения.",
            photos: [
                "image/products/drip-irrigation/auto_1.jpg",
                "image/products/drip-irrigation/auto_2.jpg",
                "image/products/drip-irrigation/auto_3.jpg",
                "image/products/drip-irrigation/auto_4.jpg",
                "image/products/drip-irrigation/auto_5.jpg",
                "image/products/drip-irrigation/auto_6.jpg",
                "image/products/drip-irrigation/auto_7.jpg"
            ]
        },
        mechanical: {
            name: "Механический",
            description: "Механическая система капельного полива. Простая в использовании, не требует подключения к электричеству. Полив осуществляется вручную через кран.",
            photos: [
                "image/products/drip-irrigation/mech_1.jpg",
                "image/products/drip-irrigation/mech_2.jpg"
            ]
        }
    },

    // ========== ЛЕНТЫ ==========
    tapes: {
        category: "Ленты",
        icon: "📏",
        description: "Ленты для герметизации и защиты теплиц. Обеспечивают надежное соединение листов поликарбоната и защиту от протечек.",
        galvanized: {
            name: "Оцинкованная лента 30 м",
            description: "Оцинкованная лента для крепления и герметизации поликарбоната. Обеспечивает надежное соединение листов и защиту от протечек. Длина 30 метров достаточна для теплицы среднего размера.",
            photos: [
                "image/products/tapes/galvanized_1.jpg",
                "image/products/tapes/galvanized_2.jpg",
                "image/products/tapes/galvanized_3.jpg",
                "image/products/tapes/galvanized_4.jpg",
                "image/products/tapes/galvanized_5.jpg"
            ]
        },
        vaporPermeable: {
            name: "Паропропускная лента 25 м",
            description: "Паропропускная лента для торцов поликарбоната. Пропускает пар наружу, предотвращая запотевание внутри теплицы, но защищает от попадания пыли и насекомых. Длина 25 метров.",
            photos: [
                "image/products/tapes/vapor_1.jpg",
                "image/products/tapes/vapor_2.jpg",
                "image/products/tapes/vapor_3.jpg"
            ],
            video: "video/products/tapes_vapor.mp4"
        },
        parameters: null // Будет заполнено после извлечения из .docx
    },

    // ========== РАСХОДНИКИ ==========
    consumables: {
        category: "Расходники",
        icon: "🔧",
        description: "Крепеж и расходные материалы для сборки теплиц. Все элементы из оцинкованной стали для защиты от коррозии.",
        anchors: {
            name: "Анкера",
            description: "Анкерные болты для крепления теплицы к бетонному фундаменту. Обеспечивают надежное и долговечное крепление конструкции.",
            photos: [
                "image/products/consumables/anchors_1.jpg",
                "image/products/consumables/anchors_2.jpg"
            ],
            parameters: null
        },
        bolts: {
            name: "Болты для крабов МС5.8",
            description: "Болты класса прочности МС5.8 для крепления краб-системы. Обеспечивают надежное соединение элементов каркаса. Используются по 4 штуки на каждый краб.",
            photos: [
                "image/products/consumables/bolts_1.jpg",
                "image/products/consumables/bolts_2.jpg"
            ]
        },
        crabs: {
            tShape: {
                name: "Крабы Т-образные",
                description: "Т-образные соединители (крабы) для каркаса теплицы. Крепятся на 4 болтах, обеспечивают прочное соединение профилей под углом. Повышают прочность и устойчивость конструкции.",
                photos: [
                    "image/products/consumables/crab_t_1.png",
                    "image/products/consumables/crab_t_2.jpg"
                ]
            },
            xShape: {
                name: "Крабы Х-образные",
                description: "Х-образные соединители (крабы) для каркаса теплицы. Крепятся на 4 болтах, обеспечивают прочное соединение профилей в местах пересечения. Равномерно распределяют нагрузку.",
                photos: [
                    "image/products/consumables/crab_x_1.png",
                    "image/products/consumables/crab_x_2.jpg"
                ]
            }
        },
        screws: {
            small: {
                name: "Саморез малый",
                description: "Малые саморезы для крепления оцинкованных уголков, цепей для автоматов, форточек (петель) и дверных петель. Оцинкованные, устойчивы к коррозии.",
                photos: [
                    "image/products/consumables/screw_small_1.jpg"
                ]
            },
            bracing: {
                name: "Саморезы для крепления бруса",
                description: "Саморезы для крепления основания теплицы к брусу. Обеспечивают надежное соединение каркаса с деревянным основанием.",
                photos: [
                    "image/products/consumables/screw_bracing_1.jpg"
                ]
            },
            roofing: {
                name: "Саморезы кровельные",
                description: "Кровельные саморезы для крепления поликарбоната к каркасу. Имеют уплотнительную шайбу для защиты от протечек. Оцинкованные, устойчивы к коррозии.",
                photos: [
                    "image/products/consumables/screw_roofing_1.jpg",
                    "image/products/consumables/screw_roofing_2.jpg"
                ]
            }
        }
    },

    // ========== ТЕРМОПРИВОД ==========
    thermodrive: {
        category: "Термопривод",
        icon: "🌡️",
        name: "Автомат для форточки",
        description: "Автоматическое устройство для открытия и закрытия форточки в зависимости от температуры в теплице. Работает без электричества, используя принцип расширения жидкости при нагреве. Обеспечивает оптимальную вентиляцию и защиту растений от перегрева.",
        photos: [
            "image/products/thermodrive/photo_1.jpg",
            "image/products/thermodrive/photo_2.jpg",
            "image/products/thermodrive/photo_3.jpg",
            "image/products/thermodrive/photo_4.jpg",
            "image/products/thermodrive/photo_5.jpg",
            "image/products/thermodrive/photo_6.jpg",
            "image/products/thermodrive/photo_7.jpg"
        ]
    },

    // ========== УГОЛОК ОЦИНКОВАННЫЙ ==========
    corner: {
        category: "Уголок оцинкованный",
        icon: "📐",
        description: "Оцинкованный уголок для усиления и соединения элементов каркаса теплицы. Обеспечивает дополнительную прочность конструкции в местах соединений.",
        photos: [
            "image/products/corner/photo_1.jpg",
            "image/products/corner/photo_2.jpg",
            "image/products/corner/photo_3.jpg",
            "image/products/corner/photo_4.jpg",
            "image/products/corner/photo_5.jpg",
            "image/products/corner/photo_6.jpg",
            "image/products/corner/photo_7.jpg",
            "image/products/corner/photo_8.jpg",
            "image/products/corner/photo_9.jpg",
            "image/products/corner/photo_10.jpg",
            "image/products/corner/photo_11.jpg",
            "image/products/corner/photo_12.jpg"
        ]
    },

    // ========== ФУНДАМЕНТ ==========
    foundation: {
        category: "Фундамент",
        icon: "🏗️",
        description: "Элементы фундамента для теплиц. Обеспечивают надежное основание и фиксацию конструкции.",
        bracing: {
            name: "Брус",
            description: "Деревянный брус 100×100 мм, пропитанный составом «Неомид» против грибка, гниения и вредителей. Поднимает теплицу примерно на 10 см, обеспечивает лучшее сохранение тепла, защиту от грызунов и равномерное распределение нагрузки от снега. Оптимально сочетать с грунтозацепами для максимальной надежности.",
            photos: [
                "image/products/foundation/bracing_1.jpg",
                "image/products/foundation/bracing_2.jpg",
                "image/products/foundation/bracing_3.jpg",
                "image/products/foundation/bracing_4.jpg"
            ]
        },
        groundHooks: {
            name: "Грунтозацепы",
            description: "Металлические штыри, вбиваемые в землю для фиксации теплицы. Защищают конструкцию от сноса ветром. Бюджетное и практичное решение, особенно для ветреных регионов. Оптимально сочетать с брусом для максимальной надежности.",
            photos: [
                "image/products/foundation/ground_hooks_1.jpg",
                "image/products/foundation/ground_hooks_2.jpg"
            ]
        },
        plates: {
            name: "Пластины и уголки для крепления бруса",
            description: "Металлические пластины и уголки для надежного крепления каркаса теплицы к брусу. Обеспечивают прочное соединение и дополнительную стабильность конструкции.",
            photos: [
                "image/products/foundation/plates_1.jpg"
            ]
        },
        parameters: null // Будет заполнено после извлечения из .docx
    },

    // ========== СЛЕДЫ ОТ ТРУБОГИБА ==========
    pipeBends: {
        category: "Следы от трубогиба",
        icon: "📐",
        description: "Пояснение о следах от трубогиба на профиле каркаса теплицы",
        explanation: "Следы от трубогиба — это видимые следы на профиле, которые остаются после процесса гибки труб на производстве. Это нормальное явление и не является дефектом. Следы не влияют на прочность и долговечность каркаса, так как профиль изготавливается из оцинкованной стали с защитным покрытием 80 мкм.",
        photos: [
            "image/products/pipe-bends/photo_1.jpg",
            "image/products/pipe-bends/photo_2.jpg",
            "image/products/pipe-bends/photo_3.jpg"
        ]
    }
};

/**
 * Получить данные о товаре по ID
 * @param {string} productId - ID товара
 * @returns {Object|null} Данные о товаре или null
 */
function getProductData(productId) {
    const mapping = {
        'gryadki': PRODUCTS_DATA.gryadki,
        'polycarbonate': PRODUCTS_DATA.polycarbonate,
        'doors-windows': PRODUCTS_DATA.doorsWindows,
        'drip-irrigation': PRODUCTS_DATA.dripIrrigation,
        'tapes': PRODUCTS_DATA.tapes,
        'consumables': PRODUCTS_DATA.consumables,
        'thermodrive': PRODUCTS_DATA.thermodrive,
        'corner': PRODUCTS_DATA.corner,
        'foundation': PRODUCTS_DATA.foundation,
        'pipe-bends': PRODUCTS_DATA.pipeBends
    };
    
    return mapping[productId] || null;
}

// Делаем функцию доступной глобально
window.getProductData = getProductData;
