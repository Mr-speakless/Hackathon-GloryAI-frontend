import { getMockResult } from "./mockData";
//后端已改接口： 把USE_MOCK改成false
const USE_MOCK = false;

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

  const response = await fetch(`${API_BASE_URL}/analyze/`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("analyze response:", data);
  return data;
}