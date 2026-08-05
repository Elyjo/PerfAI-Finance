import { ShieldCheck, FileSearch, Brain } from "lucide-react";

export default function RiskAnalysisResult() {
  return (
    <div
      className="
          rounded-2xl
          border
          border-white/10
          bg-white/3
          p-6
          backdrop-blur-xl
          transition
          duration-300
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
            gap-3
          "
      >
        <div
          className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#0B63C7]/10
            "
        >
          <Brain size={20} className="text-[#0B63C7]" />
        </div>

        <div>
          <h3
            className="
                text-lg
                font-semibold
                text-white
              "
          >
            Résultat de l&apos;analyse IA
          </h3>

          <p
            className="
                text-sm
                text-white/50
              "
          >
            Synthèse automatique du profil financier
          </p>
        </div>
      </div>

      {/* Decision */}
      <div
        className="
            mt-6
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            p-5
          "
      >
        <div
          className="
              flex
              items-center
              gap-3
            "
        >
          <ShieldCheck size={22} className="text-green-400" />

          <p
            className="
                font-semibold
                text-green-400
              "
          >
            Crédit recommandé avec surveillance
          </p>
        </div>

        <p
          className="
              mt-3
              text-sm
              leading-relaxed
              text-white/60
            "
        >
          Le profil présente une situation financière globalement stable.
          Cependant, une surveillance du niveau d&apos;endettement est
          recommandée avant validation finale.
        </p>
      </div>

      {/* Analysis details */}
      <div
        className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
          "
      >
        <div
          className="
              rounded-xl
              border
              border-white/10
              bg-white/3
              p-4
            "
        >
          <div
            className="
                flex
                items-center
                gap-2
              "
          >
            <FileSearch size={18} className="text-[#0B63C7]" />

            <p
              className="
                  text-sm
                  font-medium
                  text-white
                "
            >
              Données analysées
            </p>
          </div>

          <p
            className="
                mt-3
                text-sm
                text-white/60
              "
          >
            Revenus, historique crédit, capacité de remboursement et profil
            client.
          </p>
        </div>

        <div
          className="
              rounded-xl
              border
              border-white/10
              bg-white/3
              p-4
            "
        >
          <p
            className="
                text-sm
                font-medium
                text-white
              "
          >
            Confiance IA
          </p>

          <p
            className="
                mt-3
                text-2xl
                font-bold
                text-[#0B63C7]
              "
          >
            92%
          </p>

          <p
            className="
                mt-1
                text-xs
                text-white/50
              "
          >
            Fiabilité de la recommandation
          </p>
        </div>
      </div>
    </div>
  );
}
