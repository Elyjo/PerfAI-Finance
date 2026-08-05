import ClientTable from "@/components/clients/ClientTable";
import AiClientInsights from "@/components/clients/AiClientInsights";
import RecentClientActivityCard from "@/components/clients/RecentClientActivityCard";
import { UserPlus } from "lucide-react";

export default function ClientsPage() {
  return (
    <section
      className="
        min-h-screen
        px-12
        py-10
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-4xl
              font-bold
              text-white
            "
          >
            Clients
          </h1>

          <p
            className="
              mt-3
              text-white/60
            "
          >
            Gestion et suivi du portefeuille clients
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#0B63C7]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#0954a8]
            cursor-pointer
          "
        >
          <UserPlus size={18} />
          Nouveau client
        </button>
      </div>

      {/* Content */}
      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-[2fr_1fr]
        "
      >
        {/* Table */}
        <ClientTable />

        {/* Right column */}
        <div
          className="
            flex
            flex-col
            gap-6
          "
        >
          <AiClientInsights />

          <RecentClientActivityCard />
        </div>
      </div>
    </section>
  );
}
