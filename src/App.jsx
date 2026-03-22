window.Components = window.Components || {};

window.Components.App = () => {
  const {
    navLinks,
    benefits,
    features,
    faqs,
    integrationNodes
  } = window.AppData;

  const {
    Navbar,
    Hero,
    Solutions,
    Features,
    Integrations,
    FAQ,
    Contact,
    DemoCTA,
    Footer
  } = window.Components;

  return (
    <div>
      <header>
        <div className="container">
          <Navbar links={navLinks} />
          <Hero />
        </div>
      </header>

      <main>
        <Solutions benefits={benefits} />
        <Features features={features} />
        <Integrations integrationNodes={integrationNodes} />
        <FAQ faqs={faqs} />
        <Contact />
        <DemoCTA />
      </main>

      <Footer />
    </div>
  );
};
