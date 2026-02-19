# GloryAI 前端迁移执行文档（开发前基线）

> 日期：2026-02-18  
> 目标：将 `React Tailwind Components` 新设计并入 `GloryAI_frontend`，保留并继续可用现有后端异步分析接口链路。

## 0. 本文档用途

这份文档用于锁定“今天开发开始前”的所有现状、约束、已确认决策和执行计划，作为后续开发与验收基线。

---

## 1. 已阅读与确认的资料范围

### 1.1 产品/前端文档（ProductManagment）
- `ProductManagment/0213/PRD.md`
- `ProductManagment/0214/Frontend Development Plan.md`
- `ProductManagment/0214/前端执行记录.md`
- `ProductManagment/0214/前端测试文档.md`
- `ProductManagment/0214/Claude Execution Plan.md`
- `ProductManagment/0214/环境配置要求.md`
- `ProductManagment/0216/FrontedDevelopmentExecution.md`（当前文档）

### 1.2 后端文档与日志
- `GloryAI_backend/README.md`
- `GloryAI_backend/工作日志.md`

### 1.3 新设计工程资料
- `React Tailwind Components/README.md`
- `React Tailwind Components/src/app/routes.js`
- `React Tailwind Components/src/app/layout/*`
- `React Tailwind Components/src/app/pages/*`
- `React Tailwind Components/src/app/components/*`

### 1.4 现有业务前端关键代码
- `GloryAI_frontend/src/App.jsx`
- `GloryAI_frontend/src/services/api.js`
- `GloryAI_frontend/src/utils/skinAnalysis.js`
- `GloryAI_frontend/src/components/*`

### 1.5 后端接口关键代码
- `GloryAI_backend/gloryai_backend/urls.py`
- `GloryAI_backend/API/urls.py`
- `GloryAI_backend/API/views.py`
- `GloryAI_backend/API/services/youcam.py`
- `GloryAI_backend/gloryai_backend/settings.py`

---

## 2. 当前系统真实状态（代码级确认）

## 2.1 前端当前架构（GloryAI_frontend）
- 单页面状态机模型：`upload -> analyzing -> report`
- 入口：`GloryAI_frontend/src/App.jsx`
- API 调用入口：`GloryAI_frontend/src/services/api.js`
- 报告生成逻辑：`GloryAI_frontend/src/utils/skinAnalysis.js`

当前 API 模式：
- `USE_MOCK = false`
- `API_BASE_URL = "http://localhost:8000/api"`

说明：当前默认已经走真实后端，不是 mock-only。

## 2.2 后端当前架构（GloryAI_backend）
- 项目路由挂载：`/api/`
- 核心接口：
  - `POST /api/analyze/`（上传图片并启动任务）
  - `GET /api/youcam/skin-analysis/status/<task_id>/`（轮询状态）

后端返回流程：
1. 前端上传 `image`（multipart/form-data）
2. 返回 `task_id`
3. 前端轮询 status
4. 成功时返回 `normalized`，前端用于渲染

CORS：已配置本地开发域（5173/5175）。

## 2.3 normalized 当前字段（后端实际）
```json
{
  "skin_analysis": {
    "wrinkle": { "ui_score": 60, "raw_score": 36.09, "mask_url": "..." },
    "pore": { "ui_score": 84, "raw_score": 88.38, "mask_url": "..." },
    "texture": { "ui_score": 76, "raw_score": 80.09, "mask_url": "..." },
    "acne": { "ui_score": 88, "raw_score": 92.29, "mask_url": "..." }
  },
  "all": { "score": 75.76 },
  "skin_age": 31,
  "resize_image_url": "..."
}
```

注意：当前后端只稳定提供 4 个 action（wrinkle/pore/texture/acne），不是 14 项全量。

---

## 3. 新设计工程现状（React Tailwind Components）

## 3.1 架构模型
- 多路由模型（React Router）：
  - `/` -> HomePage
  - `/skin-lab` -> SkinLabPage
  - `/scanning` -> ScanningPage
  - `/report` -> SkinReportPage
- 布局层：`Layout + PageNav`

## 3.2 数据状态
- 新设计页面基本是静态 UI 演示
- 页面中的分数、文案、产品卡大多写死
- 尚未接入现有后端异步任务+轮询逻辑

## 3.3 资产问题
- 大量 `figma:asset/...` 引用
- 在现项目里直接可运行性存在风险，需要后续替换/落地真实资源路径

---

## 4. 今天开发前已达成决策（用户确认）

1. **核心目标明确**：将新设计的静态路由展示改造成业务异步任务 + 轮询接口模型；本质是“外观迁移 + 业务保留”。
2. **figma 资产问题延后**：第一版先允许资源占位/空置，不阻塞主链路。
3. **字段映射复杂项延后**：先静态跑通页面框架，后续再补齐详细字段映射逻辑。
4. `0215` 目录不存在，基线文档统一放在 `0216`。

---

## 5. 关键风险与约束（开发前）

1. 新设计是静态路由，现业务是异步状态机，需做模型融合。
2. 后端返回字段少于设计展示字段，报告页需先做降级展示。
3. `figma:asset` 资源不可直接复用，短期需占位图策略。
4. 迁移过程必须保证接口契约不变：
   - `POST /api/analyze/`
   - `GET /api/youcam/skin-analysis/status/<task_id>/`
   - 字段 `image` 不改

---

## 6. 今日开发计划（分阶段）

## 阶段 1：迁移骨架（路由与页面壳）
目标：把新设计的页面骨架移入 `GloryAI_frontend`，但先不改业务接口。

要做：
- 在 `GloryAI_frontend` 建立路由结构（Home/SkinLab/Scanning/Report）
- 接入 `Layout + PageNav`
- 将原 `App.jsx` 状态机逻辑拆为可复用业务层（或 hook）

产出：
- 前端可访问四个路由页面
- 页面可渲染（即使部分图像是占位）

验收：
- 路由跳转正常
- 构建/启动无报错

## 阶段 2：业务链路嫁接（先通后美）
目标：在新路由页面里恢复旧业务主流程。

要做：
- `SkinLab` 页面完成上传入口与触发分析
- 触发分析后跳转到 `Scanning`
- 在 `Scanning` 执行 `task_id` 轮询
- 轮询成功跳转 `Report` 并携带/存储 `normalized`
- 轮询失败回到 `SkinLab` 并显示错误

产出：
- 新 UI 下的完整业务链路：上传 -> 扫描 -> 报告

验收：
- 能用真实后端跑通 1 次完整流程
- 错误路径可回退并提示

## 阶段 3：报告页字段最小映射（MVP）
目标：先把当前后端已有字段映射到新报告页面。

要做：
- 映射 `all.score`、`skin_age`
- 映射 `wrinkle/pore/texture/acne` 到状态标签或卡片
- 映射 `mask_url` 至左侧 overlay 切换
- 推荐区先保留静态 mock（不阻塞）

产出：
- 新报告页面显示真实分析数据（最小可用）

验收：
- 报告关键数据不是写死值
- overlay 可切换已返回的 mask

## 阶段 4：样式校正与回归测试
目标：稳定版本，避免迁移引入回归。

要做：
- 调整响应式和关键视觉差异
- 回归测试主流程与错误流程
- 补充执行记录与测试记录

产出：
- 可演示版本（业务可用、视觉接近新设计）

验收：
- 主流程：上传 -> 扫描 -> 报告 -> 重新检测 全通过
- 错误流程：非人脸/超时/接口失败 可提示并恢复

---

## 7. 阶段优先级（今天建议）

- P0：阶段 1 + 阶段 2（先打通链路）
- P1：阶段 3（关键字段最小映射）
- P2：阶段 4（视觉精修和增强）

理由：Hackathon 场景下“可跑通 + 可演示”优先于“字段完美覆盖”。

---

## 8. 今日开发完成定义（DoD）

满足以下即判定今天目标完成：
1. 新路由 UI 已落进 `GloryAI_frontend`
2. 保持并跑通现有后端异步接口链路
3. 报告页显示真实后端关键字段（最小映射）
4. 迁移记录写入 `0216` 文档并可复现

---

## 9. 之后再做（明确延后项）

1. Figma 资产替换为本地静态资源/CDN资源
2. 完整字段映射（扩展到更多 skin actions）
3. 推荐数据从静态 mock 改为后端返回
4. 报告页文案生成策略升级（前端规则 -> 后端/LLM）

---

## 10. 执行备注

- 本文档是 2026-02-18 开发前冻结版本。
- 后续每阶段结束后，在本文件追加“阶段结果/问题/决策变更”。

---

## 11. 阶段 1 执行记录（进行中）

### 11.1 本阶段目标
- 在 `GloryAI_frontend` 建立新路由骨架（`/`、`/skin-lab`、`/scanning`、`/report`）。
- 保留原有状态机实现，避免业务代码丢失。
- 暂不接入 figma 资产与字段映射细节。

### 11.2 实际执行动作（按顺序）
1. 创建目录：
   - `GloryAI_frontend/src/app/layout`
   - `GloryAI_frontend/src/app/pages`
   - `GloryAI_frontend/src/features/legacy`
2. 将旧 `src/App.jsx` 迁移为：
   - `src/features/legacy/LegacyFlowPage.jsx`
3. 重写 `src/App.jsx` 为 `RouterProvider` 入口。
4. 新增路由文件：`src/app/routes.jsx`。
5. 新增布局文件：
   - `src/app/layout/Layout.jsx`
   - `src/app/layout/PageNav.jsx`
6. 新增阶段一占位页面：
   - `src/app/pages/HomePage.jsx`
   - `src/app/pages/SkinLabPage.jsx`
   - `src/app/pages/ScanningPage.jsx`
   - `src/app/pages/SkinReportPage.jsx`
7. 修复 `LegacyFlowPage`：
   - 导入路径改为 `../../...`
   - 导出改为 `export function LegacyFlowPage()`
8. 在 `GloryAI_frontend/package.json` 添加依赖：
   - `react-router-dom: ^7.0.0`

### 11.3 阶段 1 当前产出
- 新路由骨架已落地。
- 底部导航 `PageNav` 已可在四个路由间切换。
- 原有业务状态机代码已保留在 `LegacyFlowPage`（临时访问路径：`/legacy-flow`）。

### 11.4 本阶段未做（按约束）
- 未处理 `figma:asset` 资源替换。
- 未做异步任务链路迁移到 `/skin-lab -> /scanning -> /report`。
- 未做报告字段映射增强。

### 11.5 下一步（若继续）
- 开始阶段 2：将上传触发、任务轮询、结果跳转迁移到新路由页面流。

---

## 12. 阶段 1 测试清单（手动）

> 目标：仅验证“路由骨架迁移”是否正确，不验证阶段 2/3 的业务联调逻辑。

### 12.1 测试环境
- 项目目录：`e:/设计项目/GloryAI/GloryAI_frontend`
- Node / npm：沿用当前本机环境
- 启动命令：
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm install
npm run dev -- --host
```
- 默认访问：`http://localhost:5173`

### 12.2 阶段 1 验收标准（测试版）
1. 首页 `/` 可正常渲染。
2. 底部导航 `PageNav` 可切换到四个路由：
   - `/`
   - `/skin-lab`
   - `/scanning`
   - `/report`
3. 四个页面均无白屏、无报错崩溃。
4. 旧流程保留页 `/legacy-flow` 可打开。

### 12.3 测试用例

#### TC-S1-01 启动与首页加载
- 步骤：执行启动命令，打开 `http://localhost:5173`
- 预期：
  - 页面成功加载
  - 显示 Home 占位内容
  - 底部导航可见

#### TC-S1-02 路由跳转（Skin Lab）
- 步骤：点击底部导航 `Skin Lab` 或直接访问 `http://localhost:5173/skin-lab`
- 预期：
  - 页面显示 `Skin Lab` 占位内容
  - 无报错弹窗、无空白页

#### TC-S1-03 路由跳转（Scanning）
- 步骤：点击底部导航 `Scanning` 或访问 `http://localhost:5173/scanning`
- 预期：
  - 页面显示 `Scanning` 占位内容
  - 无报错弹窗、无空白页

#### TC-S1-04 路由跳转（Report）
- 步骤：点击底部导航 `Report` 或访问 `http://localhost:5173/report`
- 预期：
  - 页面显示 `Skin Report` 占位内容
  - 无报错弹窗、无空白页

#### TC-S1-05 返回首页
- 步骤：点击底部导航 `Home` 或访问 `http://localhost:5173/`
- 预期：
  - 回到 Home 页面
  - 页面状态正常

#### TC-S1-06 旧流程保留验证（兼容）
- 步骤：访问 `http://localhost:5173/legacy-flow`
- 预期：
  - 可进入原上传/分析/报告旧流程页面
  - 至少上传页可正常显示

### 12.4 失败判定
出现以下任一情况视为阶段 1 测试失败：
1. 任一路由打开白屏。
2. 控制台出现阻断错误（如模块缺失、路由异常）。
3. `/legacy-flow` 无法打开。

### 12.5 问题记录模板
```text
[问题标题]
用例ID：
步骤：
预期：
实际：
浏览器控制台报错：
截图：
```

### 12.6 执行结果填写区（你测试后回填）
- TC-S1-01：已执行 成功
- TC-S1-02：已执行 成功
- TC-S1-03：已执行 成功
- TC-S1-04：已执行 成功
- TC-S1-05：已执行 成功
- TC-S1-06：已执行 成功

结论：阶段一成功

---

## 13. 阶段 1 测试报错修复记录（2026-02-18）

### 13.1 用户反馈报错
- Vite 报错：`package.json ... is not valid JSON`
- 连带报错：`Failed to resolve import react-router-dom`

### 13.2 根因定位
- `GloryAI_frontend/package.json` 文件带有 UTF-8 BOM 头（`EF BB BF`）。
- 在当前工具链下，`@tailwindcss/vite` 读取目录描述文件时 JSON 解析失败，导致依赖解析链路中断。

### 13.3 修复动作
1. 检查 `package.json` 前 3 字节，确认存在 BOM（239,187,191）。
2. 使用无 BOM 的 UTF-8 重新写入 `package.json`。
3. 复检文件头，确认已无 BOM（文件起始字节为 `{`）。

### 13.4 你本地需要执行
在 `GloryAI_frontend` 目录执行：
```bash
npm install
npm run dev -- --host
```

说明：
- 第二类报错（`react-router-dom` 找不到）通常是依赖未安装完成引起。
- 在 `package.json` 可正常解析后，重新安装依赖即可恢复。

---

## 14. 阶段 2 执行记录（已完成代码改造）

### 14.1 本阶段目标
- 把异步业务链路迁移到新路由流：`/skin-lab -> /scanning -> /report`。
- 保留原有旧流程页面作为回退（`/legacy-flow`）。

### 14.2 实际执行动作（按顺序）
1. 新增全局分析流程上下文：
   - `GloryAI_frontend/src/features/analysis/AnalysisFlowContext.jsx`
   - 承载状态：`pendingFile`、`analysisData`、`error`、`isAnalyzing`、`uploadedImageUrl`、mask切换信息
   - 承载动作：`queueAnalysis`、`runQueuedAnalysis`、`switchMask`、`resetAll`
2. 更新 `App` 入口：
   - `GloryAI_frontend/src/App.jsx`
   - 使用 `AnalysisFlowProvider` 包裹 `RouterProvider`
3. 改造 `SkinLabPage`：
   - 文件：`GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - 接入 `ImageUpload`
   - 上传后调用 `queueAnalysis(file)` 并导航到 `/scanning`
   - 展示全局错误信息
4. 改造 `ScanningPage`：
   - 文件：`GloryAI_frontend/src/app/pages/ScanningPage.jsx`
   - 接入 `AnalyzingLoader`
   - 页面进入后执行 `runQueuedAnalysis()`
   - 成功跳转 `/report`，失败跳回 `/skin-lab`
   - 直达扫描页但无待分析文件时自动回 `/skin-lab`
5. 改造 `SkinReportPage`：
   - 文件：`GloryAI_frontend/src/app/pages/SkinReportPage.jsx`
   - 使用 `ReportPage` 渲染真实 `analysisData` 结果
   - 支持 mask 切换与重置
   - 无数据直达报告页自动回 `/skin-lab`

### 14.3 阶段 2 当前结果
- 新路由业务主链路已接通（代码层）。
- 旧逻辑仍保留在：`/legacy-flow`。

### 14.4 当前限制
- 本执行环境（PowerShell 沙箱）无 `npm` 命令，无法本地直接跑构建验证。
- 尝试通过 WSL 执行构建时，授权被拒绝，未执行成功。

---

## 15. 阶段 2 测试清单（手动）

> 目标：验证新路由下的异步任务链路是否可用。

### 15.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm install
npm run dev -- --host
```
访问：`http://localhost:5173`

### 15.2 测试用例

#### TC-S2-01 Skin Lab 上传触发
- 步骤：访问 `/skin-lab`，上传合法 JPG/PNG 并点“开始分析”
- 预期：页面跳转到 `/scanning`

#### TC-S2-02 Scanning 自动轮询
- 步骤：在 `/scanning` 等待
- 预期：
  - 出现分析中加载动画
  - 轮询成功后自动跳转 `/report`

#### TC-S2-03 Report 页面展示
- 步骤：观察 `/report`
- 预期：
  - 显示报告主容器
  - 左侧可见上传原图（若有 mask_url 则叠加）
  - 可点击左右按钮切换 mask

#### TC-S2-04 Report 重置回流
- 步骤：点击“重新检测”
- 预期：跳转回 `/skin-lab`

#### TC-S2-05 无上下文保护（扫描页）
- 步骤：直接在地址栏输入 `/scanning`
- 预期：自动回到 `/skin-lab`

#### TC-S2-06 无上下文保护（报告页）
- 步骤：直接在地址栏输入 `/report`
- 预期：自动回到 `/skin-lab`

#### TC-S2-07 失败路径
- 步骤：上传后端无法识别的人脸/非法图，触发接口失败
- 预期：
  - 自动回到 `/skin-lab`
  - 页面出现错误提示（红色文案）

### 15.3 执行结果填写区（你测试后回填）
- TC-S2-01：已执行 成功
- TC-S2-02：已执行 成功
- TC-S2-03：已执行 成功
- TC-S2-04：已执行 成功
- TC-S2-05：已执行 成功
- TC-S2-06：已执行 成功
- TC-S2-07：已执行 成功

结论：已执行 成功

---

## 16. 阶段 3 执行记录（字段最小映射 MVP）

### 16.1 本阶段目标
- 将报告页核心静态值替换为真实后端字段。
- 映射当前后端可稳定返回的 4 项指标：`wrinkle/pore/texture/acne`。
- 保持推荐区可显示（后端无推荐字段时使用静态兜底）。

### 16.2 实际执行动作
1. 更新 `buildReport`（`src/utils/skinAnalysis.js`）：
   - 新增 `CORE_METRICS = ["wrinkle", "pore", "texture", "acne"]`
   - 输出 `focusMetrics`（每项包含 `label/score/risk/severity`）
   - 保留 `overallScore` 映射 `all.score`
   - 保留 `skinAge` 映射 `skin_age`
   - 修复空数据摘要兜底文案，避免空字符串拼接
2. 更新 `SkinReport`（`src/components/SkinReport.jsx`）：
   - 新增 `core metrics` 区块，显示 4 项核心指标的真实分数与风险
   - 保留 `main issue`（Top issue）区块
3. 更新 `RecommendationGrid`（`src/components/RecommendationGrid.jsx`）：
   - 当 `items` 为空时，显示 3 张静态兜底推荐卡
4. 更新 `ReportPage`（`src/components/ReportPage.jsx`）：
   - mask 标题空值兜底显示为 `暂无`
   - 其余链路保持不变

### 16.3 阶段 3 当前结果
- 报告页已不再只依赖静态文本。
- 已接入并展示后端关键字段：`all.score`、`skin_age`、4项核心 action 的 `ui_score` 与风险等级。
- 推荐区在后端无推荐字段时仍可稳定显示。

---

## 17. 阶段 3 测试清单（手动）

### 17.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm run dev -- --host
```

### 17.2 测试用例

#### TC-S3-01 总分与皮肤年龄映射
- 步骤：走完整链路到 `/report`
- 预期：
  - 页面显示“总分”为后端 `all.score`（四舍五入）
  - 页面显示“皮肤年龄”为后端 `skin_age`

#### TC-S3-02 Core Metrics 4项映射
- 步骤：在报告页查看 `core metrics`
- 预期：
  - 固定显示 4 项：细纹/毛孔/肤质纹理/痘痘
  - 每项显示真实 `ui_score` 与风险等级（高/中/低）

#### TC-S3-03 Mask 切换兜底
- 步骤：在报告页点击左右切换按钮
- 预期：
  - 有 mask 时可切换并显示分数
  - 无 mask 时标题显示“暂无”，页面不报错

#### TC-S3-04 推荐区兜底
- 步骤：后端返回无 `recommendations`（当前常态）
- 预期：
  - `新手推荐`、`进阶推荐` 区块均显示静态兜底卡片
  - 页面不空白、不报错

### 17.3 执行结果填写区（你测试后回填）
- TC-S3-01：已执行 成功
- TC-S3-02：已执行 成功
- TC-S3-03：已执行 成功
- TC-S3-04：已执行 

结论：已执行 

---

## 18. 阶段 4.0 收口修复记录（阶段三闭环）

### 18.1 修复目标
- 解决阶段三中“推荐区可能显示为空白”的风险。
- 解决报告右侧区域在部分屏幕下内容可见性不足的问题。

### 18.2 实际修复动作
1. 更新 `GloryAI_frontend/src/components/RecommendationGrid.jsx`
   - 新增 `hasBackendItems` 判断。
   - 当后端推荐为空时，强制使用 3 张静态兜底卡。
   - 增加“静态占位推荐”标记，便于区分真实推荐与占位数据。
   - 推荐卡增加边框，提升视觉可见性。
2. 更新 `GloryAI_frontend/src/components/ReportPage.jsx`
   - 右侧内容容器由 `overflow-hidden` 调整为 `overflow-y-auto`。
   - 增加 `pb-24`，避免底部导航遮挡内容。
   - 保留 mask 标题空值兜底逻辑（`暂无`）。

### 18.3 阶段 4.0 复测清单（手动）

#### TC-S4-01 推荐兜底卡可见
- 步骤：走完整链路进入 `/report`（后端无 recommendations）
- 预期：
  - `新手推荐` 与 `进阶推荐` 均显示 3 张静态占位卡
  - 每个区块右上显示“静态占位推荐”

#### TC-S4-02 右侧内容滚动
- 步骤：在 `/report` 页面滚动右侧列
- 预期：
  - 可滚动查看全部模块
  - 不被底部导航遮挡

#### TC-S4-03 阶段三回归
- 步骤：复测阶段三关键项
- 预期：
  - `all.score`、`skin_age` 显示正常
  - core metrics 4项可见
  - mask 切换正常

### 18.4 执行结果填写区（你测试后回填）
- TC-S4-01：已执行 成功
- TC-S4-02：已执行 成功
- TC-S4-03：已执行 成功

结论：已执行 成功

---

## 19. 阶段 4.1 执行记录（静态视觉迁移 - 第一批）

### 19.1 本阶段目标
- 迁移新设计中的静态视觉层（优先 Home 与 Skin Lab）。
- 保持阶段 2/3 已接通的业务链路不回退。

### 19.2 实际执行动作
1. 更新 `GloryAI_frontend/src/app/pages/HomePage.jsx`
   - 使用本地素材（`src/assets/images`）重建首页 Hero 视觉结构
   - 新增顶部胶囊导航风格（Skin Lab / About）
   - 新增右侧双人像叠放区域
   - 新增静态指标与扫描徽章样式
2. 更新 `GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - 使用本地素材重建 Skin Lab 左右分栏布局
   - 左侧加入静态流程与拍照示例区
   - 右侧加入风格化上传区（预览+Select+Scan）
   - 保留业务触发：`Scan -> queueAnalysis(file) -> navigate('/scanning')`
   - 增加 object URL 释放逻辑，避免预览图内存泄漏

### 19.3 影响说明
- 本次仅调整视觉层与页面结构。
- 异步任务链路（阶段 2）与报告映射（阶段 3）保持不变。

---

## 20. 阶段 4.1 测试清单（手动）

### 20.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm run dev -- --host
```

### 20.2 测试用例

#### TC-S4-1-01 Home 视觉结构
- 步骤：访问 `/`
- 预期：
  - 显示新的 Hero 视觉布局（左文案+右侧双图）
  - 顶部导航样式可见
  - `Get Start` 点击可跳到 `/skin-lab`

#### TC-S4-1-02 Skin Lab 新布局
- 步骤：访问 `/skin-lab`
- 预期：
  - 左侧显示流程和拍照示例区
  - 右侧显示上传预览区与 `Select`/`Scan` 按钮

#### TC-S4-1-03 Skin Lab 功能不回退
- 步骤：上传合法图片并点击 `Scan`
- 预期：
  - 跳转 `/scanning`
  - 后续链路仍可到 `/report`

#### TC-S4-1-04 文件校验
- 步骤：上传非法格式或超 10MB 图片
- 预期：
  - 出现错误提示
  - 不进入扫描流程

### 20.3 执行结果填写区（你测试后回填）
- TC-S4-1-01：已测试 成功
- TC-S4-1-02：已测试 成功
- TC-S4-1-03：已测试 成功
- TC-S4-1-04：已测试 成功

结论：已测试 成功

---

## 21. 阶段 4.1 即时修复记录（JSX 解析错误）

### 21.1 用户反馈
- Vite 报错：
  - `[plugin:vite:oxc] Transform failed`
  - `Unexpected token. Did you mean {'>'} or &gt;?`
- 位置：`src/app/pages/SkinLabPage.jsx` 第 111 行附近。

### 21.2 根因
- JSX 文本中直接写了 `>=` 与 `<=`，被解析器识别为非法 token 组合。

### 21.3 修复动作
- 将文案从：
  - `Dimension: Short side >= 480px, Long side <= 4096px`
- 改为转义：
  - `Dimension: Short side &gt;= 480px, Long side &lt;= 4096px`

### 21.4 预期结果
- `npm run dev -- --host` 可恢复正常编译。
- 首页与 Skin Lab 页面可正常访问。

## 22. 阶段 4.1 执行记录（静态视觉迁移 - 第二批）

### 22.1 本阶段目标
- 迁移 `Scanning` 与 `Report` 的视觉外观，向 `React Tailwind Components` 风格靠拢。
- 保持阶段 2/3 的业务链路、数据映射、交互能力不变。

### 22.2 实际执行动作
1. 更新 `GloryAI_frontend/src/app/pages/ScanningPage.jsx`
   - 扫描页背景改为设计稿同款渐变。
   - 中央加入上传图预览容器（无图时占位）。
   - 添加暗色覆盖层与扫描线视觉效果。
   - 保留原有自动轮询与跳转逻辑：
     - 成功 -> `/report`
     - 失败/无上下文 -> `/skin-lab`
2. 更新 `GloryAI_frontend/src/components/ReportPage.jsx`
   - 页面背景改为设计稿渐变风格。
   - 左侧图像和 mask 叠层保留，卡片样式升级。
   - 右侧模块容器继续保持可滚动，避免内容截断。
   - “重新检测”按钮保留业务行为。
3. 更新 `GloryAI_frontend/src/components/SkinReport.jsx`
   - 标题改为 `Skin Report` 风格化展示。
   - 保留动态数据字段（summary / skinAge / overallScore / core metrics / main issue）。
   - 调整卡片与排版为更接近新设计的视觉层。

### 22.3 影响说明
- 仅做视觉层改造，不改接口契约。
- 阶段 2/3 功能链路与映射逻辑仍然有效。

---

## 23. 阶段 4.1（第二批）测试清单（手动）

### 23.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm run dev -- --host
```

### 23.2 测试用例

#### TC-S4-2-01 Scanning 视觉与链路
- 步骤：在 `/skin-lab` 上传图片后进入 `/scanning`
- 预期：
  - 显示新扫描页视觉（渐变背景 + 图像 + 扫描线）
  - 自动完成轮询并跳转 `/report`

#### TC-S4-2-02 Report 视觉完整性
- 步骤：到达 `/report`
- 预期：
  - 左侧原图 + mask 区域显示正常
  - 右侧 `Skin Report` 与推荐区块样式正常
  - 右侧区域可滚动，不被底部导航遮挡

#### TC-S4-2-03 Report 功能不回退
- 步骤：在 `/report` 测试交互
- 预期：
  - mask 左右切换正常
  - core metrics / main issue 保持真实数据
  - 点击“重新检测”回到 `/skin-lab`

### 23.3 执行结果填写区（你测试后回填）
- TC-S4-2-01：已测试 成功
- TC-S4-2-02：已测试 成功
- TC-S4-2-03：已测试 成功

结论：已测试 成功

---

## 24. 阶段 4.2 执行记录（图标/SVG 收敛与组件化）

### 24.1 本阶段目标
- 将顶部导航视觉与图标抽象成可复用组件。
- 在不影响业务链路的前提下，降低页面间样式重复和后续维护成本。

### 24.2 实际执行动作
1. 新增组件：`GloryAI_frontend/src/app/components/TopNavPill.jsx`
   - 内置 `SkinLabIcon`、`AboutIcon`（SVG）
   - 支持 active 状态（`skinlab` / `about`）
   - 统一 Home 和 SkinLab 顶部导航样式
2. 更新 `GloryAI_frontend/src/app/pages/HomePage.jsx`
   - 移除页面内本地导航实现，改用 `TopNavPill`
   - 保持原有 Hero 视觉与 CTA 行为不变
3. 更新 `GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - 接入 `TopNavPill`（active=skinlab）
   - 将三步流程块改为可复用 `StepRow`
   - 保留上传与分析链路：`Scan -> /scanning`

### 24.3 影响说明
- 仅为视觉层与结构重构。
- 未改动接口、轮询逻辑、报告映射逻辑。

---

## 25. 阶段 4.2 测试清单（手动）

### 25.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm run dev -- --host
```

### 25.2 测试用例

#### TC-S4-2A-01 顶部导航图标显示
- 步骤：分别访问 `/` 与 `/skin-lab`
- 预期：
  - 顶部胶囊导航显示 SVG 图标
  - `/` 页 About 高亮，`/skin-lab` 页 Skin Lab 高亮

#### TC-S4-2A-02 顶部导航跳转
- 步骤：点击顶部导航的两项 tab
- 预期：
  - 在 Home 与 SkinLab 间可正常跳转
  - 无样式错位与白屏

#### TC-S4-2A-03 SkinLab 功能回归
- 步骤：在 `/skin-lab` 上传合法图片并点击 `Scan`
- 预期：
  - 正常进入 `/scanning`
  - 后续可跳转到 `/report`

### 25.3 执行结果填写区（你测试后回填）
- TC-S4-2A-01：已测试 成功
- TC-S4-2A-02：已测试 成功
- TC-S4-2A-03：已测试 成功

结论：已测试 成功

---

## 26. 阶段 4.3 执行记录（响应式与交互统一）

### 26.1 本阶段目标
- 收敛 Home/SkinLab/Scanning/Report 的小屏体验。
- 统一关键交互反馈，减少不同页面的视觉行为差异。

### 26.2 实际执行动作
1. 更新 `GloryAI_frontend/src/app/components/TopNavPill.jsx`
   - 顶部胶囊导航支持 `flex-wrap`，避免窄屏溢出。
2. 更新 `GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - 页面左右区块在窄屏自动堆叠。
   - 拍照示例网格在小屏改为更合理列数。
   - `Select` / `Scan` 按钮增加统一 hover 反馈。
   - 文案层级与内边距针对小屏下调。
3. 更新 `GloryAI_frontend/src/app/pages/ScanningPage.jsx`
   - 扫描图容器改为 `w-full + max-width`，高度使用视口比例并设置最小值。
   - 解决窄屏固定宽高导致的裁切/溢出风险。
4. 更新 `GloryAI_frontend/src/components/ReportPage.jsx`
   - 主容器改为 `min-h-screen`，兼容不同设备高度。
   - 左侧标题文字在小屏缩级，避免挤压。
   - 右侧滚动区底部留白在移动端增大，避免与底部导航重叠。
5. 更新 `GloryAI_frontend/src/app/layout/PageNav.jsx`
   - 底部导航在移动端缩小字号与间距，并限制最大宽度。

### 26.3 影响说明
- 本次改造不涉及 API 或业务状态机逻辑。
- 仅做视觉/布局/交互细节收敛。

---

## 27. 阶段 4.3 测试清单（手动）

### 27.1 启动命令
```bash
cd e:/设计项目/GloryAI/GloryAI_frontend
npm run dev -- --host
```

### 27.2 测试用例

#### TC-S4-3-01 窄屏导航可用性
- 步骤：将浏览器缩窄到移动宽度（如 390px）
- 预期：
  - 顶部导航 `TopNavPill` 不溢出
  - 底部 `PageNav` 按钮不重叠、可点击

#### TC-S4-3-02 SkinLab 窄屏布局
- 步骤：访问 `/skin-lab` 并缩到窄屏
- 预期：
  - 左右区块改为纵向堆叠
  - 示例图片和上传区无横向滚动
  - Select/Scan 按钮 hover/disabled 正常

#### TC-S4-3-03 Scanning 自适应
- 步骤：上传后进入 `/scanning`，在窄屏观察
- 预期：
  - 扫描图容器完整显示（不超出屏幕宽度）
  - 扫描线可见

#### TC-S4-3-04 Report 窄屏可读性
- 步骤：进入 `/report` 并缩到窄屏
- 预期：
  - 报告标题、mask 信息不拥挤
  - 右侧内容可滚动查看全量模块
  - 底部导航不遮挡核心内容

### 27.3 执行结果填写区（你测试后回填）
- TC-S4-3-01：已执行 成功
- TC-S4-3-02：已执行 成功
- TC-S4-3-03：已执行 成功
- TC-S4-3-04：已执行 成功

结论：已执行 成功


---

## 28. 阶段 4.4 执行记录（封板回归与交付清单）

### 28.1 目标
- 对 4.0 ~ 4.3 的结果做封板收敛。
- 明确“当前可交付状态”“剩余差异与后续补救计划”。

### 28.2 回归结论（基于已回填测试）
1. 阶段 1：通过（路由骨架）
2. 阶段 2：通过（上传 -> 扫描 -> 报告 链路）
3. 阶段 3：通过（关键字段映射 + 推荐兜底）
4. 阶段 4.0：通过（推荐空白风险与报告可滚动问题收口）
5. 阶段 4.1：通过（Home/SkinLab/Scanning/Report 视觉迁移）
6. 阶段 4.2：通过（顶部导航 icon/SVG 组件化）
7. 阶段 4.3：通过（响应式与交互一致性）

综合结论：
- 当前版本可作为 Hackathon 可演示版本。
- 核心业务链路、关键数据映射和基础视觉一致性已达到可交付标准。

### 28.3 当前可交付能力（As-Is）
- 前端多路由：`/`、`/skin-lab`、`/scanning`、`/report`
- 真实后端联调链路：
  - `POST /api/analyze/`
  - `GET /api/youcam/skin-analysis/status/<task_id>/`
- 报告页关键字段映射：
  - `all.score`
  - `skin_age`
  - `wrinkle/pore/texture/acne`
- 推荐区无后端数据时静态兜底稳定可见

### 28.4 与 ReactTailwindComponents 的剩余差异（已知）
1. 部分 icon 仍为近似替代（未逐像素还原）
2. 组件间距、字体与排版有少量偏差
3. 扫描页动画与原稿细节（扫描线质感、遮罩层表现）仍可精修
4. 报告页模块视觉密度与原稿存在轻微差异

### 28.5 下一轮建议（后续补救）
1. 图标与 SVG 全量精修
2. 设计 token 收敛（字体、字号、间距、圆角、阴影）
3. 报告页细节还原（仪表盘、状态徽章视觉）
4. 推荐数据切换到后端真实返回（当前先保持占位兜底）

### 28.6 交付前检查清单（建议）
- [ ] 本地 `npm run dev -- --host` 连续稳定
- [ ] 主流程录屏（上传 -> 扫描 -> 报告 -> 重新检测）
- [ ] 异常流程录屏（非人脸/失败回退）
- [ ] 文档与当前代码状态一致（本文件）

---

## 29. 首页精修记录（按参考图）

### 29.1 本轮目标
- 首页顶部导航收窄并居中。
- 右下角信息区改为：
  - 左侧 `Scanning` 独占一栏
  - 右侧三张指标卡纵向堆叠

### 29.2 实际改动
- 文件：`GloryAI_frontend/src/app/pages/HomePage.jsx`
1. 顶部导航外层新增居中容器：
   - `max-w-md` 收窄
   - `justify-center` 居中
2. 右下角信息区由横向排列改为两列：
   - `grid-cols-[1fr_auto]`
   - 左列仅 `Scanning... >> 100%`
   - 右列 `Moisture / Elasticity / Pores` 三卡纵向排列

### 29.3 手动验证
- 访问 `/`
- 预期：
  - 顶部胶囊导航相对主内容宽度更窄且位于中间
  - 右下角布局符合“左 Scanning + 右三卡纵向”

---

## 30. 首页与 SkinLab 精修（图片叠放 + 新 icon 接线）

### 30.1 本轮需求
1. 首页双人像增加参考图风格的叠放效果。
2. 接入 assets 中新增 icon：
   - Home 顶部导航：Lab / About
   - SkinLab 三步骤：AI Skin Mapping / Skin Report / Personalized Solution
   - Upload icon 替换上传占位图
3. SkinLab 顶部导航容器与 Home 保持同规格（收窄+居中）。

### 30.2 实际改动
1. 更新 `GloryAI_frontend/src/app/components/TopNavPill.jsx`
   - 顶部导航图标改为读取：
     - `src/assets/icons/SkinLabIcon.svg`
     - `src/assets/icons/AboutIcon.svg`
2. 更新 `GloryAI_frontend/src/app/pages/HomePage.jsx`
   - 双人像位置调整为前后叠放（前景 woman 覆盖后景 man）
   - 保持右下角为“左 Scanning + 右三卡纵向”结构
3. 更新 `GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - 顶部导航外层容器与 Home 一致：`max-w-md + justify-center`
   - 三步骤改用新 icon：
     - `AISkinMapping.svg`
     - `SkinReportIcon.svg`
     - `PersonalizedSolution.svg`
   - 上传占位改为 `UploadeImg.svg` 图标（无预览时显示）

### 30.3 你提问的原因说明
- 是的，你判断正确：之前 Home 与 SkinLab 的顶部导航“看起来不一致”，主要是因为我只改了 Home 的父级容器（收窄+居中），而 SkinLab 当时直接放置 `TopNavPill`，外层约束不同导致视觉差异。
- 本次已将 SkinLab 的导航容器和 Home 对齐，样式逻辑一致。

### 30.4 手动验证
- `/`：检查双人像叠放与顶部导航图标
- `/skin-lab`：检查顶部导航居中、三步骤 icon、upload 占位 icon
- 上传流程：Select -> Scan -> /scanning 业务链路不回退

---

## 31. SkinLab StepRow 结构精修（icon/text 双容器 + 全局渐变复用）

### 31.1 需求
- 将 SkinLab 三步流程每一行改为两个 `div`：
  - icon 容器
  - text 容器
- icon 容器使用统一修饰：
  - `w-8 h-8 ... rounded`
  - 渐变背景可全局复用

### 31.2 实际改动
1. 更新 `GloryAI_frontend/src/index.css`
   - 新增全局变量：`--icon-chip-gradient`
   - 新增全局复用类：`.icon-chip-gradient`
2. 更新 `GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
   - `StepRow` 从单一 `<p>` 改为结构化双容器：
     - `<div className="icon-chip-gradient w-8 h-8 rounded ...">` 包 icon
     - `<div>...</div>` 包 text

### 31.3 复用说明
- 后续任何页面只要需要同款 icon 背景，可直接使用：
  - `className="icon-chip-gradient w-8 h-8 rounded ..."`
- 若要整体换色，只改 `index.css` 的 `--icon-chip-gradient` 一处即可。

---

## 32. SkinLab PASS/FAIL 行内 icon 精修

### 32.1 需求
- PASS / FAIL 增加对应 icon。
- icon 与文字在同一行。
- 该行在父级容器中居中，并有适当间距。

### 32.2 实际改动
- 文件：`GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
1. PASS 区块改为：
   - `flex items-center justify-center gap-2`
   - 左侧 `GreenPass` icon，右侧 `PASS` 文本
2. FAIL 区块改为：
   - `mt-2 flex items-center justify-center gap-2`
   - 左侧 `RedFail` icon，右侧 `FAIL` 文本

### 32.3 验证点
- `/skin-lab` 页面中 PASS/FAIL 均为 icon + text 同行显示。
- 两组内容在各自父容器中居中，无错位。

---

## 33. SkinLab 上传交互改造（去 Select / 自动 Scan）

### 33.1 需求
- 移除 `Select` 按钮。
- 用户上传图片后，若文件校验通过，自动执行扫描流程（不再多点一步）。

### 33.2 实际改动
- 文件：`GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
1. 删除 `file` 状态与 `startAnalyze` 手动触发逻辑。
2. `handleFile` 在校验通过后直接执行：
   - `queueAnalysis(nextFile)`
   - `navigate('/scanning')`
3. 上传入口改为点击上传 icon 区域：
   - 在上传占位图区域包裹隐藏 `input[type=file]`
   - 点击上传 icon 即可选图
4. 移除原 `Select` 和 `Scan` 按钮，增加说明文案：
   - “点击上传图标，校验通过后自动开始 Scan。”

### 33.3 验证点
- 选择合法图片后应自动跳转 `/scanning`。
- 非法文件（格式/体积）应停留当前页并提示错误。

---

## 34. SkinLab 上传触发方式修正（改回 Scan 按钮）

### 34.1 变更说明
- 移除“点击上传图标自动扫描”的交互文案。
- 恢复为：点击 `Scan` 按钮触发文件选择，选图并校验通过后自动开始扫描。

### 34.2 实际改动
- 文件：`GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
1. 上传占位区恢复为纯展示（不再绑定 file input）。
2. 新增 `Scan` 按钮（label + hidden input）。
3. `onChange` 仍复用 `handleFile`，保持“选图后自动进入 `/scanning`”。

---

## 35. SkinLab 示例图单元格精修（缩窄 + 居中）

### 35.1 需求
- 示例图片区每个单元格改窄。
- 每个单元格内“图片 + 文字”都水平居中。

### 35.2 实际改动
- 文件：`GloryAI_frontend/src/app/pages/SkinLabPage.jsx`
- 组件：`GuideImage`
  - 外层由固定宽度改为：`w-[62px]` 并加 `flex flex-col items-center`
  - 图片尺寸改为：`h-[82px] w-[62px]`
  - 文字加 `w-full text-center`，确保在单元格内水平居中

---

## 36. ReportPage 收敛执行记录（按设计图，仅内容区）

### 36.1 本轮目标
- 按 `ProductManagment/0216/ReportPage收敛计划.md` 收敛 `/report` 内容区。
- 保持页面级导航不变，保留业务链路和后端接口契约。

### 36.2 实际执行动作
1. 更新 `GloryAI_frontend/src/components/ReportPage.jsx`
   - 新增本地状态 `overlayOn`。
   - 左图 mask 叠层受 `overlayOn` 控制。
   - 原说明文案替换为 `Overlay` 开关（含 `role=switch` 和 `focus-visible`）。
   - 保留左右按钮切换 `mask`。
   - 底部动作由“重新检测”改为：`Read Full Report` / `Regenerate`。
   - `Regenerate` 复用 `onReset`。
2. 更新 `GloryAI_frontend/src/components/SkinReport.jsx`
   - 重排主卡：标题 + `Skin Age` 标签。
   - 新增 CSS 仪表盘式 `Overall Score` 区块。
   - 将 `focusMetrics` 与 `topIssues` 转为两行胶囊指标卡。
   - 保持数据来源不变（仍使用 `report`）。
3. 更新 `GloryAI_frontend/src/components/RecommendationGrid.jsx`
   - 推荐项改为横向轻卡布局。
   - 保留后端为空时静态兜底策略。
   - 兜底标记降级为轻角标。
4. 新增文档：`ProductManagment/0216/ReportPage收敛计划.md`
   - 固化本轮目标、差异对比、实施范围、验收标准。

### 36.3 验收清单（待你回填）
- TC-RP-01：Overlay 开关可切换 mask 显隐；左右按钮切换正常。
- TC-RP-02：主卡出现年龄标签、仪表盘和两行胶囊指标。
- TC-RP-03：推荐区为横向轻卡，桌面三列，移动端自适应。
- TC-RP-04：底部显示 `Read Full Report` / `Regenerate`，后者可回 `/skin-lab`。
- TC-RP-05：核心数据仍来自真实映射，无静态值覆盖真实值。

### 36.4 备注
- 本轮未改 API 接口与 `buildReport` 输出结构。
- 页面级导航（顶部/底部）保持现状。

## 37. ReportPage 二次收敛（基于实测截图问题复盘）

### 37.1 复盘结论（问题评估）
根据你反馈截图，上一版主要问题：
1. 左侧图像区过于“满铺”，缺少参考图中的外层框与留白层次。
2. 右侧主卡虽然已重排，但信息密度和视觉节奏仍偏“工程态”。
3. 推荐卡与参考图相比，卡片对齐和文字权重还不够统一。
4. 底部动作区与参考图的弱动作风格不够接近。

### 37.2 本轮修复动作
1. 更新 `GloryAI_frontend/src/components/ReportPage.jsx`
   - 左侧改为“外层容器 + 内层图像卡 + 底部控制区”三级结构。
   - 图像卡新增边框与阴影，叠层透明度下调。
   - mask 切换行与 Overlay 开关的间距、背景、边框重新收敛。
   - 右侧推荐标题改为：`Starter Kit Recommendations` / `Targeted Enhancement`。
   - 底部弱动作改为带箭头的浅色文本入口：`Read Full Report ›` / `Regenerate ›`。
2. 更新 `GloryAI_frontend/src/components/SkinReport.jsx`
   - 标题接入 `SkinReportIcon.svg`。
   - 仪表盘改为半圆渐变进度视觉，降低卡片粗糙感。
   - `Skin Age` 与摘要行重新排布。
   - 指标胶囊统一为 3 列 x 2 行，风险色映射保持不变。
3. 更新 `GloryAI_frontend/src/components/RecommendationGrid.jsx`
   - 推荐卡继续保留横向结构，统一标题层级和行高。
   - 保留静态兜底但弱化角标视觉权重。

### 37.3 待你回归验证
- RC-RP-2-01：左侧是否接近参考图（外层框、内图卡、底部控件层次）。
- RC-RP-2-02：主卡信息层级是否更清晰（标题/年龄/摘要/胶囊）。
- RC-RP-2-03：推荐区是否更接近参考图（两组卡片密度与对齐）。
- RC-RP-2-04：`Overlay`、左右切换、`Regenerate` 功能是否全部正常。

## 38. ReportPage 结构按提示词重排

### 38.1 修改背景
- 按 `ReportPage.jsx` 文件内提示词重排组件结构：
  - `main` 负责全屏渐变背景。
  - 上栏单独放 `TopNavPill`。
  - 下栏拆分左右内容（左图像卡 / 右报告内容）。

### 38.2 实际修改
- 文件：`GloryAI_frontend/src/components/ReportPage.jsx`
1. 修复错误的 DOM 层级与多余闭合标签。
2. 重建布局为 `grid-rows-[auto_1fr]`：顶部导航 + 底部内容区。
3. 底部内容区改为 `md:grid-cols-[35%_65%]`。
4. 保留现有业务交互：
   - 左右 `mask` 切换
   - `Overlay` 开关
   - `Regenerate` -> `onReset`

### 38.3 预期
- 结构清晰并和提示词一致。
- 避免因 JSX 结构错乱引发渲染/编译问题。

## 39. ReportPage 按提示词结构修正（上下再左右）
- 文件：`GloryAI_frontend/src/components/ReportPage.jsx`
- 调整为：`main = 上栏 navbar + 下栏内容`。
- 下栏内容再拆分：`左图像卡片 + 右报告区`。
- 保留原交互：左右切换、Overlay 开关、Regenerate。

## 40. ReportPage JSX 语法修复
- 报错：`Expected corresponding JSX closing tag for 'section'`。
- 文件：`GloryAI_frontend/src/components/ReportPage.jsx`
- 修复：将右侧内容区末尾错误的 `</div>` 更正为 `</section>`。
- 结果：消除该 parse error。

## 41. ReportPage 布局模型改为 Flex（配合 Figma Auto Layout）
- 文件：`GloryAI_frontend/src/components/ReportPage.jsx`
- 修改目标：将页面主结构从 Grid 全量改为 Flex，便于和 Figma Auto Layout 对齐。
- 关键调整：
  1. `main`: `grid` -> `flex flex-col`
  2. 内容容器：`grid` -> `flex flex-col md:flex-row`
  3. 左栏：`md:w-[35%]`
  4. 右栏：`flex-1 flex flex-col`
- 保留功能：mask 左右切换、Overlay 开关、Regenerate。

## 42. 风险等级字段英文统一（Low/Medium/High）
- 文件：`GloryAI_frontend/src/utils/skinAnalysis.js`
  - `toRiskLevel` 返回值由 `高/中/低` 改为 `High/Medium/Low`（阈值逻辑不变）。
- 文件：`GloryAI_frontend/src/components/SkinReport.jsx`
  - `riskTone` 判断改为英文：`Low` / `Medium` / `High`。
  - `fillToThree` 默认风险值改为 `Medium`。
  - 指标展示值改为直接显示 `metric.risk`（不再混用 `Normal` 与中文）。
