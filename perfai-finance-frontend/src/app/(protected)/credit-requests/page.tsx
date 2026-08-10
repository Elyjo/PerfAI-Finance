import Link from "next/link";
import { Plus } from "lucide-react";
import CreditRequestTable from "@/components/credit/CreditRequestTable";
import CreditRequestKpis from "@/components/credit/CreditRequestKpis";
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

      <Link href="/credit-requests?create=1" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B63C7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0954a8]">
        <Plus size={17} />
        Nouvelle demande
      </Link>

      <CreditRequestKpis />

      {/* Content */}
      <div
        className="
          mt-6
          grid
          gap-6
          lg:grid-cols-[minmax(0,1fr)_20rem]
          items-start
        "
      >
        <CreditRequestTable />

        <RecentCreditActivityCard />
      </div>
    </section>
  );
}
