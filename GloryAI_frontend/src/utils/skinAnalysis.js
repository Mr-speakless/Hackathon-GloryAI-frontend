const ISSUE_LABELS = {
  wrinkle: "细纹",
  acne: "痘痘",
  moisture: "含水量",
  oiliness: "油脂",
  redness: "泛红",
  pore: "毛孔",
  texture: "肤质纹理",
  radiance: "光泽",
  age_spot: "色斑",
  dark_circle_v2: "黑眼圈",
  eye_bag: "眼袋",
  firmness: "紧致度",
  droopy_upper_eyelid: "上眼睑松弛",
  droopy_lower_eyelid: "下眼睑松弛",
};
// 根据严重程度得分转换为风险等级
function toRiskLevel(severity) {
  if (severity >= 35) return "高";
  if (severity >= 20) return "中";
  return "低";
}
// 根据油脂和含水量得分推断皮肤类型
function inferSkinType(oilinessScore, moistureScore) {
  const lowOil = oilinessScore < 65;
  const lowMoisture = moistureScore < 65;

  if (lowOil && lowMoisture) return "混合偏油";
  if (lowOil && !lowMoisture) return "油性";
  if (!lowOil && lowMoisture) return "偏干";
  return "中性";
}
// 构建皮肤分析报告
export function buildReport(rawData) {
  // 过滤掉不相关的分析项，并计算严重程度
  const analysis = rawData.skin_analysis ?? {};
  // 只保留有有效得分的项，并排除整体评分和皮肤年龄
  const entries = Object.entries(analysis).filter(([key, value]) => {
    return key !== "all" && key !== "skin_age" && typeof value?.ui_score === "number";
  });
  // 将每个问题转换为带有标签、得分和风险等级的对象，并按严重程度排序
  const issues = entries
    .map(([key, value]) => {
      // 严重程度 = 100 - 得分，得分越低问题越严重
      const severity = 100 - value.ui_score;
      return {
        key,
        // 如果有预定义标签就用它，否则直接用key作为标签
        label: ISSUE_LABELS[key] ?? key,
        score: value.ui_score,
        severity,
        //这里写了一个简单的风险等级划分，实际可以根据需求调整阈值和等级，甚至不要这个字段
        risk: toRiskLevel(severity),
      };
    })
    // 按严重程度降序排序，最严重的问题排在前面
    .sort((a, b) => b.severity - a.severity);

  const topIssues = issues.slice(0, 3);
  // 提取油脂和含水量的得分，用于推断皮肤类型，如果没有就默认70分，表示中等水平
  const oilinessScore = analysis.oiliness?.ui_score ?? 70;
  // 含水量得分同理，如果没有就默认70分，表示中等水平
  const moistureScore = analysis.moisture?.ui_score ?? 70;

  return {
    summary: `[测试版] 你的皮肤整体状态稳定，当前优先关注${topIssues
      .map((item) => item.label)
      .join("、")}。建议先做基础护理，再逐步增加功能型产品。`,
    skinType: inferSkinType(oilinessScore, moistureScore),
    skinAge: analysis.skin_age ?? "-",
    overallScore: analysis.all?.score ?? "-",
    topIssues,
  };
}

