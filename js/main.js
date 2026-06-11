// 能源数字化资讯网站 - 主要交互逻辑

// 全局变量
let allArticles = [];
let currentCategory = 'all';
let currentPage = 1;
let articlesPerPage = 6;

// DOM元素
const articlesGrid = document.getElementById('articlesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const subscribeForm = document.getElementById('subscribeForm');
const emailInput = document.getElementById('emailInput');
const backToTopBtn = document.getElementById('backToTop');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const articleCountEl = document.getElementById('articleCount');
const categoryButtons = document.querySelectorAll('.category-btn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    setupEventListeners();
});

// 加载文章数据
async function loadArticles() {
    try {
        const response = await fetch('data/articles.json');
        if (!response.ok) throw new Error('无法加载文章数据');
        allArticles = await response.json();

        // 更新文章数量
        articleCountEl.textContent = allArticles.length;

        // 渲染文章
        renderArticles();
    } catch (error) {
        showError('加载文章失败，请稍后重试');
        console.error('Error loading articles:', error);
    }
}

// 渲染文章列表
function renderArticles() {
    let filteredArticles = filterArticles();
    filteredArticles = sortArticles(filteredArticles);

    // 计算要显示的文章
    const startIndex = 0;
    const endIndex = currentPage * articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    // 清空容器
    articlesGrid.innerHTML = '';

    if (articlesToShow.length === 0) {
        showEmptyState();
        loadMoreBtn.style.display = 'none';
        return;
    }

    // 渲染文章卡片
    articlesToShow.forEach(article => {
        const card = createArticleCard(article);
        articlesGrid.appendChild(card);
    });

    // 控制加载更多按钮
    loadMoreBtn.style.display = endIndex < filteredArticles.length ? 'block' : 'none';
}

// 创建文章卡片
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => openArticleDetail(article);

    const tagsHTML = article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('');

    card.innerHTML = `
        <div class="article-card-header">
            <span class="article-category">${getCategoryIcon(article.category)} ${article.category}</span>
            <h3 class="article-title">${article.title}</h3>
        </div>
        <div class="article-card-body">
            <p class="article-summary">${article.summary}</p>
            <div class="article-meta">
                <span class="article-source">来源: ${article.source}</span>
                <span>${article.date}</span>
            </div>
            <div class="article-tags">${tagsHTML}</div>
        </div>
    `;

    return card;
}

// 获取分类图标
function getCategoryIcon(category) {
    const icons = {
        '人工智能': '🤖',
        '碳管理': '🌍',
        '虚拟电厂': '⚡',
        '微电网': '🔌',
        '智慧冷冻': '❄️',
        '智慧空压': '💨',
        '绿电直联': '🌱',
        '零碳项目': '♻️'
    };
    return icons[category] || '📋';
}

// 筛选文章
function filterArticles() {
    let filtered = allArticles;

    // 按分类筛选
    if (currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === currentCategory);
    }

    // 按搜索关键词筛选
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.summary.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            article.source.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

// 排序文章
function sortArticles(articles) {
    const sortValue = sortSelect.value;

    return [...articles].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (sortValue === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });
}

// 显示空状态
function showEmptyState() {
    articlesGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>暂无相关资讯</p>
        </div>
    `;
}

// 显示错误
function showError(message) {
    articlesGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
}

// 打开文章详情
function openArticleDetail(article) {
    // 创建模态框显示文章详情
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // 构建链接HTML
    const linkHTML = article.link
        ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" class="article-link-btn">查看原文链接 →</a>`
        : '';

    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <div class="modal-header">
                <span class="article-category">${getCategoryIcon(article.category)} ${article.category}</span>
                <h2>${article.title}</h2>
            </div>
            <div class="modal-body">
                <div class="modal-meta">
                    <span>来源: ${article.source}</span>
                    <span>日期: ${article.date}</span>
                </div>
                <div class="modal-content-text">${article.content || article.summary}</div>
                ${linkHTML}
                <div class="modal-tags">
                    ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 设置事件监听器
function setupEventListeners() {
    // 分类按钮点击
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新激活状态
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新当前分类
            currentCategory = btn.dataset.category;
            currentPage = 1;

            // 重新渲染
            renderArticles();
        });
    });

    // 搜索按钮点击
    searchBtn.addEventListener('click', () => {
        currentPage = 1;
        renderArticles();
    });

    // 搜索输入回车
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentPage = 1;
            renderArticles();
        }
    });

    // 排序变化
    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        renderArticles();
    });

    // 加载更多
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderArticles();
    });

    // 订阅表单提交
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubscribe();
    });

    // 返回顶部按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 移动端菜单
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// 处理订阅
function handleSubscribe() {
    const email = emailInput.value.trim();

    // 验证邮箱格式
    if (!validateEmail(email)) {
        showNotification('请输入有效的邮箱地址', 'error');
        return;
    }

    // 模拟订阅请求（实际项目中会调用API）
    console.log('订阅邮箱:', email);

    // 显示成功消息
    showNotification('订阅成功！每日资讯将发送至您的邮箱', 'success');

    // 清空输入框
    emailInput.value = '';
}

// 验证邮箱格式
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// 显示通知
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 3秒后自动消失
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加通知样式（动态注入）
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: #1a365d;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }

    .notification-success {
        background: #38a169;
    }

    .notification-error {
        background: #e53e3e;
    }

    .notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    /* 文章详情模态框 */
    .article-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
    }

    .modal-content {
        background: white;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        border-radius: 12px;
        position: relative;
    }

    .modal-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 32px;
        height: 32px;
        border: none;
        background: #e2e8f0;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-header {
        padding: 24px;
        background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
        color: white;
    }

    .modal-header h2 {
        margin-top: 8px;
        font-size: 1.5rem;
    }

    .modal-body {
        padding: 24px;
    }

    .modal-meta {
        display: flex;
        gap: 16px;
        color: #718096;
        margin-bottom: 16px;
    }

    .modal-content-text {
        line-height: 1.8;
        color: #2d3748;
        margin-bottom: 16px;
    }

    .modal-tags {
        display: flex;
        gap: 8px;
    }
`;
document.head.appendChild(notificationStyles);