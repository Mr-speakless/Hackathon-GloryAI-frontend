import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .services.youcam import (
    YouCamError,
    start_skin_analysis_from_upload,
    create_skin_analysis_task,
    get_skin_analysis_task,
)

DEFAULT_ACTIONS = ["wrinkle", "pore", "texture", "acne"]


@csrf_exempt
def analyze(request):
    return skin_analysis_start(request)


def skin_analysis_start(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST only"}, status=405)

    print("CONTENT_TYPE:", request.content_type)
    print("FILES keys:", list(request.FILES.keys()))
    print("FILES(image) exists?", bool(request.FILES.get("image")))

    # ✅ 前端字段就是 image
    f = request.FILES.get("image")
    if not f:
        return JsonResponse({"success": False, "error": "Missing uploaded file field 'image'."}, status=400)

    file_bytes = f.read()
    file_name = getattr(f, "name", "upload.png")
    content_type = getattr(f, "content_type", "image/png") or "image/png"

    print(">>> ABOUT TO CALL YOUCAM (start_skin_analysis_from_upload)")
    print(">>> file:", file_name, content_type, "size:", len(file_bytes))

    try:
        out = start_skin_analysis_from_upload(
            file_name=file_name,
            content_type=content_type,
            file_bytes=file_bytes,
            dst_actions=DEFAULT_ACTIONS,
            miniserver_args={},
        )
        print(">>> YOUCAM RESULT:", out)
        return JsonResponse({"success": True, "task_id": out.get("task_id"), "raw": out})

    except YouCamError as e:
        print(">>> YOUCAM ERROR:", str(e))
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    except Exception as e:
        print(">>> SERVER ERROR:", str(e))
        return JsonResponse({"success": False, "error": f"Server error: {e}"}, status=500)
    
def skin_analysis_status(request, task_id: str):
    if request.method != "GET":
        return JsonResponse({"success": False, "error": "GET only"}, status=405)

    try:
        data = get_skin_analysis_task(task_id)  # 这是 youcam 原始返回
        inner = data.get("data", {})
        task_status = inner.get("task_status")

        normalized = None
        if task_status == "success":
            out = (inner.get("results") or {}).get("output") or []
            skin_analysis = {}
            all_score = None
            skin_age = None
            resize_image_url = None

            for item in out:
                t = item.get("type")
                if t in ("wrinkle", "pore", "texture", "acne"):
                    skin_analysis[t] = {
                        "ui_score": item.get("ui_score"),
                        "raw_score": item.get("raw_score"),
                        "mask_url": (item.get("mask_urls") or [None])[0],
                    }
                elif t == "all":
                    all_score = item.get("score")
                elif t == "skin_age":
                    skin_age = item.get("score")
                elif t == "resize_image":
                    resize_image_url = (item.get("mask_urls") or [None])[0]

            normalized = {
                "skin_analysis": skin_analysis,
                "all": {"score": all_score},
                "skin_age": skin_age,
                "resize_image_url": resize_image_url,
            }

        return JsonResponse({
            "success": True,
            "data": data,              # 原始 youcam 返回（调试用）
            "normalized": normalized,  # ✅ 前端直接用这个
        })

    except YouCamError as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Server error: {e}"}, status=500)




