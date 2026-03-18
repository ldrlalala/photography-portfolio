# Photography Portfolio

一个基于 TypeScript、Next.js App Router 和 Supabase 的摄影作品集模板，适合展示精选作品、长期系列、拍摄说明和个人介绍。

## 1. 本地启动

```bash
cd photography-portfolio
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开 `http://localhost:3000`。

如果你还没配置 Supabase，页面会先显示内置示例作品，不会空白。

## 2. Supabase 配置

### 环境变量

在 `.env.local` 里填写:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_BUCKET=portfolio
```

### 数据库

1. 在 Supabase 项目里打开 SQL Editor。
2. 执行 [supabase/schema.sql](/Users/liudongrong/.codex/worktrees/bdd2/codex-work/photography-portfolio/supabase/schema.sql)。
3. 在 Storage 中确认已经有 `portfolio` 这个 public bucket。
4. 把你的照片上传到 `portfolio` bucket，例如 `featured/my-photo.jpg`。
5. 在 `photos` 表里插入记录，把 `image_path` 写成对应文件路径。

### `photos` 表字段建议

- `title`: 作品标题
- `description`: 简短说明
- `series`: 所属系列
- `location`: 拍摄地点
- `shot_on`: 拍摄日期
- `camera` / `lens`: 器材信息
- `aspect_ratio`: `portrait` / `landscape` / `square`
- `featured`: 是否在首页精选优先显示
- `sort_order`: 排序数字，越小越靠前
- `image_path`: Supabase Storage 中的路径
- `tags`: 标签数组

## 3. 页面结构

- 首页 Hero: 个人摄影陈述 + 最新作品摘要
- 精选作品区: 自动读取 `featured` 作品
- 系列叙事区: 自动统计 `series`
- 联系区: 可继续接入邮箱、社交媒体或表单

## 4. 通过 Vercel 发布

### 推荐流程

1. 把 `photography-portfolio` 推到 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com/)。
3. 点击 `Add New Project`，导入你的 GitHub 仓库。
4. Framework Preset 选择 `Next.js`。
5. 在 Environment Variables 里填写这三个值:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_BUCKET`
6. 点击 `Deploy`。

### 绑定自定义域名

1. 打开 Vercel 项目。
2. 进入 `Settings > Domains`。
3. 添加你的域名，例如 `photo.yourname.com`。
4. 按 Vercel 提示去域名服务商配置 DNS。

### 后续更新

以后你只需要:

1. 修改代码并推送到 GitHub。
2. Vercel 会自动重新构建并上线。
3. 如果只是新增作品，也可以只在 Supabase 中上传图片和插入数据，不必改代码。

## 5. 你可以继续扩展的方向

- 增加独立的 `About` 页面
- 增加 `Services` 页面展示拍摄服务
- 接入联系表单或预约表单
- 增加博客，用来写拍摄日志和项目故事
