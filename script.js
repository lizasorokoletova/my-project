const createPostBtn = document.getElementById('createPostBtn');
const showStatsBtn = document.getElementById('showStatsBtn');
const postForm = document.getElementById('postForm');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const savePostBtn = document.getElementById('savePostBtn');
const statsDialog = document.getElementById('statsDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const totalPostsSpan = document.getElementById('totalPostsCount');
const totalCommentsSpan = document.getElementById('totalCommentsCount');
const blogGrid = document.querySelector('.blog-grid');
const blogFeatured = document.querySelector('.blog-featured');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const noPostsMessage = document.getElementById('noPostsMessage');
const nextBtn = document.querySelector('.btn-outline');

function updateStats() {
    let total = 0;
    if (blogFeatured && blogFeatured.parentNode) total += 1;
    const cards = document.querySelectorAll('.blog-grid .card');
    total += cards.length;
    totalPostsSpan.textContent = total;
    totalCommentsSpan.textContent = '0';
}

function updateNoPostsMessage() {
    const allPosts = document.querySelectorAll('.post-item');
    if (allPosts.length === 0) {
        noPostsMessage.style.display = 'block';
        if (blogFeatured) blogFeatured.style.display = 'none';
        if (blogGrid) blogGrid.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        noPostsMessage.style.display = 'none';
        if (blogFeatured) blogFeatured.style.display = '';
        if (blogGrid) blogGrid.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
    }
}

function attachDeleteHandlers() {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.removeEventListener('click', handleDelete);
        btn.addEventListener('click', handleDelete);
    });
}

function handleDelete(event) {
    const btn = event.currentTarget;
    const postItem = btn.closest('.post-item');
    if (postItem) {
        postItem.remove();
        updateStats();
        updateNoPostsMessage();
        attachDeleteHandlers(); 
    }
}

function createPostFromForm(title, text) {
    const newCard = document.createElement('div');
    newCard.className = 'card post-item';
    newCard.innerHTML = `
        <img src="Selection.jpg" alt="Иконка">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
        <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        <button class="delete-btn" title="Удалить статью">✕</button>
    `;
    return newCard;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

function addNewPostFromForm() {
    const title = postTitleInput.value.trim();
    const text = postTextInput.value.trim();
    if (!title || !text) {
        alert('Пожалуйста, заполните заголовок и текст статьи');
        return false;
    }
    const newPost = createPostFromForm(title, text);
    blogGrid.appendChild(newPost);
    attachDeleteHandlers();
    updateStats();
    updateNoPostsMessage();
    return true;
}

createPostBtn.addEventListener('click', () => {
    postForm.classList.remove('hidden');
    postTitleInput.value = '';
    postTextInput.value = '';
    postForm.scrollIntoView({ behavior: 'smooth' });
});

cancelPostBtn.addEventListener('click', () => {
    postTitleInput.value = '';
    postTextInput.value = '';
    postForm.classList.add('hidden');
});

savePostBtn.addEventListener('click', () => {
    if (addNewPostFromForm()) {
        postTitleInput.value = '';
        postTextInput.value = '';
        postForm.classList.add('hidden');
    }
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
attachDeleteHandlers();