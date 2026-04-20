window.Components = window.Components || {};

window.Components.Contact = () => {
  const { DemoForm } = window.Components;

  return (
    <section id="contact">
      <div className="container">
        <div className="section-title" data-animate>
          <p className="text-highlight">Contact us</p>
          <h2>Tell us about your business.</h2>
          <p>
            Sync orders, inventory, finance, and messaging platforms instantly. Ezupp eliminates duplicate entries and ensures your teams operate from a single source of truth.
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-panel" data-animate="delay-1">
            <h3>What you get</h3>
            <ul>
              <li>Personalized walkthrough for your sales and distribution model</li>
              <li>Integration assessment with your existing stack</li>
              <li>Clear next steps, timelines, and ROI milestones</li>
            </ul>
            <div className="contact-note">
              Prefer a direct call? <strong>+91 84276 65211 | aadhar@electrovese.com</strong>.
            </div>
          </div>
          <div data-animate="delay-2">
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
};
