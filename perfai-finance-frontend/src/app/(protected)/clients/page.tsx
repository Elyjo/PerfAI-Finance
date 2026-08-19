import ClientTable from "@/components/clients/ClientTable";
import ClientKpis from "@/components/clients/ClientKpis";
import AiClientInsights from "@/components/clients/AiClientInsights";
import RecentClientActivityCard from "@/components/clients/RecentClientActivityCard";

export default function ClientsPage() {
  return (
    <section
      className="
        min-h-screen
        px-4
        py-6
        sm:px-6
        lg:px-12
        lg:py-10
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
            text-3xl
            font-bold
            text-white
            sm:text-4xl
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
      </div>

      <ClientKpis />

      {/* Content */}
      <div
        className="
          mt-4
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
