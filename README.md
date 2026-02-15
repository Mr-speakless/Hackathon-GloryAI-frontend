# Hackathon-GloryAI-frontend

GloryAI Hackathon 前端项目。  
目标是让用户上传面部照片后，展示 AI 皮肤分析报告与分层产品推荐。

## Tech Stack

- Vite
- React 19
- Tailwind CSS
- JavaScript

## Project Structure

```text
GloryAI/
├─ GloryAI_frontend/           # 前端项目目录
│  ├─ src/
│  │  ├─ components/           # 页面与业务组件
│  │  ├─ services/             # API 抽象与 mock 数据
│  │  ├─ utils/                # 皮肤分析逻辑
│  │  └─ App.jsx               # 状态机入口（upload/analyzing/report）
│  ├─ public/
│  └─ package.json
├─ ProductManagment/           # PRD、开发计划、执行记录、测试文档
└─ README.md
```

## Quick Start

```bash
cd GloryAI_frontend
npm install
npm run dev -- --host
```

访问：`http://localhost:5173`

## Build

```bash
cd GloryAI_frontend
npm run build
```

打包产物输出到：`GloryAI_frontend/dist/`

## API / Mock Mode

当前通过 `src/services/api.js` 切换数据源：

- `USE_MOCK = true`：使用 `src/services/mockData.js`
- `USE_MOCK = false`：请求后端接口（`API_BASE_URL`）

## Backend Integration Guide

这一节给后端联调用，目标是明确“后端需要返回什么、前端在哪里接、如何本地联调”。

### 后端要实现的核心能力

1. 接收前端上传图片  
- 接口建议：`POST /api/analyze`
- 请求格式：`multipart/form-data`
- 文件字段名：`image`（见 `src/services/api.js`）

2. 返回分析成功 JSON  
- 详细见文档：<https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis>

3. 返回错误情况  
- 如：非人脸、多人脸、图像质量差、文件格式错误、服务异常。
- 当前前端接收错误的位置：
  - `GloryAI_frontend/src/services/api.js` 的 `analyzeSkin(imageFile)`
    - 请求返回 `response.ok === false` 时抛出错误，进入失败流
  - `GloryAI_frontend/src/App.jsx` 的 `handleAnalyze(file)` 中 `catch`
    - 接收 `api.js` 抛出的错误并设置 `error`，页面回到上传页展示错误提示
- 建议后端错误响应返回可读文案字段（例如 `error`），便于前端直接展示。
- HTTP 状态码建议：
  - `400`：参数/文件错误
  - `422`：可解析但业务不可用（如无人脸）
  - `500`：服务内部错误

### 前端接口位置与接入点

1. 请求入口：`GloryAI_frontend/src/services/api.js`  
- `analyzeSkin(imageFile)` 是唯一对后端的调用入口。
- 真实联调时：
  - `USE_MOCK = false`
  - `API_BASE_URL` 改成后端地址（如 `http://localhost:8000/api`）

2. 调用发起处：`GloryAI_frontend/src/App.jsx`  
- 用户点击“开始分析”后，`handleAnalyze` 调用 `analyzeSkin(file)`。
- 成功后进入报告页；失败会显示错误信息并回到上传页。

3. 响应消费位置：`GloryAI_frontend/src/utils/skinAnalysis.js`  
- 解析 `skin_analysis` 并生成：
  - `skinType`
  - `topIssues`
  - `summary`
- 规则：`severity = 100 - ui_score`（分数越低问题越严重）。

### 后端联调时的本地环境配置

1. 前端运行（WSL 或本机终端）：
```bash
cd GloryAI_frontend
npm install
npm run dev -- --host
```
- 前端地址：`http://localhost:5173`

2. 后端需要允许跨域（若前后端不同端口）：
- 允许来源：`http://localhost:5173`
- 允许方法至少包含：`POST`
- 允许 `multipart/form-data`

3. 联调步骤：
1. 启动后端服务（例如 `http://localhost:8000`）
2. 在 `src/services/api.js` 设置：
   - `USE_MOCK = false`
   - `API_BASE_URL = "http://localhost:8000/api"`
3. 前端上传真实图片测试：
   - 正常人脸
   - 非人脸图片
   - 错误格式文件
4. 验证成功/错误 JSON 均能被前端正确处理

## Current Status

- 上传 -> 分析中 -> 报告页 流程已打通
- 报告与推荐卡片基于 mock 数据渲染
- 前后端联调时只需切换 `USE_MOCK` 与后端地址

## Notes

- `.agents/` 已从版本控制移除并在 `.gitignore` 中忽略
- 详细执行过程见：`ProductManagment/0214/前端执行记录.md`
