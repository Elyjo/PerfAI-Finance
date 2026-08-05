"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  ShieldAlert,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Clients",
    icon: Users,
  },
  {
    label: "Demandes de crédit",
    icon: CreditCard,
  },
  {
    label: "Analyse des risques",
    icon: ShieldAlert,
  },
  {
    label: "Alertes",
    icon: Bell,
  },
  {
    label: "Paramètres",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed
        left-0
        top-16
        h-[calc(100vh-4rem)]
        border-r
        border-white/10
        bg-[#020617]/60
        backdrop-blur-xl
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <div
        className="
          flex
          h-full
          flex-col
          px-4
          py-6
        "
      >
        {/* Toggle button */}
        <div
          className={`
            flex
            ${collapsed ? "justify-center" : "justify-end"}
            mb-6
          `}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
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
              hover:bg-[#0B63C7]/10
              hover:text-white
              cursor-pointer
            "
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="
            flex
            flex-col
            gap-2
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`
                  flex
                  items-center
                  ${collapsed ? "justify-center" : "gap-3"}
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  cursor-pointer

                  ${
                    item.active
                      ? `
                        border
                        border-[#0B63C7]/30
                        bg-[#0B63C7]/15
                        shadow-lg
                        shadow-[#0B63C7]/10
                        text-white
                      `
                      : `
                        text-white/60
                        hover:bg-white/5
                        hover:text-white
                      `
                  }
                `}
              >
                <Icon
                  size={20}
                  className={item.active ? "text-[#0B63C7]" : "text-white/50"}
                />

                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom information */}
        {!collapsed && (
          <div
            className="
              mt-auto
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-4
            "
          >
            <p
              className="
                text-xs
                font-medium
                tracking-wide
                uppercase
                text-white/40
              "
            >
              PerfAI Finance Intelligence
            </p>

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#0B63C7]
                "
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-white
                "
              >
                Analyse IA activée
              </span>
            </div>

            <p
              className="
                mt-2
                text-xs
                leading-relaxed
                text-white/50
              "
            >
              Surveillance intelligente des crédits, risques et comportements
              financiers.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
