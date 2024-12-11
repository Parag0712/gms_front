"use client";
import React from "react";

import { usePathname } from "next/navigation";
import ManageProjectDashboard from "../(managment)/manage-project/[id]/dashboard/_components/manage-project-dashboard";
import Profile from "./_components/profile";

const Header = () => {
  const pathname = usePathname();

  const isProjectPage = pathname.includes("/manage-project");
  return (
    <div className="py-3 px-4  shadow-sm flex justify-end items-center gap-4">
      {isProjectPage && <ManageProjectDashboard />}
      <Profile />
    </div>
  );
};

export default Header;
