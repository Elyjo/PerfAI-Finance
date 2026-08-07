import CreditRequestTable from "@/components/credit/CreditRequestTable";
import RecentCreditActivityCard from "@/components/credit/RiskCreditActivityCard";

export default function CreditRequestsPage() {
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

      </div>

      {/* Content */}
      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-[2fr_1fr]
          items-start
        "
      >
        <CreditRequestTable />

        <RecentCreditActivityCard />
      </div>
    </section>
  );
}
