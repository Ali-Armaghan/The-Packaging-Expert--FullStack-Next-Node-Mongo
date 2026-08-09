import type { Home2ProcessContent } from "@/lib/home2/content";

type Home2ProcessProps = {
  content: Home2ProcessContent;
};

/** Dark process strip — four clear steps from style to reorder. */
export function Home2Process({ content }: Home2ProcessProps) {
  return (
    <section className="home2-process">
      <div className="home2-process__inner">
        <header className="home2-process__header">
          <p className="home2-pillars__eyebrow">
            <span className="home2-pillars__eyebrow-dot" />
            {content.eyebrow}
          </p>
          <h2 className="home2-process__title">{content.title}</h2>
          <p className="home2-process__subtitle">{content.subtitle}</p>
        </header>

        <ol className="home2-process__steps">
          {content.steps.map((step) => (
            <li key={step.id} className="home2-process__step">
              <span className="home2-process__index">{step.index}</span>
              <h3 className="home2-process__step-title">{step.title}</h3>
              <p className="home2-process__step-text">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
