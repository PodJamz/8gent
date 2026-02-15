"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FolderCard from "@/components/ui/folder-card";

interface SidebarItem {
  id: string;
  title: string;
  gradient: string;
  isActive?: boolean;
}

interface BlogSidebarProps {
  items: SidebarItem[];
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({ items }) => {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderPostIcon = (item: SidebarItem) => {
    return (
      <span
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center transition-all duration-200`}
      >
        <span className="w-4 h-4 bg-white/60 rounded-full" />
      </span>
    );
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-[280px]'} min-h-screen flex flex-col justify-between bg-card border-r border-border p-4 transition-all duration-300 ease-in-out`}>
      <div>
        <div className="flex items-center mb-8 justify-center">
          <div 
            className="cursor-pointer transition-all duration-300"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FolderCard 
              title={!isCollapsed ? "Claw AI" : undefined}
              isOpen={!isCollapsed}
            />
          </div>
        </div>
        
        {!isCollapsed && (
          <nav className="flex flex-col gap-2 animate-in fade-in duration-300">
            {items.map((item) => {
              const isActive = item.id === currentSlug;
              return (
                <Link
                  key={item.id}
                  href={`/blog/${item.id}`}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-medium ${isActive ? "bg-muted font-bold border-l-4 border-primary shadow-md" : "hover:bg-muted"}`}
                  aria-current={isActive ? "page" : undefined}
                  scroll={false}
                  style={{ marginBottom: 8 }}
                >
                  <div className={`transition-all duration-200 ${isActive ? "ring-2 ring-primary rounded-full" : ""}`}>
                    {renderPostIcon(item)}
                  </div>
                  <span className="flex-1 flex items-center text-foreground" style={{ minHeight: 32 }}>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        )}
        
        {isCollapsed && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            {items.map((item) => {
              const isActive = item.id === currentSlug;
              return (
                <Link
                  key={item.id}
                  href={`/blog/${item.id}`}
                  className={`w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${isActive ? "bg-muted ring-2 ring-primary" : "hover:bg-muted"}`}
                  aria-current={isActive ? "page" : undefined}
                  scroll={false}
                  title={item.title}
                >
                  {renderPostIcon(item)}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      
    </aside>
  );
}; 