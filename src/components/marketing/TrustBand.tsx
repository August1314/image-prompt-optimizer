interface TrustBandProps {
  items: string[]
}

export function TrustBand({ items }: TrustBandProps) {
  return (
    <section className="trust-band">
      {items.map((item) => (
        <span key={item} className="trust-pill">
          {item}
        </span>
      ))}
    </section>
  )
}
