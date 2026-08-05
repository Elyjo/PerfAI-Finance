import CreditStatusBadge from "./CreditStatusBadge";
import RiskLevelBadge from "./RiskLevelBadge";

const creditRequests = [
  {
    id: 1,
    client: "Fatou Ndiaye",
    activity: "Commerce",
    amount: "750 000 FCFA",
    riskLevel: "Faible" as const,
    score: 92,
    status: "Approuvé" as const,
    date: "05 Août 2026",
  },
  {
    id: 2,
    client: "Mamadou Diallo",
    activity: "Transport",
    amount: "2 000 000 FCFA",
    riskLevel: "Moyen" as const,
    score: 68,
    status: "En analyse" as const,
    date: "04 Août 2026",
  },
  {
    id: 3,
    client: "Awa Ba",
    activity: "Agriculture",
    amount: "500 000 FCFA",
    riskLevel: "Élevé" as const,
    score: 41,
    status: "En attente" as const,
    date: "02 Août 2026",
  },
];

export default function CreditRequestTable() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/3
        p-6
        backdrop-blur-xl
        shadow-lg
        shadow-[#0B63C7]/10
        transition
        duration-300
        hover:-translate-y-1
        hover:border-[#0B63C7]/30
        hover:shadow-xl
        hover:shadow-[#0B63C7]/20
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-6
          py-5
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Demandes de crédit
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="
                border-b
                border-white/10
                text-left
                text-xs
                uppercase
                tracking-wide
                text-white/40
              "
            >
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Risque</th>
              <th className="px-6 py-4">Score IA</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {creditRequests.map((request) => (
              <tr
                key={request.id}
                className="
                  border-b
                  border-white/5
                  transition
                  hover:bg-white/3
                "
              >
                {/* Client */}
                <td className="px-6 py-5">
                  <p
                    className="
                      font-medium
                      text-white
                    "
                  >
                    {request.client}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/40
                    "
                  >
                    {request.activity}
                  </p>
                </td>

                {/* Risk */}
                <td className="px-6 py-5">
                  <RiskLevelBadge riskLevel={request.riskLevel} />
                </td>

                {/* AI Score */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-2
                        w-24
                        overflow-hidden
                        rounded-full
                        bg-white/10
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#0B63C7]
                        "
                        style={{
                          width: `${request.score}%`,
                        }}
                      />
                    </div>

                    <span className="text-sm text-white/60">
                      {request.score}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <CreditStatusBadge status={request.status} />
                </td>

                {/* Amount */}
                <td
                  className="
                    px-6
                    py-5
                    text-sm
                    text-white/70
                  "
                >
                  {request.amount}
                </td>

                {/* Date */}
                <td
                  className="
                    px-6
                    py-5
                    text-sm
                    text-white/70
                  "
                >
                  {request.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/10
            px-6
            py-4
          "
        >
          <p className="text-sm text-white/50">
            {creditRequests.length} demandes
          </p>

          <div className="text-sm text-white/50">Page 1 sur 1</div>
        </div>
      </div>
    </div>
  );
}
