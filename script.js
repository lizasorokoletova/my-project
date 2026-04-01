const createPostBtn = document.getElementById('createPostBtn');
const showStatsBtn = document.getElementById('showStatsBtn');
const postForm = document.getElementById('postForm');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const statsDialog = document.getElementById('statsDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const totalPostsSpan = document.getElementById('totalPostsCount');
const totalCommentsSpan = document.getElementById('totalCommentsCount');
const articlesContainer = document.getElementById('articlesContainer');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const noPostsMessage = document.getElementById('noPostsMessage');
const nextBtn = document.querySelector('.btn-outline');

function updateStats() {
    const articles = document.querySelectorAll('.blog-article');
    totalPostsSpan.textContent = articles.length;
    totalCommentsSpan.textContent = '0';
}

function updateNoPostsMessage() {
    const articles = document.querySelectorAll('.blog-article');
    if (articles.length === 0) {
        noPostsMessage.style.display = 'block';
        if (articlesContainer) articlesContainer.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        noPostsMessage.style.display = 'none';
        if (articlesContainer) articlesContainer.style.display = 'grid';
        if (nextBtn) nextBtn.style.display = 'block';
    }
}

const articleTemplate = document.getElementById('article-template');
function createArticleFromForm(title, text) {
    const template = document.createElement('article');
    template.className = 'blog-article';
    template.innerHTML = `
        <div class="blog-article-img">
            <img src="Selection.jpg" alt="Иконка">
        </div>
        <div class="blog-article-text">
            <h3 class="blog-article-title">${escapeHtml(title)}</h3>
            <p class="blog-article-description">${escapeHtml(text)}</p>
            <time datetime="${new Date().toISOString().slice(0,10)}">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
        </div>
        <button class="delete-btn" data-delete title="Удалить статью">✕</button>
    `;
    return template;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

articlesContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-delete]');
    if (deleteBtn) {
        const article = deleteBtn.closest('.blog-article');
        if (article) {
            article.remove();
            updateStats();
            updateNoPostsMessage();
        }
    }
});

createPostBtn.addEventListener('click', () => {
    postForm.classList.remove('hidden');
    postTitleInput.value = '';
    postTextInput.value = '';
    postForm.scrollIntoView({ behavior: 'smooth' });
});

cancelPostBtn.addEventListener('click', () => {
    postForm.reset();
    postForm.classList.add('hidden');
});

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = postTitleInput.value.trim();
    const text = postTextInput.value.trim();
    if (!title || !text) {
        alert('Пожалуйста, заполните заголовок и текст статьи');
        return;
    }
    const newArticle = createArticleFromForm(title, text);
    articlesContainer.appendChild(newArticle);
    postForm.reset();
    postForm.classList.add('hidden');
    updateStats();
    updateNoPostsMessage();
});

showStatsBtn.addEventListener('click', () => {
    updateStats();
    statsDialog.showModal();
});

closeDialogBtn.addEventListener('click', () => {
    statsDialog.close();
});

statsDialog.addEventListener('click', (e) => {
    if (e.target === statsDialog) statsDialog.close();
});

updateStats();
updateNoPostsMessage();