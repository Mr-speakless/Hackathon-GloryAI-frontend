import { Link } from "react-router-dom";
import imgWoman from "../../assets/images/b594ed2ba6b71a21a695948f67b7f40e784b3613.png";
import imgMan from "../../assets/images/8abbb633749a1443aec4861c818ba9c949b7aa24.png";
import { TopNavPill } from "../components/TopNavPill";

function MetricPill({ label, value, valueClass }) {
  return (
    <div className="rounded-2xl bg-white/25 px-4 py-2 text-sm text-zinc-700 backdrop-blur-sm">
      <span>{label}: </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#c7c4f1] via-[#e5daca] to-[#f1ece3] px-6 py-12 text-zinc-900 md:px-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div className="flex justify-center">
          <div className="flex w-full max-w-md justify-center">
            <TopNavPill activeTab="about" />
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-zinc-900" />
              <p className="text-3xl font-bold">GLory.AI</p>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Decode Your Skin.
              <br />
              Restore Your Glow.
            </h1>

            <p className="max-w-2xl text-sm text-zinc-700/80 md:text-base">
              GLory.AI offers AI-driven diagnostic tools to decode your unique skin profile. Start from Skin Lab,
              finish a full scan, and get actionable report insights with starter recommendations.
            </p>

            <Link
              to="/skin-lab"
              className="inline-flex rounded-full bg-black px-8 py-3 text-xl font-semibold text-white transition hover:bg-zinc-800"
            >
              Get Start
            </Link>
          </section>

          <section className="space-y-6">
            <div className="relative mx-auto h-[380px] w-full max-w-[520px]">
              <img
                src={imgMan}
                alt="skin sample male"
                className="absolute right-2 top-0 z-10 h-[260px] w-[220px] rounded-2xl object-cover shadow-lg md:h-[300px] md:w-[250px]"
              />
              <img
                src={imgWoman}
                alt="skin sample female"
                className="absolute bottom-0 left-[18%] z-20 h-[270px] w-[230px] rounded-2xl object-cover shadow-xl md:h-[310px] md:w-[260px]"
              />
            </div>

            <div className="mx-auto grid w-full max-w-[500px] grid-cols-[1fr_auto] items-center gap-3">
              <div className="rounded-full border border-white/70 bg-white/20 px-4 py-2 text-center text-sm backdrop-blur-sm">
                Scanning... &gt;&gt; 100%
              </div>

              <div className="flex flex-col gap-2">
                <MetricPill label="Moisture" value="85%" valueClass="text-green-600" />
                <MetricPill label="Elasticity" value="High" valueClass="text-green-600" />
                <MetricPill label="Pores" value="Medium" valueClass="text-orange-500" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
