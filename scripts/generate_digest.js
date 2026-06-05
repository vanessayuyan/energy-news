// 每日摘要生成脚本

const fs = require('fs');
const path = require('path');

// 读取文章数据
const articlesPath = path.join(__dirname, '../data/articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// 获取今天的日期
const today = new Date().toISOString().split('T')[0];

// 筛选最近的文章（最近3天）
const recentArticles = articles.filter(article => {
    const articleDate = new Date(article.date);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return articleDate >= threeDaysAgo;
});

// 按分类整理
const categorizedArticles = {};
recentArticles.forEach(article => {
    if (!categorizedArticles[article.category]) {
        categorizedArticles[article.category] = [];
    }
    categorizedArticles[article.category].push(article);
});

// 生成摘要内容
const digest = {
    date: today,
    title: `能源数字化资讯日报 - ${today}`,
    totalArticles: recentArticles.length,
    categories: Object.keys(categorizedArticles).length,
    articles: categorizedArticles
};

// 保存摘要
const digestPath = path.join(__dirname, '../data/daily_digest.json');
fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));

// 输出日志
console.log(`生成每日摘要: ${recentArticles.length} 篇文章, ${Object.keys(categorizedArticles).length} 个分类`);
console.log(`摘要已保存到: ${digestPath}`);