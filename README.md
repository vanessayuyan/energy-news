# 能源数字化资讯平台

> 每日7:00自动推送能源数字化建设最新资讯

## 功能特点

- **自动推送**: 每日早上7:00自动推送最新资讯
- **邮件推送**: 通过QQ邮箱每日推送资讯摘要
- **分类筛选**: 8大领域分类快速筛选
- **搜索功能**: 快速搜索政策、报告、项目
- **响应式设计**: 完美适配移动端和桌面端

## 内容领域

1. **人工智能** - AI技术在能源领域的应用
2. **碳管理** - 碳排放监测、碳交易、碳足迹管理
3. **虚拟电厂** - VPP建设、运营模式、市场交易
4. **微电网** - 微电网技术、运行优化
5. **智慧冷冻** - 冷链物流、冷冻设备智能化
6. **智慧空压** - 压缩空气系统优化、节能改造
7. **绿电直联** - 绿色电力直供、源网荷储一体化
8. **零碳项目** - 零碳园区、工厂、建筑示范项目

## 部署教程（零基础友好）

### 第一步：准备工作

#### 1.1 注册GitHub账号
1. 访问 https://github.com
2. 点击右上角 "Sign up"
3. 填写邮箱、密码、用户名
4. 完成邮箱验证

#### 1.2 准备QQ邮箱（用于邮件推送）

**重要：需要获取QQ邮箱授权码，不是密码！**

1. 登录QQ邮箱网页版：https://mail.qq.com
2. 点击右上角 **设置** → **账户**
3. 向下滑动找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
4. 开启 **POP3/SMTP服务**
5. 按提示发送短信验证
6. 获得 **16位授权码**（保存好，只显示一次）

### 第二步：创建GitHub仓库

#### 2.1 创建新仓库
1. 登录GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `energy-news`
   - Description: `能源数字化资讯平台`
   - 选择 "Public"
   - 勾选 "Add a README file"
4. 点击 "Create repository"

### 第三步：上传代码

#### 3.1 方法一：使用GitHub网页上传（最简单）
1. 在仓库页面点击 "Add file" → "Upload files"
2. 将整个项目文件夹内容拖拽上传
3. 点击 "Commit changes"

#### 3.2 方法二：使用Git命令行
```bash
# 进入项目目录
cd /Users/anyo/Desktop/energy-news

# 初始化git
git init
git add .
git commit -m "Initial commit"

# 关联远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/energy-news.git
git branch -M main
git push -u origin main
```

### 第四步：启用GitHub Pages

1. 进入仓库页面
2. 点击 "Settings"
3. 左侧菜单选择 "Pages"
4. Source 选择 "Deploy from a branch"
5. Branch 选择 "main" → "/ (root)"
6. 点击 "Save"
7. 等待2-5分钟，访问 `https://你的用户名.github.io/energy-news`

### 第五步：配置QQ邮箱推送

#### 5.1 设置GitHub Secrets
1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 "New repository secret"
3. 添加以下3个Secrets：

| Secret名称 | 值 | 说明 |
|-----------|-----|------|
| `QQ_EMAIL` | 你的QQ邮箱 | 如：123456789@qq.com |
| `QQ_AUTH_CODE` | 16位授权码 | 从QQ邮箱设置中获取 |
| `RECEIVER_EMAILS` | 收件人邮箱 | 多个用逗号分隔 |

**示例：**
```
QQ_EMAIL = 123456789@qq.com
QQ_AUTH_CODE = abcd1234efgh5678
RECEIVER_EMAILS = receiver1@qq.com,receiver2@163.com
```

#### 5.2 测试邮件推送
1. 进入仓库 **Actions** 页面
2. 选择 "Daily Energy News Push"
3. 点击 "Run workflow" → "Run workflow"
4. 等待执行完成，检查收件箱

### 第六步：更新内容

#### 6.1 添加新文章
编辑 `data/articles.json`，添加新文章：
```json
{
    "id": 13,
    "title": "新文章标题",
    "category": "虚拟电厂",
    "summary": "文章摘要",
    "content": "详细内容",
    "source": "来源",
    "date": "2026-06-06",
    "tags": ["标签1", "标签2"],
    "author": "作者"
}
```

#### 6.2 自动推送
GitHub Actions会在每日7:00自动执行：
- 更新网站时间戳
- 发送邮件摘要到订阅者

## 网站访问

部署成功后访问：`https://你的GitHub用户名.github.io/energy-news`

## QQ邮箱配置详解

### 获取授权码步骤

```
┌─────────────────────────────────────────────┐
│  QQ邮箱 → 设置 → 账户                        │
│                                             │
│  找到：POP3/IMAP/SMTP服务                    │
│                                             │
│  开启 POP3/SMTP服务                          │
│       ↓                                     │
│  发送短信验证                                │
│       ↓                                     │
│  获得16位授权码（保存好！）                   │
└─────────────────────────────────────────────┘
```

### 授权码说明
- **不是QQ密码**
- **不是邮箱密码**
- 只有开通SMTP服务才能获取
- 获取后只显示一次，务必保存

### 添加收件人
编辑 `RECEIVER_EMAILS` Secret，多个邮箱用逗号分隔：
```
receiver1@qq.com,receiver2@163.com,receiver3@gmail.com
```

## 测试清单

### 第一轮测试：功能测试
- [x] 页面正常加载
- [x] 分类筛选功能正常
- [x] 搜索功能正常
- [x] 订阅表单验证正常
- [x] 文章详情弹窗正常

### 第二轮测试：端到端测试
- [x] GitHub Actions执行成功
- [x] 邮件推送成功
- [x] 移动端适配正常
- [x] 返回顶部按钮正常

## 技术架构

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  内容数据源     │ ──▶ │  GitHub Actions  │ ──▶ │  GitHub Pages    │
│  (JSON文件)     │     │  (每日7点执行)    │     │  (免费托管网站)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  QQ邮箱推送       │
                        │  (SMTP SSL加密)   │
                        └──────────────────┘
```

## 费用说明

- **GitHub Pages**: 免费
- **GitHub Actions**: 免费（公开仓库）
- **QQ邮箱SMTP**: 免费

**总成本：零**

## 常见问题

### Q: 网站无法访问？
A: 检查GitHub Pages是否启用，等待5分钟后再试。

### Q: 自动推送没有执行？
A: 检查GitHub Actions是否启用，手动触发测试。

### Q: 邮件发送失败？
A: 检查以下内容：
1. QQ邮箱是否开启了SMTP服务
2. 授权码是否正确（不是密码）
3. Secrets是否正确设置

### Q: 授权码忘记了？
A: QQ邮箱 → 设置 → 账户 → 重新生成授权码

### Q: 如何修改推送时间？
A: 编辑 `.github/workflows/daily-push.yml`，修改cron表达式：
- 北京时间7:00 = UTC时间23:00 → `0 23 * * *`
- 北京时间8:00 = UTC时间0:00 → `0 0 * * *`

### Q: 如何添加更多收件人？
A: 编辑 `RECEIVER_EMAILS` Secret，用逗号分隔多个邮箱。

## 项目文件说明

```
energy-news/
├── index.html              # 网站首页
├── css/style.css          # 样式文件
├── js/main.js             # 交互逻辑
├── data/
│   ├── articles.json      # 文章数据（12篇示例）
│   ├── categories.json    # 分类配置（8大领域）
│   └── daily_digest.json  # 每日摘要（自动生成）
├── .github/workflows/
│   └── daily-push.yml     # 定时推送配置
└── scripts/
    ├── generate_digest.js # 摘要生成脚本
    └── send_email_qq.py   # QQ邮箱推送脚本
```

## 联系支持

如有问题，请提交GitHub Issue。

---

**能源数字化资讯平台** - 让能源数字化触手可及