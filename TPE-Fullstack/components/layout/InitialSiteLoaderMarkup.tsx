/** Server-rendered splash — visible on first HTML paint, before JS hydrates. */
export function InitialSiteLoaderMarkup() {
  return (
    <div
      id="initial-site-loader"
      className="initial-site-loader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f8f7",
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading website"
    >
      <div className="boxes-loader" aria-hidden="true">
        <div className="boxes-loader__ground">
          <div />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`boxes-loader__box boxes-loader__box--${i}`}>
            <div />
          </div>
        ))}
      </div>
      <p className="initial-site-loader__text">
        Preparing your packaging experience…
      </p>
    </div>
  );
}
