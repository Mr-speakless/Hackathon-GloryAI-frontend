# GloryAI 前端开发计划

> 日期：2025-02-14
> 状态：待审核
> 负责人：前端

## Context

GloryAI 是一个 Hackathon 项目（截止 2/20），团队3人（设计+前端+后端）。产品是一个 AI 护肤新手指南：用户上传面部照片 → 后端调用 Perfect Corp API 分析皮肤 → 前端展示报告和产品推荐。

**当前状态**：后端还没好，前端需要先用 mock 数据独立开发。今天目标是搭建能跑通完整流程的前端原型。

**技术栈**：Vite + React + Tailwind CSS + JavaScript + npm

---

## 项目结构

```
E:\设计项目\GloryAI\
├── frontend/                    ← 今天要创建的前端项目
│   ├── public/
│   ├── src/
│   │   ├── components/          ← React 组件
│   │   │   ├── ImageUpload.jsx      ← 图片上传（拖拽+点击）
│   │   │   ├── AnalyzingLoader.jsx  ← 分析中加载动画
│   │   │   ├── SkinReport.jsx       ← 皮肤报告主容器
│   │   │   ├── SkinTypeCard.jsx     ← 皮肤类型展示卡片
│   │   │   ├── IssueCard.jsx        ← 单个皮肤问题卡片
│   │   │   ├── RecommendationCard.jsx ← 推荐等级卡片（新手/进阶/高手）
│   │   │   └── Header.jsx           ← 页面顶部导航/Logo
│   │   ├── services/            ← API 和数据服务
│   │   │   ├── api.js               ← API 抽象层（mock/真实切换）
│   │   │   └── mockData.js          ← Mock 数据（模拟后端返回）
│   │   ├── utils/               ← 工具函数
│   │   │   └── skinAnalysis.js      ← 皮肤分析逻辑（分类、文案生成）
│   │   ├── App.jsx              ← 根组件（状态机：upload → analyzing → report）
│   │   ├── App.css
│   │   ├── index.css            ← Tailwind 入口
│   │   └── main.jsx             ← 入口文件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── ProductManagment/            ← 产品文档
├── .agents/                     ← Agent skills
├── .gitignore
└── README.md
```

---

## 核心架构设计

### 1. 页面状态机（App.jsx）

App 组件管理三个状态，控制页面显示：

```
upload → analyzing → report
  ↑                    │
  └────────────────────┘ (重新上传)
```

- `upload`：显示 ImageUpload 组件
- `analyzing`：显示 AnalyzingLoader（模拟 2-3 秒等待）
- `report`：显示 SkinReport + RecommendationCard

### 2. API 抽象层（services/api.js）

关键设计：通过一个 `USE_MOCK` 开关控制数据来源。

```javascript
const USE_MOCK = true; // 后端好了改成 false
const API_BASE_URL = 'http://localhost:8000/api'; // 后端地址

export async function analyzeSkin(imageFile) {
  if (USE_MOCK) {
    return getMockResult(); // 返回 mock 数据
  }
  // 真实 API 调用：POST formData 到后端
}
```

后端好了之后，只需要：
1. 把 `USE_MOCK` 改为 `false`
2. 把 `API_BASE_URL` 改为后端实际地址

### 3. Mock 数据设计（services/mockData.js）

> ⚠️ Mock 数据精确匹配 Perfect Corp API 的真实返回格式，方便后端对接时无缝切换。

**重要：分数含义 → 越高=皮肤越好**（不是越高越差！）
- `ui_score`: 1-100 美化分（给用户看的，偏高）
- `raw_score`: 1-100 原始分（更真实）
- 前端展示用 `ui_score`

**我们用 SD 模式**（14项检测，对 Hackathon 来说足够，HD 复杂度更高）

#### 后端预期返回给前端的格式（Django 包装后）

```javascript
{
  // --- Perfect Corp API 原始数据（后端透传）---
  "skin_analysis": {
    "wrinkle":              { "raw_score": 36.09, "ui_score": 60, "output_mask_name": "wrinkle_output.png" },
    "acne":                 { "raw_score": 92.29, "ui_score": 88, "output_mask_name": "acne_output.png" },
    "moisture":             { "raw_score": 48.69, "ui_score": 70, "output_mask_name": "moisture_output.png" },
    "oiliness":             { "raw_score": 60.74, "ui_score": 72, "output_mask_name": "oiliness_output.png" },
    "redness":              { "raw_score": 72.01, "ui_score": 77, "output_mask_name": "redness_output.png" },
    "pore":                 { "raw_score": 88.38, "ui_score": 84, "output_mask_name": "pore_output.png" },
    "texture":              { "raw_score": 80.09, "ui_score": 76, "output_mask_name": "texture_output.png" },
    "radiance":             { "raw_score": 76.57, "ui_score": 79, "output_mask_name": "radiance_output.png" },
    "age_spot":             { "raw_score": 83.23, "ui_score": 77, "output_mask_name": "age_spot_output.png" },
    "dark_circle_v2":       { "raw_score": 80.19, "ui_score": 76, "output_mask_name": "dark_circle_v2_output.png" },
    "eye_bag":              { "raw_score": 76.67, "ui_score": 79, "output_mask_name": "eye_bag_output.png" },
    "firmness":             { "raw_score": 89.66, "ui_score": 85, "output_mask_name": "firmness_output.png" },
    "droopy_upper_eyelid":  { "raw_score": 79.05, "ui_score": 80, "output_mask_name": "droopy_upper_eyelid_output.png" },
    "droopy_lower_eyelid":  { "raw_score": 79.97, "ui_score": 81, "output_mask_name": "droopy_lower_eyelid_output.png" },
    "all": { "score": 75.76 },
    "skin_age": 37
  },
  // --- 后端额外附加的产品推荐（后端生成）---
  "recommendations": {
    "beginner":     [/* 3 个产品 */],
    "intermediate": [/* 4 个产品 */],
    "advanced":     [/* 6 个产品 */]
  }
}
```

#### 关于分数的换算逻辑（前端 skinAnalysis.js 负责）

因为 Perfect Corp 的分数是**越高=越好**，但前端展示需要找出"问题最严重的"：
- **问题严重度 = 100 - ui_score**（分数越低=问题越严重）
- 比如 wrinkle ui_score=60，说明皱纹问题相对严重（100-60=40 严重度）
- acne ui_score=88，说明痘痘情况较好（100-88=12 严重度）
- Top 3 问题 = 按严重度（100-ui_score）从高到低排序

#### 皮肤类型判断逻辑
- oiliness ui_score 低（<65）→ 偏油性
- moisture ui_score 低（<65）→ 偏干性
- 两者都低 → 混合偏油
- 两者都正常 → 中性
- oiliness 低 + moisture 正常 → 油性

### 4. 皮肤分析工具（utils/skinAnalysis.js）

前端临时生成报告文字（标记为测试版），逻辑包括：

- **皮肤类型判断**：根据 oiliness/hydration 分数 → 干性/油性/混合
- **Top 3 问题提取**：按 score 排序取前三
- **风险等级**：根据分数区间映射为 低/中/高
- **中文文案生成**：为每个问题生成通俗易懂的中文描述

---

## 实施步骤（按顺序）

### Step 1: 初始化项目
- 在 `E:\设计项目\GloryAI\frontend\` 创建 Vite + React 项目
- 安装依赖：tailwindcss, postcss, autoprefixer, axios
- 配置 Tailwind CSS
- 配置 vite.config.js（代理设置，方便后续对接后端）

### Step 2: 搭建基础结构
- 创建目录结构（components/, services/, utils/）
- 写 App.jsx 状态机框架
- 写 Header 组件

### Step 3: 图片上传组件
- ImageUpload.jsx：支持拖拽上传 + 点击选择
- 图片预览功能
- 文件类型/大小校验（JPG/PNG, <10MB）

### Step 4: Mock 数据和 API 层
- 写 mockData.js（完整的模拟数据）
- 写 api.js（USE_MOCK 开关 + analyzeSkin 函数）

### Step 5: 皮肤分析工具函数
- skinAnalysis.js：类型判断、问题排序、文案生成
- 标注 `[测试版]` 水印

### Step 6: 报告展示组件
- AnalyzingLoader.jsx：加载动画
- SkinReport.jsx：报告主容器
- SkinTypeCard.jsx：皮肤类型卡片
- IssueCard.jsx：问题详情卡片

### Step 7: 推荐产品组件
- RecommendationCard.jsx：三张卡片（新手/进阶/高手）
- 每张卡片展示对应数量的产品

### Step 8: 串联完整流程
- 上传 → 调用 mock API → loading → 展示报告
- 添加"重新上传"功能

### Step 9: GitHub 设置
- 在 GloryAI 根目录 git init
- 创建 .gitignore（node_modules, .env 等）
- 初始 commit
- 创建 GitHub repo 并 push

---

## 需要和后端同学确认的事项清单

> 把这个清单发给后端同学，约定好了填在旁边
> ✅ = 已确认，❓ = 需要回复

### API 接口约定（最重要）
| # | 问题 | 状态 | 说明 |
|---|---|---|---|
| 1 | 前端上传图片的接口 URL 是什么？（建议 `POST /api/analyze`） | ❓ | 前端 POST multipart/form-data 到这个地址 |
| 2 | 请求格式：前端用 `multipart/form-data` 上传图片 OK 吗？ | ❓ | 后端收到后自己走 Perfect Corp 的 file→PUT→task→poll 流程 |
| 3 | 后端返回给前端的 JSON 结构是什么？ | ❓ | 建议：`{ skin_analysis: {...原始数据}, recommendations: {...} }` |
| 4 | 出错时返回什么格式？ | ❓ | 建议：`{ error: "message", error_code: "XXX" }` |

### Perfect Corp API 相关（已从文档确认）
| # | 信息 | 状态 | 说明 |
|---|---|---|---|
| 5 | 用 SD 还是 HD 模式？ | ✅ | 目前我们先暂用SD模式 |
| 6 | 请求哪些 dst_actions？ | ✅ | 目前暂定SD里面的所有信息好了 |
| 7 | 分数含义 | ✅ | ui_score 1-100，越高=皮肤越好。前端用 100-ui_score 计算问题严重度 |
| 8 | 图片尺寸要求 | ✅ | SD: 长边≤4096px, 短边≥480px。后端需要做 resize |

### 产品推荐
| # | 问题 | 状态 | 说明 |
|---|---|---|---|
| 9 | 产品推荐数据由后端返回？还是前端硬编码？ | ❓ | 前端目前先硬编码 mock 产品数据 |
| 10 | 产品数据包含哪些字段？ | ❓ | 建议：name, brand, image_url, purchase_url, description, target_issue |
| 11 | 产品图片从哪来？ | ❓ | 后端提供 URL？还是前端自己放静态图？ |

### 部署和协作
| # | 问题 | 状态 | 说明 |
|---|---|---|---|
| 12 | 开发时后端跑在 `localhost:8000` 吗？ | ❓ | 前端 vite proxy 需要知道地址 |
| 13 | 后端需要配置 CORS | ❓ | Django 装 django-cors-headers，允许 localhost:5173 |
| 14 | 报告文字最终由谁生成？ | ❓ | 暂时前端生成（标记测试版），后续可切到后端 LLM |
| 15 | mask 图片（叠加层）后端是返回 URL 还是 base64？ | ❓ | Perfect Corp 返回 mask PNG 文件名，后端需要把下载 URL 传给前端 |

---

## 验证方式

完成后如何验证前端工作正常：

1. `npm run dev` 启动开发服务器
2. 打开浏览器，看到上传页面
3. 拖拽/点击上传一张图片，看到预览
4. 点击分析按钮，看到加载动画
5. 2-3 秒后看到皮肤报告（mock 数据）
6. 看到三张推荐卡片（新手/进阶/高手）
7. 点击"重新检测"回到上传页
8. 在 api.js 中把 `USE_MOCK` 改为 `false`，修改 `API_BASE_URL`，即可对接真实后端

---

## 关键文件说明

| 文件 | 作用 | 为什么重要 |
|---|---|---|
| `src/services/api.js` | API 抽象层 + mock 开关 | 切换 mock/真实只改一行 |
| `src/services/mockData.js` | Mock 数据 | 解除对后端的依赖 |
| `src/utils/skinAnalysis.js` | 分析逻辑 + 中文文案 | 前端临时生成报告的核心 |
| `src/App.jsx` | 状态机 + 数据流 | 控制整个应用流程 |
| `src/components/SkinReport.jsx` | 报告展示 | Demo 演示的核心页面 |
