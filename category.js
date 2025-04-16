// Масив API-ключів для ротації
const API_KEYS = [
    'AIzaSyBIsnxOgHVW7AbYsYLZ6yMUF8f3PZFQFqc',
    // Додайте тут резервний ключ, якщо створите новий у Google Cloud Console
    // 'AIzaSyANIlHucfoyt3cMP5d06cV4uQX3Xx-XPLE',
];
let currentKeyIndex = 0;

// Описи для категорій
const categoryDescriptions = {
    'Загальні знання': 'Перевірте свою ерудицію з тестами на загальні знання! Від історії до науки — ці вікторини ідеальні для дітей і дорослих, щоб весело провести час і дізнатися щось нове. Пройдіть тест прямо зараз!',
    'Біблія': 'Зануртеся у світ Святого Письма з вікторинами про Біблію! Перевірте, як добре ви знаєте біблійні сюжети та персонажів. Пройдіть тест і поглибте свої знання!',
    'Ігри, В Які Неможливо Програти': 'Готові до сміху та веселощів? Ці вікторини з несподіваними питаннями ідеальні для гри з друзями чи родиною. Дізнайтесь цікаве один про одного та пройдіть тест разом!',
    'Що зайве': 'Потренуйте мозок із тестами на пошук зайвого чи подібного! Ці завдання покращують концентрацію та увагу. Прийміть виклик і перевірте свої навички!',
    'Логіка': 'Перевірте свою кмітливість із тестами на логіку! Ці загадки — чудовий спосіб потренувати розум і весело провести час. Спробуйте розв’язати всі завдання!',
    'Історія': 'Досліджуйте минуле з вікторинами про історію, міфи та легенди! Перевірте знання про давні цивілізації й таємничі сюжети. Пройдіть тест і дізнайтесь більше!',
    'Географія': 'Мандруйте світом із географічними тестами! Від країн до природних чудес — ці вікторини підходять усім, хто любить географію. Перевірте свої знання вже зараз!',
    'Україна': 'Поглибте знання про Україну з тестами про її історію та культуру! Дізнайтесь більше про традиції, події та видатних постатей. Пройдіть вікторину прямо зараз!'
};

// Отримуємо категорію з URL
const urlParams = new URLSearchParams(window.location.search);
const category = decodeURIComponent(urlParams.get('category'));

// Відображаємо назву категорії
const titleElement = document.getElementById('category-title');
if (titleElement) {
    titleElement.textContent = category || 'Категорія не вказана';
} else {
    console.error('Елемент category-title не знайдено');
}

// Відображаємо опис категорії
const descriptionElement = document.getElementById('category-description');
if (descriptionElement) {
    const description = categoryDescriptions[category] || 'Цікаві тести та вікторини для всіх!';
    descriptionElement.textContent = description;
} else {
    console.error('Елемент category-description не знайдено');
}

// Оновлюємо мета-теги для SEO
document.title = `Вікторини з ${category || 'Категорії'} - Знання для всіх`;
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
    metaDescription.setAttribute(
        'content',
        categoryDescriptions[category] || 'Дивіться вікторини та тести з категорії на YouTube-каналі Знання для всіх. Цікаво для всіх!'
    );
}
const existingKeywords = document.querySelector('meta[name="keywords"]');
if (existingKeywords) {
    existingKeywords.setAttribute('content', `вікторини, тести, ${category || 'категорії'}, знання для всіх, YouTube`);
} else {
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = `вікторини, тести, ${category || 'категорії'}, знання для всіх, YouTube`;
    document.head.appendChild(metaKeywords);
}

// Мапа плейлистів
const playlistIds = {
    'Географія': 'PLOI77RmcxMp7iQywXcinPbgpl4kTXx_oV',
    'Історія': 'PLOI77RmcxMp57Hj3qFR8kv0D1rYs-MJNO',
    'Біблія': 'PLOI77RmcxMp6bsY12dqBZ9tdf-EMf6lpY',
    'Україна': 'PLOI77RmcxMp7umvhlyP8jIgvCk_9gKUFN',
    'Загальні знання': 'PLOI77RmcxMp40BcW7EImRhMEtLFieW9B7',
    'Логіка': 'PLOI77RmcxMp69eZQe-B51PXjk-hG123nE',
    'Що зайве': 'PLOI77RmcxMp6jhCedjZf7QYOscN3KuMIO',
    'Не програєш': 'PLOI77RmcxMp5FIXH2Z9OGFTEhrGQjBi_S',
};

const playlistId = playlistIds[category];

// Функція для виконання запитів з ротацією ключів
async function fetchWithKey(url) {
    try {
        const response = await fetch(`${url}&key=${API_KEYS[currentKeyIndex]}`);
        if (!response.ok && (response.status === 403 || response.status === 429)) {
            console.warn(`Помилка ${response.status} для ключа ${currentKeyIndex}. Спробуємо наступний ключ.`);
            currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
            return fetchWithKey(url); // Спробувати з наступним ключем
        }
        return response;
    } catch (error) {
        console.error('Помилка запиту:', error);
        throw error;
    }
}

// Функція для фільтрації Shorts
async function filterNonShorts(videoIds) {
    if (!videoIds.length) {
        console.warn('Немає videoIds для фільтрації');
        return [];
    }
    if (category === 'Логіка') {
        console.log('Пропускаємо фільтр Shorts для Логіки');
        return videoIds;
    }
    const response = await fetchWithKey(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}`
    );
    if (!response.ok) {
        console.error('Помилка API:', response.status, response.statusText);
        return videoIds; // Повертаємо всі ID, якщо не вдалося перевірити тривалість
    }
    const data = await response.json();
    const nonShorts = [];
    data.items.forEach((item, index) => {
        const duration = item.contentDetails.duration;
        const durationSeconds = parseDuration(duration);
        console.log(`Відео ${videoIds[index]}: ${duration} (${durationSeconds}s)`);
        if (durationSeconds >= 60) {
            nonShorts.push(videoIds[index]);
        }
    });
    return nonShorts;
}

// Парсинг тривалості відео
function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

// Рендеринг відео
function renderVideos(videos, container) {
    videos.forEach((video) => {
        const videoId = video.snippet.resourceId.videoId;
        const title = video.snippet.title;
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const videoElement = document.createElement('div');
        videoElement.innerHTML = `
            <div class="video-container">
                <img src="${thumbnail}" alt="${title}" class="thumbnail" data-video-id="${videoId}">
            </div>
            <p>${title}</p>
        `;
        container.appendChild(videoElement);
    });

    document.querySelectorAll('.thumbnail').forEach((thumbnail) => {
        thumbnail.addEventListener('click', (e) => {
            const videoId = e.target.getAttribute('data-video-id');
            const container = e.target.parentElement;
            container.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
            `;
        });
    });
}

// Завантаження відео з плейлиста
async function fetchCategoryVideos() {
    const videosDiv = document.getElementById('category-videos');
    if (!videosDiv) {
        console.error('Елемент category-videos не знайдено');
        return;
    }
    const cacheKey = `categoryVideos_${category}`;
    const cacheTimeKey = `categoryVideosTime_${category}`;
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 години

    videosDiv.classList.add('loading');

    // Перевірка кешу
    const cachedVideos = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    if (cachedVideos && cachedTime && now - cachedTime < cacheDuration) {
        console.log('Використовуємо кешовані відео');
        const videos = JSON.parse(cachedVideos);
        renderVideos(videos, videosDiv);
        videosDiv.classList.remove('loading');
        return;
    }

    try {
        if (!playlistId) {
            throw new Error('Категорія не знайдена');
        }

        console.log('Завантажуємо відео для плейлиста:', playlistId);
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`
        );
        if (!response.ok) {
            throw new Error(`Помилка API: ${response.status}`);
        }
        const data = await response.json();
        console.log('API відповідь:', data);

        let videos = data.items.filter(
            (item) =>
                item.snippet &&
                item.snippet.resourceId &&
                item.snippet.resourceId.videoId &&
                item.snippet.title !== 'Private video'
        );

        const videoIds = videos.map((video) => video.snippet.resourceId.videoId);
        const nonShortsIds = await filterNonShorts(videoIds);
        videos = videos.filter((video) => nonShortsIds.includes(video.snippet.resourceId.videoId));

        if (videos.length === 0) {
            videosDiv.innerHTML = '<p>Немає доступних відео.</p>';
            videosDiv.classList.remove('loading');
            return;
        }

        // Зберігаємо в кеш
        localStorage.setItem(cacheKey, JSON.stringify(videos));
        localStorage.setItem(cacheTimeKey, now.toString());

        videosDiv.innerHTML = '';
        renderVideos(videos, videosDiv);
    } catch (error) {
        console.error('Помилка завантаження відео:', error);
        videosDiv.innerHTML = '<p>Помилка завантаження відео. Спробуйте пізніше.</p>';
    } finally {
        videosDiv.classList.remove('loading');
    }
}

// Запускаємо завантаження
fetchCategoryVideos();
