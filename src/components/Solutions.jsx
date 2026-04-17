window.Components = window.Components || {};

window.Components.Solutions = ({ benefits }) => (
  <section className="section-soft bg-pattern-grid" id="solutions">
    <div className="floating-orb primary size-lg pos-center-right" style={{ animationDelay: "1s" }}></div>
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="solutions-grid">
        <div data-animate>
          <p className="text-highlight">Operational clarity, end-to-end.</p>
          <h2>Fragmented Systems? Lack of Visibility? Streamline Operations with Ezupp.</h2>
          <p>
            Eliminate fragmented systems with a unified ERP that synchronizes sales, distribution, and supply chain execution. Empower every team to operate from a single, real-time source of truth.
            <br /><br />
            Distributor and dealer tools help you onboard them faster and reward performance.
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
                  <li>Lead Loss</li>
                  <li>Communication gap</li>
                  <li>Compromised data</li>
                  <li>Customer Miscommunication</li>
                </ul>
              </div>
              <div className="panel-col">
                <div className="panel-title success">With Ezupp</div>
                <ul className="panel-list">
                  <li>Live fleet visibility and beat adherence</li>
                  <li>Partner scoring and automated onboarding</li>
                  <li>Unified supply chain flow</li>
                  <li>Zero lead loss</li>
                  <li>Seamless communication</li>
                  <li>Secure data</li>
                  <li>Clear customer communication</li>
                </ul>
              </div>
            </div>
            <div className="panel-kpis">
              <div className="kpi-tile">98% Visit compliance</div>
              <div className="kpi-tile">24h Inventory refresh</div>
              <div className="kpi-tile">15% Lower leakage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
