import os
import requests
from typing import Optional


class YouCamError(Exception):
    pass


def _auth_headers() -> dict:
    api_key = os.getenv("YOUCAM_API_KEY", "")
    print("YOUCAM_API_KEY loaded?", bool(api_key))
    print("YOUCAM_BASE:", os.getenv("YOUCAM_BASE"))

    if not api_key:
        raise YouCamError("Missing YOUCAM_API_KEY in .env")
    return {"Authorization": f"Bearer {api_key}"}




def _base() -> str:
    base = os.getenv("YOUCAM_BASE", "").rstrip("/")
    if not base:
        raise YouCamError("Missing YOUCAM_BASE in .env")
    return base


# Step 2: init file upload (metadata)
def init_skin_analysis_file(file_name: str, content_type: str, file_size: int) -> dict:
    url = f"{_base()}/file/skin-analysis"
    headers = {**_auth_headers(), "Content-Type": "application/json"}

    payload = {
        "files": [
            {
                "content_type": content_type,
                "file_name": file_name,
                "file_size": file_size,
            }
        ]
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    if not resp.ok:
        raise YouCamError(f"File API error {resp.status_code}: {resp.text[:500]}")

    data = resp.json()
    try:
        file_info = data["data"]["files"][0]
        file_id = file_info["file_id"]
        req0 = file_info["requests"][0]
        upload_url = req0["url"]
        upload_headers = req0.get("headers", {})
    except Exception:
        raise YouCamError(f"Unexpected File API response: {data}")

    return {
        "file_id": file_id,
        "upload_url": upload_url,
        "upload_headers": upload_headers,
        "raw": data,
    }


# Step 4: PUT upload to presigned url
def upload_to_presigned_url(upload_url: str, upload_headers: dict, file_bytes: bytes) -> None:
    # 重要：presigned URL 通常是直接 PUT 到 S3，不需要 Authorization
    # headers 里一般包含 Content-Type / Content-Length
    resp = requests.put(upload_url, data=file_bytes, headers=upload_headers, timeout=60)
    if resp.status_code not in (200, 201, 204):
        raise YouCamError(f"Upload PUT failed {resp.status_code}: {resp.text[:500]}")


# Step 5: create AI task
def create_skin_analysis_task(
    *,
    src_file_id: Optional[str] = None,
    src_image_url: Optional[str] = None,
    dst_actions: list[str],
    miniserver_args: Optional[dict] = None,
    fmt: str = "json",
) -> str:
    if not src_file_id and not src_image_url:
        raise YouCamError("Either src_file_id or src_image_url is required")

    url = f"{_base()}/task/skin-analysis"
    headers = {**_auth_headers(), "Content-Type": "application/json"}

    payload: dict = {
        "dst_actions": dst_actions,
        "miniserver_args": miniserver_args or {},
        "format": fmt,
    }
    if src_file_id:
        payload["src_file_id"] = src_file_id
    if src_image_url:
        # 文档说可以直接传 public image url（字段名以官方 Inputs & Outputs 为准）
        # 这里先用常见写法 src_url；如果你们文档明确是别的字段名，我再帮你改
        payload["src_url"] = src_image_url

    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    if not resp.ok:
        raise YouCamError(f"Task create error {resp.status_code}: {resp.text[:500]}")

    data = resp.json()
    try:
        task_id = data["data"]["task_id"]
        return task_id
    except Exception:
        raise YouCamError(f"Unexpected task create response: {data}")


# Step 6: poll task
def get_skin_analysis_task(task_id: str) -> dict:
    url = f"{_base()}/task/skin-analysis/{task_id}"
    headers = {**_auth_headers(), "Content-Type": "application/json"}

    resp = requests.get(url, headers=headers, timeout=30)
    if not resp.ok:
        raise YouCamError(f"Task status error {resp.status_code}: {resp.text[:500]}")
    return resp.json()



# 一条龙：后端接收文件 -> File API -> PUT -> create task
def start_skin_analysis_from_upload(
    *, file_name: str, content_type: str, file_bytes: bytes, dst_actions: list[str], miniserver_args: Optional[dict] = None
) -> dict:
    file_size = len(file_bytes)
    meta = init_skin_analysis_file(file_name=file_name, content_type=content_type, file_size=file_size)
    upload_to_presigned_url(meta["upload_url"], meta["upload_headers"], file_bytes)
    task_id = create_skin_analysis_task(
        src_file_id=meta["file_id"],
        dst_actions=dst_actions,
        miniserver_args=miniserver_args,
        fmt="json",
    )
    return {"task_id": task_id, "file_id": meta["file_id"]}

def _get_base():
    base = os.getenv("YOUCAM_BASE")
    if not base:
        raise YouCamError("Missing YOUCAM_BASE in .env")
    return base

