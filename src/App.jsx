window.Components = window.Components || {};

window.Components.App = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  const openDemoModal = (e) => {
    if (e) e.preventDefault();
    setIsDemoModalOpen(true);
  };
  const closeDemoModal = () => setIsDemoModalOpen(false);

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
    Footer,
    DemoModal
  } = window.Components;

  return (
    <div>
      <header>
        <div className="container">
          <Navbar links={navLinks} onOpenDemo={openDemoModal} />
          <Hero onOpenDemo={openDemoModal} />
        </div>
      </header>

      <main>
        <Solutions benefits={benefits} />
        <Features features={features} />
        <Integrations integrationNodes={integrationNodes} />
        <FAQ faqs={faqs} />
        <Contact />
        <DemoCTA onOpenDemo={openDemoModal} />
      </main>

      <Footer />
      <DemoModal isOpen={isDemoModalOpen} onClose={closeDemoModal} />
    </div>
  );
};
