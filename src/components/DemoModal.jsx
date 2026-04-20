window.Components = window.Components || {};

window.Components.DemoModal = ({ isOpen, onClose }) => {
  const { DemoForm } = window.Components;
  
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '600px', padding: '40px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '8px' }}>Request a Personalized Demo</h2>
          <p>Fill out the form below and our team will get back to you within 24 hours.</p>
        </div>
        
        <DemoForm />
        
        <button 
          className="nav-close" 
          type="button" 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
