"use client";
import React from "react";
import { usePathname } from "next/navigation";
import ManageProjectDashboard from "../(managment)/manage-project/[id]/dashboard/_components/manage-project-dashboard";
import Profile from "./_components/profile";

const Header = () => {
  const pathname = usePathname();

  // Check if the current path includes "/manage-project"
  const isProjectPage = pathname.includes("/manage-project");

  return (
    <div className="py-4 px-10 shadow-sm flex justify-end items-center gap-4 top-0 bg-white z-50">
      {/* Render ManageProjectDashboard only on project-related pages */}
      {isProjectPage && <ManageProjectDashboard />}
      <Profile />
    </div>
  );
};

export default Header;
