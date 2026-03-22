window.Components = window.Components || {};

window.Components.Integrations = ({ integrationNodes }) => (
  <section id="integrations">
    <div className="container">
      <div className="section-title" data-animate>
        <p className="text-highlight">Seamless integrations</p>
        <h2>Connects effortlessly. Enhances everything.</h2>
        <p>
          Leverage your existing ecosystem. Ezupp integrates with the tools you already use, ensuring unified
          workflows across teams.
        </p>
      </div>
      <div className="integration-layout">
        <div className="integration-graphic" data-animate="delay-1">
          <div className="integration-orbit">
            <div className="integration-center">Ezupp ERP</div>
            {integrationNodes.map((node) => (
              <div
                className="integration-node"
                style={{ "--x": node.x, "--y": node.y }}
                key={node.label}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>
        <div className="integration-copy" data-animate="delay-2">
          <div className="integration-card">
            <h3>Bi-directional data flow that keeps every system aligned.</h3>
            <p>
              Sync orders, inventory, finance, and messaging platforms instantly. Ezupp eliminates duplicate
              entry and ensures your teams operate from the same live data set.
            </p>
            <div className="integration-list">
              <div>Orders + inventory sync without manual exports.</div>
              <div>Finance reconciliation with SAP/Tally-ready logs.</div>
              <div>WhatsApp alerts for field teams and distributors.</div>
            </div>
            <div className="hero-actions">
              <a className="btn primary" href="#demo">See Integration Map</a>
              <a className="btn secondary" href="#demo">Talk to an Integration Expert</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
