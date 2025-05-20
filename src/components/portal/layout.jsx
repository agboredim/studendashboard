"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SidebarNav from "./sidebar-nav";
import { UserNav } from "./user-nav";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-medium">Student Portal</h2>
            <UserNav />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
