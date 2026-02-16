# GloryAI Backend

GloryAI Hackathon 后端项目。

负责：

- 接收前端图片上传
- 调用 YouCam Skin Analysis API
- 处理文件上传（Presigned URL）
- 创建 AI 分析任务
- 轮询任务状态
- 标准化分析结果返回给前端

## Tech Stack

- Django 6
- Python 3.13
- requests
- python-dotenv
- django-cors-headers



## Project Structure

GloryAI_backend/
├─ API/
│  ├─ views.py                 # API endpoints: /api/analyze, /api/youcam/...
│  ├─ urls.py                  # app-level routes (mounted at /api/)
│  └─ services/
│     ├─ __init__.py
│     └─ youcam.py             # YouCam API wrapper (file init, presigned upload, task, poll)
├─ gloryai_backend/
│  ├─ settings.py              # Django settings + load_dotenv(.env) + CORS
│  ├─ urls.py                  # project-level routes: path("api/", include("API.urls"))
│  ├─ asgi.py
│  └─ wsgi.py
├─ manage.py
├─ requirements.txt
├─ .env                        # YOUCAM_API_KEY / YOUCAM_BASE (not committed)
└─ db.sqlite3                  # local dev DB (optional)


## Install

```bash
cd GloryAI_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt