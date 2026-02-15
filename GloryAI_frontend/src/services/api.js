import { getMockResult } from "./mockData";
//这里改成后端接口后记得把USE_MOCK改成false
const USE_MOCK = true;
const API_BASE_URL = "http://localhost:8000/api";

export async function analyzeSkin(imageFile) {
  if (!imageFile) {
    throw new Error("请先上传图片");
  }

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getMockResult();
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("分析失败，请稍后重试");
  }

  return response.json();
}

