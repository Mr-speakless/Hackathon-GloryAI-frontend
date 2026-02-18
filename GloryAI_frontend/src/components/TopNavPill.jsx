import { Link } from "react-router-dom";
import skinLabIcon from "../assets/icons/SkinLabIcon.svg";
import aboutIcon from "../assets/icons/AboutIcon.svg";

function NavTab({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm transition ${
        active ? "bg-black text-white" : "text-zinc-700/90 hover:bg-black/10"
      }`}
    >
      <img src={icon} alt="" className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function TopNavPill({ activeTab = "about" }) {
  return (
    <div className="inline-flex max-w-full flex-wrap rounded-full bg-black/15 p-2 backdrop-blur-sm">
      <NavTab to="/skin-lab" icon={skinLabIcon} label="Skin Lab" active={activeTab === "skinlab"} />
      <NavTab to="/" icon={aboutIcon} label="About GLory.AI" active={activeTab === "about"} />
    </div>
  );
}
