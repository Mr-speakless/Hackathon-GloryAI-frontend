const MOCK_RESPONSE = {
  skin_analysis: {
    wrinkle: { raw_score: 36.09, ui_score: 60, output_mask_name: "wrinkle_output.png" },
    acne: { raw_score: 92.29, ui_score: 88, output_mask_name: "acne_output.png" },
    moisture: { raw_score: 48.69, ui_score: 70, output_mask_name: "moisture_output.png" },
    oiliness: { raw_score: 60.74, ui_score: 72, output_mask_name: "oiliness_output.png" },
    redness: { raw_score: 72.01, ui_score: 77, output_mask_name: "redness_output.png" },
    pore: { raw_score: 88.38, ui_score: 84, output_mask_name: "pore_output.png" },
    texture: { raw_score: 80.09, ui_score: 76, output_mask_name: "texture_output.png" },
    radiance: { raw_score: 76.57, ui_score: 79, output_mask_name: "radiance_output.png" },
    age_spot: { raw_score: 83.23, ui_score: 77, output_mask_name: "age_spot_output.png" },
    dark_circle_v2: { raw_score: 80.19, ui_score: 76, output_mask_name: "dark_circle_v2_output.png" },
    eye_bag: { raw_score: 76.67, ui_score: 79, output_mask_name: "eye_bag_output.png" },
    firmness: { raw_score: 89.66, ui_score: 85, output_mask_name: "firmness_output.png" },
    droopy_upper_eyelid: { raw_score: 79.05, ui_score: 80, output_mask_name: "droopy_upper_eyelid_output.png" },
    droopy_lower_eyelid: { raw_score: 79.97, ui_score: 81, output_mask_name: "droopy_lower_eyelid_output.png" },
    all: { score: 75.76 },
    skin_age: 27,
  },
  recommendations: {
    beginner: [
      { name: "温和洁面", brand: "SimpleLab", description: "减少清洁过度，维持屏障稳定。" },
      { name: "轻保湿乳", brand: "HydraM", description: "日常补水，改善紧绷感。" },
      { name: "基础防晒", brand: "SunDaily", description: "白天稳定防护，降低光损伤。" },
    ],
    intermediate: [
      { name: "控油精华", brand: "PoreFix", description: "帮助减少油光和毛孔明显度。" },
      { name: "修护精华", brand: "BarrierCare", description: "辅助缓解泛红，修护屏障。" },
      { name: "晚间面霜", brand: "NightFlow", description: "夜间维稳，减少干燥粗糙。" },
    ],
    advanced: [
      { name: "抗老精华", brand: "AgeZero", description: "针对细纹和松弛问题。" },
      { name: "眼周精华", brand: "EyeBright", description: "针对黑眼圈和眼袋区域。" },
      { name: "密集修护霜", brand: "RepairPro", description: "加强夜间修护与锁水。" },
    ],
  },
};

export function getMockResult() {
  return structuredClone(MOCK_RESPONSE);
}

