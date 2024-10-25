import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { SocketProvider } from "@/components/layout/socket-provider";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overscroll-contain pt-16">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
