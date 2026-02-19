import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgFaceGood from "../../assets/images/261e0934b2ed31c6efad383265ad35110771692f.png";
import imgTilt from "../../assets/images/6666bdb41fbf9baea89dcd292f11eb836f4326f3.png";
import imgGlasses from "../../assets/images/cb3419ee80286613c7b0fd4d53dc520a4a287f0d.png";
import imgHair from "../../assets/images/af9153d0c311bacda19221302f9faf29bb95c85f.png";
import imgMakeup from "../../assets/images/a4d492f4a81bd0b8c4b7eb4fd98be4217fda442b.png";
import aiSkinMappingIcon from "../../assets/icons/AISkinMapping.svg";
import skinReportIcon from "../../assets/icons/SkinReport.svg";
import personalizedSolutionIcon from "../../assets/icons/PersonalizedSolution.svg";
import uploadImgIcon from "../../assets/icons/UploadeImg.svg";
import GreenPass from "../../assets/icons/GreenPass.svg";
import RedFail from "../../assets/icons/RedFail.svg";
import { useAnalysisFlow } from "../../features/analysis/AnalysisFlowContext";
import { TopNavPill } from "../../components/TopNavPill";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

function validateFile(file) {
  if (!file) return "请选择图片";
  if (!ALLOWED_TYPES.includes(file.type)) return "仅支持 JPG / PNG";
  if (file.size > MAX_SIZE) return "图片不能超过 10MB";
  return "";
}

function GuideImage({ src, label }) {
  return (
    <div className="flex w-[62px] flex-col items-center justify-start">
      <img src={src} alt={label} className="h-[82px] w-[62px] rounded-md object-cover shadow" />
      <p className="mt-1 w-full text-center text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}

function StepRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/40 px-4 py-3">
      <div className="icon-chip-gradient w-8 h-8 rounded grid place-items-center shrink-0">
        <img src={icon} alt="" className="h-4 w-4" />
      </div>
      <div className="text-zinc-700">{text}</div>
    </div>
  );
}

export function SkinLabPage() {
  const navigate = useNavigate();
  const { error, queueAnalysis, setError } = useAnalysisFlow();
  const [previewUrl, setPreviewUrl] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(nextFile) {
    const msg = validateFile(nextFile);
    setLocalError(msg);
    if (msg) {
      setPreviewUrl("");
      return;
    }

    setError("");
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(nextFile);
    });
    queueAnalysis(nextFile);
    navigate("/scanning");
  }

  function onInputChange(event) {
    handleFile(event.target.files?.[0]);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#a49eed] via-[#e6d7c4] to-[#f2ddbd] px-4 py-8 text-zinc-900 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex justify-center">
          <div className="flex w-full max-w-md justify-center">
            <TopNavPill activeTab="skinlab" />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="w-full rounded-2xl bg-white/35 p-5 backdrop-blur-sm lg:w-1/2">
            <h2 className="text-3xl font-semibold italic text-zinc-700 md:text-4xl">Skin Lab</h2>
            <div className="mt-2 h-px w-full bg-white/70" />

            <div className="mt-6 space-y-3 text-zinc-700">
              <StepRow icon={aiSkinMappingIcon} text="AI Skin Mapping" />
              <StepRow icon={skinReportIcon} text="Skin Report" />
              <StepRow icon={personalizedSolutionIcon} text="Personalized Solution" />
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* LEFT BLUE DIV */}
              <div className="flex flex-col items-center text-center p-4 gap-4">

                <img
                  src={imgFaceGood}
                  alt="good sample"
                  className="h-[180px] w-[160px] rounded-md object-cover shadow"
                />

                <p className="mt-4 text-[12px] text-zinc-600">
                  Choose a clear front-facing face photo.
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <img src={GreenPass} alt="pass" className="h-5 w-5" />
                  <p className="text-xl font-semibold text-green-600">PASS</p>
                </div>

              </div>


              {/* RIGHT BLUE DIV */}
              <div className="flex flex-col items-center justify-center p-4">

                {/* 2x2 GRID */}
                <div className="grid grid-cols-2 gap-6 place-items-center ">
                  <GuideImage src={imgTilt} label="Tilt" />
                  <GuideImage src={imgGlasses} label="Glasses" />
                  <GuideImage src={imgHair} label="Hair covering" />
                  <GuideImage src={imgMakeup} label="Makeup" />
                </div>

                {/* BOTTOM HORIZONTAL DIV */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <img src={RedFail} alt="fail" className="h-5 w-5" />
                  <p className="text-xl font-semibold text-orange-500">FAIL</p>
                </div>

              </div>

            </div>
          </section>

          <section className="w-full rounded-2xl bg-white/35 p-5 backdrop-blur-sm lg:w-1/2">
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-zinc-500/40 bg-white/25 p-6 text-center">
              <div className="w-full max-w-md space-y-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="mx-auto h-[210px] w-[220px] rounded-lg object-cover shadow" />
                ) : (
                  <div className="mx-auto grid h-[210px] w-[220px] place-items-center rounded-lg text-zinc-500">
                    <img src={uploadImgIcon} alt="upload" className="h-48 w-48 opacity-70" />
                  </div>
                )}

                <div className="self-stretch h-14 text-center justify-start text-gray-500 opacity-50 text-xs font-normal font-['Helvetica']">Dimension: Short side ≥ 480px, Long side ≤ 4096px<br />Format: JPG, JPEG, or PNG<br />Max Size: 10MB<br /></div>

                <label className="inline-block cursor-pointer rounded-full bg-black px-8 py-3 text-xl font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800">
                  Scan
                  <input type="file" hidden accept="image/jpeg,image/png" onChange={onInputChange} />
                </label>

                {localError ? <p className="text-sm text-red-700">{localError}</p> : null}
                {error ? <p className="text-sm text-red-700">{error}</p> : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
