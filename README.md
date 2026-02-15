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

## Current Status

- 上传 -> 分析中 -> 报告页 流程已打通
- 报告与推荐卡片基于 mock 数据渲染
- 前后端联调时只需切换 `USE_MOCK` 与后端地址

## Notes

- `.agents/` 已从版本控制移除并在 `.gitignore` 中忽略
- 详细执行过程见：`ProductManagment/0214/前端执行记录.md`
