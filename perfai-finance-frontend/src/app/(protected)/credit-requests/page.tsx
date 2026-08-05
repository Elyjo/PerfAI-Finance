import CreditRequestTable from "@/components/credit/CreditRequestTable";
import RecentCreditActivityCard from "@/components/credit/RiskCreditActivityCard";

export default function CreditRequestsPage() {
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
            Demandes de crédit
          </h1>

          <p
            className="
              mt-3
              text-white/60
            "
          >
            Analysez, suivez et gérez les demandes de financement avec
            l&apos;intelligence artificielle.
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
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#0954a8]
            cursor-pointer
          "
        >
          <span className="text-lg">+</span>
          Nouvelle demande
        </button>
      </div>

      {/* Main table */}
      <div
        className="
          mt-8
        "
      >
        <CreditRequestTable />
      </div>

      {/* Activity */}
      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-[2fr_1fr]
        "
      >
        <div />

        <RecentCreditActivityCard />
      </div>
    </section>
  );
}
