"use client";

import { Bell } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-16
        border-b
        border-white/10
        bg-[#020617]/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-between
          px-8
          lg:px-6
        "
      >
        {/* Logo */}
        <div>
          <h1
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Perf
            <span className="text-[#0B63C7]">AI</span>
            <span className="ml-2 text-white/60">Finance</span>
          </h1>
        </div>

        {/* User */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          {/* Notifications */}
          <button
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-white/70
              transition
              hover:border-[#0B63C7]/30
              hover:bg-[#0B63C7]/10
              hover:text-white
              cursor-pointer
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-[#0B63C7]
              "
            />
          </button>

          {/* Avatar */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[#0B63C7]
              text-sm
              font-semibold
              text-white
            "
          >
            PF
          </div>
        </div>
      </div>
    </header>
  );
}
