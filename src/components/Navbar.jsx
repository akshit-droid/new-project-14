window.Components = window.Components || {};

window.Components.Navbar = ({ links }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="logo">
        <img src="/logo11.png" alt="Ezupp ERP" />
      </div>
      <div className="nav-links">
        {links.map((link) => (
          <a href={link.href} key={link.label} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
      </div>
      <div className="nav-cta">
        <a className="btn primary small" href="#contact" onClick={closeMenu}>Book Demo</a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`nav-overlay ${menuOpen ? "open" : ""}`} onClick={closeMenu} />
      <aside
        id="mobile-nav"
        className={`nav-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-header">
          <span>Menu</span>
          <button className="nav-close" type="button" onClick={closeMenu}>Close</button>
        </div>
        <div className="nav-drawer-links">
          {links.map((link) => (
            <a href={link.href} key={`mobile-${link.label}`} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </div>
      </aside>
    </nav>
  );
};
