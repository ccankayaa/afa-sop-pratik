export default function NotFound() {
  return (
    <main id="main">
      <section className="question-card" aria-labelledby="not-found">
        <h1 id="not-found">Page not found</h1>
        <p className="practice-subtitle">
          This address does not match a practice page.
        </p>
        <div className="result-actions">
          <a className="button button-primary" href="/">
            Open SOP Practice
          </a>
        </div>
      </section>
    </main>
  );
}
