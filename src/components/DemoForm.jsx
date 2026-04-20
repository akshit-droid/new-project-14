window.Components = window.Components || {};

window.Components.DemoForm = ({ onSuccess }) => {
  const [modal, setModal] = React.useState({ open: false, status: "success", message: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = event.target;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      business: data.get("business"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      _subject: "Ezupp ERP Demo Request",
      _replyto: data.get("email"),
      _cc: "pranav@electrovese.com,akshit@electrovese.com",
      _captcha: "false",
      _template: "table"
    };

    fetch("https://formsubmit.co/ajax/aadhar@electrovese.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Submission failed");
        }
        return response.json();
      })
      .then(() => {
        setModal({
          open: true,
          status: "success",
          message: "Thanks! Your request has been submitted. Our team will reach out shortly."
        });
        form.reset();
        if (onSuccess) onSuccess();
      })
      .catch(() => {
        setModal({
          open: true,
          status: "error",
          message: "Submission failed. Please try again or email us directly at aadhar@electrovese.com."
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            Business name
            <input type="text" name="business" placeholder="Company or organization" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@company.com" required />
          </label>
          <label>
            Phone number
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              inputMode="numeric"
              pattern="^(\+91[\s-]?)?[6-9]\d{9}$"
              title="Enter a valid Indian mobile number (e.g., 9876543210 or +91 9876543210)"
              required
            />
          </label>
        </div>
        <label className="full">
          Message
          <textarea name="message" rows="4" placeholder="Tell us about your goals or challenges." required></textarea>
        </label>
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {modal.open && (
        <div className="modal-backdrop" style={{ zIndex: 2000 }} onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{modal.status === "success" ? "Submission received" : "Something went wrong"}</h3>
            <p>{modal.message}</p>
            <button
              className="btn primary"
              type="button"
              onClick={() => setModal({ ...modal, open: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
