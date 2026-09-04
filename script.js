const searchForm = document.querySelector('#book-search-form');
const searchInput = document.querySelector('#book-search-input');
const resultsGrid = document.querySelector('#search-results');
const resultsCount = document.querySelector('#results-count');

const booksApiUrl = 'https://openlibrary.org/search.json';

function formatYear(date) {
	return date ? `${String(date).slice(0, 4)} рік` : 'Рік невідомий';
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, character => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;',
		'"': '&quot;'
	})[character]);
}

function createBookCard(book) {
	const title = book.title || 'Без назви';
	const author = book.author_name?.join(', ') || 'Автор невідомий';
	const cover = book.cover_i
		? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
		: '';
	const genre = book.subject?.[0] || 'Книга';
	const rating = book.ratings_average ? book.ratings_average.toFixed(1) : 'Немає оцінки';
	const coverStyle = cover ? ` style="background-image: url('${escapeHtml(cover)}')"` : '';

	return `
		<article class="book-card">
			<div class="card-top">
				<div class="cover-container"${coverStyle}>
					<div class="genre-tag">${escapeHtml(genre)}</div>
				</div>
				<div class="details">
					<div>
						<div class="book-title">${escapeHtml(title)}</div>
						<div class="book-author">${escapeHtml(author)}</div>
					</div>
					<div class="meta-row">
						<div class="rating">
							<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
							<div class="rating-text">${escapeHtml(rating)}</div>
						</div>
						<div class="year">${escapeHtml(formatYear(book.first_publish_year))}</div>
					</div>
				</div>
			</div>
			<div class="card-footer">
				<button class="btn-add" type="button">Додати до моїх</button>
			</div>
		</article>`;
}

async function searchBooks(event) {
	event.preventDefault();
	const query = searchInput.value.trim();

	if (!query) {
		searchInput.focus();
		return;
	}

	resultsGrid.setAttribute('aria-busy', 'true');
	resultsGrid.innerHTML = '<p class="search-status">Шукаємо книги...</p>';
	resultsCount.textContent = 'Пошук...';

	try {
		const response = await fetch(`${booksApiUrl}?q=${encodeURIComponent(query)}&limit=12&fields=title,author_name,first_publish_year,subject,cover_i,ratings_average`);
		if (!response.ok) throw new Error('API request failed');

		const data = await response.json();
		const books = data.docs || [];

		resultsCount.textContent = `${books.length} знайдено`;
		resultsGrid.innerHTML = books.length
			? books.map(createBookCard).join('')
			: '<p class="search-status">За цим запитом книг не знайдено.</p>';
	} catch (error) {
		resultsCount.textContent = 'Помилка';
		resultsGrid.innerHTML = '<p class="search-status">Не вдалося виконати пошук. Перевірте з’єднання та спробуйте ще раз.</p>';
	} finally {
		resultsGrid.removeAttribute('aria-busy');
	}
}

searchForm.addEventListener('submit', searchBooks);
 