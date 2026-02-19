import json
from pathlib import Path

import openpyxl


ROOT = Path(__file__).resolve().parents[1]
XLSX_PATH = ROOT / "AI_Skin_Product_Recommendation_Database.xlsx"
OUTPUT_PATH = ROOT / "GloryAI_frontend" / "src" / "data" / "productRecommendationDb.json"


def normalize_row(row):
    return {
        "brand": str(row[0] or "").strip(),
        "name": str(row[1] or "").strip(),
        "category": str(row[2] or "").strip(),
        "level": str(row[3] or "").strip(),
        "targetConcern": str(row[4] or "").strip(),
        "scoreMin": int(row[5]) if row[5] is not None else 0,
        "scoreMax": int(row[6]) if row[6] is not None else 100,
        "notes": str(row[7] or "").strip(),
    }


def export_db():
    if not XLSX_PATH.exists():
        raise FileNotFoundError(f"XLSX not found: {XLSX_PATH}")

    workbook = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    sheet = workbook[workbook.sheetnames[0]]

    products = []
    for row_idx in range(2, sheet.max_row + 1):
        row = [sheet.cell(row=row_idx, column=col).value for col in range(1, 9)]
        product = normalize_row(row)
        if product["name"]:
            products.append(product)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Exported {len(products)} products -> {OUTPUT_PATH}")


if __name__ == "__main__":
    export_db()
