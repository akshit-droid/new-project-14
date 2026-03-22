window.Components = window.Components || {};

window.Components.Solutions = ({ benefits }) => (
  <section className="section-soft" id="solutions">
    <div className="container">
      <div className="solutions-grid">
        <div data-animate>
          <p className="text-highlight">Operational clarity, end-to-end.</p>
          <h2>Fragmented Systems? Lack of Visibility? Streamline Operations with Ezupp.</h2>
          <p>
            Replace disconnected tools with one ERP that aligns sales, distribution, and supply chain execution
            around real-time data. Every team works from the same live picture.
          </p>
          <div className="solutions-list">
            {benefits.map((benefit) => (
              <div className="solutions-item" key={benefit.title}>
                <strong>{benefit.title}</strong>
                <span>{benefit.body}</span>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <a className="btn primary" href="#features">Explore the Platform</a>
            <a className="btn secondary" href="#demo">Schedule a Walkthrough</a>
          </div>
        </div>
        <div className="solutions-visual" data-animate="delay-1">
          <div className="solutions-panel">
            <div className="panel-header">
              <div>
                <p className="text-highlight">Operational impact</p>
                <h3>From reactive firefighting to proactive control.</h3>
              </div>
              <div className="panel-score">
                <span>Unified score</span>
                <strong>92</strong>
              </div>
            </div>
            <div className="panel-columns">
              <div className="panel-col">
                <div className="panel-title danger">Before Ezupp</div>
                <ul className="panel-list muted">
                  <li>Manual updates and delayed reporting</li>
                  <li>Disconnected distributor data</li>
                  <li>Limited field visibility</li>
                </ul>
              </div>
              <div className="panel-col">
                <div className="panel-title success">With Ezupp</div>
                <ul className="panel-list">
                  <li>Live fleet visibility and beat adherence</li>
                  <li>Partner scoring and automated onboarding</li>
                  <li>Unified supply chain flow</li>
                </ul>
              </div>
            </div>
            <div className="panel-kpis">
              <div className="kpi-tile">98% visit compliance</div>
              <div className="kpi-tile">24h inventory refresh</div>
              <div className="kpi-tile">15% lower leakage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
