# 能源数字化资讯平台

> 每日7:00自动推送能源数字化建设最新资讯

## 功能特点

- **自动推送**: 每日早上7:00自动推送最新资讯
- **邮件订阅**: 订阅用户可收到每日邮件摘要
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

#### 1.2 注册Mailchimp账号（可选，用于邮件订阅）
1. 访问 https://mailchimp.com
2. 点击 "Sign Up Free"
3. 填写邮箱、用户名、密码
4. 完成注册流程

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
2. 将以下文件拖拽上传：
   - `index.html`
   - `css/style.css`
   - `js/main.js`
   - `data/articles.json`
   - `data/categories.json`
   - `.github/workflows/daily-push.yml`
   - `scripts/generate_digest.js`
   - `scripts/send_email.js`
3. 点击 "Commit changes"

#### 3.2 方法二：使用GitHub Desktop（推荐）
1. 安装 GitHub Desktop: https://desktop.github.com
2. 登录GitHub账号
3. Clone仓库到本地
4. 将项目文件复制到仓库目录
5. 点击 "Commit" → "Push origin"

### 第四步：启用GitHub Pages

1. 进入仓库页面
2. 点击 "Settings"
3. 左侧菜单选择 "Pages"
4. Source 选择 "Deploy from a branch"
5. Branch 选择 "main" → "/ (root)"
6. 点击 "Save"
7. 等待几分钟，访问 `https://你的用户名.github.io/energy-news`

### 第五步：配置自动推送

#### 5.1 配置GitHub Actions Secrets（邮件推送）
1. 进入仓库 "Settings" → "Secrets and variables" → "Actions"
2. 点击 "New repository secret"
3. 添加以下Secrets：
   - `MAILCHIMP_API_KEY`: 从Mailchimp获取API Key
   - `MAILCHIMP_LIST_ID`: Mailchimp订阅列表ID

#### 5.2 测试自动推送
1. 进入仓库 "Actions" 页面
2. 选择 "Daily Energy News Push"
3. 点击 "Run workflow" → "Run workflow"
4. 观察运行结果

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

#### 6.2 自动更新时间
GitHub Actions会在每日7:00自动执行，更新网站时间戳。

## 网站访问

部署成功后访问：`https://你的GitHub用户名.github.io/energy-news`

## 测试清单

### 第一轮测试：功能测试
- [ ] 页面正常加载
- [ ] 分类筛选功能正常
- [ ] 搜索功能正常
- [ ] 订阅表单验证正常
- [ ] 文章详情弹窗正常

### 第二轮测试：端到端测试
- [ ] GitHub Actions执行成功
- [ ] 邮件推送成功（如配置了Mailchimp）
- [ ] 移动端适配正常
- [ ] 返回顶部按钮正常

## 技术架构

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  内容数据源     │ ──▶ │  GitHub Actions  │ ──▶ │  GitHub Pages    │
│  (JSON文件)     │     │  (每日7点执行)    │     │  (免费托管网站)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  邻件订阅推送     │
                        │  (Mailchimp免费版)│
                        └──────────────────┘
```

## 费用说明

- **GitHub Pages**: 免费
- **GitHub Actions**: 免费（公开仓库）
- **Mailchimp**: 免费（2000订阅者以内）

**总成本：零**

## 常见问题

### Q: 网站无法访问？
A: 检查GitHub Pages是否启用，等待5分钟后再试。

### Q: 自动推送没有执行？
A: 检查GitHub Actions是否启用，手动触发测试。

### Q: 邮件没有收到？
A: 检查Mailchimp配置是否正确，Secrets是否设置。

### Q: 如何修改推送时间？
A: 编辑 `.github/workflows/daily-push.yml`，修改cron表达式：
- 北京时间7:00 = UTC时间23:00 → `0 23 * * *`
- 北京时间8:00 = UTC时间0:00 → `0 0 * * *`

## 维护说明

1. **每日更新**: 编辑 `data/articles.json` 添加新内容
2. **自动推送**: GitHub Actions每日自动执行
3. **订阅管理**: Mailchimp后台管理订阅者

## 联系支持

如有问题，请提交GitHub Issue。

---

**能源数字化资讯平台** - 让能源数字化触手可及