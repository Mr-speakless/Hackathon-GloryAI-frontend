# API 文档

## Integration Guide

### How to Take Photos for AI Skin Analysis

- Take a selfie facing forward
    - Just one clear shot, looking straight into the camera. Leave your hair down so it falls over your chest, and make sure you're staring directly ahead for that front-on view.
    - Instead, use the JS Camera Kit to take a photo. Just leave your hair down so it falls over your chest. Don't tie it up.

### Workflow

**Skin Analysis API Usage Guide** This guide explains how to upload an image and create a skin analysis task using the File API and AI Task API.

### **Step 1: Resize your source image**

Resize your photo to fit the supported dimensions - up to 4096 pixels on the long side and at least 480 pixels on the short side for SD, or up to 4096 pixels on the long side and at least 1080 pixels on the short side for HD. See details in [**File Specs & Errors**](https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis/File-Specs-and-Errors)

### **Step 2: Upload File Metadata via File API**

- Image Requirements
    - See details in [**File Specs & Errors**](https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis/File-Specs-and-Errors)

Send a POST request to initialise the file upload:

```bash
curl --request POST \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/file/skin-analysis \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "files": [
      {
        "content_type": "image/png",
        "file_name": "skin_analysis_01_3dbd1b6683.png",
        "file_size": 547541
      }
    ]
  }'
```

- ***Important***: Simply calling the File API does not upload your file. You must **additionally upload** the file to the **URL provided in the File API response**. That URL is your upload destination, make sure the file is successfully transferred there before proceeding.
    
    > **Warning:** Please note that, you will get an 500 Server Error / unknown_internal_error or 404 Not Found error when using AI APIs if you do not upload the file to the URL provided in the File API response.
    > 

---

### **Step 3: Retrieve Upload URL and File ID**

The response includes:

- `requests.url` – Pre-signed URL for image upload.
- `file_id` – Identifier for creating an AI task.

**Example Response:**

```json
{
  "status": 200,
  "data": {
    "files": [
      {
        "content_type": "image/png",
        "file_name": "skin_analysis_01_3dbd1b6683.png",
        "file_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9/13W5TOD8/u/FfjK3xgCQ+hRt9MJXBFaud",
        "requests": [
          {
            "method": "PUT",
            "url": "https://yce-us.s3-accelerate.amazonaws.com/demo/ttl30/...signature...",
            "headers": {
              "Content-Length": "547541",
              "Content-Type": "image/png"
            }
          }
        ]
      }
    ]
  }
}
```

---

### **Step 4: Upload Image to Pre-signed URL**

Use the provided `requests.url` and headers:

```bash
curl --location --request PUT 'https://yce-us.s3-accelerate.amazonaws.com/demo/ttl30/...signature...' \
  --header 'Content-Type: image/png' \
  --header 'Content-Length: 547541' \
  --data-binary @'./skin_analysis_01_3dbd1b6683.png'
```

---

### **Step 5: Create AI Task**

Use the `file_id` from Step 2 to create a skin analysis task:

```bash
curl --request POST \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-analysis \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "src_file_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9/13W5TOD8/u/FfjK3xgCQ+hRt9MJXBFaud",
    "dst_actions": ["wrinkle", "pore", "texture", "acne"],
    "miniserver_args": {
      "enable_mask_overlay": true,
      "enable_dark_background_hd_pore": true,
      "color_dark_background_hd_pore": "3D3D3D",
      "opacity_dark_background_hd_pore": 0.4
      // Additional parameters omitted for brevity
    },
    "format": "json"
  }'
```

Once the upload is complete, you can select any skin concerns to analyze using your file ID or image file url. Please refer to the [**Inputs & Outputs**](https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis/Inputs-and-Outputs).

Subsequently, calling POST 'task/skin-analysis' with the File ID or image file url executes the enhance task and obtains a ***task_id***. Please be advised that simultaneous use of SD and HD skin concern parameters is **NOT** supported.

- **Use an Existing Public Image URL** Instead of uploading, you may supply a publicly accessible image URL directly when initiating the AI task.

**Example Response:**

```json
{
  "status": 200,
  "data": {
    "task_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9_13W5TOD8_u_GPi6NqQ3dhlmN-6ntFwhzT"
  }
}
```

---

### **Step 6: Poll Task Status**

Retrieve task results using the `task_id`:

```bash
curl --request GET \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-analysis/<YOUR_TASK_ID> \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json'
```

This ***task_id*** is used to monitor the task's status through polling GET 'task/skin-analysis' to retrieve the current engine status. Until the engine completes the task, the status will remain 'running', and no units will be consumed during this stage.

Processed results are retained for 24 hours after completion.- No need for short-interval polling.- Flexible polling intervals within the 24-hour window.

> **Important:** Polling is still required to check task status, as execution time is not guaranteed.
> 

The task will change to the 'success' status after the engine successfully processes your input file and generates the resulting image. You will get an url of the processed image and a dst_id that allow you to chain another AI task without re-upload the result image.

Your units will only be consumed in this case. If the engine fails to process the task, the task's status will change to 'error' and no unit will be consumed. When deducting units, the system will prioritize those nearing expiration. If the expiration date is the same, it will deduct the units obtained on the earliest date.

---

### **Step 7: Interpret Results**

The response includes:

- `ui_score` – User-friendly score.
- `raw_score` – Raw analysis score.
- `mask_urls` – URLs for detection masks.

**Example Response:**

```json
{
  "status": 200,
  "data": {
    "results": {
      "output": [
        {
          "type": "texture",
          "ui_score": 68,
          "raw_score": 57.33,
          "mask_urls": ["https://yce-us.s3-accelerate.amazonaws.com/...texture_output.jpg"]
        },
        {
          "type": "pore",
          "ui_score": 92,
          "raw_score": 95.34,
          "mask_urls": ["https://yce-us.s3-accelerate.amazonaws.com/...pore_output.jpg"]
        }
        // Additional results omitted for brevity
      ]
    },
    "task_status": "success"
  }
}
```

### Debugging Guide

> **Warning:** Please be advised that simultaneous use of SD and HD skin concern parameters is **NOT** supported. Attempting to deviate from these specifications will result in an ***InvalidParameters*** error.
> 
- If you mix using HD and SD skin concerns, you will get an error as following:
    
    ```json
    {
        "status": 400,
        "error": "cannot mix HD and SD dst_actions",
        "error_code": "InvalidParameters"
    }
    ```
    
- If you misspell a skin concern or sending unknown skin concerns, you will get an error as following:
    
    ```json
    {
        "status": 400,
        "error": "Not available dst_action abc123",
        "error_code": "InvalidParameters"
    }
    ```
    

## Inputs & Outputs

### Input Paramenter Description

There are two options for controlling the visual output of AI Skin Analysis results: either generate multiple images, with each skin concern displayed as an independent mask, or produce a single blended image using the `enable_mask_overlay` parameter. By default, the system outputs multiple masks, giving you full control over how to blend each skin concern mask with the image.

- Default: enable_mask_overlay false
    
    ![](https://bcw-media.s3.ap-northeast-1.amazonaws.com/strapi/assets/mask_overlay_false_1920_ea1cde0ead.png)
    
- Set enable_mask_overlay to true
    
    ![](https://bcw-media.s3.ap-northeast-1.amazonaws.com/strapi/assets/mask_overlay_1920_0fbb4786cc.png)
    

---

### Output ZIP Data Structure Description

The system provides a ZIP file with a 'skinanalysisResult' folder inside. This folder contains a 'score_info.json' file that includes all the detection scores and references to the result images.

The 'score_info.json' file contains all the skin analysis detection results, with numerical scores and the names of the corresponding output mask files.

The PNG files are detection result masks that can be overlaid on your original image. Simply use the alpha values in these PNG files to blend them with your original image, allowing you to see the detection results directly on the source image.

### File Structure in the Skin Analysis Result ZIP

- HD Skincare ZIP
    - skinanalysisResult
        - score_info.json
        - hd_acne_output.png
        - hd_age_spot_output.png
        - hd_dark_circle_output.png
        - hd_droopy_lower_eyelid_output.png
        - hd_droopy_upper_eyelid_output.png
        - hd_eye_bag_output.png
        - hd_firmness_output.png
        - hd_moisture_output.png
        - hd_oiliness_output.png
        - hd_radiance_output.png
        - hd_redness_output.png
        - hd_texture_output.png
        - hd_pore_output_all.png
        - hd_pore_output_cheek.png
        - hd_pore_output_forehead.png
        - hd_pore_output_nose.png
        - hd_wrinkle_output_all.png
        - hd_wrinkle_output_crowfeet.png
        - hd_wrinkle_output_forehead.png
        - hd_wrinkle_output_glabellar.png
        - hd_wrinkle_output_marionette.png
        - hd_wrinkle_output_nasolabial.png
        - hd_wrinkle_output_periocular.png
- SD Skincare ZIP
    - skinanalysisResult
        - score_info.json
        - acne_output.png
        - age_spot_output.png
        - dark_circle_v2_output.png
        - droopy_lower_eyelid_output.png
        - droopy_upper_eyelid_output.png
        - eye_bag_output.png
        - firmness_output.png
        - moisture_output.png
        - oiliness_output.png
        - pore_output.png
        - radiance_output.png
        - redness_output.png
        - texture_output.png
        - wrinkle_output.png
- JSON Data Structure (score_info.json)
    - "all": A floating-point value between 1 and 100 representing the general skin condition. A higher score indicates healthier and more aesthetically pleasing skin condition.
    - "skin_age": AI-derived skin age relative to the general population distribution across all age groups.
    - Each category contains:
        - "raw_score": A floating-point value ranging from 1 to 100. A higher score indicates healthier and more aesthetically pleasing skin condition.
        - "ui_score": An integer ranging from 1 to 100. The UI Score functions primarily as a psychological motivator in beauty assessment. We adjust the raw scores to produce more favorable results, acknowledging that consumers generally prefer positive evaluations regarding their skin health. This calibration serves to instill greater confidence in users while maintaining the underlying beauty psychology framework.
        - "output_mask_name": The filename of the corresponding output mask image.
    - Categories and Descriptions
        - HD Skincare:
            - "hd_redness": Measures skin redness severity.
            - "hd_oiliness": Determines skin oiliness level.
            - "hd_age_spot": Detects age spots and pigmentation.
            - "hd_radiance": Evaluates skin radiance.
            - "hd_moisture": Assesses skin hydration levels.
            - "hd_dark_circle": Analyzes the presence of dark circles under the eyes.
            - "hd_eye_bag": Detects eye bags.
            - "hd_droopy_upper_eyelid": Measures upper eyelid drooping severity.
            - "hd_droopy_lower_eyelid": Measures lower eyelid drooping severity.
            - "hd_firmness": Evaluates skin firmness and elasticity.
            - "hd_texture": Subcategories[whole]; Analyzes overall skin texture.
            - "hd_acne": Subcategories[whole]; Detects acne presence.
            - "hd_pore": Subcategories[forehead, nose, cheek, whole]; Detects and evaluates pores in different facial regions.
            - "hd_wrinkle": Subcategories[forehead, glabellar, crowfeet, periocular, nasolabial, marionette, whole]; Measures the severity of wrinkles in various facial areas.
        - SD Skincare:
            - "wrinkle": General wrinkle analysis.
            - "droopy_upper_eyelid": Measures upper eyelid drooping severity.
            - "droopy_lower_eyelid": Measures lower eyelid drooping severity.
            - "firmness": Evaluates skin firmness and elasticity.
            - "acne": Evaluates acne presence.
            - "moisture": Measures skin hydration.
            - "eye_bag": Detects eye bags.
            - "dark_circle_v2": Analyzes dark circles using an alternative method.
            - "age_spot": Detects age spots.
            - "radiance": Evaluates skin brightness.
            - "redness": Measures skin redness.
            - "oiliness": Determines skin oiliness.
            - "pore": Measures pore visibility.
            - "texture": Analyzes overall skin texture.
    - Sample score_info.json of HD Skincare
        
        ```json
        {
            "hd_redness": {
                "raw_score": 72.011962890625,
                "ui_score": 77,
                "output_mask_name": "hd_redness_output.png"
            },
            "hd_oiliness": {
                "raw_score": 60.74365234375,
                "ui_score": 72,
                "output_mask_name": "hd_oiliness_output.png"
            },
            "hd_age_spot": {
                "raw_score": 83.23274230957031,
                "ui_score": 77,
                "output_mask_name": "hd_age_spot_output.png"
            },
            "hd_radiance": {
                "raw_score": 76.57244205474854,
                "ui_score": 79,
                "output_mask_name": "hd_radiance_output.png"
            },
            "hd_moisture": {
                "raw_score": 48.694559931755066,
                "ui_score": 70,
                "output_mask_name": "hd_moisture_output.png"
            },
            "hd_dark_circle": {
                "raw_score": 80.1993191242218,
                "ui_score": 76,
                "output_mask_name": "hd_dark_circle_output.png"
            },
            "hd_eye_bag": {
                "raw_score": 76.67280435562134,
                "ui_score": 79,
                "output_mask_name": "hd_eye_bag_output.png"
            },
            "hd_droopy_upper_eyelid": {
                "raw_score": 79.05348539352417,
                "ui_score": 80,
                "output_mask_name": "hd_droopy_upper_eyelid_output.png"
            },
            "hd_droopy_lower_eyelid": {
                "raw_score": 79.97175455093384,
                "ui_score": 81,
                "output_mask_name": "hd_droopy_lower_eyelid_output.png"
            },
            "hd_firmness": {
                "raw_score": 89.66898322105408,
                "ui_score": 85,
                "output_mask_name": "hd_firmness_output.png"
            },
            "hd_texture": {
                "whole": {
                    "raw_score": 66.3921568627451,
                    "ui_score": 75,
                    "output_mask_name": "hd_texture_output.png"
                }
            },
            "hd_acne": {
                "whole": {
                    "raw_score": 59.92677688598633,
                    "ui_score": 76,
                    "output_mask_name": "hd_acne_output.png"
                }
            },
            "hd_pore": {
                "forehead": {
                    "raw_score": 79.59770965576172,
                    "ui_score": 80,
                    "output_mask_name": "hd_pore_output_forehead.png"
                },
                "nose": {
                    "raw_score": 29.139814376831055,
                    "ui_score": 58,
                    "output_mask_name": "hd_pore_output_nose.png"
                },
                "cheek": {
                    "raw_score": 44.11081314086914,
                    "ui_score": 65,
                    "output_mask_name": "hd_pore_output_cheek.png"
                },
                "whole": {
                    "raw_score": 49.23978805541992,
                    "ui_score": 67,
                    "output_mask_name": "hd_pore_output_all.png"
                }
            },
            "hd_wrinkle": {
                "forehead": {
                    "raw_score": 55.96956729888916,
                    "ui_score": 67,
                    "output_mask_name": "hd_wrinkle_output_forehead.png"
                },
                "glabellar": {
                    "raw_score": 76.7251181602478,
                    "ui_score": 75,
                    "output_mask_name": "hd_wrinkle_output_glabellar.png"
                },
                "crowfeet": {
                    "raw_score": 83.4361481666565,
                    "ui_score": 78,
                    "output_mask_name": "hd_wrinkle_output_crowfeet.png"
                },
                "periocular": {
                    "raw_score": 67.88706302642822,
                    "ui_score": 72,
                    "output_mask_name": "hd_wrinkle_output_periocular.png"
                },
                "nasolabial": {
                    "raw_score": 74.03312683105469,
                    "ui_score": 74,
                    "output_mask_name": "hd_wrinkle_output_nasolabial.png"
                },
                "marionette": {
                    "raw_score": 71.94477319717407,
                    "ui_score": 73,
                    "output_mask_name": "hd_wrinkle_output_marionette.png"
                },
                "whole": {
                    "raw_score": 49.64699745178223,
                    "ui_score": 65,
                    "output_mask_name": "hd_wrinkle_output_all.png"
                }
            },
            "all": {
                "score": 75.75757575757575
            },
            "skin_age": 37
        }
        ```
        
    - Sample score_info.json of SD Skincare
        
        ```json
        {
            "wrinkle": {
                "raw_score": 36.09360456466675,
                "ui_score": 60,
                "output_mask_name": "wrinkle_output.png"
            },
            "droopy_upper_eyelid": {
                "raw_score": 79.05348539352417,
                "ui_score": 80,
                "output_mask_name": "droopy_upper_eyelid_output.png"
            },
            "droopy_lower_eyelid": {
                "raw_score": 79.97175455093384,
                "ui_score": 81,
                "output_mask_name": "droopy_lower_eyelid_output.png"
            },
            "firmness": {
                "raw_score": 89.66898322105408,
                "ui_score": 85,
                "output_mask_name": "firmness_output.png"
            },
            "acne": {
                "raw_score": 92.29713000000001,
                "ui_score": 88,
                "output_mask_name": "acne_output.png"
            },
            "moisture": {
                "raw_score": 48.694559931755066,
                "ui_score": 70,
                "output_mask_name": "moisture_output.png"
            },
            "eye_bag": {
                "raw_score": 76.67280435562134,
                "ui_score": 79,
                "output_mask_name": "eye_bag_output.png"
            },
            "dark_circle_v2": {
                "raw_score": 80.1993191242218,
                "ui_score": 76,
                "output_mask_name": "dark_circle_v2_output.png"
            },
            "age_spot": {
                "raw_score": 83.23274230957031,
                "ui_score": 77,
                "output_mask_name": "age_spot_output.png"
            },
            "radiance": {
                "raw_score": 76.57244205474854,
                "ui_score": 79,
                "output_mask_name": "radiance_output.png"
            },
            "redness": {
                "raw_score": 72.011962890625,
                "ui_score": 77,
                "output_mask_name": "redness_output.png"
            },
            "oiliness": {
                "raw_score": 60.74365234375,
                "ui_score": 72,
                "output_mask_name": "oiliness_output.png"
            },
            "pore": {
                "raw_score": 88.38014125823975,
                "ui_score": 84,
                "output_mask_name": "pore_output.png"
            },
            "texture": {
                "raw_score": 80.09742498397827,
                "ui_score": 76,
                "output_mask_name": "texture_output.png"
            },
            "all": {
                "score": 75.75757575757575
            },
            "skin_age": 37
        }
        ```