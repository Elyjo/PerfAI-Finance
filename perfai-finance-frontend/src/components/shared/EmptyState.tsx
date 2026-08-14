import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <Icon size={24} className="text-white/30" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white/60">{title}</p>
        {description && <p className="mt-1 text-xs text-white/30">{description}</p>}
      </div>
    </div>
  )
}
