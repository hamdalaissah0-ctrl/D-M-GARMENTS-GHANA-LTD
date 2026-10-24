export function MapEmbed({ address, className }: { address: string; className?: string }) {
  const query = encodeURIComponent(address)

  return (
    <div className={`overflow-hidden rounded-2xl border border-border ${className ?? ""}`}>
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          title={`Map showing ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none size-full border-0"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-accent px-4 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Open {address} in Google Maps
        <span aria-hidden>↗</span>
      </a>
    </div>
  )
}
