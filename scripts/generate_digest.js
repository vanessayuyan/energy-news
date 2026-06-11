// 每日摘要生成脚本

const fs = require('fs');
const path = require('path');

// 读取文章数据
const articlesPath = path.join(__dirname, '../data/articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// 获取今天的日期
const today = new Date().toISOString().split('T')[0];

// 选择优质文章（按日期排序，选取最新的10篇）
const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // 按日期降序排序
});

// 取最新的10篇作为每日推送
const selectedArticles = sortedArticles.slice(0, 10);

// 按分类整理
const categorizedArticles = {};
selectedArticles.forEach(article => {
    if (!categorizedArticles[article.category]) {
        categorizedArticles[article.category] = [];
    }
    categorizedArticles[article.category].push(article);
});

// 生成摘要内容
const digest = {
    date: today,
    title: `能源数字化资讯日报 - ${today}`,
    totalArticles: selectedArticles.length,
    categories: Object.keys(categorizedArticles).length,
    articles: categorizedArticles
};

// 保存摘要
const digestPath = path.join(__dirname, '../data/daily_digest.json');
fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));

// 输出日志
console.log(`生成每日摘要: ${selectedArticles.length} 篇文章, ${Object.keys(categorizedArticles).length} 个分类`);
console.log(`摘要已保存到: ${digestPath}`);