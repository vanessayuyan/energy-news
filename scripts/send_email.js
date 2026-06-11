// 邉件推送脚本 (Mailchimp API)

const fs = require('fs');
const path = require('path');

// 从环境变量获取配置
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.log('Mailchimp配置缺失，跳过邮件推送');
    console.log('请设置 secrets.MAILCHIMP_API_KEY 和 secrets.MAILCHIMP_LIST_ID');
    process.exit(0);
}

// 读取每日摘要
const digestPath = path.join(__dirname, '../data/daily_digest.json');
const digest = JSON.parse(fs.readFileSync(digestPath, 'utf8'));

// 生成邮件内容
const emailContent = generateEmailHTML(digest);

// 发送邮件函数
async function sendEmail() {
    const apiKeyParts = MAILCHIMP_API_KEY.split('-');
    const serverPrefix = apiKeyParts[apiKeyParts.length - 1];

    const campaignData = {
        type: 'regular',
        recipients: {
            list_id: MAILCHIMP_LIST_ID
        },
        settings: {
            subject_line: digest.title,
            title: digest.title,
            from_name: '能源数字化资讯',
            reply_to: 'noreply@example.com'
        }
    };

    // 创建campaign
    const createResponse = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/campaigns`, {
        method: 'POST',
        headers: {
            'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
    });

    const campaign = await createResponse.json();

    // 设置邮件内容
    await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaign.id}/content`, {
        method: 'PUT',
        headers: {
            'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            html: emailContent
        })
    });

    // 发送campaign
    await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaign.id}/actions/send`, {
        method: 'POST',
        headers: {
            'Authorization': `apikey ${MAILCHIMP_API_KEY}`
        }
    });

    console.log(`邮件已发送: ${digest.title}`);
}

// 生成邮件HTML内容
function generateEmailHTML(digest) {
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .category { margin-bottom: 20px; }
        .category-title { color: #1a365d; font-size: 18px; font-weight: bold; border-bottom: 2px solid #38a169; padding-bottom: 5px; }
        .article { padding: 15px; background: #f7fafc; margin: 10px 0; border-radius: 8px; }
        .article-title { color: #1a365d; font-weight: bold; }
        .article-summary { color: #4a5568; margin-top: 5px; }
        .article-link { display: inline-block; margin-top: 8px; padding: 6px 12px; background: #38a169; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; }
        .article-link:hover { background: #2f855a; }
        .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
        .unsubscribe { color: #718096; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ 能源数字化资讯日报</h1>
        <p>${digest.date}</p>
    </div>

    <p>今日共推送 <strong>${digest.totalArticles}</strong> 篇资讯，涵盖 <strong>${digest.categories}</strong> 个领域</p>
`;

    for (const [category, articles] of Object.entries(digest.articles)) {
        html += `
    <div class="category">
        <div class="category-title">${category}</div>
`;
        articles.forEach(article => {
            const linkHTML = article.link
                ? `<a href="${article.link}" class="article-link" target="_blank">查看原文链接 →</a>`
                : '';
            html += `
        <div class="article">
            <div class="article-title">${article.title}</div>
            <div class="article-summary">${article.summary}</div>
            <div style="color: #718096; font-size: 12px; margin-top: 5px;">
                来源: ${article.source} | 日期: ${article.date}
            </div>
            ${linkHTML}
        </div>
`;
        });
        html += `    </div>`;
    }

    html += `
    <div class="footer">
        <p>能源数字化资讯平台 | 每日7:00准时推送</p>
        <p class="unsubscribe">
            如需退订，请点击 <a href="*|UNSUB|*">退订链接</a>
        </p>
    </div>
</body>
</html>
`;

    return html;
}

// 执行发送
sendEmail().catch(err => {
    console.error('邮件发送失败:', err.message);
    process.exit(1);
});