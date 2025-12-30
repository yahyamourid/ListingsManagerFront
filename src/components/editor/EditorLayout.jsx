import React from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { EditorSidebar } from "./EditorSidebar";
import { useNavigate } from "react-router-dom";

export const EditorLayout = () => {
  const navigate = useNavigate()
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background  overflow-x-hidden">
        <EditorSidebar />
        <div className="flex-1 flex flex-col in-w-0 overflow-x-hidden">
          <header className="h-14 border-b border-border flex justify-between items-center px-4 bg-card">
            <div className="flex items-center">
              <SidebarTrigger />
              <span className="ml-3 font-semibold text-foreground">
                Editor Dashboard
              </span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate("/")}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
