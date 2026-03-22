window.Components = window.Components || {};

window.Components.Icon = ({ name }) => {
  const icons = {
    sales: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
    network: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M8.5 7.5 10.5 15" />
        <path d="M15.5 7.5 13.5 15" />
      </svg>
    ),
    chain: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 12" />
        <path d="M14 11a5 5 0 0 1 0 7l-1.5 1.5a5 5 0 0 1-7-7L7 12" />
      </svg>
    ),
    loyalty: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.7 5.4 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.3l6-.9L12 3z" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6" />
        <path d="M12 16v6" />
        <path d="M4.2 4.2l4.2 4.2" />
        <path d="M15.6 15.6l4.2 4.2" />
        <path d="M2 12h6" />
        <path d="M16 12h6" />
        <path d="M4.2 19.8l4.2-4.2" />
        <path d="M15.6 8.4l4.2-4.2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    people: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20a7 7 0 0 1 14 0" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M16 20a5 5 0 0 1 6 0" />
      </svg>
    ),
    crm: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
      </svg>
    )
  };

  return <span className="icon">{icons[name]}</span>;
};
