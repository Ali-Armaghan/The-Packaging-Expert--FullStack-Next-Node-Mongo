import type { Home2ProcessContent } from "@/lib/home2/content";

type Home2ProcessProps = {
  content: Home2ProcessContent;
};

/** Dark studio journey — connected steps from blank page to branded box. */
export function Home2Process({ content }: Home2ProcessProps) {
  return (
    <section className="home2-process">
      <div className="home2-process__glow home2-process__glow--a" aria-hidden="true" />
      <div className="home2-process__glow home2-process__glow--b" aria-hidden="true" />
      <div className="home2-process__grid" aria-hidden="true" />

      <div className="home2-process__inner">
        <header className="home2-process__header">
          <div className="home2-process__intro">
            <p className="home2-pillars__eyebrow">
              <span className="home2-pillars__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-process__title">{content.title}</h2>
            <p className="home2-process__subtitle">{content.subtitle}</p>
          </div>

          <div className="home2-process__badge" aria-hidden="true">
            <span className="home2-process__badge-count">
              {String(content.steps.length).padStart(2, "0")}
            </span>
            <span className="home2-process__badge-label">
              <span>clear</span>
              <span>steps</span>
            </span>
          </div>
        </header>

        <div className="home2-process__rail" aria-hidden="true">
          <span className="home2-process__rail-line" />
          {content.steps.map((step) => (
            <span key={step.id} className="home2-process__rail-node">
              <span />
            </span>
          ))}
        </div>

        <ol className="home2-process__steps">
          {content.steps.map((step, i) => (
            <li key={step.id} className="home2-process__step">
              <span className="home2-process__ghost" aria-hidden="true">
                {step.index}
              </span>
              <div className="home2-process__step-top">
                <span className="home2-process__index">{step.index}</span>
                <span className="home2-process__phase">Phase {i + 1}</span>
              </div>
              <h3 className="home2-process__step-title">{step.title}</h3>
              <p className="home2-process__step-text">{step.description}</p>
              <span className="home2-process__step-arrow" aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
