"use client";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-8">
            <div className="container mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
