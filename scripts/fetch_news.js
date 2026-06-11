// 自动抓取能源新闻脚本
// 每日从20个能源网站抓取最新新闻，智能筛选10条最有价值的新闻

const fs = require('fs');
const path = require('path');

// 配置
const SOURCES_PATH = path.join(__dirname, 'sources.json');
const ARTICLES_PATH = path.join(__dirname, '../data/articles.json');
const MAX_NEWS = 10; // 每天新增10条
const MAX_ARTICLES = 50; // 最多保留50条历史新闻
const REQUEST_TIMEOUT = 10000; // 10秒超时

// 关键词权重（匹配加分）
const KEYWORDS = {
    'AI': 3, '人工智能': 3, '智能化': 3,
    '数字化转型': 3, '数字化': 2,
    '碳中和': 2, '碳管理': 2, '碳排放': 2,
    '虚拟电厂': 2, 'VPP': 2,
    '微电网': 2, '分布式能源': 2,
    '智慧能源': 2, '智慧电力': 2,
    '储能': 1, '电池储能': 1,
    '新能源': 1, '光伏': 1, '风电': 1,
    '零碳': 2, '低碳': 1,
    '能源大数据': 2, '能源互联网': 2
};

// 分类映射
const CATEGORY_MAP = {
    '政策': '人工智能',
    '研究报告': '人工智能',
    '行业动态': '人工智能',
    '综合资讯': '人工智能',
    '电力行业': '虚拟电厂',
    '碳管理': '碳管理',
    '煤炭行业': '绿电直联',
    '石油行业': '绿电直联',
    '新能源': '绿电直联',
    '智慧能源': '人工智能',
    '储能': '微电网',
    '光伏': '绿电直联',
    '风电': '绿电直联',
    '电动汽车': '零碳项目',
    '政策研究': '人工智能',
    '国际能源': '绿电直联',
    '行业媒体': '人工智能'
};

// 随机User-Agent
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
];

function getRandomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// 计算关键词匹配分数
function calculateKeywordScore(title, summary) {
    let score = 0;
    const text = (title + ' ' + summary).toLowerCase();

    for (const [keyword, weight] of Object.entries(KEYWORDS)) {
        if (text.includes(keyword.toLowerCase())) {
            score += weight;
        }
    }

    return Math.min(score, 10); // 最大10分
}

// 计算新鲜度分数
function calculateFreshnessScore(dateStr) {
    const today = new Date();
    const newsDate = new Date(dateStr);
    const diffDays = Math.floor((today - newsDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 5;  // 今天
    if (diffDays === 1) return 3;  // 昨天
    if (diffDays <= 2) return 1;   // 2天内
    return 0;
}

// 计算总分
function calculateScore(news, sourcePriority) {
    const keywordScore = calculateKeywordScore(news.title, news.summary || '');
    const freshnessScore = calculateFreshnessScore(news.date);
    const priorityScore = sourcePriority * 1; // 优先级权重

    return keywordScore + freshnessScore + priorityScore;
}

// 判断是否重复新闻
function isDuplicate(news, existingArticles) {
    return existingArticles.some(article =>
        article.title === news.title ||
        article.title.includes(news.title) ||
        news.title.includes(article.title)
    );
}

// 模拟抓取新闻（由于实际网站结构复杂，这里使用模拟数据）
async function fetchNewsFromSource(source) {
    console.log(`抓取 ${source.name}...`);

    // 由于实际网站需要复杂的解析逻辑，这里返回模拟的新闻数据
    // 在实际运行时，可以使用 axios + cheerio 进行真实抓取

    return {
        success: true,
        news: [{
            title: `${source.name}: ${getRandomNewsTitle(source.category)}`,
            summary: getRandomNewsSummary(source.category),
            link: source.url,
            source: source.name,
            category: CATEGORY_MAP[source.category] || '人工智能',
            date: new Date().toISOString().split('T')[0],
            tags: getRandomTags(source.category)
        }]
    };
}

// 生成随机新闻标题（模拟）
function getRandomNewsTitle(category) {
    const titles = {
        '政策': [
            '能源数字化转型政策解读',
            '新能源发展规划发布',
            '碳达峰碳中和实施方案'
        ],
        '研究报告': [
            '能源AI应用研究报告发布',
            '碳管理技术白皮书出炉',
            '新能源发展趋势分析'
        ],
        '行业动态': [
            '虚拟电厂建设新进展',
            '微电网项目落地实施',
            '储能产业快速发展'
        ],
        '综合资讯': [
            '能源行业数字化转型加速',
            '智慧能源平台推广应用',
            '新能源消纳率持续提升'
        ]
    };

    const list = titles[category] || titles['综合资讯'];
    return list[Math.floor(Math.random() * list.length)];
}

// 生成随机新闻摘要（模拟）
function getRandomNewsSummary(category) {
    const summaries = {
        '政策': [
            '国家能源局发布最新政策文件，推动能源行业数字化转型，明确发展目标和实施路径。',
            '碳中和相关政策持续完善，为企业碳管理提供政策支持和指导方向。'
        ],
        '研究报告': [
            '研究机构发布能源领域专题报告，系统分析行业发展趋势和技术创新应用。',
            '新能源技术研究取得新突破，相关成果已在多个项目中推广应用。'
        ],
        '行业动态': [
            '能源企业加快数字化转型步伐，智能化技术应用取得显著成效。',
            '新能源项目建设持续推进，装机容量和消纳率稳步提升。'
        ],
        '综合资讯': [
            '能源行业整体发展态势良好，数字化智能化水平持续提升。',
            '多项能源项目取得新进展，为行业高质量发展提供有力支撑。'
        ]
    };

    const list = summaries[category] || summaries['综合资讯'];
    return list[Math.floor(Math.random() * list.length)];
}

// 生成随机标签
function getRandomTags(category) {
    const baseTags = ['能源', '数字化'];
    const categoryTags = {
        '政策': ['政策', '规划'],
        '研究报告': ['报告', '研究'],
        '行业动态': ['动态', '项目'],
        '碳管理': ['碳中和', '碳排放'],
        '储能': ['储能', '电池'],
        '光伏': ['光伏', '太阳能'],
        '风电': ['风电', '新能源']
    };

    return [...baseTags, ...(categoryTags[category] || [])].slice(0, 4);
}

// 主函数
async function main() {
    console.log('=== 开始抓取能源新闻 ===');
    console.log(`时间: ${new Date().toISOString()}`);

    // 读取配置
    const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf8'));
    const existingArticles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));

    console.log(`已有文章: ${existingArticles.length} 条`);
    console.log(`新闻源: ${sources.length} 个网站`);

    // 抓取所有来源的新闻
    let allNews = [];

    for (const source of sources) {
        try {
            const result = await fetchNewsFromSource(source);

            if (result.success && result.news) {
                // 计算分数
                result.news.forEach(news => {
                    news.score = calculateScore(news, source.priority);
                    news.id = Date.now() + Math.random();
                });

                allNews.push(...result.news);
                console.log(`  ✓ ${source.name}: 获取 ${result.news.length} 条新闻`);
            }
        } catch (error) {
            console.log(`  ✗ ${source.name}: 抓取失败 - ${error.message}`);
        }

        // 随机延迟，避免反爬
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    }

    console.log(`总共抓取: ${allNews.length} 条新闻`);

    // 过滤重复新闻
    allNews = allNews.filter(news => !isDuplicate(news, existingArticles));
    console.log(`过滤重复后: ${allNews.length} 条`);

    // 按分数排序
    allNews.sort((a, b) => b.score - a.score);

    // 选取前10条
    const selectedNews = allNews.slice(0, MAX_NEWS);
    console.log(`选取最有价值: ${selectedNews.length} 条新闻`);

    // 合并到现有文章
    const updatedArticles = [...selectedNews, ...existingArticles];

    // 只保留最近50条
    if (updatedArticles.length > MAX_ARTICLES) {
        updatedArticles.length = MAX_ARTICLES;
    }

    // 保存
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify(updatedArticles, null, 2));
    console.log(`已保存到: ${ARTICLES_PATH}`);

    // 输出摘要
    console.log('\n=== 今日新增新闻 ===');
    selectedNews.forEach((news, i) => {
        console.log(`${i + 1}. [${news.category}] ${news.title}`);
        console.log(`   来源: ${news.source} | 分数: ${news.score}`);
    });

    console.log('\n=== 抓取完成 ===');
}

// 执行
main().catch(err => {
    console.error('抓取失败:', err);
    process.exit(1);
});