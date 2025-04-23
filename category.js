// Масив API-ключів для ротації
const API_KEYS = [
    'AIzaSyBIsnxOgHVW7AbYsYLZ6yMUF8f3PZFQFqc',
    'AIzaSyBUIKh8TbT05XmLQTsQq9aXwf0RsiB-GR0',
];
let currentKeyIndex = 0;

const CHANNEL_ID = 'UC0usNaN5iwML35qPxASBDWQ';

// Описи для категорій
const categoryDescriptions = {
    'Загальні знання': 'Перевірте свою ерудицію з тестами на загальні знання! Від історії до науки — ці вікторини ідеальні для дітей і дорослих, щоб весело провести час і дізнатися щось нове разом із родиною. Пройдіть тест прямо зараз!',
    'Біблія': 'Зануртеся у світ Святого Письма з вікторинами про Біблію! Перевірте, як добре ви знаєте біблійні сюжети та персонажів разом із сім’єю. Пройдіть тест і поглибте свої знання!',
    'Не програєш': 'Готові до сміху та веселощів? Ці вікторини з несподіваними питаннями ідеальні для гри з друзями чи родиною. Дізнайтесь цікаве один про одного та пройдіть тест разом!',
    'Що зайве': 'Потренуйте мозок із тестами на пошук зайвого чи подібного разом із родиною! Ці завдання покращують концентрацію та увагу. Прийміть виклик і перевірте свої навички!',
    'Логіка': 'Перевірте свою кмітливість із тестами на логіку разом із сім’єю! Ці загадки — чудовий спосіб потренувати розум і весело провести час. Спробуйте розв’язати всі завдання!',
    'Історія': 'Досліджуйте минуле з вікторинами про історію, міфи та легенди разом із родиною! Перевірте знання про давні цивілізації й таємничі сюжети. Пройдіть тест і дізнайтесь більше!',
    'Географія': 'Мандруйте світом із географічними тестами разом із сім’єю! Від країн до природних чудес — ці вікторини підходять усім, хто любить географію. Перевірте свої знання вже зараз!',
    'Україна': 'Поглибте знання про Україну з тестами про її історію та культуру разом із родиною! Дізнайтесь більше про традиції, події та видатних постатей. Пройдіть вікторину прямо зараз!'
};

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

// Отримуємо категорію з URL
const urlParams = new URLSearchParams(window.location.search);
const category = decodeURIComponent(urlParams.get('category') || '');

// Перевірка валідності категорії
const validCategories = Object.keys(playlistIds);
if (!validCategories.includes(category)) {
    window.location.replace('https://www.znannia.online/');
}

const playlistId = playlistIds[category];

// Відображаємо назву категорії
const titleElement = document.getElementById('category-title');
if (titleElement) {
    titleElement.textContent = category || 'Вікторини та тести';
} else {
    console.error('Елемент category-title не знайдено');
}

// Відображаємо опис категорії
const descriptionElement = document.getElementById('category-description');
if (descriptionElement) {
    const description = categoryDescriptions[category] || 'Цікаві тести та вікторини для всієї родини!';
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
        categoryDescriptions[category] || 'Дивіться вікторини та тести з категорії на YouTube-каналі Знання для всіх. Цікаво для всієї родини!'
    );
}
const existingKeywords = document.querySelector('meta[name="keywords"]');
if (existingKeywords) {
    existingKeywords.setAttribute('content', `знання для всіх, вікторини, тести, ${category || 'категорії'}, освіта, Україна, НМТ 2025`);
} else {
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = `знання для всіх, вікторини, тести, ${category || 'категорії'}, освіта, Україна, НМТ 2025`;
    document.head.appendChild(metaKeywords);
}
const canonicalLink = document.createElement('link');
canonicalLink.rel = 'canonical';
canonicalLink.href = window.location.href;
document.head.appendChild(canonicalLink);
const existingRobots = document.querySelector('meta[name="robots"]');
if (existingRobots) {
    existingRobots.setAttribute('content', 'index, follow');
} else {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'index, follow';
    document.head.appendChild(metaRobots);
}

// Додаємо структуровану розмітку (JSON-LD)
const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': `Вікторини з ${category || 'Категорії'} - Знання для всіх`,
    'description': categoryDescriptions[category] || 'Цікаві тести та вікторини для всієї родини!',
    'thumbnailUrl': 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg',
    'uploadDate': '2025-04-21',
    'contentUrl': 'https://www.youtube.com/watch?v=VIDEO_ID'
};
const schemaScript = document.createElement('script');
schemaScript.type = 'application/ld+json';
schemaScript.text = JSON.stringify(videoSchema);
document.head.appendChild(schemaScript);

// Функція для виконання запитів з ротацією ключів
async function fetchWithKey(url) {
    try {
        const response = await fetch(`${url}&key=${API_KEYS[currentKeyIndex]}`);
        if (!response.ok && (response.status === 403 || response.status === 429)) {
            console.warn(`Помилка ${response.status} для ключа ${currentKeyIndex}. Спробуємо наступний ключ.`);
            currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
            return fetchWithKey(url);
        }
        return response;
    } catch (error) {
        console.error('Помилка запиту:', error);
        throw error;
    }
}

// Отримання кількості підписників
async function fetchSubscribers() {
    const subscribersDiv = document.getElementById('subscribers');
    const cacheKey = 'subscribersCount';
    const cacheTimeKey = 'subscribersTime';
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 години
    const now = new Date();
    const currentTime = now.getTime();
    const hours = now.getHours();

    const shouldUpdate = hours === 17;
    const cachedSubscribers = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedSubscribers && cachedTime && currentTime - cachedTime < cacheDuration && !shouldUpdate) {
        subscribersDiv.innerHTML = `Нас уже понад<br><span class="subscribers-count">${cachedSubscribers}</span>`;
        return;
    }

    try {
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}`
        );
        if (!response.ok) {
            throw new Error('Не вдалося отримати дані про підписників');
        }
        const data = await response.json();
        const subscriberCount = data.items[0].statistics.subscriberCount;
        localStorage.setItem(cacheKey, subscriberCount);
        localStorage.setItem(cacheTimeKey, currentTime.toString());
        subscribersDiv.innerHTML = `Нас уже понад<br><span class="subscribers-count">${subscriberCount}</span>`;
    } catch (error) {
        console.error('Помилка завантаження підписників:', error);
        subscribersDiv.innerHTML = 'Помилка завантаження підписників';
    }
}
fetchSubscribers();

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
    try {
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}`
        );
        if (!response.ok) {
            console.error('Помилка API:', response.status, response.statusText);
            return videoIds;
        }
        const data = await response.json();
        const nonShorts = [];
        data.items.forEach((item, index) => {
            const duration = item.contentDetails.duration;
            const durationSeconds = parseDuration(duration);
            if (durationSeconds >= 60) {
                nonShorts.push(videoIds[index]);
            }
        });
        return nonShorts;
    } catch (error) {
        console.error('Помилка фільтрації шортсів:', error);
        return videoIds;
    }
}

// Парсинг тривалості відео
function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

// Очищення опису
function cleanDescription(description) {
    return description
        .replace(/#[\wА-Яа-я]+/g, '')
        .replace(/Вітаємо на каналі "Знання для всіх"/gi, '')
        .trim();
}

// Рендеринг відео
async function renderVideos(videos, container) {
    container.innerHTML = '';
    if (videos.length === 0) {
        container.innerHTML = '<p>Немає доступних відео.</p>';
        return;
    }

    // Оновлюємо JSON-LD із першим відео
    if (videos[0]) {
        const videoId = videos[0].snippet.resourceId.videoId;
        videoSchema.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        videoSchema.contentUrl = `https://www.youtube.com/watch?v=${videoId}`;
        schemaScript.text = JSON.stringify(videoSchema);
    }

    for (const video of videos) {
        const videoId = video.snippet.resourceId.videoId;
        const title = video.snippet.title;
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        let description = '';
        try {
            const response = await fetchWithKey(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`
            );
            if (response.ok) {
                const data = await response.json();
                description = cleanDescription(data.items[0].snippet.description);
            }
        } catch (error) {
            console.error('Помилка завантаження опису:', error);
        }

        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';
        videoElement.innerHTML = `
            <div class="video-container">
                <img src="${thumbnail}" alt="${title}" class="thumbnail" data-video-id="${videoId}">
            </div>
            <p class="video-title" data-video-id="${videoId}">${title}</p>
            <div class="video-actions">
                <button class="comment-btn">Коментар</button>
                <div class="like-container">
                    <span class="heart${localStorage.getItem(`liked_${videoId}`) ? ' liked' : ''}" data-video-id="${videoId}">${localStorage.getItem(`liked_${videoId}`) ? '♥' : '♡'}</span>
                    <span class="like-count" data-video-id="${videoId}">${localStorage.getItem(`likes_${videoId}`) || 0}</span>
                </div>
                <button class="more-btn" data-video-id="${videoId}">Більше</button>
            </div>
            <div class="comment-box" style="display: none;">
                <textarea placeholder="Ваш коментар..." rows="4"></textarea>
                <button class="submit-comment">Відправити</button>
                <div class="comment-list"></div>
            </div>
            <div class="description-box" style="display: none;" data-video-id="${videoId}">
                <p>${description || 'Опис недоступний'}</p>
            </div>
        `;
        container.appendChild(videoElement);

        const commentList = videoElement.querySelector('.comment-list');
        const savedComments = JSON.parse(localStorage.getItem(`comments_${videoId}`) || '[]');
        savedComments.forEach((comment) => {
            const commentElement = document.createElement('p');
            commentElement.textContent = comment;
            commentList.appendChild(commentElement);
        });
    }

    container.querySelectorAll('.video-title, .thumbnail').forEach((element) => {
        let isPlayerActive = false;
        element.addEventListener('click', (e) => {
            const videoId = e.target.getAttribute('data-video-id');
            const container = e.target.closest('.video-item').querySelector('.video-container');
            if (!isPlayerActive) {
                container.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
                `;
                isPlayerActive = true;
            }
        });
    });

    container.querySelectorAll('.comment-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const commentBox = btn.parentElement.nextElementSibling;
            commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
        });
    });

    container.querySelectorAll('.submit-comment').forEach((btn) => {
        btn.addEventListener('click', () => {
            const textarea = btn.previousElementSibling;
            const videoId = btn.closest('.video-item').querySelector('.heart').getAttribute('data-video-id');
            const commentList = btn.nextElementSibling;
            if (textarea.value.trim()) {
                const commentElement = document.createElement('p');
                commentElement.textContent = textarea.value.trim();
                commentList.appendChild(commentElement);
                const savedComments = JSON.parse(localStorage.getItem(`comments_${videoId}`) || '[]');
                savedComments.push(textarea.value.trim());
                localStorage.setItem(`comments_${videoId}`, JSON.stringify(savedComments));
                textarea.value = '';
            }
        });
    });

    container.querySelectorAll('.heart').forEach((heart) => {
        const videoId = heart.getAttribute('data-video-id');
        heart.addEventListener('click', () => {
            let likes = parseInt(localStorage.getItem(`likes_${videoId}`) || 0);
            if (!localStorage.getItem(`liked_${videoId}`)) {
                likes += 1;
                heart.classList.add('liked');
                heart.innerHTML = '♥';
                localStorage.setItem(`liked_${videoId}`, 'true');
                localStorage.setItem(`likes_${videoId}`, likes);
            } else {
                likes -= 1;
                heart.classList.remove('liked');
                heart.innerHTML = '♡';
                localStorage.removeItem(`liked_${videoId}`);
                localStorage.setItem(`likes_${videoId}`, likes);
            }
            heart.nextElementSibling.textContent = likes;
        });
    });

    container.querySelectorAll('.more-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video-id');
            const descriptionBox = btn.parentElement.nextElementSibling.nextElementSibling;
            if (descriptionBox.style.display === 'none') {
                descriptionBox.style.display = 'block';
                btn.textContent = 'Менше';
            } else {
                descriptionBox.style.display = 'none';
                btn.textContent = 'Більше';
            }
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

    const cachedVideos = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    if (cachedVideos && cachedTime && now - cachedTime < cacheDuration) {
        console.log('Використовуємо кешовані відео');
        let videos = JSON.parse(cachedVideos).filter(
            (video) =>
                video.snippet &&
                video.snippet.title &&
                video.snippet.title !== 'Private video' &&
                video.snippet.title !== 'Deleted video' &&
                video.snippet.resourceId &&
                video.snippet.resourceId.videoId
        );
        if (videos.length === 0) {
            videosDiv.innerHTML = '<p>Немає доступних відео.</p>';
            videosDiv.classList.remove('loading');
            return;
        }
        await renderVideos(videos, videosDiv);
        localStorage.setItem(cacheKey, JSON.stringify(videos));
        videosDiv.classList.remove('loading');
        return;
    }

    try {
        if (!playlistId) {
            throw new Error('Категорія не знайдена');
        }

        console.log('Завантажуємо відео для плейлиста:', playlistId);
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=${playlistId}&maxResults=50`
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
                item.snippet.title &&
                item.snippet.title !== 'Private video' &&
                item.snippet.title !== 'Deleted video' &&
                item.status &&
                item.status.privacyStatus === 'public'
        );

        const videoIds = videos.map((video) => video.snippet.resourceId.videoId);
        const nonShortsIds = await filterNonShorts(videoIds);
        videos = videos.filter((video) => nonShortsIds.includes(video.snippet.resourceId.videoId));

        if (videos.length === 0) {
            videosDiv.innerHTML = '<p>Немає доступних відео.</p>';
            videosDiv.classList.remove('loading');
            return;
        }

        localStorage.setItem(cacheKey, JSON.stringify(videos));
        localStorage.setItem(cacheTimeKey, now.toString());

        await renderVideos(videos, videosDiv);
    } catch (error) {
        console.error('Помилка завантаження відео:', error);
        videosDiv.innerHTML = `<p>Помилка завантаження відео: ${error.message}. Спробуйте пізніше.</p>`;
    } finally {
        videosDiv.classList.remove('loading');
    }
}

// Показ/приховування списку категорій у футері
document.getElementById('categories-btn').addEventListener('click', () => {
    const list = document.getElementById('categories-list');
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
});

// Запускаємо завантаження
fetchCategoryVideos();
