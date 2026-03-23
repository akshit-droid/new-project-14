window.Components = window.Components || {};

window.Components.Features = ({ features }) => {
  const { Icon } = window.Components;

  return (
    <section id="features" className="bg-pattern-dots" style={{ position: "relative" }}>
      <div className="shape-accent shape-circle pos-top-left"></div>
      <div className="shape-accent shape-plus pos-center-right"></div>
      <div className="shape-accent shape-dots pos-bottom-left"></div>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="section-title" data-animate>
          <p className="text-highlight">A complete suite</p>
          <h2>A Complete Suite. Unlimited Possibilities.</h2>
          <p>Power-packed features designed for sales velocity, distribution precision, and operational control.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              data-animate={index % 3 === 0 ? "delay-1" : index % 3 === 1 ? "delay-2" : "delay-3"}
              key={feature.title}
            >
              <img
                className="feature-image"
                src={`/${index + 1}.png`}
                alt={`${feature.title} illustration`}
              />
              <Icon name={feature.icon} />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
