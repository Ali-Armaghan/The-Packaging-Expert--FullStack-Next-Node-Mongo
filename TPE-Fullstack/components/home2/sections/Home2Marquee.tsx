import type { Home2MarqueeContent } from "@/lib/home2/content";

type Home2MarqueeProps = {
  content: Home2MarqueeContent;
};

/**
 * Slow infinite image marquee — sits directly under the /home2 hero.
 * Track is duplicated for a seamless CSS loop; pauses on hover / reduced motion.
 */
export function Home2Marquee({ content }: Home2MarqueeProps) {
  const loop = [...content.items, ...content.items];

  return (
    <section className="home2-marquee" aria-label="Packaging formats showcase">
      <div className="home2-marquee__fade home2-marquee__fade--left" aria-hidden="true" />
      <div className="home2-marquee__fade home2-marquee__fade--right" aria-hidden="true" />

      <div className="home2-marquee__viewport">
        <ul className="home2-marquee__track">
          {loop.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              className="home2-marquee__item"
              aria-hidden={index >= content.items.length ? true : undefined}
            >
              <span className="home2-marquee__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} loading="lazy" draggable={false} />
              </span>
              <span className="home2-marquee__label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
