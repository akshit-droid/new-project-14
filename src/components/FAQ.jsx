window.Components = window.Components || {};

window.Components.FAQ = ({ faqs }) => (
  <section className="section-soft" id="faq">
    <div className="container">
      <div className="section-title" data-animate>
        <p className="text-highlight">Answers at a glance</p>
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to evaluate Ezupp ERP with confidence.</p>
      </div>
      <div className="faq-grid">
        {faqs.map((item, index) => (
          <details className="faq-item" data-animate={index % 2 === 0 ? "delay-1" : "delay-2"} key={item.question}>
            <summary className="faq-question">
              <span>{item.question}</span>
              <span className="faq-icon">+</span>
            </summary>
            <div className="faq-answer">{item.answer}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
);
