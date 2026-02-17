import { getMockResult } from "./mockData";

const USE_MOCK = false;
const API_BASE_URL = "http://localhost:8000/api";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollStatus(taskId, { intervalMs = 1200, timeoutMs = 30000 } = {}) {
  const start = Date.now();

  while (true) {
    const res = await fetch(`${API_BASE_URL}/youcam/skin-analysis/status/${taskId}/`);
    const json = await res.json();

    if (!res.ok || json?.success === false) {
      throw new Error(json?.error || "查询任务失败");
    }

    // ✅ 成功时后端返回 normalized
    if (json.normalized) return json.normalized;

    if (Date.now() - start > timeoutMs) {
      throw new Error("分析超时，请稍后再试或换张图片");
    }

    await sleep(intervalMs);
  }
}

export async function analyzeSkin(imageFile) {
  if (!imageFile) throw new Error("请先上传图片");

  if (USE_MOCK) {
    await sleep(800);
    return getMockResult();
  }

  // 1) start
  const formData = new FormData();
  formData.append("image", imageFile);

  const startRes = await fetch(`${API_BASE_URL}/analyze/`, {
    method: "POST",
    body: formData,
  });

  const startJson = await startRes.json();
  console.log("start:", startJson);

  if (!startRes.ok || startJson?.success === false) {
    throw new Error(startJson?.error || "启动分析失败");
  }

  const taskId = startJson.task_id;
  if (!taskId) throw new Error("没有拿到 task_id");

  // 2) poll
  const normalized = await pollStatus(taskId);
  return normalized; // ✅ App.jsx 直接当 analysisData 用
}

