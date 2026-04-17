window.Components = window.Components || {};

window.Components.DemoCTA = () => (
  <section className="section-strong bg-pattern-dots" id="demo" style={{ position: "relative" }}>
    <div className="floating-orb primary size-lg pos-top-left" style={{ animationDelay: "3s" }}></div>
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="cta-grid">
        <div data-animate>
          <p className="text-highlight">Ready to transform your business?</p>
          <h2>Take Control. Start Your Journey with Ezupp ERP Today.</h2>
          <p>
            Get a tailored demo and see how Ezupp can optimize your sales performance, supply chain velocity,
            and partner experience in one platform.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#contact">Request a Personalized Demo</a>
            <a className="btn secondary" href="#demo">Download Our Feature Guide</a>
          </div>
          <div className="contact-list">
            <div>Contact: <a href="tel:+918427665211">+91 84276 65211</a> | <a href="mailto:hello@ezupp.com">hello@ezupp.com</a></div>
            <div>Office Hours: Mon-Fri, 9:00 AM - 6:00 PM</div>
          </div>
        </div>
        <div className="cta-card" data-animate="delay-1">
          <img src="/8.png" alt="Ezupp account executive reviewing dashboards" />
          <h3>Work with a dedicated solution expert.</h3>
          <p>
            Our team designs a deployment plan that aligns with your distribution model, ensuring a smooth
            rollout and measurable ROI.
          </p>
        </div>
      </div>
    </div>
  </section>
);
