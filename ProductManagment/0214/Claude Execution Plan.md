# GloryAI 前端开发计划（Claude 执行版）

> 这是给 Claude Agent 执行用的精简版 plan，详细版见 `0214 Frontend Development Plan.md`

## Context

GloryAI 是一个 Hackathon 项目（截止 2/20），团队3人（设计+前端+后端）。
架构：React前端 → Django后端 → Perfect Corp YouCam API（AI Skin Analysis）。
后端还没好，前端先用 mock 数据独立开发。今天目标：搭建能跑通完整流程的前端原型。
技术栈：Vite + React + Tailwind CSS + JavaScript + npm

---

## 项目结构

```
E:\设计项目\GloryAI\
├── frontend/                         ← 今天创建
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx       ← 图片上传（拖拽+点击+预览）
│   │   │   ├── AnalyzingLoader.jsx   ← 分析中加载动画
│   │   │   ├── SkinReport.jsx        ← 皮肤报告主容器
│   │   │   ├── SkinTypeCard.jsx      ← 皮肤类型卡片
│   │   │   ├── IssueCard.jsx         ← 单个皮肤问题卡片
│   │   │   ├── RecommendationCard.jsx ← 推荐等级卡片(新手/进阶/高手)
│   │   │   └── Header.jsx
│   │   ├── services/
│   │   │   ├── api.js                ← API抽象层(USE_MOCK开关)
│   │   │   └── mockData.js           ← Mock数据(精确匹配Perfect Corp格式)
│   │   ├── utils/
│   │   │   └── skinAnalysis.js       ← 分析逻辑+中文文案生成[测试版]
│   │   ├── App.jsx                   ← 状态机: upload→analyzing→report
│   │   ├── index.css                 ← Tailwind入口
│   │   └── main.jsx
│   ├── vite.config.js, tailwind.config.js, postcss.config.js
│   └── package.json
├── ProductManagment/
└── .agents/
```

---

## 核心架构

### 状态机 (App.jsx)
```
upload → analyzing → report
  ↑                    │
  └────────────────────┘ (重新上传)
```

### API 抽象层 (api.js)
`USE_MOCK = true` 开关，后端好了改一行即可切换。

### Mock 数据 (mockData.js) — 精确匹配 Perfect Corp SD 模式返回格式

⚠️ 关键：**分数越高 = 皮肤越好**（不是越差！）
- `ui_score`: 1-100 美化分（前端展示用这个）
- `raw_score`: 1-100 原始分
- 问题严重度 = `100 - ui_score`

SD 模式 14 项检测：wrinkle, acne, moisture, oiliness, redness, pore, texture, radiance, age_spot, dark_circle_v2, eye_bag, firmness, droopy_upper_eyelid, droopy_lower_eyelid
+ `all.score` 总分 + `skin_age` 皮肤年龄

每项返回：`{ raw_score, ui_score, output_mask_name }`

### 皮肤分析工具 (skinAnalysis.js)
- 皮肤类型：oiliness/moisture 的 ui_score 组合判断
- Top 3 问题：按 100-ui_score 排序
- 中文文案生成 [标记测试版]

---

## 实施步骤

### Step 0: 整理 ProductManagment 文件夹
当前文件夹内容：
- `0213 PRD.md` ← 保留
- `0214工作任务.txt` ← 内容已合并到 plan 中，保留作为原始记录
- `0214 Frontend Development Plan.md` ← 已创建的详细 plan，保留
- `API 文档...html` + `API 文档...md` + `f6398207...pdf` ← 三个同一份 API 文档的不同格式，保留 html 和 md，PDF 留着备用
- `API信息.txt` ← 空文件，删除

整理动作：删除空文件，确认详细 plan 已保存。

### Step 1 开始正式开发 ↓

1. **初始化** — `npm create vite@latest frontend -- --template react` + 装 tailwindcss, axios
2. **基础结构** — 创建 components/, services/, utils/ + App.jsx 状态机
3. **图片上传** — ImageUpload.jsx (拖拽+点击+预览+校验JPG/PNG/<10MB)
4. **Mock + API** — mockData.js + api.js (USE_MOCK开关)
5. **分析工具** — skinAnalysis.js (类型判断+问题排序+文案)
6. **报告组件** — AnalyzingLoader + SkinReport + SkinTypeCard + IssueCard
7. **推荐组件** — RecommendationCard × 3 (新手/进阶/高手)
8. **串联流程** — 完整 upload→loading→report→重新上传
9. **GitHub** — git init + .gitignore + 初始 commit + push

---

## 验证

1. `npm run dev` → 浏览器看到上传页
2. 拖拽图片 → 预览 → 点击分析 → loading 动画
3. 2-3 秒后 → 皮肤报告(mock) + 三张推荐卡片
4. 点"重新检测" → 回到上传页
5. 改 `USE_MOCK=false` + `API_BASE_URL` → 可对接真实后端
