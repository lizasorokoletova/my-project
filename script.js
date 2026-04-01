class BlogArticle {
    constructor({ id, title, text, date, image = "Selection.jpg" }) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.date = date;
        this.image = image;
    }

    render() {
        const article = document.createElement('article');
        article.className = 'blog-article';
        article.dataset.id = this.id;

        article.innerHTML = `
            <div class="blog-article-img">
                <img src="${this.image}" alt="Иконка">
            </div>
            <div class="blog-article-text">
                <h3 class="blog-article-title">${escapeHtml(this.title)}</h3>
                <p class="blog-article-description">${escapeHtml(this.text)}</p>
                <time datetime="${this.date}">${formatDate(this.date)}</time>
            </div>
            <button class="delete-btn" data-delete title="Удалить статью">✕</button>
        `;
        return article;
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

const STORAGE_KEY = 'blogPosts';
let articles = [];

function loadArticlesSync() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const raw = JSON.parse(stored);
            articles = raw.map(data => new BlogArticle(data));
        } catch (e) {
            console.error('Ошибка парсинга localStorage', e);
            articles = [];
        }
    } else {
        articles = [];
    }
    renderAllArticles();
}

function saveArticles() {
    const raw = articles.map(article => ({
        id: article.id,
        title: article.title,
        text: article.text,
        date: article.date,
        image: article.image
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
}

function deleteArticleById(id) {
    articles = articles.filter(article => article.id !== id);
    saveArticles();
    renderAllArticles();
}

function renderAllArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    container.innerHTML = '';
    articles.forEach(article => {
        container.appendChild(article.render());
    });
    updateStatsAndMessage();
}

function updateStatsAndMessage() {
    const total = articles.length;
    document.getElementById('totalPostsCount').textContent = total;
    document.getElementById('totalCommentsCount').textContent = '0';

    const noPostsMsg = document.getElementById('noPostsMessage');
    const articlesContainer = document.getElementById('articlesContainer');
    if (total === 0) {
        if (noPostsMsg) noPostsMsg.style.display = 'block';
        if (articlesContainer) articlesContainer.style.display = 'none';
    } else {
        if (noPostsMsg) noPostsMsg.style.display = 'none';
        if (articlesContainer) articlesContainer.style.display = 'grid';
    }
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

function disableUI(disabled = true) {
    const elements = [
        document.getElementById('createPostBtn'),
        document.getElementById('showStatsBtn'),
        document.getElementById('savePostBtn'),
        document.getElementById('cancelPostBtn'),
        document.getElementById('postTitle'),
        document.getElementById('postText')
    ];
    elements.forEach(el => {
        if (el) el.disabled = disabled;
    });
    const formBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    formBtns.forEach(btn => { if (btn) btn.disabled = disabled; });
}

function addArticleWithDelay(title, text) {
    showLoader();
    disableUI(true);

    setTimeout(() => {
        const newArticle = new BlogArticle({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
            title: title,
            text: text,
            date: new Date().toISOString().slice(0, 10),
            image: "article.jpg"
        });
        articles.push(newArticle);
        saveArticles();
        renderAllArticles();

        hideLoader();
        disableUI(false);
        postForm.reset();
        postForm.classList.add('hidden');
    }, 1500);
}

function init() {
    showLoader();
    disableUI(true);
    setTimeout(() => {
        loadArticlesSync();
        hideLoader();
        disableUI(false);
    }, 1500);
}

document.getElementById('articlesContainer')?.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-delete]');
    if (deleteBtn) {
        const articleElem = deleteBtn.closest('.blog-article');
        const id = articleElem?.dataset.id;
        if (id) {
            deleteArticleById(id);
        }
    }
});

const postForm = document.getElementById('postForm');
const postTitle = document.getElementById('postTitle');
const postText = document.getElementById('postText');

postForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = postTitle.value.trim();
    const text = postText.value.trim();
    if (!title || !text) {
        alert('Заполните заголовок и текст');
        return;
    }
    addArticleWithDelay(title, text);
});

const createPostBtn = document.getElementById('createPostBtn');
if (createPostBtn) {
    createPostBtn.addEventListener('click', () => {
        postForm.classList.remove('hidden');
        postTitle.value = '';
        postText.value = '';
        postForm.scrollIntoView({ behavior: 'smooth' });
    });
}

const cancelPostBtn = document.getElementById('cancelPostBtn');
if (cancelPostBtn) {
    cancelPostBtn.addEventListener('click', () => {
        postForm.reset();
        postForm.classList.add('hidden');
    });
}

const showStatsBtn = document.getElementById('showStatsBtn');
const statsDialog = document.getElementById('statsDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');

if (showStatsBtn && statsDialog) {
    showStatsBtn.addEventListener('click', () => {
        updateStatsAndMessage();
        statsDialog.showModal();
    });
    closeDialogBtn?.addEventListener('click', () => statsDialog.close());
    statsDialog.addEventListener('click', (e) => {
        if (e.target === statsDialog) statsDialog.close();
    });
}

init();