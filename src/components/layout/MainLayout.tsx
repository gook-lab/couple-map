import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import AddSheet from "@/components/shared/AddSheet";
import OfflineBanner from "@/components/shared/OfflineBanner";

const MainLayout: React.FC = () => {
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--app-bg)" }}>
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav onAddPress={() => setAddSheetOpen(true)} />
      <AddSheet open={addSheetOpen} onClose={() => setAddSheetOpen(false)} />
      <OfflineBanner />
    </div>
  );
};

export default MainLayout;
