import { useEffect, useState } from "react";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

function validateFile(file) {
  if (!file) return "请选择图片";
  if (!ALLOWED_TYPES.includes(file.type)) return "仅支持 JPG / PNG";
  if (file.size > MAX_SIZE) return "图片不能超过 10MB";
  return "";
}

export default function ImageUpload({ onSubmit }) {
  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFile(nextFile) {
    const message = validateFile(nextFile);
    setError(message);

    if (message) {
      setFile(null);
      return;
    }

    setFile(nextFile);
  }

  function onInputChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function onDrop(event) {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <section className="grid h-full items-center gap-8 md:grid-cols-2">
      <div>
        <h1 className="mb-4 text-4xl font-normal leading-none md:text-6xl">GloryAI Skin Guide</h1>
        <ul className="grid list-disc gap-2 pl-7 text-sm md:text-lg">
          <li>3分钟得到皮肤分析报告</li>
          <li>自动识别关键皮肤问题</li>
          <li>按新手到进阶给出护理建议</li>
        </ul>
      </div>

      <div
        className="flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl bg-zinc-300 p-4"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        {previewUrl ? (
          <img className="h-[150px] w-[240px] rounded-lg object-cover" src={previewUrl} alt="预览图" />
        ) : null}

        <label className={`cursor-pointer rounded-lg bg-zinc-100 px-6 py-2 text-base md:text-xl ${interactiveClass}`}>
          上传图片按钮
          <input type="file" accept="image/jpeg,image/png" hidden onChange={onInputChange} />
        </label>

        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <p className="text-sm text-zinc-600">支持 JPG/PNG，大小不超过 10MB</p>
        )}

        <button
          className={`rounded-lg bg-zinc-100 px-6 py-2 text-sm enabled:cursor-pointer enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:text-base ${interactiveClass}`}
          disabled={!file}
          onClick={() => onSubmit(file)}
        >
          开始分析
        </button>
      </div>
    </section>
  );
}
