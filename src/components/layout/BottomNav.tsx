import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Map, Clock, User, Plus } from "lucide-react";

interface BottomNavProps {
  onAddPress?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onAddPress }) => {
  const tabs = [
    { to: "/today", icon: Home, label: "홈" },
    { to: "/travel", icon: Map, label: "지도" },
    { to: "#add", icon: Plus, label: "", isCenter: true },
    { to: "/timeline", icon: Clock, label: "타임라인" },
    { to: "/profile", icon: User, label: "MY" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30">
      {/* + FAB */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
        <button
          onClick={onAddPress}
          className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "rgb(var(--accent-070))", width: 52, height: 52 }}
          aria-label="추가"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Bar with solid background */}
      <div
        className="border-t pt-1.5 pb-2"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-line-soft)",
        }}
      >
        <div className="grid grid-cols-5 h-12 items-start">
          {tabs.map((tab) =>
            tab.isCenter ? (
              <div key="add-spacer" />
            ) : (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center gap-0.5 pt-1 transition-colors"
                style={({ isActive }) =>
                  ({ color: isActive ? "rgb(var(--accent-070))" : "var(--app-ink-3)" })
                }
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
