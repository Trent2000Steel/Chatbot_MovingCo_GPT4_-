export default function ServiceAgreement() {
  return (
    <div style={{
      backgroundColor: "#f4f4f4",
      padding: "60px 24px",
      fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", sans-serif',
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 32px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e0e0e0"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "24px", color: "#222" }}>Service Agreement</h1>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>1. Introduction</h2>
          <p>
            By booking with MovingCo, you agree to the terms outlined in this Service Agreement.
            This agreement defines the scope of services we provide, your responsibilities as a customer, 
            and important limitations of liability.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>2. Our Role</h2>
          <p>
            MovingCo is a coordination and concierge service for long-distance moves. 
            We do not operate trucks, transport goods, or provide labor directly. 
            We connect customers with independent, third-party service providers who perform the physical move.
          </p>
          <p style={{ marginTop: "10px" }}>
            We are not a freight broker, common carrier, insurer, or moving company.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>3. The MoveSafe Method™</h2>
          <p>
            Our MoveSafe Method includes:
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li>Reviewing your submitted inventory and photos</li>
              <li>Providing a flat-rate estimate for approval</li>
              <li>Coordinating transport and labor through verified vendors</li>
              <li>Guiding you throughout the process</li>
            </ul>
            Packing services are not included unless specifically arranged in writing.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>4. Customer Responsibilities</h2>
          <p>
            You agree to:
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li>Submit accurate inventory photos within 48 hours of booking</li>
              <li>Be available for the MoveSafe Call within 2 business days</li>
              <li>Disclose fragile or special items during your MoveSafe Call</li>
              <li>Have everything packed and ready on move day</li>
              <li>Ensure safe, legal access to your property</li>
            </ul>
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>5. Payments</h2>
          <p>
            An $85 deposit is required to begin the quote and coordination process. If you accept your flat-rate quote,
            a second payment may be required to cover supplies or additional services. All payments are subject to our{" "}
            <a href="/refund-policy" style={{ color: "#0d6efd" }}>Refund Policy</a>.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>6. Third-Party Services & Liability</h2>
          <p>
            MovingCo coordinates, but does not provide, moving labor or transportation. 
            As such, we are not liable for any damage, loss, delay, or performance issue caused by third-party providers. 
            We will assist with coordination or issue resolution where possible.
          </p>
          <p style={{ marginTop: "10px" }}>
            If you purchase Premium Move Coverage™, it applies only to pre-declared items and within posted reimbursement limits.
          </p>
          <p style={{ marginTop: "10px", fontStyle: "italic", color: "#555" }}>
            Please note: Some responses on our site may be powered by artificial intelligence. 
            While we aim to be helpful, AI may occasionally provide incorrect or outdated information. 
            Your MoveSafe Coordinator will confirm all final terms and logistics during your scheduled call.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>7. Cancellation or Refusal of Service</h2>
          <p>
            We reserve the right to cancel or refuse service at any time due to suspected fraud, unsafe conditions, false information,
            or failure to follow this agreement.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#111" }}>8. Governing Law</h2>
          <p>
            This agreement is governed by the laws of the state of Texas, without regard to conflict of law rules.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", color: "#111" }}>9. Contact</h2>
          <p>
            Questions? Reach out anytime at{" "}
            <a href="mailto:support@trustmovingco.com" style={{ color: "#0d6efd" }}>
              support@trustmovingco.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
