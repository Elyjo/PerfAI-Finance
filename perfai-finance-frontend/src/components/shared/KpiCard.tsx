import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  description,
}: KpiCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#0B63C7]/40
        hover:shadow-xl
        hover:shadow-[#0B63C7]/20
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="
              text-sm
              font-medium
              text-white/60
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-white
            "
          >
            {value}
          </h3>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-[#0B63C7]/15
          "
        >
          <Icon size={22} strokeWidth={2} className="text-[#0B63C7]" />
        </div>
      </div>

      {description && (
        <p
          className="
            mt-5
            text-sm
            text-white/50
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}
