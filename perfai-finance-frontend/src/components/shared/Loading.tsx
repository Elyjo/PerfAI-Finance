export default function Loading({ text = 'Chargement...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#0B63C7]" />
      <p className="text-sm text-white/50">{text}</p>
    </div>
  )
}
