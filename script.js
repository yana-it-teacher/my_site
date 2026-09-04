document.addEventListener('DOMContentLoaded', () => {
// Асинхронна функція для пошуку книг
async function searchBooks(query) {
    // Змінили URL на Open Library API
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;

    try {
        console.log(`Шукаємо: "${query}"...`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Повна відповідь від сервера:', data);
        
        // В Open Library масив результатів лежить у властивості docs
        if (data.docs && data.docs.length > 0) {
            console.log('--- Знайдені книги ---');
            data.docs.forEach((book, index) => {
                const title = book.title;
                // Автори тут лежать у масиві author_name
                const author = book.author_name ? book.author_name.join(', ') : 'Невідомий автор';
                // Рік першого видання
                const year = book.first_publish_year ? book.first_publish_year : 'Рік невідомий';
                
                console.log(`${index + 1}. ${title} | ${author} | ${year}`);
            });
        } else {
            console.log('На жаль, за цим запитом нічого не знайдено.');
        }

    } catch (error) {
        console.error('Сталася помилка при пошуку:', error);
    }
}

// Знаходимо елементи на сторінці
const searchInput = document.querySelector('.input-wrapper input');
const searchBtn = document.querySelector('.search-btn');

// Додаємо обробник події на клік по кнопці
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim(); // Отримуємо текст і забираємо зайві пробіли
    
    if (query !== '') {
        searchBooks(query);
    } else {
        alarm('Введіть назву книги або автора для пошуку!');
    }
});

// Додатково: дозволяємо шукати по натисканню клавіші Enter у полі вводу
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query !== '') {
            searchBooks(query);
        }
    }
});

})