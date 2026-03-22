window.Components = window.Components || {};

window.Components.Hero = () => (
  <div className="hero">
    <div className="hero-content" data-animate>
      <div className="badge">Built for distribution-led businesses</div>
      <h1 className="hero-title">
        Empower Your Sales. Optimize Your Chain. Elevate Your Business with{" "}
        <span className="hero-highlight">Ezupp ERP</span>.
      </h1>
      <p className="hero-lede">
        The complete, cloud-based ERP solution with customizable mobile app, seamless integrations, and
        real-time insights for unparalleled control.
      </p>
      <div className="hero-actions">
        <a className="btn primary" href="#demo">Get a Free Demo</a>
      </div>
      <div className="hero-metrics">
        <div className="metric">
          <strong>30%+</strong>
          Faster field execution
        </div>
        <div className="metric">
          <strong>20K+</strong>
          Active distributor touchpoints
        </div>
        <div className="metric">
          <strong>99.9%</strong>
          Platform uptime assurance
        </div>
      </div>
    </div>

    <div className="hero-card" data-animate="delay-1">
      <img
        src="/main.png"
        alt="Sales professional using the Ezupp mobile app with a distributor"
      />
    </div>
  </div>
);
