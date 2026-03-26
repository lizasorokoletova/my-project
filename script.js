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
const featuredPost = document.querySelector('.blog-featured');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');

function updateStats() {
    let totalPosts = 0;
    if (featuredPost) totalPosts += 1;
    const cards = document.querySelectorAll('.blog-grid .card');
    totalPosts += cards.length;
    totalPostsSpan.textContent = totalPosts;
    totalCommentsSpan.textContent = '0'; 
}

function addNewPost() {
    const template = document.createElement('div');
    template.className = 'card';
    template.innerHTML = `
        <img src="Selection.jpg" alt="Иконка">
        <h3>Новая статья (mock)</h3>
        <span>Oct 26, 2026</span>
    `;
    blogGrid.appendChild(template);
    updateStats(); 
}

createPostBtn.addEventListener('click', () => {
    postForm.classList.remove('hidden');
    postTitleInput.value = '';
    postTextInput.value = '';
    postForm.scrollIntoView({ behavior: 'smooth' });
});

cancelPostBtn.addEventListener('click', () => {
    postForm.classList.add('hidden');
});

savePostBtn.addEventListener('click', () => {
    addNewPost();
    postForm.classList.add('hidden');
});

showStatsBtn.addEventListener('click', () => {
    updateStats();
    statsDialog.showModal();
});

closeDialogBtn.addEventListener('click', () => {
    statsDialog.close();
});

statsDialog.addEventListener('click', (e) => {
    if (e.target === statsDialog) {
        statsDialog.close();
    }
});

updateStats();