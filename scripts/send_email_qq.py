#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QQ邮箱每日资讯推送脚本
"""

import smtplib
import json
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from datetime import datetime

# ============ 配置区域 ============
# 从环境变量获取配置
SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465  # SSL加密端口

# QQ邮箱地址（发送方）
SENDER_EMAIL = os.environ.get("QQ_EMAIL", "")

# QQ邮箱授权码（不是密码！）
# 获取方式：QQ邮箱 → 设置 → 账户 → POP3/SMTP服务 → 开启并获取授权码
AUTH_CODE = os.environ.get("QQ_AUTH_CODE", "")

# 收件人邮箱列表（多个用逗号分隔）
RECEIVER_EMAILS = os.environ.get("RECEIVER_EMAILS", "")

# ============ 检查配置 ============
if not SENDER_EMAIL or not AUTH_CODE or not RECEIVER_EMAILS:
    print("QQ邮箱配置缺失，跳过邮件推送")
    print("请设置以下 Secrets:")
    print("  - QQ_EMAIL: 你的QQ邮箱地址")
    print("  - QQ_AUTH_CODE: QQ邮箱授权码")
    print("  - RECEIVER_EMAILS: 收件人邮箱(多个用逗号分隔)")
    exit(0)

# ============ 读取每日摘要 ============
digest_path = os.path.join(os.path.dirname(__file__), "../data/daily_digest.json")
if not os.path.exists(digest_path):
    print("摘要文件不存在，请先运行 generate_digest.py")
    exit(1)

with open(digest_path, "r", encoding="utf-8") as f:
    digest = json.load(f)

# ============ 生成邮件内容 ============
def generate_email_html(digest):
    html = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f7fafc;
        }
        .header {
            background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }
        .content {
            background: white;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .summary {
            background: #edf2f7;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .category {
            margin-bottom: 25px;
        }
        .category-title {
            color: #1a365d;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #38a169;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .article {
            padding: 15px;
            background: #f7fafc;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 3px solid #38a169;
        }
        .article-title {
            color: #1a365d;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }
        .article-summary {
            color: #4a5568;
            font-size: 14px;
        }
        .article-meta {
            color: #718096;
            font-size: 12px;
            margin-top: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #718096;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
            margin-top: 20px;
        }
        .tag {
            display: inline-block;
            background: #e2e8f0;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ 能源数字化资讯日报</h1>
        <p>{date}</p>
    </div>

    <div class="content">
        <div class="summary">
            <p>今日共推送 <strong>{total}</strong> 篇资讯，涵盖 <strong>{categories}</strong> 个领域</p>
            <p style="font-size: 12px; color: #718096; margin-top: 10px;">
                访问网站查看更多: https://your-username.github.io/energy-news
            </p>
        </div>
""".format(
    date=digest["date"],
    total=digest["totalArticles"],
    categories=digest["categories"]
)

    # 添加各分类文章
    for category, articles in digest["articles"].items():
        html += """
        <div class="category">
            <div class="category-title">{category}</div>
""".format(category=category)

        for article in articles:
            tags_html = "".join(['<span class="tag">{}</span>'.format(tag) for tag in article.get("tags", [])])
            html += """
            <div class="article">
                <div class="article-title">{title}</div>
                <div class="article-summary">{summary}</div>
                <div class="article-meta">
                    来源: {source} | 日期: {date}
                </div>
                <div style="margin-top: 8px;">
                    {tags}
                </div>
            </div>
""".format(
    title=article["title"],
    summary=article["summary"],
    source=article["source"],
    date=article["date"],
    tags=tags_html
        )

        html += "        </div>\n"

    html += """
        <div class="footer">
            <p>能源数字化资讯平台 | 每日7:00准时推送</p>
            <p>本邮件由系统自动发送，请勿回复</p>
        </div>
    </div>
</body>
</html>
"""

    return html


def generate_email_text(digest):
    """生成纯文本版本（备用）"""
    text = """
能源数字化资讯日报
日期: {date}

今日共推送 {total} 篇资讯，涵盖 {categories} 个领域

""".format(
    date=digest["date"],
    total=digest["totalArticles"],
    categories=digest["categories"]
)

    for category, articles in digest["articles"].items():
        text += "\n【{}】\n".format(category)
        for article in articles:
            text += """
- {title}
  {summary}
  来源: {source} | 日期: {date}

""".format(
    title=article["title"],
    summary=article["summary"],
    source=article["source"],
    date=article["date"]
            )

    text += "\n访问网站查看更多内容\n"
    text += "能源数字化资讯平台 | 每日7:00准时推送\n"

    return text


# ============ 发送邮件 ============
def send_email():
    # 创建邮件
    message = MIMEMultipart("alternative")
    message["From"] = Header("能源数字化资讯 <{}>".format(SENDER_EMAIL), "utf-8")

    # 处理多个收件人
    receivers = [email.strip() for email in RECEIVER_EMAILS.split(",")]
    message["To"] = Header(",".join(receivers), "utf-8")

    subject = "能源数字化资讯日报 - {}".format(digest["date"])
    message["Subject"] = Header(subject, "utf-8")

    # 添加纯文本和HTML内容
    text_content = generate_email_text(digest)
    html_content = generate_email_html(digest)

    message.attach(MIMEText(text_content, "plain", "utf-8"))
    message.attach(MIMEText(html_content, "html", "utf-8"))

    # 发送邮件
    try:
        print("正在连接QQ邮箱SMTP服务器...")
        smtp = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)

        print("正在登录...")
        smtp.login(SENDER_EMAIL, AUTH_CODE)

        print("正在发送邮件...")
        smtp.sendmail(SENDER_EMAIL, receivers, message.as_string())

        smtp.quit()

        print("=" * 50)
        print("邮件发送成功！")
        print("主题: {}".format(subject))
        print("收件人: {}".format(",".join(receivers)))
        print("文章数: {} 篇".format(digest["totalArticles"]))
        print("=" * 50)

    except smtplib.SMTPAuthenticationError:
        print("错误: QQ邮箱认证失败")
        print("请检查:")
        print("  1. QQ邮箱是否开启了SMTP服务")
        print("  2. 授权码是否正确（不是QQ密码）")
        exit(1)

    except smtplib.SMTPException as e:
        print("错误: SMTP发送失败 - {}".format(str(e)))
        exit(1)

    except Exception as e:
        print("错误: {}".format(str(e)))
        exit(1)


# ============ 执行 ============
if __name__ == "__main__":
    send_email()