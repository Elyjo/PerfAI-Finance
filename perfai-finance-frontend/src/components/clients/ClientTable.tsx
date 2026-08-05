import ClientRiskBadge from "./ClientRiskBadge";

const clients = [
  {
    id: 1,
    name: "Mamadou Diallo",
    activity: "Commerce",
    risk: "Faible" as const,
    score: 92,
    status: "Actif",
    credits: 2,
    lastActivity: "Aujourd'hui",
  },
  {
    id: 2,
    name: "Fatou Ndiaye",
    activity: "Agriculture",
    risk: "Moyen" as const,
    score: 68,
    status: "Actif",
    credits: 1,
    lastActivity: "Hier",
  },
  {
    id: 3,
    name: "Ousmane Ba",
    activity: "Transport",
    risk: "Élevé" as const,
    score: 41,
    status: "Surveillance",
    credits: 3,
    lastActivity: "Il y a 3 jours",
  },
];

export default function ClientTable() {
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
          Liste des clients
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

              <th className="px-6 py-4">Crédits actifs</th>

              <th className="px-6 py-4">Activité</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
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
                    {client.name}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/40
                    "
                  >
                    {client.activity}
                  </p>
                </td>

                {/* Risk */}
                <td className="px-6 py-5">
                  <ClientRiskBadge risk={client.risk} />
                </td>

                {/* Score */}
                <td className="px-6 py-5">
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        h-2
                        w-28
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
                          width: `${client.score}%`,
                        }}
                      />
                    </div>

                    <span className="text-sm text-white/60">
                      {client.score}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td
                  className="
                    px-6
                    py-5
                    text-sm
                    text-white/70
                  "
                >
                  {client.status}
                </td>

                {/* Credits */}
                <td
                  className="
                    px-6
                    py-5
                    text-sm
                    text-white/70
                  "
                >
                  {client.credits}
                </td>

                {/* Activity */}
                <td
                  className="
                    px-6
                    py-5
                    text-sm
                    text-white/70
                  "
                >
                  {client.lastActivity}
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
          <p className="text-sm text-white/50">{clients.length} clients</p>

          <p className="text-sm text-white/50">Page 1 sur 1</p>
        </div>
      </div>
    </div>
  );
}
