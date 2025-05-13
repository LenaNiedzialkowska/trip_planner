const defaultCategories={
        Ubrania: [
            {name: 'T-shirty', rule: (nights) => nights + 1},
            {name: 'Spodnie', rule: (nights) => Math.ceil(nights / 3)},
            {name: 'Bielizna', rule: (nights) => nights + 1},
        ],
        Kosmetyki: [
            { name: 'Szczoteczka do zębów', rule: () => 1 },
            { name: 'Szampon', rule: (nights) => Math.ceil(nights / 30) },
            { name: 'Żel pod prysznic', rule: (nights) => Math.ceil(nights / 30) },
            { name: 'Pasta do zębów', rule: (nights) => Math.ceil(nights / 30) },
        ],
        Elektronika: [
            { name: 'Ładowarka do telefonu', rule: () => 1 },
            { name: 'Powerbank', rule: () => 1 },
        ],
        Plaża: [
            { name: 'Strój kąpielowy', rule: (nights) =>  Math.min(2, nights) },
            { name: 'Ręcznik', rule: (nights) =>  Math.ceil(nights / 7) },
            { name: 'Klapki', rule: () =>  1 },
        ],
        Dziecko: [
            { name: 'Pieluchy', rule: (nights) =>  nights * 9 },
            { name: 'Mleko modyfikowane', rule: (nights) =>  Math.ceil(nights / 7) },
        ]
}

module.exports = defaultCategories;