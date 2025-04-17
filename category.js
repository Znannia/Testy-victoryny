const API_KEYS = ['YOUR_API_KEY_1', 'YOUR_API_KEY_2']; // Замініть на свої ключі
let currentKeyIndex = 0;

async function fetchWithKey(url) {
    const response = await fetch(`${url}&key=${API_KEYS[currentKeyIndex]}`);
    if (response.status === 403 && currentKeyIndex < API_KEYS.length - 1) {
        currentKeyIndex++;
        return fetchWithKey(url);
    }
    return response;
}

async function filterNonShorts(videoIds) {
    if (!videoIds.length) return [];
    try {
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}`
        );
        if (!response.ok) {
            console.error('Помилка при отриманні деталей відео:', response.status);
            return videoIds; // Повертаємо всі ID, якщо не вдалося перевірити
        }
        const data = await response.json();
        return data.items
            .filter(item => {
                const duration = item.contentDetails.duration;
                const seconds = parseDuration(duration);
                return seconds > 60; // Виключаємо відео коротше 60 секунд
            })
            .map(item => item.id);
    } catch (error) {
        console.error('Помилка в filterNonShorts:', error);
        return videoIds; // Повертаємо всі ID у разі помилки
    }
}

function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

function cleanDescription(description) {
    return description.replace(/(?:\r\n|\r|\n)/g, '<br>').substring(0, 200) + '...';
}

function renderVideos(videos, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    videos.forEach(item => {
        const videoId = item.snippet.resourceId.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.high.url;
        const description = cleanDescription(item.snippet.description);
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `
            <div class="video-container">
                <img src="${thumbnail}" alt="${title}" class="thumbnail" data-video-id="${videoId}">
            </div>
            <a href="https://www.youtube.com/watch?v=${videoId}" class="video-title" target="_blank">${title}</a>
            <div class="video-actions">
                <button class="comment-btn">Коментувати</button>
                <div class="like-container">
                    <span class="heart" data-video-id="${videoId}">&#9829;</span>
                    <span class="like-count">0</span>
                </div>
                <button class="more-btn">Більше</button>
            </div>
            <div class="comment-box">
                <textarea placeholder="Ваш коментар..."></textarea>
                <button class="submit-comment">Надіслати</button>
            </div>
            <div class="comment-list"></div>
            <div class="description-box">
                <p>${description}</p>
            </div>
        `;
        container.appendChild(videoItem);
    });

    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video-id');
            const container = thumbnail.parentElement;
            container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
        });
    });

    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentBox = button.parentElement.nextElementSibling;
            commentBox.style.display = commentBox.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.submit-comment').forEach(button => {
        button.addEventListener('click', () => {
            const textarea = button.previousElementSibling;
            const commentList = button.parentElement.nextElementSibling;
            const comment = textarea.value.trim();
            if (comment) {
                const commentElement = document.createElement('p');
                commentElement.textContent = comment;
                commentList.appendChild(commentElement);
                textarea.value = '';
            }
        });
    });

    document.querySelectorAll('.heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.classList.toggle('liked');
            const likeCount = heart.nextElementSibling;
            let count = parseInt(likeCount.textContent);
            likeCount.textContent = heart.classList.contains('liked') ? count + 1 : count - 1;
        });
    });

    document.querySelectorAll('.more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const descriptionBox = button.parentElement.nextElementSibling.nextElementSibling.nextElementSibling;
            descriptionBox.style.display = descriptionBox.style.display === 'block' ? 'none' : 'block';
        });
    });
}

async function loadCategoryVideos() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    document.getElementById('category-title').innerText = category || 'Категорія';

    const playlistIds = {
        'Географія': 'PL0usNaN5iwMLzUsoaY3W1gY0x_8iFzBjd', // Перевірено
        'Історія': 'PL0usNaN5iwMLgW1MBNM-F3yMLU3f3uVv2', // Перевірено
        'Україна': 'PL0usNaN5iwMJkDqUYy5oW8pTKb7q27V_9', // Перевірено
        'Біблія': 'PL0usNaN5iwMKp5vD0oCXIQwUc3O0W2jA0', // Перевірено
        'Загальні': 'PL0usNaN5iwMLj0j9aF7G0jTqWFM3iKYhK', // Перевірено
        'Логіка': 'PL0usNaN5iwMLHXzNKh2yQ6iJUsiN4yqA_', // Перевірено
        'Що зайве': 'PL0usNaN5iwMJmWbrzV0aG5SlDngSbuu7Q', // Перевірено
        'Різне': 'PL0usNaN5iwML4WQXUmO3Qz2w0Xz0KxgdY' // Перевірено
    };

    const playlistId = playlistIds[category];
    const videosDiv = document.getElementById('category-videos');

    if (!playlistId) {
        videosDiv.innerHTML = '<p>Категорію не знайдено</p>';
        return;
    }

    videosDiv.classList.add('loading');
    try {
        const response = await fetchWithKey(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}`
        );
        if (!response.ok) {
            throw new Error(`Помилка API: ${response.status}`);
        }
        const data = await response.json();
        const videos = data.items;

        if (!videos || videos.length === 0) {
            videosDiv.innerHTML = '<p>У цій категорії поки немає відео</p>';
            return;
        }

        const videoIds = videos.map(item => item.snippet.resourceId.videoId);
        const nonShorts = await filterNonShorts(videoIds);
        const filteredVideos = videos.filter(item => nonShorts.includes(item.snippet.resourceId.videoId));

        if (filteredVideos.length === 0) {
            videosDiv.innerHTML = '<p>У цій категорії поки немає відео довше 60 секунд</p>';
            return;
        }

        renderVideos(filteredVideos, 'category-videos');
    } catch (error) {
        console.error(`Помилка завантаження відео для категорії ${category}:`, error);
        videosDiv.innerHTML = `<p>Помилка завантаження відео: ${error.message}</p>`;
    } finally {
        videosDiv.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategoryVideos();

    const categoriesBtn = document.getElementById('categories-btn');
    const categoriesList = document.getElementById('categories-list');
    categoriesBtn.addEventListener('click', () => {
        categoriesList.style.display = categoriesList.style.display === 'none' ? 'block' : 'none';
    });
});
