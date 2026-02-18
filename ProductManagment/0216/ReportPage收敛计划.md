# ReportPage 设计收敛计划（仅报告内容区）

## 简要总结
基于参考图，本轮仅收敛 `/report` 内容区，不改页面级导航。保留当前 `mask` 左右切换逻辑，将左下说明区替换为 `Overlay` 开关，并补充交互态。

## 当前与参考图的异同

### 相同点
1. 已有左右双栏结构（左图像区 + 右报告区）。
2. 已有核心数据映射（`overallScore`、`skinAge`、`focusMetrics`、`topIssues`）。
3. 已有两段推荐区（新手推荐/进阶推荐）。
4. 已有重新检测业务闭环。

### 主要差异
1. `SkinReport` 头部信息层级与参考稿不一致，缺少年龄标签和仪表盘视觉层。
2. 推荐卡视觉密度偏占位，与参考稿横向轻卡有差异。
3. 左侧底部交互区当前为说明文案，参考稿为 `Overlay` 开关。
4. 右侧底部动作当前为大按钮，参考稿为弱动作链接。
5. 色彩和边框圆角体系偏灰阶，需要收敛到半透明淡紫体系。

## 实施范围
1. `ReportPage` 内容区结构和视觉收敛。
2. 左侧说明文案改 `Overlay` 开关，保留左右切换 `mask`。
3. `SkinReport` 内部模块重排与样式收敛。
4. `RecommendationGrid` 卡片样式改为横向轻卡。
5. 补充 `hover/active/focus-visible/disabled` 交互态。

## 非范围
1. 页面级导航（顶部/底部）不改。
2. 推荐数据来源不改（保留静态兜底）。
3. 不新增后端字段映射，不改接口契约。

## 详细改造方案

### 1. 左侧图像区（`src/components/ReportPage.jsx`）
1. 保留原图+mask叠层与左右切换按钮。
2. 说明文案替换为 `Overlay` 开关（默认 `on`）。
3. 开关行为：
   - `overlayOn=true` 显示 mask。
   - `overlayOn=false` 隐藏 mask，不影响 `currentMaskKey/currentMaskScore`。
4. 开关支持键盘与 focus 态。

### 2. 右侧报告主卡（`src/components/SkinReport.jsx`）
1. 头部重排：标题 + `Skin Age` 标签。
2. 总分区改为 CSS 仪表盘风格卡片。
3. 指标区改为两行胶囊卡片：
   - 第一行：`focusMetrics`（状态化显示）
   - 第二行：`topIssues`（风险化显示）
4. 文案规则沿用现有风险映射，不新增后端依赖。

### 3. 推荐区（`src/components/RecommendationGrid.jsx`）
1. 保持两组推荐。
2. 卡片改为横向轻卡：小图 + 标题 + 简要描述。
3. 卡片高度和间距统一。
4. 静态兜底标记降级为轻角标。

### 4. 底部动作区（`src/components/ReportPage.jsx`）
1. 大按钮替换为双弱动作：`Read Full Report` / `Regenerate`。
2. 行为映射：
   - `Read Full Report`：占位入口（暂不跳新页面）。
   - `Regenerate`：复用 `onReset` 回到 `/skin-lab`。

## 接口/类型变更
1. `ReportPage` 新增组件内状态：`overlayOn`。
2. `ReportPage` 与 `SkinReport` 外部 props 契约不变。
3. `buildReport` 输出结构不变。

## 验收测试
1. `TC-RP-01` Overlay 开关可切 mask 显隐，左右切换正常。
2. `TC-RP-02` 主卡出现年龄标签+仪表盘+两行胶囊，且不溢出。
3. `TC-RP-03` 推荐卡为横向轻卡，桌面三列移动端降列。
4. `TC-RP-04` 底部显示 `Read Full Report/Regenerate`，后者可回 `/skin-lab`。
5. `TC-RP-05` 数据仍来自真实映射，无静态覆盖真实值。

## 风险与默认策略
1. 仪表盘/图标素材不足：先用 CSS 占位实现。
2. 弱动作可见性不足：若反馈差，恢复主按钮。
3. Overlay 关闭理解偏差：保留 mask 名称与分数文本。