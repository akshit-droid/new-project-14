window.Components = window.Components || {};

window.Components.Customers = ({ logos, testimonials }) => (
  <section className="section-soft" id="customers">
    <div className="container">
      <div className="section-title" data-animate>
        <p className="text-highlight">Trusted by industry leaders</p>
        <h2>Trusted by Industry Leaders.</h2>
        <p>From FMCG to manufacturing, teams rely on Ezupp to keep operations predictable and efficient.</p>
      </div>
      <div className="logo-row" data-animate="delay-1">
        {logos.map((logo) => (
          <div className="logo-tile" key={logo}>{logo}</div>
        ))}
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div
            className="testimonial"
            data-animate={index === 0 ? "delay-1" : index === 1 ? "delay-2" : "delay-3"}
            key={testimonial.name}
          >
            <p className="quote">“{testimonial.quote}”</p>
            <div className="metric">{testimonial.metric}</div>
            <div className="profile">
              <img src={testimonial.image} alt={testimonial.name} />
              <div>
                <strong>{testimonial.name}</strong>
                <div>{testimonial.title}</div>
                <div>{testimonial.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
