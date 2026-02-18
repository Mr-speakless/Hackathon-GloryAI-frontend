import { Link, useLocation } from "react-router-dom";

const pages = [
  { path: "/", label: "Home" },
  { path: "/skin-lab", label: "Skin Lab" },
  { path: "/scanning", label: "Scanning" },
  { path: "/report", label: "Report" },
];

export function PageNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex max-w-[94vw] -translate-x-1/2 gap-1 rounded-full bg-black/80 px-3 py-2 backdrop-blur-sm md:bottom-5 md:gap-2 md:px-4">
      {pages.map((page) => (
        <Link
          key={page.path}
          to={page.path}
          className={`rounded-full px-2.5 py-1 text-xs transition-colors md:px-3 md:text-sm ${
            location.pathname === page.path
              ? "bg-white text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          {page.label}
        </Link>
      ))}
    </div>
  );
}
