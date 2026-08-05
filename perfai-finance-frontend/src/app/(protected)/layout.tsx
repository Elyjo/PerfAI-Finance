import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020617]
        text-white
      "
    >
      {/* Main glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/3
          h-150
          w-150
          -translate-x-1/2
          rounded-full
          bg-[#0B63C7]/30
          blur-[140px]
        "
      />

      {/* Left light */}
      <div
        className="
          absolute
          -left-40
          top-20
          h-80
          w-80
          rounded-full
          bg-blue-500/20
          blur-[120px]
        "
      />

      {/* Right light */}
      <div
        className="
          absolute
          -right-40
          bottom-20
          h-80
          w-80
          rounded-full
          bg-[#0B63C7]/30
          blur-[120px]
        "
      />

      <div className="relative z-20">
        <DashboardNavbar />
      </div>

      <div className="relative z-10 flex pt-16">
        <DashboardSidebar />

        <main
          className="
            ml-64
            flex-1
            overflow-x-hidden
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
